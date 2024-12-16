import type { VoidFunctionComponent } from 'react';
import type { TStateData } from '@/base';
import type { THooksBase } from '../logic';
import type { Extractor } from './types/extractor';

import { useMemo } from 'react';

import { ComponentInstance, useInstance } from '../instance';
import { setFunctionName } from './utils/function-name';
import { useRerender } from './utils/rerender';


type o = object;


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
			THooks extends THooksBase = void
		> extends ComponentInstance<TProps, TState, THooks> {

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
	template?: () => (React.JSX.Element | null);

	/**
	 * Manually trigger a rerender of your component.
	 * You should rarely ever need this. But if you are migrating
	 * an older React.Component class, this should provide similar functionality
	 * to the {@link React.Component.forceUpdate | `forceUpdate`} method provided there.
	 * 
	 * Note that the callback argument is currently not supported.
	 */
	declare readonly forceUpdate: VoidFunction;


	/*************************************
	 *   Function Component Extractor    *
	**************************************/

	/**
	 * Extract a Function Component (FC) which can be used to render
	 * your ClassComponent just like any other React component.
	 * 
	 * Each JSX reference to the returned component will render with
	 * a separate instance of your class.
	 * 
	 * So you only need to call `YourClassComponent.FC()` once, then use the returned
	 * function component as many times as you need.
	 * 
	 * It is recommended to store this returned value as a static member of
	 * your ClassComponent. While this value may be given any name, the name
	 * RC (for "React Component") is the recommended convention.
	 * 
	 * @example <caption>Calling FC in your ClassComponent</caption>
	 * class Button extends ClassComponent {
	 *     static readonly RC = this.FC();
	 *     // Because of the static keyword, `this` here refers to the class itself, same as calling `Button.FC()`.
	 * }
	 * 
	 * // Render with `<Button.RC />`, or export RC to use the component in other files.
	 * export default Button.RC;
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

		/** A class-based React function component created with (@cleanweb/react).{@link ClassComponent} */
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
		/**************************************
		*     End Function Component          *
		**************************************/


		setFunctionName(Wrapper, `$${Component.name}$`);
		return Wrapper;
	};

	/** @see {@link ClassComponent.FC} */
	static readonly extract = this.FC;
}

export { ClassComponent as Component };


/** /testing: {
	const a: object = {b: ''};

	type t = keyof typeof a;

	class MyComponentLogic extends ClassComponent<{}, {a: ''}> {
		static getInitialState = () => ({a: '' as const});
		// a = () => this.hooks.a = '';

		useHooks = () => {
			this.state.a;
		};
	};

	const Template = MyComponentLogic.FC();
}/**/
