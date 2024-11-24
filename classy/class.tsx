import type { VoidFunctionComponent/* , ReactElement */ } from 'react';
import type { IComponentClass, TComponentClass } from './logic';

import { useMemo, useEffect } from 'react';
import { ComponentInstance, useInstance } from './instance';


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

// eslint-disable no-use-before-define
// eslint-disable-next-line no-use-before-define
type Extractor = <TComponent extends ClassComponent<object, object, object>>(
	this: TComponentClass<TComponent, typeof ClassComponent>,
	_Component?: TComponentClass<TComponent, typeof ClassComponent>
) => VoidFunctionComponent;
// eslint-enable no-use-before-define

export class ClassComponent<
		TState extends object = EmptyObject,
		TProps extends object = EmptyObject,
		THooks extends object = EmptyObject> extends ComponentInstance<TState, TProps, THooks> {
	Render: VoidFunctionComponent<TProps>;
	// Render: () => ReactElement<any, any> | null;

	static renderAs: 'component' | 'template' = 'component';

	static FC: Extractor = function FC (this, _Component) {
		const Component = _Component ?? this;
		const isClassComponentType = Component.prototype instanceof ClassComponent;

		if (!Component.getInitialState || !isClassComponentType) throw new Error(
			'Attempted to initialize ClassComponent with invalid Class type. Either pass a class that extends ClassComponent to FC (e.g `export FC(MyComponent);`), or ensure it is called as a method on a ClassComponent constructor type (e.g `export MyComponent.FC()`).'
		);

		// Argument of type '[TComponent["props"]]' is not assignable to parameter of type 'valueof<TComponent["props"]> extends never ? [] | [CEmptyObject] : [TComponent["props"]]'

		type ComponentProps = InstanceType<typeof Component>['props'];
		type TProps = valueof<ComponentProps> extends never ? [] | [EmptyObject] : [ComponentProps];
		type TProps3 = valueof<ComponentProps> extends never
			? [EmptyObject, any | undefined]
			: [ComponentProps, any | undefined];
		type TProps2 = valueof<ComponentProps> extends never ? EmptyObject : ComponentProps;
		type TProps4 = [TProps2];

		const a = (b: ComponentProps): b is TProps => {
			return true;
		}

		const Wrapper: VoidFunctionComponent<TProps2> = (props, context) => {
			// type TClass = InstanceType<typeof Component>;
			// const args: valueof<TClass['props']> extends never
			// 	? ([] | [EmptyObject])
			// 	: [TClass['props']] = [props];

			const P: TProps = [props] as TProps;

			const { Render } = useInstance(Component, ...P);

			// Add calling component name to Render function name in stack traces.
			useMemo(() => setFunctionName(Render, `${Component.name} > Render`), [Render]);

			/**
			 * Normally a component can update it's own state in the "before-render" stage to
			 * skip DOM updates and trigger and immediate rerun of the rendering with the new state.
			 * 
			 * It may be impossible to do this within the body of Render, if we call it as JSX here,
			 * since technically, the Wrapper component owns the state and not the Render component.
			 * Using it as JSX establishes a component boundary, and React will throw an error if we try to set
			 * state in the "before-render" stage of `Render`, since it will be attempting to update it's parent's
			 * state (i.e `Wrapper` component) rather than it's own state.
			 * 
			 * Consider using this as a function call instead of JSX to avoid that. This way, we avoid
			 * establishing a component boundary between `Wrapper` and `Render`.
			 * 
			 * Although, since beforeRender() is called earlier from a hook, this is probably
			 * a non-issue. It will only force users to move their logic into `beforeRender` instead
			 * of doing it directly in `Render`. This might mean cleaner Render functions,
			 * so there's probably no real value lost if we keep the component boundary.
			**/
			
			if (Component.renderAs === 'template') return Render({}, context);

			// With the existence of useContext(),
			// what exactly does the context argument to FunctionComponent represent?
			// Do we need to find a way to pass that context value to <Render /> here?
			return <Render />;
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

