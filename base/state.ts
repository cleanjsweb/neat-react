import { useEffect, useRef, useState } from 'react';


type TUseStateArray<TState extends object> = [
	val: TState[keyof TState],
	setter: (val: TState[keyof TState]) => void,
];

type TUseStateResponses<TState extends object> = {
	[Key in keyof TState]: TUseStateArray<TState>;
};


class _CleanState_<TState extends object> {
	private _values_ = {} as TState;
	private _setters_ = {} as {
		[Key in keyof TState]: (value: TState[Key]) => void;
	};

	put = this._setters_;

	constructor(stateAndSetters: TUseStateResponses<TState>) {
		/** Must be extracted before the loop begins to avoid including keys from the consumers state object. */
		const reservedKeys = Object.keys(this);

		Object.entries<TUseStateArray<TState>>(stateAndSetters).forEach(([key, responseFromUseState]) => {
			if (reservedKeys.includes(key)) throw new Error(`The name "${key}" is reserved by CleanState and cannot be used to index state variables. Please use a different key.`);

			[this._values_[key], this._setters_[key]] = responseFromUseState;
			// this.put[key] = this._setters_[key];

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

	putMany = (newValues: Partial<TState>) => {
		type StateValuesUnion = (typeof newValues)[keyof TState];
		Object.entries<StateValuesUnion>(newValues).forEach(([key, value]) => {
			this.put[key](value);
		});
	};
};


type TCleanStateInstance<TState extends object> = TState & _CleanState_<TState>;
const _CleanState = _CleanState_ as unknown as new <TState extends object>(
	...args: ConstructorParameters<typeof _CleanState_>
) => TCleanStateInstance<TState>;

export type CleanState<TState extends object> = InstanceType<typeof _CleanState<TState>>;

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
	// TState extends object,
	TStateObjOrFactory extends ((props?: TProps) => object) | object,
	TProps extends object = object
>(
	_initialState: TStateObjOrFactory,
	props?: TStateObjOrFactory extends Func ? TProps : undefined
) => CleanState<TStateObjOrFactory extends Func ? ReturnType<TStateObjOrFactory> : TStateObjOrFactory>;

export const useCleanState: UseCleanState = (_initialState, props) => {
	const initialState = typeof _initialState === 'function' ? _initialState(props) : _initialState;
	type TState = typeof initialState;

	const stateKeys = Object.keys(initialState);
	const [initialCount] = useState(stateKeys.length);

	if (stateKeys.length !== initialCount) {
		throw new Error('The keys in your state object must be consistent throughout your components lifetime. Look up "rules of hooks" for more context.');
	}

	const stateAndSetters = {};

	for (let key of stateKeys) {
		stateAndSetters[key] = retrieveState(initialState[key]);
	}

	// @todo Refactor to return consistent state instance each render.
	// Though useState gives us persistent references for values and setters,
	// so keeping the CleanState wrapper persistent may be unnecessary.
	return new _CleanState<TState>(stateAndSetters);
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
