/**
 * @module ComponentMethods
 */


// JSDoc references
import { useRerender } from '@/helpers';
import type { useCleanState } from './state';

// Types
import type { TCleanState, TStateData } from './state';

// Values
import { useEffect, useMemo, useRef } from 'react';


/**
 * @summary
 * Base class for a class that holds methods for a function component.
 * 
 * @remarks
 * These methods will have access to the components state and props via
 * `this.state` and `this.props` respectively.
 * 
 * Call the {@link useMethods} hook inside your function component to instantiate the class.
 */
export class ComponentMethods<
		TProps extends object = {},
		TState extends TStateData | null = null> {
	declare readonly props: TProps;
	declare readonly state: TState extends TStateData ? TCleanState<TState> : null;

	/**
	 * Specify custom class members to be copied over whenever the class is
	 * reinstantiated during hot module replacement.
	 * 
	 * Oore handles HMR by recreating the class instance
	 * with the updated code whenever there is a file change.
	 * Your component is then rerendered so that event handlers
	 * now point to the new functions.
	 * 
	 * For this to work well, your component's state needs to be preserved,
	 * so it is copied over from the old instance, to the newly created one.
	 * This includes `state`, `props` by default, but you can
	 * extend it to include more properties if there are values your component expects
	 * to be persistent.
	 * 
	 * In most case, any values you wish to preserve should be created `React.useRef`.
	 * ```
	 * // In useHooks method:
	 * this.inputId = useRef(inputId);
	 * // And access anywhere with:
	 * this.inputId.current;
	 * ```
	 * If you use a ref in this way, React will preserve it for you, and there will be no need
	 * to use `_hmrPreserveKeys`.
	 * 
	 * `_hmrPreserveKeys` is only relevant in development and has not effect in production environment.
	 * Accordingly, you should only update this array when environment is development, so
	 * that it can be tree-shaken during production builds.
	 * 
	 * @example Specify additional properties to be considered stateful,
	 * in addition to `state`, `props`, and `hooks`.
	 * ```ts
	 * MyComponentMethods extends ComponentMethods {
	 *     // Some class member definitions...
	 * 
	 *     constructor() {
	 *         if (process.env.NODE_ENV === 'development') {
	 *             this._hmrPreserveKeys.push('inputId', 'unsubscribeCallback');
	 *         }
	 *     }
	 * 
	 *     // Method definitions...
	 * }
	 * With the above example, whenever HMR occurs, `this.inputId` and `this.unsubscribeCallback`
	 * will maintain there existing values, while everything else will be recreated. Meanwhile,
	 * because the code is written in an environment condition, it should be easy to strip it from the
	 * production build to avoid shipping dead code.
	 */
	_hmrPreserveKeys: Array<keyof this | (string & {})> = []; // @todo Keep undefined. Update to empty array after instantiation in dev env.

	/**
	 * Handle complex update logic whenever your component instance is updated through HMR.
	 * The function is called on the new instance, and it receives the old instance as the only argument.
	 * So you can access data from the old instance, and reinitialize any processes on the new instance as needed.
	 * 
	 * 
	 * `_onHmrUpdate` is only relevant in development and has not effect in production environment.
	 * Accordingly, you should only assign this function when environment is development, so
	 * that it can be tree-shaken during production builds.
	 * 
	 * @example
	 * ```ts
	 * MyComponentMethods extends ComponentMethods {
	 *     // Some class member definitions...
	 * 
	 *     constructor() {
	 *         if (process.env.NODE_ENV === 'development') {
	 *             this._onHmrUpdate = () => {
	 *                 // Your custom hmr logic here.
	 *             };
	 *         }
	 *     }
	 * 
	 *     // Method definitions...
	 * }
	 */
	declare _onHmrUpdate?: <
		TInstance extends this
	>(oldInstance: TInstance) => void;
};

type UseMethods = {
	<Class extends typeof ComponentMethods<object, object>>(
		Methods: Class & Constructor<InstanceType<Class>>,
		props: InstanceType<Class>['props'],
		state: InstanceType<Class>['state'],
	): InstanceType<Class>;

	<Class extends typeof ComponentMethods<object, null>>(
		Methods: Class & Constructor<InstanceType<Class>>,
		props: InstanceType<Class>['props'],
		state?: null // null should be equal to InstanceType<Class>['state'] in this case.
	): InstanceType<Class>;

	<Class extends typeof ComponentMethods<NeverObject, null>>(
		Methods: Class & Constructor<InstanceType<Class>>,
	): InstanceType<Class>;
}

type UMParams = [
	Methods: (
		typeof ComponentMethods<object, object>
		& Constructor<ComponentMethods<object, object>>
	),
	props?: object,
	state?: TCleanState<object> | null
]

type UMReturn = ComponentMethods<object, object>;


/**
 * Returns an instance of the provided class,
 * with the state and props arguments added as instance members.
 * 
 * `state` should be an instance of `CleanState` created with {@link useCleanState}.
 */
const useMethods: UseMethods = (...args: UMParams): UMReturn => {
	const [Methods, props = {}, state] = args;

	// Vite HMR seems to sometimes reinitialize useMemo calls after a hot update,
	// causing the instance to be unexpectedly recreated in the middle of the component's lifecycle.
	// But useRef and useState values appear to always be preserved whenever this happens.
	// So those two are the only cross-render-persistence methods we can consider safe.

	// In production, we only use the latestInstance the first time, and it's ignored every other time.
	// This means changing the class at runtime will have no effect in production.
	// latestInstance is only extracted into a separate variable for use in dev mode during HMR.
	const latestInstance = useMemo(() => new Methods(), [Methods]);
	const instanceRef = useRef(latestInstance);

	const refreshState = () => {
		// @ts-expect-error
		instanceRef.current.props = props;
	
		// @ts-expect-error
		if (state) instanceRef.current.state = state;
	}

	if (process.env.NODE_ENV === 'development' && instanceRef.current !== latestInstance) {
		const oldInstance = instanceRef.current;

		latestInstance._hmrPreserveKeys.forEach((_key) => {
			const key = _key as (typeof latestInstance._hmrPreserveKeys)[number];
			// @ts-expect-error We're assigning to readonly properties. Also, Typescript doesn't know that the type of the left and right side will always match, due to the dynamic access.
			latestInstance[key] = oldInstance[key];
		});

		Reflect.ownKeys(oldInstance).forEach((_key) => {
			const key = _key as keyof typeof oldInstance;
			delete oldInstance[key];
		});
		Object.setPrototypeOf(oldInstance, latestInstance);

		instanceRef.current = latestInstance;
		refreshState();
		latestInstance._onHmrUpdate?.(oldInstance);
	}

	else refreshState();

	return instanceRef.current;
};

export  { useMethods };

/** /testing: {
	let a = async () => { 
		const a: object = {b: ''};

		type t = keyof typeof a;

		class MyMethods extends ComponentMethods<EmptyObject, null> {
			// static getInitialState = () => ({});
		};

		const { useCleanState } = (await import('./state.js'));

		const self = useMethods(MyMethods, {});
		self.state;
	}
}/**/

