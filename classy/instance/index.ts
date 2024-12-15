import type { ExtractCleanStateData, TStateData } from '@/base/state';
import type { THooksBase } from '../logic';

import { useEffect } from 'react';

import { ComponentLogic,  useLogic } from '../logic';
import { UIParams, UIReturn, UseInstance } from './hook-types';
import { useMountCallbacks } from './mount-callbacks';

// @todo Use rollup. Insert globals.ts reference tag to all d.ts output files.


type AsyncAllowedEffectCallback = () => Awaitable<IVoidFunction>;
type o = object;


/** An empty function. It returns (void) without performing any operations. */
export const noOp = () => {};


/**
 * A superset of {@link ComponentLogic} that adds support for lifecycle methods.
 * This provides a declarative API for working with your React function component's lifecycle,
 * a simpler alternative to the imperative approach with `useEffect` and/or `useMemo`.
 */
export class ComponentInstance<
		TProps extends o = {},
		TState extends TStateData = WeakEmptyObject,
		THooks extends THooksBase = void> extends ComponentLogic.Class<TProps, TState, THooks> {
	/**
	 * Runs only _before_ first render, i.e before the component instance is mounted.
	 * Useful for logic that is involved in determining what to render.
	 * 
	 * Updating local state from in here will abort the render cycle early, before changes are committed to the DOM,
	 * and prompt React to immediately rerender the component with the updated state value(s).
	 * 
	 * Ignored on subsequent rerenders.
	 */
	beforeMount: IVoidFunction = () => {};
	/**
	 * Runs only **_after_** first render, i.e after the component instance is mounted.
	 * 
	 * Should usually only be used for logic that does not directly take part in determining what to render, like
	 * synchronize your component with some external system.
	 * 
	 * Ignored on subsequent rerenders.
	 * 
	 * Returns a cleanup function.
	 */
	onMount: AsyncAllowedEffectCallback = () => noOp;

	/**
	 * Runs _before_ every render cycle, including the first.
	 * Useful for logic that is involved in determining what to render.
	 * 
	 * Updating local state from in here will abort the render cycle early, before changes are committed to the DOM,
	 * and prompt React to immediately rerender the component with the updated state value(s).
	 */
	beforeRender: IVoidFunction = () => {};
	/**
	 * Runs **_after_** every render cycle, including the first.
	 * 
	 * Should usually only be used for logic that does not directly take part in determining what to render, like
	 * synchronize your component with some external system.
	 * 
	 * Returns a cleanup function.
	 */
	onRender: AsyncAllowedEffectCallback = () => noOp;

	/**
	 * Runs when the component is unmounted.
	 * It is called _after_ the cleanup function returned by onMount.
	 */
	cleanUp: IVoidFunction = () => {};
};

/*
 * To ensure successful type checking, the second parameter must be written with spread syntax.
 * Likely because of the `exactOptionalPropertyTypes` config option turned on,
 * and `UseInstance` using an empty tuple in its rest parameter type, attempting to simply
 * retrieve the second argument directly causes an error when that argument is passed on to `useLogic`.
 * But directly working with the rest array bypasses the problem. Also note that the issue persists even when
 * the second param is given `{}` as a default follow to account for the empty tuple case. TypeScript
 * just wants us to use the rest parameter explicitly by force.
 */
export const useInstance: UseInstance = (...args: UIParams): UIReturn => {
	const [Component, props = {}] = args;

	// useHooks.
	const instance = useLogic(Component, props);

	/**
	 * Argument of type '
		* [
				(valueof<TClass["props"]> extends never 
					? [] | [CEmptyObject]
					: [ TClass["props"] ]
				)[0]
			]
		' is not assignable to parameter of type '
			valueof<TClass["props"]> extends never
				? [] | [CEmptyObject]       // | [undefined]
				: [ TClass["props"] ]
		'
	 */

	// beforeMount, onMount, cleanUp.
	useMountCallbacks(instance);

	// beforeRender.
	instance.beforeRender?.();

	// onRender.
	useEffect(() => {
		const cleanupAfterRerender = instance.onRender?.();

		return () => {
			if (typeof cleanupAfterRerender === 'function') cleanupAfterRerender();
			else cleanupAfterRerender?.then((cleanUp?: FunctionType) => cleanUp?.());
		};
	});

	return instance;
};

/** /testing: {
	class A extends ComponentInstance<{}, {}, object> {
		static getInitialState: (p?: object) => ({putan: ''});
		// k = this.props.o
		a = this.state['_initialValues_']

		// useHooks: (() => void | HardEmptyObject) | undefined;
		// hard empty has every key
		// weak empty has no key
		// weak empty is not assignable to hard empty
	}

	const a = useInstance(A, {o: ''});
	a.a;

	// a.props['o'];
	type bbbb = A['state'];
	type ttt = bbbb['put'];
}/**/
