import type { FunctionComponent } from 'react';
import type { ComponentInstanceConstructor } from './instance';

import { useMemo } from 'react';
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
	Render: FunctionComponent<TProps>;

	/**
	 * Use this to let React know whenever you would like all of your instance's state to be reset.
	 * When the value is changed, React will reset all state variables to their initial value the next time your component re-renders.
	 * @see https://react.dev/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes
	 */
	instanceId?: string;

	static FC = function FC <IComponentType extends IComponentConstructor>(this: IComponentType, _Component?: IComponentType) {
		const Component = _Component || this;
		const isClassComponentType = Component.prototype instanceof ClassComponent;

		if (!Component.getInitialState || !isClassComponentType) throw new Error(
			'Attempted to initialize ClassComponent with invalid Class type. Either pass a class that extends ClassComponent to FC (e.g `export FC(MyComponent);`), or ensure it is called as a method on a ClassComponent constructor type (e.g `export MyComponent.FC()`).'
		);

		const Wrapper = (props: InstanceType<IComponentType>['props']) => {
			const { Render, instanceId } = useInstance(Component, props);

			// Add calling component name to Render function name in stack traces.
			useMemo(() => setFunctionName(Render, `${Component.name}.Render`), []);

			return <Render key={instanceId} />;
		}

		// Include calling component name in wrapper function name on stack traces.
		const wrapperName = `ClassComponent${Wrapper.name} > ${Component.name}`;
		setFunctionName(Wrapper, wrapperName);

		return Wrapper;
	};
}
