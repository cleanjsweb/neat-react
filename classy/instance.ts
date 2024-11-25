import { useEffect } from 'react';
import { useMountState } from '@/base/state';
import { ComponentLogic,  IComponentLogicClass,  useLogic } from './logic';


type AsyncAllowedEffectCallback = () => Awaitable<IVoidFunction>;

type UseMountCallbacks = <
	// eslint-disable-next-line no-use-before-define
	TInstance extends ComponentInstance<any, any, any>
>(instance: TInstance) => void;

export const useMountCallbacks: UseMountCallbacks = (instance) => {
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

export const noOp = () => {};

export class ComponentInstance<
		TProps extends o = EmptyObject,
		TState extends o = EmptyObject,
		THooks extends o = EmptyObject> extends ComponentLogic<TProps, TState, THooks> {
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

type o = object;
type InstanceClassParams = ConstructorParameters<typeof ComponentInstance<o, o, o>>;

export interface IComponentInstanceClass<
	Instance extends ComponentInstance<o, o, o> = ComponentInstance,
	Params extends InstanceClassParams = InstanceClassParams
> extends IComponentLogicClass<Instance, Params> {};

type UseInstance = <TClass extends typeof ComponentInstance<object, object, object>>(
	Class: TClass & IComponentInstanceClass<InstanceType<TClass>>,

	...props: valueof<InstanceType<TClass>['props']> extends never
		? ([] | [EmptyObject] | [InstanceType<TClass>['props']])
		: [InstanceType<TClass>['props']]
) => InstanceType<TClass>;

/*
 * To ensure successful type checking, the second parameter must be written with spread syntax.
 * Likely because of the `exactOptionalPropertyTypes` config option turned on,
 * and `UseInstance` using an empty tuple in its rest parameter type, attempting to simply
 * retrieve the second argument directly causes an error when that argument is passed on to `useLogic`.
 * But directly working with the rest array bypasses the problem. Also note that the issue persists even when
 * the second param is given `{}` as a default follow to account for the empty tuple case. TypeScript
 * just wants us to use the rest parameter explicitly by force.
 */
export const useInstance: UseInstance = (Component, ...args) => {
	// useHooks.
	const instance = useLogic(Component, ...args); // Must spread rest parameter, rather than passing a single `props` argument directly.

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
			else cleanupAfterRerender?.then((cleanUp) => cleanUp?.());
		};
	});

	return instance;
};
