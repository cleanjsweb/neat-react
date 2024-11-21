import { useEffect, useMemo, useRef, useState } from 'react';


/**
 * Returns a value that is false before the component has been mounted,
 * then true during all subsequent rerenders.
 */ 
export const useMountState = () => {
	/**
	 * This must not be a stateful value. It should not be the cause of a rerender.
	 * It merely provides information about the render count,
	 * without influencing that count itself.
	 * So `mounted` should never be set with `useState`.
	 */
	let mounted = useRef(false);
	useEffect(() => {
		mounted.current = true;
	}, []);
	return mounted.current;
};


type TUseStateArray<TState extends object> = [
	val: TState[keyof TState],
	setter: (val: TState[keyof TState]) => void,
];

type TUseStateResponses<TState extends object> = {
	[Key in keyof TState]: TUseStateArray<TState>;
};


class CleanStateBase<TState extends object> {
	reservedKeys: string[];
	valueKeys: string[];

	private _values_ = {} as TState;
	private _initialValues_: TState;
	private _setters_ = {} as {
		[Key in keyof TState]: (value: TState[Key]) => void;
	};

	constructor(initialState: TState) {
		this.reservedKeys = Object.keys(this);

		/**
		 * The keys from the initial state object.
		 * By capturing and storing the value once, we ensure that any potential changes to the object,
		 * or irregularities in the order of keys returned by Object.keys,
		 * will not affect the order of subsequent useState calls.
		 * Only keys provided on the initial call will be recognized,
		 * since CleanState is instantiated only once with useMemo,
		 * and they will always be processed in a consistent order during rerenders.
		 */
		this.valueKeys = Object.keys(initialState);
		this._initialValues_ = { ...initialState };

		this.valueKeys.forEach((key) => {
			if (this.reservedKeys.includes(key)) throw new Error(`The name "${key}" is reserved by CleanState and cannot be used to index state variables. Please use a different key.`);

			const self = this;
			Object.defineProperty(this, key, {
				get() {
					return self._values_[key];
				},
				set(value) {
					self._setters_[key](value);
				},
				enumerable: true,
			});
		});
	}

	static update = function update<TState extends object>(this: CleanStateBase<TState>) {
		if (!(this instanceof CleanState)) throw new Error('CleanState.update must be called with `this` value set to a CleanState instance. Did you forget to use `.call` or `.apply`? Example: CleanState.update.call(cleanState);');

		/**
		 * Linters complain about the use of a React hook within a loop because:
		 * > By following this rule, you ensure that Hooks are called in the same order each time a component renders.
		 * > That’s what allows React to correctly preserve the state of Hooks between multiple useState and useEffect calls. 
		 * To resolve this, we're calling `useState` via an alias `retrieveState`.
		 * Bypassing this rule is safe here because `useCleanState` is a special case,
		 * and it guarantees that the same useState calls will be made on every render in the exact same order.
		 * Therefore, it is safe to silence the linters, and required for this implementation to work smoothly.
		 */
		const retrieveState = useState;

		this.valueKeys.forEach((key) => {
			let setter: FunctionType;
			// @todo Make state updates reflect immediately. Use state.staged to access the scheduled updates.
			// @todo Support SetStateAction callback signature in state.put(...);
			[this._values_[key], setter] = retrieveState(this.initialState[key]);

			this._setters_[key] = (value) => {
				// this._staged_[key] = value;
				setter(value);
			}
		})

		/* Object.entries<TUseStateArray<TState>>(stateAndSetters).forEach(([key, responseFromUseState]) => {
			[this._values_[key], this._setters_[key]] = responseFromUseState;
		}); */

		// return this;
	};

	get put() {
		return { ...this._setters_ };
	}
	get initialState() {
		return { ...this._initialValues_ };
	}

	putMany = (newValues: Partial<TState>) => {
		type StateValuesUnion = (typeof newValues)[keyof TState];
		Object.entries<StateValuesUnion>(newValues).forEach(([key, value]) => {
			this.put[key](value);
		});
	};
};


type TCleanStateInstance<TState extends object> = TState & CleanStateBase<TState>;
type TCleanStateBase = typeof CleanStateBase;
type TCleanStateBaseKeys = keyof TCleanStateBase;

interface ICleanStateConstructor {
	new <TState extends object>(
		...args: ConstructorParameters<typeof CleanStateBase>
	): TCleanStateInstance<TState>;

	// update: typeof CleanStateBase.update;
	/* <TState extends object>(
		this: CleanStateBase<TState>,
		stateAndSetters: TUseStateResponses<TState>
	) => void; // TCleanStateInstance<TState>; */
}

// Typescript said: A mapped type may not declare properties or methods.
// Instead of simply saying: Mapped type cannot be used in interface. Use type instead.

type ICleanStateClass = {
	/* update: <TState extends object>(
		this: CleanStateBase<TState>,
		stateAndSetters: TUseStateResponses<TState>
	) => void; */
	// update: (typeof CleanStateBase)['update'],
	[Key in TCleanStateBaseKeys]: (typeof CleanStateBase)[Key];
}
const CleanState = CleanStateBase as unknown as ICleanStateConstructor & ICleanStateClass;


export type TCleanState<TState extends object> = TCleanStateInstance<TState>;
// InstanceType<typeof CleanState<TState>>;


type StateInitFunction = (...args: any[]) => object;
type StateInit = object | StateInitFunction;

type TInitialState<
	Initializer extends StateInit
> = Initializer extends (...args: any[]) => (infer TState extends object)
	? TState
	: Initializer;



type TUseCleanState = <TInit extends StateInit>(
	_initialState: TInit,
	...props: TInit extends (...args: infer TProps) => object ? TProps : []
) => TCleanStateInstance<TInitialState<TInit>>;

export const useCleanState: TUseCleanState = (_initialState, ...props) => {
	const mounted = useMountState();

	// Allow passing a callback to be run after state update is done.

	// type TStateInitializer = typeof _initialState;
	// type TState = TStateInitializer extends (...args: any) => any ? ReturnType<TStateInitializer> : TStateInitializer;

	// let iSt = {} as TState; // object;

	const initialState = typeof _initialState === 'function'
		? useMemo(() => _initialState(...props), [])
		: _initialState;
	;

	type TState = TInitialState<typeof initialState>;


	let freshInstance = {} as TCleanStateInstance<TState>;

	if (!mounted) freshInstance = new CleanState(initialState);
	const cleanState = useRef(freshInstance).current;

	CleanState.update.call(cleanState);
	return cleanState;
};

useCleanState((a: number) => ({b: a.toString()}), 6);
useCleanState((a: boolean) => ({b: a.toString()}), true);
useCleanState((a: number, c?: string) => ({ b: `${a}` }), 6);
useCleanState((a: number, c: string) => ({ b: a + c }), 6, 'text');
useCleanState({ b: 'a.toString()' });
