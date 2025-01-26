
import type { Dispatch, SetStateAction } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { CleanState } from './class';
import { TUseCleanState, TCleanState, TInitialState } from './hook-types';


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


/**
 * Creates a state object, which includes the provided values, and helper methods for
 * updating those values and automatically rerendering your component's UI accordingly.
 */
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
