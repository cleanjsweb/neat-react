import type { VoidFunctionComponent } from 'react';
import type { IComponentInstanceClass } from './instance';
import type { TStateData } from '@/base';

import { useMemo, useEffect, useState } from 'react';
import { ComponentInstance, useInstance } from './instance';


/** Provide more useful stack traces for otherwise non-specific function names. */
const setFunctionName = (func: FunctionType, newName: string) => {
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

export const useRerender = () => {
	/*
	 * Skip the value, we don't need it.
	 * Grab just the setter function.
	 */
	const [, _forceRerender] = useState(Date.now());
	const rerender = () => _forceRerender(Date.now());

	return rerender;
};

// eslint-disable-next-line no-use-before-define
type ComponentClassParams = ConstructorParameters<typeof ClassComponent>
type o = object;

export interface IComponentClass<

	// eslint-disable-next-line no-use-before-define
	Instance extends ClassComponent<o, o, o> = ClassComponent,

	Params extends ComponentClassParams = ComponentClassParams

> extends IComponentInstanceClass<Instance, Params> {};


// eslint-disable-next-line no-use-before-define
type Extractor = <TComponent extends typeof ClassComponent<o, o, o>>(

	this: NonNullable<typeof _Component>,

	_Component?: TComponent & IComponentClass<InstanceType<TComponent>>

) => VoidFunctionComponent<InstanceType<TComponent>['props']>;

type ReactTemplate = React.JSX.Element | null
export class ClassComponent<
		TProps extends o = WeakEmptyObject,
		TState extends TStateData = WeakEmptyObject,
		THooks extends o = WeakEmptyObject> extends ComponentInstance<TProps, TState, THooks> {
	Render?: VoidFunctionComponent<{}>;
	template?: ReactTemplate | (() => ReactTemplate); // ReturnType<VoidFunctionComponent<{}>>;

	readonly forceUpdate: VoidFunction;

	static readonly FC: Extractor = function FC (this, _Component) {
		const Component = _Component ?? this;
		const isClassComponentType = Component.prototype instanceof ClassComponent;

		if (!Component.getInitialState || !isClassComponentType) throw new Error(
			'Attempted to initialize ClassComponent with invalid Class type. Either pass a class that extends ClassComponent to FC (e.g `export FC(MyComponent);`), or ensure it is called as a method on a ClassComponent constructor type (e.g `export MyComponent.FC()`).'
		);

		// Argument of type '[TComponent["props"]]' is not assignable to parameter of type 'valueof<TComponent["props"]> extends never ? [] | [CEmptyObject] : [TComponent["props"]]'

		type ComponentProps = InstanceType<typeof Component>['props'];

		const Wrapper: VoidFunctionComponent<ComponentProps> = (props) => {
			const instance = useInstance(Component, props);
			const { Render, template } = instance;

			let _forceUpdate: typeof instance.forceUpdate;

			// @ts-expect-error (Cannot assign to 'forceUpdate' because it is a read-only property.ts(2540))
			instance.forceUpdate = (
				_forceUpdate = useRerender() // Moved this to separate line to allow TS errors. Use proxy local variable to regain some type checking for the assignment to `instance.forceUpdate`.
			);

			// Add calling component name to Render function name in stack traces.
			useMemo(() => {
				if (typeof template === 'function')
					setFunctionName(template, `${Component.name}.template`);
				else if (typeof Render === 'function')
					setFunctionName(Render, `${Component.name}.Render`);
			}, [Render, template]);

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
			 * Users should favor using the `template()` method instead. This way, we avoid
			 * establishing a component boundary between `Wrapper` and `Render`.
			 * 
			 * Although, since beforeRender() is called earlier from a hook, this is probably
			 * a non-issue. It will only force users to move their logic into `beforeRender` instead
			 * of doing it directly in `Render`. Even if `template` is being used, the `beforeRender` method
			 * is the preferred location for such logic to maintain a high level of separation of concerns,
			 * which is what this library exists to provide.
			 * 
			 * So there's probably no real value lost with the component boundary. Users should just use
			 * `beforeRender` + `template`.
			**/

			switch (typeof template) {
				case 'undefined':
					if (typeof Render === 'function') return <Render />;
					else throw new Error([
						'A ClassComponent must have either a `template` or a `Render` property. But neither was found.',
						'Add a `template` member to your class and assign a valid (JSX.Element | null) to it. (or a function that returns that).',
						'Alternatively, add a `Render` method and assign a FunctionComponent to it.',
						'\n\n',
						'Expected `Render` to be a Function Component because `template` was `undefined`.',
						`Instead got the following '${typeof Render}': $o`,
					].join(' '), Render);
				case 'function': return template();
				default: return template;
			}
		}

		// Include calling component name in wrapper function name on stack traces.
		setFunctionName(Wrapper, `$${Component.name}$`);

		return Wrapper;
	};
}


interface HookWrapperProps<THookFunction extends AnyFunction> {
	hook: THookFunction,
	argumentsList: Parameters<THookFunction>,
	onUpdate: (output: ReturnType<THookFunction>) => void,
}

type ClassComponentHookWrapper = <Hook extends AnyFunction>(
	props: HookWrapperProps<Hook>
) => null;

export const Use: ClassComponentHookWrapper = (params) => {
	const { hook: useGenericHook, argumentsList, onUpdate } = params;

	const output = useGenericHook(...argumentsList);

	useEffect(() => {
		onUpdate(output);
	}, [output]);

	return null;
};



testing: {
	const a: object = {b: ''};

	type t = keyof typeof a;

	class MyComponentLogic extends ClassComponent<{}, {a: ''}, {}> {
		static getInitialState = () => ({a: '' as const});
	};

	const Template = MyComponentLogic.FC();
}
