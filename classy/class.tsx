import type { VoidFunctionComponent, Component } from 'react';
import type { TStateData } from '@/base';
import type { IComponentInstanceClass } from './instance';

import { useMemo, useEffect, useState } from 'react';

import { ComponentInstance, useInstance } from './instance';
import { THooksBase } from './logic';


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



type ComponentClassIT<
		TComponent extends ClassComponent<object, object, THooksBase>> = {
	useHooks$?: () => TComponent['hooks'];
	template?: () => React.JSX.Element | null;
} & TComponent;

type T<
	TProps extends object,
	TState extends TStateData,
	THooks extends THooksBase
> = typeof ClassComponent<TProps, TState, THooks>;

interface ComponentClass<
		TProps extends object,
		TState extends TStateData,
		THooks extends THooksBase> extends T<TProps, TState, THooks> {
	new (
		...params: ConstructorParameters<T<TProps, TState, THooks>>
	): ComponentClassIT<ClassComponent<TProps, TState, THooks>>;
}
export interface IComponentClass<
	// eslint-disable-next-line no-use-before-define
	Instance extends ClassComponent<o, o, THooksBase> = ClassComponent
> extends IComponentInstanceClass<Instance> {};



type Extractor = <
		TComponent extends ComponentClass<object, object, THooksBase>>(
	this: NonNullable<typeof _Component>,
	_Component?: TComponent & IComponentClass<InstanceType<TComponent>>
) => VoidFunctionComponent<InstanceType<TComponent>['props']>;
// eslint-disable-next-line no-use-before-define
// type Extractor = <TComponent extends typeof ClassComponent<o, o, THooksBase>>(
// 	this: NonNullable<typeof _Component>,
// 	_Component?: TComponent & IComponentClass<InstanceType<TComponent>>
// ) => VoidFunctionComponent<InstanceType<TComponent>['props']>;




/**
 * A superset of {@link ComponentInstance} that allows defining your
 * component's JSX template directly inside the class.
 * 
 * This is designed to closely resemble the old {@link React.Component} class,
 * making it easier to migrate older class components to the newer hooks-based system
 * with little to no changes to their existing semantics/implementation.
 */
