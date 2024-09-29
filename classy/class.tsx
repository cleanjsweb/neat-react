import type { ReactElement } from 'react';
import type { ComponentInstanceConstructor } from './instance';

import { useMemo, useEffect } from 'react';
import { ComponentInstance, useInstance } from './instance';

type Obj = Record<string, any>;
type IComponentConstructor = ComponentInstanceConstructor<any, any, any> & typeof ClassComponent<any, any, any>;

/** Provide more useful stack traces for otherwise non-specific function names. */
const setFunctionName = (func: Function, newName: string) => {
	try {
		// Must use try block, as `name` is not configurable on older browsers, and may yield a TypeError.
		Object.defineProperty(func, 'name', {
			writable: true,
			value: newName,
		});
	} catch (error) {
		console.warn(error);
	}
}


export class ClassComponent<TState extends Obj, TProps extends Obj, THooks extends Obj> extends ComponentInstance<TState, TProps, THooks> {
	// Render: FunctionComponent<TProps>;
	Render: () => ReactElement<any, any> | null;

	static FC = function FC <IComponentType extends IComponentConstructor>(this: IComponentType, _Component?: IComponentType) {
		const Component = _Component || this;
		const isClassComponentType = Component.prototype instanceof ClassComponent;

		if (!Component.getInitialState || !isClassComponentType) throw new Error(
			'Attempted to initialize ClassComponent with invalid Class type. Either pass a class that extends ClassComponent to FC (e.g `export FC(MyComponent);`), or ensure it is called as a method on a ClassComponent constructor type (e.g `export MyComponent.FC()`).'
		);

		const Wrapper = (props: InstanceType<IComponentType>['props']) => {
			const { Render } = useInstance(Component, props);

			// Add calling component name to Render function name in stack traces.
			useMemo(() => setFunctionName(Render, `${Component.name} > Render`), [Render]);

			/**
			 * It may be impossible to set state within the body of Render,
			 * since technically, the Wrapper component owns the state and not the Render component.
			 * Consider using this as a function call instead of JSX to avoid that.
			 */
			// if (instance.renderAs === 'component') return <Render />;
			return Render();
		}

		// Include calling component name in wrapper function name on stack traces.
		setFunctionName(Wrapper, `${Component.name} > ${Wrapper.name}`);

		return Wrapper;
	};
}


type AnyFunction = (...args: any) => any;

interface HookWrapperProps<THookFunction extends AnyFunction> {
	hook: THookFunction,
	argumentsList: Parameters<THookFunction>,
	onUpdate: (output: ReturnType<THookFunction>) => void,
}

type ClassComponentHookWrapper = <Hook extends AnyFunction>(
	props: HookWrapperProps<Hook>
) => null;


export const Use: ClassComponentHookWrapper = ({ hook: useGenericHook, argumentsList, onUpdate }) => {
	const output = useGenericHook(...argumentsList);

	useEffect(() => {
		onUpdate(output);
	}, [output]);

	return null;
};

