import { useEffect } from "react";

import { useMountState } from "./state";
import { ComponentLogic, ComponentLogicConstructor, useLogic } from "./logic";

type Obj = Record<string, any>;

export class ComponentInstance<TState extends Obj = {}, TProps extends Obj = {}, THooks extends Obj = {}> extends ComponentLogic<TState, TProps, THooks> {
	beforeMount: VoidFunction = () => {};
	onMount: () => Function | Promise<Function> = () => {
		return () => {};
	};

	beforeRender: VoidFunction = () => {};
	onRender: VoidFunction = () => {};

	cleanUp: VoidFunction = () => {};
};


type T<
	TState extends Obj = {},
	TProps extends Obj = {},
	THooks extends Obj = {}
> = ComponentLogicConstructor<TState, TProps, THooks> & Constructor<ComponentInstance<TState, TProps, THooks>>

// export interface ComponentInstanceConstructor<TState extends Obj = {}, TProps extends Obj = {}, THooks extends Obj = {}> extends Constructor<ComponentInstance<TState, TProps, THooks>> {
export interface ComponentInstanceConstructor<TState extends Obj = {}, TProps extends Obj = {}, THooks extends Obj = {}> extends T<TState, TProps, THooks> {
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
			const doCleanUp = (runMountCleaners) => {
				runMountCleaners?.();

				instance.cleanUp();
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
	// useCustomHooks.
	const instance = useLogic(Component, props);

	// beforeMount, onMount, cleanUp.
	useMountCallbacks(instance);

	instance.beforeRender()
	useEffect(instance.onRender);

	return instance;
};