export class ClassComponent<
		TProps extends o = WeakEmptyObject,
		TState extends TStateData = WeakEmptyObject,
		THooks extends THooksBase = void> extends ComponentInstance<TProps, TState, THooks> {

	/**
	 * @deprecated An older alternative to {@link template}.
	 * 
	 * Using this will add a component boundary between your JSX template
	 * and the function component returned from ClassComponent.FC();
	 * 
	 * This means that from React's perspective, your template won't "own" the state and props it consumes.
	 * This could lead to subtle unexpected changes in behaviour.
	 * 
	 * In most cases, you should use {@link template} instead, as it allows your class component
	 * to function more predictably as a single unit.
	 */
	Render?: VoidFunctionComponent<{}>;

	/**
	 * Analogous to {@link React.Component.render}. A function that returns
	 * your component's JSX template.
	 * 
	 * You should place most logic that would usually go here
	 * in {@link ComponentInstance.beforeRender | `beforeRender`} instead.
	 * This helps to separate concerns and keep the template itself clean.
	 * 
	 * ******
	 * 
	 * Ideally the template method should only be concerned with defining the HTML/JSX structure of
	 * your component's UI. This may include destructuring nested instance members
	 * into more easily accessible local variables, or some simple transformation of data from props/state
	 * into a more appropriate format for display.
	 * 
	 * ******
	 * 
	 * @example < caption>Using a template function that returns JSX.</ caption>
	 * 
	 * ```tsx
	 * template = () => {
	 *     const { title } = this.props;
	 * 
	 *     return (
	 *         <h1>
	 *             {this.props.title}
	 *         </h1>
	 *     );
	 * }
	 * ```
	 */
	template?: () => (React.JSX.Element | null); // ReturnType<VoidFunctionComponent<{}>>;

	/**
	 * Manually trigger a rerender of your component.
	 * You should rarely ever need this. But if you are migrating
	 * an older React.Component class, this should provide similar functionality
	 * to the {@link Component.forceUpdate | `forceUpdate`} method provided there.
	 * 
	 * Note that the callback argument is currently not supported.
	 */
	declare readonly forceUpdate: VoidFunction;


	/*************************************
	 *   Function Component Extractor    *
	**************************************/
	// @todo Attempt using implicit `this` value to allow rendering <MyComponent.FC /> directly.
	// const FC = (props) => { const self = useMemo(() => useInstance(this, props), {}); return self.template(); }
	/**
	 * Extract a function component which can be used to render
	 * your ClassComponent just like any other component.
	 * 
	 * Each JSX reference to this returned component will render with
	 * a separate instance of your class.
	 * 
	 * So you only need to call `YourClassComponent.FC()` once, then use the returned
	 * function component as many times as you need.
	 */
	static readonly FC: Extractor = function FC (this, _Component) {
		const Component = _Component ?? this;
		const isClassComponentType = Component.prototype instanceof ClassComponent;

		if (!Component.getInitialState || !isClassComponentType) throw new Error(
			'Attempted to initialize ClassComponent with invalid Class type. Either pass a class that extends ClassComponent to FC (e.g `export FC(MyComponent);`), or ensure it is called as a method on a ClassComponent constructor type (e.g `export MyComponent.FC()`).'
		);

		// Argument of type '[TComponent["props"]]' is not assignable to parameter of type 'valueof<TComponent["props"]> extends never ? [] | [CEmptyObject] : [TComponent["props"]]'

		type ComponentProps = InstanceType<typeof Component>['props'];



		/*************************************
		 *    Begin Function Component       *
		**************************************/
		/** A class-based React function component created with (@cleanweb/react).ClassComponent */
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
						'Add a `template: (JSX.Element | null);` member to your class, (or a `template` method that returns the same type).',
						'Alternatively, add a `Render: FunctionComponent;` method.',
						'\n\n',
						'Expected `Render` to be a Function Component because `template` was `undefined`.',
						`Instead got the following '${typeof Render}': $o`,
					].join(' '), Render);
				case 'function': return template();
				default: return template;
			}
		}
		/*************************************
		 *     End Function Component        *
		**************************************/


		setFunctionName(Wrapper, `$${Component.name}$`);
		return Wrapper;
	};
}


interface HookWrapperProps<THookFunction extends AnyFunction> {
	/**
	 * The React hook you which to consume.
	 * Render a separate instance of the `<Use />` component for each hook.
	 * You can also create a custom hook that combines multiple hooks,
	 * then use that wrapper hook with a single `<Use />` instance.
	 */
	hook: THookFunction,

	/**
	 * An array containing the list of arguments
	 * to be passed to your hook, in the right order.
	 */
	argumentsList: Parameters<THookFunction>,

	/**
	 * A callback that will be called with whatever value your hook returns.
	 * Use this to update your component's state with the value.
	 * This will allow your component to rerender whenever the hook returns a new value.
	 */
	onUpdate: (output: ReturnType<THookFunction>) => void,
}

type ClassComponentHookWrapper = <Hook extends AnyFunction>(
	props: HookWrapperProps<Hook>
) => null;


/**
 * A component you can use to consume hooks
 * in a {@link Component | React.Component} class component.
 */
export const Use: ClassComponentHookWrapper = (params) => {
	const { hook: useGenericHook, argumentsList, onUpdate } = params;

	const output = useGenericHook(...argumentsList);

	useEffect(() => {
		onUpdate(output);
	}, [output]);

	return null;
};



/*testing: {
	const a: object = {b: ''};

	type t = keyof typeof a;

	class MyComponentLogic extends ClassComponent<{a: ''}> {
		static getInitialState = () => ({a: '' as const});
		// a = () => this.hooks.a = '';

		useHooks = () => {

		};
	};

	const Template = MyComponentLogic.FC();
}*/
