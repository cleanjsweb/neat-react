import { useEffect, useMemo, useRef, useState } from 'react';


type TUseStateArray<TState extends object> = [
	val: TState[keyof TState],
	setter: (val: TState[keyof TState]) => void,
];

type TUseStateResponses<TState extends object> = {
	[Key in keyof TState]: TUseStateArray<TState>;
};


class CleanStateBase<TState extends object> {
	static update <TState extends object>(this: CleanStateBase<TState>, stateAndSetters: TUseStateResponses<TState>) {
		Object.entries<TUseStateArray<TState>>(stateAndSetters).forEach(([key, responseFromUseState]) => {
			if (this.reservedKeys.includes(key)) throw new Error(`The name "${key}" is reserved by CleanState and cannot be used to index state variables. Please use a different key.`);

			this.valueKeys.push(key);
			[this._values_[key], this._setters_[key]] = responseFromUseState;

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

		// return this;
	}

	reservedKeys: string[];
	valueKeys: string[] = [];
	private _values_ = {} as TState;
	private _setters_ = {} as {
		[Key in keyof TState]: (value: TState[Key]) => void;
	};

	get put() {
		return { ...this._setters_ };
	}

	constructor() {
		this.reservedKeys = Object.keys(this);
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
let a: InstanceType<TCleanStateBase>;

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
interface ICleanStateClass {
	update: <TState extends object>(
		this: CleanStateBase<TState>,
		stateAndSetters: TUseStateResponses<TState>
	) => void;
}
const CleanState = CleanStateBase as unknown as ICleanStateConstructor & ICleanStateClass;
let na = new CleanState<{a: string}>();

export type TCleanState<TState extends object> = TCleanStateInstance<TState>; // InstanceType<typeof CleanState<TState>>;

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

type Func = (...params: any[]) => any;

type UseCleanState = <
	TState extends object,
	// TStateObjOrFactory extends ((props?: TProps) => Record<'a' | 'b', number>) | Record<'a' | 'b', number>,
	TProps extends object = object
>(
	_initialState: ((props?: TProps) => TState) | TState, // TStateObjOrFactory,
	props?: typeof _initialState extends Func ? TProps : undefined // TProps
) => TCleanState<TState>; // <TStateObjOrFactory extends Func ? ReturnType<TStateObjOrFactory> : TStateObjOrFactory>;

export const useCleanState: UseCleanState = (_initialState, props) => {
	const initialState = typeof _initialState === 'function' ? _initialState(props) : _initialState;
	type TState = typeof initialState;

	// props?.s
	const cleanState = useMemo(() => new CleanState<TState>(), []);

	const stateKeys = Object.keys(initialState);
	const [initialCount] = useState(stateKeys.length);

	if (stateKeys.length !== initialCount) {
		throw new Error('The keys in your state object must be consistent throughout your components lifetime. Look up "rules of hooks" for more context.');
	}

	const stateAndSetters = {};

	for (let key of stateKeys) {
		stateAndSetters[key] = retrieveState(initialState[key]);
	}

	CleanState.update.call(cleanState, stateAndSetters);
	return cleanState;
};

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
