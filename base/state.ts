import type { Dispatch, SetStateAction } from 'react';
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

type PutState<TState extends object> = {
	[Key in keyof TState]: React.Dispatch<React.SetStateAction<TState[Key]>>;
}

class CleanStateBase<TState extends Record<string, any>> {
	readonly reservedKeys: string[];
	readonly valueKeys: string[];

	private _values_: Record<string, any> = {} as TState;
	private _initialValues_: TState;
	private _setters_ = {} as {
		[Key in keyof TState]: PutState<TState>[Key];
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
					self._setters_[key as keyof TState](value);
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
			// @todo Make state updates accessible immediately. Use state.staged to access the scheduled updates.
			let setter: Dispatch<SetStateAction<any>>;
			// @todo Support SetStateAction callback signature in state.put(...);
			[this._values_[key], setter] = retrieveState(this.initialState[key as keyof TState]);

			this._setters_[key as keyof TState] = ((valueOrCallback) => {
				// this._staged_[key] = value;
				setter(valueOrCallback);
			});
		})

		/* Object.entries<TUseStateArray<TState>>(stateAndSetters).forEach(([key, responseFromUseState]) => {
			[this._values_[key], this._setters_[key]] = responseFromUseState;
		}); */

		// return this;
	};

	get put(): PutState<TState> {
		return { ...this._setters_ };
	}
	get initialState() {
		return { ...this._initialValues_ };
	}

	readonly putMany = (newValues: Partial<TState>) => {
		Object.entries(newValues).forEach(([key, value]) => {
			this.put[key as keyof TState](value as TState[string]);
		});
	};
};
type TCleanStateBase = typeof CleanStateBase;
type TCleanStateBaseKeys = keyof TCleanStateBase;

interface ICleanStateConstructor {
	new <TState extends object>(
		...args: ConstructorParameters<typeof CleanStateBase>
	): TCleanState<TState>;
}

type ICleanStateClass = {
	[Key in TCleanStateBaseKeys]: (typeof CleanStateBase)[Key];
}
const CleanState = CleanStateBase as unknown as ICleanStateConstructor & ICleanStateClass;


export type TStateData = object & {
	[Key in keyof CleanStateBase<{}>]?: never;
};

export type TCleanState<TState extends TStateData> = (
	CleanStateBase<TState>
	& Omit<TState, keyof CleanStateBase<{}>>
	// {
	// 	[Key in keyof TState]: Key extends keyof CleanStateBase<{}>
	// 		? CleanStateBase<{}>[Key]
	// 		: TState[Key]
	// 	;
	// }
);

export type ExtractCleanStateData<
	YourCleanState extends CleanStateBase<{}>
> = Omit<YourCleanState, keyof CleanStateBase<{}>>;


type StateInitFunction = (...args: any[]) => object;
type StateInit = object | StateInitFunction;

type TInitialState<
	Initializer extends StateInit
> = Initializer extends (...args: any[]) => (infer TState extends object)
	? TState
	: Initializer;



type TUseCleanState = <TInit extends StateInit>(
	_initialState: TInit,
	...props: TInit extends (...args: infer TProps extends any[]) => (infer TState extends object)
		? TProps
		: []
) => TCleanState<TInitialState<TInit>>;

export const useCleanState: TUseCleanState = (_initialState, ...props) => {
	type TState = TInitialState<typeof _initialState>;

	const initialState: TState = typeof _initialState === 'function'
		? useMemo(() => _initialState(...props), [])
		: _initialState;
	;

	const cleanState: TCleanState<TState> = useRef(useMemo(() => {
		return new CleanState<TState>(initialState);
	}, [])).current;

	CleanState.update.call(cleanState);
	return cleanState;
};


// Should be valid.
// useCleanState((a: number) => ({b: a.toString(), q: 1}), 6);
// useCleanState((a: boolean) => ({b: a.toString()}), true);
// useCleanState((a: number, c?: string) => ({ b: `${a}` }), 6);
// useCleanState((a: number, c?: string) => ({ b: `${a}` }), 6, 'word');
// useCleanState((a: number, c: string) => ({ b: a + c, f: true }), 6, 'text');
// useCleanState({ d: 5000 });


// Should fail.
// useCleanState((a: number) => ({b: a.toString(), q: 1}), 6, false);
// useCleanState((a: boolean) => ({b: a.toString()}));
// useCleanState((a: number, c?: string) => ({ b: `${a}` }), '6');
// useCleanState((a: number, c?: string) => ({ b: `${a}` }));
// useCleanState((a: number, c: string) => ({ b: a + c, f: true }), 6, 7);
// useCleanState({ d: 5000 }, true);
