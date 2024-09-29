import type { ComponentLogicConstructor } from './logic';

import { useEffect } from 'react';
import { useMountState } from '@/base/state';
import { ComponentLogic,  useLogic } from './logic';


type Obj = Record<string, any>;

type AsyncAllowedEffectCallback = () => Awaitable<IVoidFunction>;

export const noOp = () => {};

export class ComponentInstance<TState extends Obj = {}, TProps extends Obj = {}, THooks extends Obj = {}> extends ComponentLogic<TState, TProps, THooks> {

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


type ComponentClassBaseType<
	TState extends Obj = {},
	TProps extends Obj = {},
	THooks extends Obj = {}
> = ComponentLogicConstructor<TState, TProps, THooks> & Constructor<ComponentInstance<TState, TProps, THooks>>

// export interface ComponentInstanceConstructor<TState extends Obj = {}, TProps extends Obj = {}, THooks extends Obj = {}> extends Constructor<ComponentInstance<TState, TProps, THooks>> {
export interface ComponentInstanceConstructor<TState extends Obj = {}, TProps extends Obj = {}, THooks extends Obj = {}> extends ComponentClassBaseType<TState, TProps, THooks> {
	// getInitialState: (props: TProps) => TState;
}

/* 
type UseInstance = <TState extends Obj = {}, TProps extends Obj = {}>(
	Class: ComponentInstanceConstructor<TState, TProps>,
	props: TProps
) => ComponentInstance<TState, TProps>;
*/

type UseInstance = <TClass extends ComponentInstanceConstructor>(
	Class: TClass,
	props: InstanceType<TClass>['props']
) => InstanceType<TClass>;



export const useMountCallbacks = <TInstance extends ComponentInstance<any, any, any>>(instance: TInstance) => {
	const mounted = useMountState();

	if (!mounted) instance.beforeMount?.();

	useEffect(() => {
		const mountHandlerCleanUp = instance.onMount?.();

		return () => {
			const doCleanUp = (runMountCleaners: IVoidFunction) => {
				runMountCleaners?.();

				// onDismount? willUnmount?
				instance.cleanUp?.();
			};

			if (typeof mountHandlerCleanUp === 'function') {
				doCleanUp(mountHandlerCleanUp);
			} else {
				mountHandlerCleanUp?.then(doCleanUp);
			}
		};
	}, []);
};

export const useInstance: UseInstance = (Component, props) => {
	// useHooks.
	const instance = useLogic(Component, props);

	// beforeMount, onMount, cleanUp.
	useMountCallbacks(instance);

	// beforeRender.
	instance.beforeRender?.();
	
	// onRender.
	useEffect(() => {
		const cleanupAfterRerender = instance.onRender?.();

		return () => {
			if (typeof cleanupAfterRerender === 'function') cleanupAfterRerender();
			else cleanupAfterRerender?.then((cleanUp) => cleanUp?.());
		};
	});

	return instance;
};
