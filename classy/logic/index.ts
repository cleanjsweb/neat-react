import type { TCleanState } from '@/base/state';
import type { ULParams, ULReturn, UseLogic } from './types/hook';

import { useMemo, useRef } from 'react';
import { useCleanState } from '@/base/state';
import { useRerender } from '@/helpers';


/**
 * The base type for the props type argument.
 * This is not the type the `props` property itself.
 * It merely defines the type constraint for the type argument
 * passed when extending any of the advanced external classes.
 * 
 * It differs from the type of the actual props object
 * in that it accepts null for components that don't take any props.
 */
export type TPropsBase = NonPrimitive | null;



/**
 * Base class for a class that holds methods intended for use in a function component,
 * as well as a static method for initializing state.
 * 
 * These methods will have access to the components state and props via
 * `this.state` and `this.props` respectively.
 * 
 * The special {@link Class['useHooks'] | useHooks} method allows you to consume
 * React hooks within this class.
 * 
 * Call the {@link useLogic} hook inside your function component to instantiate the class.
 * 
 * @typeParam TProps - {@include ./types/tprops.md}
 */
export class ComponentLogic<TProps extends TPropsBase = null> {
	/**
	 * A {@link TCleanState | `CleanState`} object.
	 * Holds all of your component's state,
	 * and methods for conveniently manipulating those values.
	 * Initialiazed with the object returned from your `getInitialState` method.
	 */
	declare readonly state: TCleanState<ReturnType<this['getInitialState']>>;

	/** The props passed into your component at the time of rendering. */
	declare readonly props: TProps extends null ? EmptyObject : TProps;

	/**
	 * Values received from the hooks your component consumes.
	 * This holds the latest copy of the object returned by
	 * {@link useHooks}.
	 */
	declare readonly hooks: ReturnType<this['useHooks']>;

	/**
	 * Called before each instance of your component is mounted.
	 * It receives the initial `props` object and should return
	 * an object with the initial values for your component's state.
	 */
	getInitialState = (props?: this['props']): object => ({});

	/**
	 * Call React hooks from here. If your component needs
	 * access to values return from the hooks you call,
	 * expose those values by returning an object with said values.
	 * 
	 * The returned object will be accessible as {@link hooks | `this.hooks`} within
	 * your component class.
	 */
	useHooks = (): object | void => {};

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
	_hmrPreserveKeys: Array<keyof this | (string & {})> = [];

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


/**
 * Returns an instance of the provided class, which holds methods for your component and
 * encapsulates hook calls with the special {@link ComponentLogic.useHooks | `useHooks`} method.
 * 
 * The class argument must be a subclass of {@link ComponentLogic}.
 * 
 * @see https://cleanjsweb.github.io/neat-react/functions/API.useLogic.html
 */
export const useLogic: UseLogic = (...args: ULParams): ULReturn => {
	const [Logic, props = {}] = args;

	// In production, we only use the latestInstance the first time, and it's ignored every other time.
	// This means changing the class at runtime will have no effect in production.
	// latestInstance is only extracted into a separate variable for use in dev mode during HMR.
	const latestInstance = useMemo(() => new Logic(), [Logic]);
	const instanceRef = useRef(latestInstance);

	if (process.env.NODE_ENV === 'development') {
		if (instanceRef.current !== latestInstance) {
			console.log([
				'HMR-updated component class detected.',
				'Creating a new instance with the updated class.',
				'All stateful values will be copied over.\n\n',
				'Note that this mechanism only works in the `development` environment during HMR.',
				'In production, the class argument will be ignored after the first render.\n\n',
				'If this wasn\'t an HMR update, you should refactor your code to make sure',
				'all clean-react hooks receive the same class argument on every render.'
			].join(' '));

			const oldInstance = instanceRef.current;

			latestInstance._hmrPreserveKeys.forEach((_key) => {
				const key = _key as keyof typeof latestInstance;
				// @ts-expect-error We're assigning to readonly properties. Also, Typescript doesn't know that the type of the left and right side will always match, due to the dynamic access.
				latestInstance[key] = oldInstance[key];
			});

			latestInstance._onHmrUpdate?.(oldInstance);
			instanceRef.current = latestInstance;

			Reflect.ownKeys(oldInstance).forEach((_key) => {
				const key = _key as keyof typeof oldInstance;
				delete oldInstance[key];
			});
			Object.setPrototypeOf(oldInstance, latestInstance);
		}
	}

	const self = instanceRef.current;

	/**
	 * A proxy variable to allow typechecking of the assignment
	 * to a readonly property,
	 * despite the need for "readonly" error suppression.
	 */
	let _propsProxy: typeof self.props;
	/** @see {@link _propsProxy} */
	let _stateProxy: typeof self.state;
	/** @see {@link _propsProxy} */
	let _hooksProxy: typeof self.hooks;

	// @ts-expect-error
	self.props = (
		_propsProxy = props
	);

	// @ts-expect-error
	self.state = (
		_stateProxy = useCleanState(self.getInitialState, props)
	);

	// @ts-expect-error
	self.hooks = (
		_hooksProxy = self.useHooks() ?? {}
	);

	return self;
};


/** /
testing: {
	const a: object = {b: ''};

	type t = keyof typeof a;

	class MyComponentLogic extends ComponentLogic<{}> {
		getInitialState = () => ({b: 7});
		b = () => 8 + this.state.b;

		useHooks = () => ({a: 'undefined'});
	};

	type tt = keyof {};

	const self = useLogic(MyComponentLogic);
	self.hooks;
	self.useHooks();


	const A = class C extends ComponentLogic {
		getInitialState = () => ({a: 'l'});
		a = () => this.state.a = '';
	}

	// const oa = {['a' as unknown as symbol]: 'boo'};
	const oa = {['a']: 'boo'};
	useLogic(A, oa);
}
/**/
