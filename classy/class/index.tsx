import type { VoidFunctionComponent } from 'react';
import type { Extractor } from './types/extractor';

import { useMemo } from 'react';

import { ComponentInstance, useInstance } from '../instance';
import { setFunctionName } from './utils/function-name';
import { useRerender } from '@/helpers/rerender';


/**
 * A superset of {@link ComponentInstance} that allows defining your
 * component's JSX template directly inside the class.
 * 
 * This is designed to closely resemble the old {@link React.Component} class,
 * making it easier to migrate older class components to the newer hooks-based system
 * with little to no changes to their existing semantics/implementation.
 */
export class ClassComponent<
			TProps extends object = WeakEmptyObject
		> extends ComponentInstance<TProps> {
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
	 * @example <caption>Using a template function that returns JSX.</caption>
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
	template: (
		context: this['templateContext']
	) => JSX.Element | null = () => null;

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
	static readonly extract: Extractor = function FC (this, _Component) {
		const Component = _Component ?? this;
		const isClassComponentType = Component.prototype instanceof ClassComponent;

		if (!isClassComponentType) throw new Error(
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
			const { template, templateContext } = instance;

			let _forceUpdate: typeof instance.forceUpdate;

			// @ts-expect-error (Cannot assign to 'forceUpdate' because it is a read-only property.ts(2540))
			instance.forceUpdate = (
				_forceUpdate = useRerender() // Moved this to separate line to allow TS errors. Use proxy local variable to regain some type checking for the assignment to `instance.forceUpdate`.
			);

			// Add calling component name to template function name in stack traces.
			useMemo(() => {
				setFunctionName(template, `${Component.name}.template`);
			}, [template]);

			return template(templateContext);
		}
		/**************************************
		*     End Function Component          *
		**************************************/


		setFunctionName(Wrapper, `$${Component.name}$`);
		return Wrapper;
	};

	/** @see {@link ClassComponent.extract} */
	static readonly FC = this.extract;
}


export { ClassComponent as Component };
export { Use } from './use-component';


/** /
testing: {
	const a: object = {b: ''};

	type t = keyof typeof a;

	class MyComponentLogic extends ClassComponent<{a: ''}> {
		getInitialState = () => ({a: '' as const});
		// a = () => this.hooks.a = '';

		useHooks = () => {
			this.state.a;
		};
	};

	const Template = MyComponentLogic.FC();
}/**/
