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

	static FC = function FC <IComponentType extends IComponentConstructor>(this: IComponentType, _Component?: IComponentType) {
		const Component = _Component || this;
		const isClassComponentType = Component.prototype instanceof ClassComponent;

		if (!Component.getInitialState || !isClassComponentType) throw new Error(
			'Attempted to initialize ClassComponent with invalid Class type. Either pass a class that extends ClassComponent to FC (e.g `export FC(MyComponent);`), or ensure it is called as a method on a ClassComponent constructor type (e.g `export MyComponent.FC()`).'
		);

		const Wrapper = (props: InstanceType<IComponentType>['props']) => {
			const { Render } = useInstance(Component, props);

			// Add calling component name to Render function name in stack traces.
			useMemo(() => setFunctionName(Render, `${Component.name}.Render`), []);

			return <Render />;
		}

		// Include calling component name in wrapper function name on stack traces.
		const wrapperName = `ClassComponent${Wrapper.name} > ${Component.name}`;
		setFunctionName(Wrapper, wrapperName);

		return Wrapper;
	};
}
