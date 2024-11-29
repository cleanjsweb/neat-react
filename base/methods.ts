// JSDoc references
import type { useCleanState } from './state';

// Types
import type { TCleanState, TStateData } from './state';

// Values
import { useMemo, useRef } from 'react';


/**
 * Base class for a class that holds methods intended for use in a function component.
 * These methods will have access to the components state and props via
 * `this.state` and `this.props` respectively.
 * 
 * Call the {@link useMethods} hook inside your function component to instantiate the class.
 */
export class ComponentMethods<
		TProps extends object = {},
		TState extends TStateData | null = null> {
	declare readonly props: TProps;
	declare state: TState extends TStateData ? TCleanState<TState> : null;
};

type UseMethods = {
	<Class extends typeof ComponentMethods<object, TStateData>>(
		Methods: Class & Constructor<InstanceType<Class>>,
		props: InstanceType<Class>['props'],
		state: InstanceType<Class>['state'],
	): InstanceType<Class>;

	<Class extends typeof ComponentMethods<object, null>>(
		Methods: Class & Constructor<InstanceType<Class>>,
		props: InstanceType<Class>['props'],
		state?: null // null should be equal to InstanceType<Class>['state'] in this case.
	): InstanceType<Class>;

	<Class extends typeof ComponentMethods<HardEmptyObject, null>>(
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
 * `state` must be an instance of `CleanState` created with {@link useCleanState}.
 */
const useMethods: UseMethods = (...args: UMParams): UMReturn => {
	const [Methods, props = {}, state] = args;

	// Vite HMR seems to sometimes reinitialize useMemo calls after a hot update,
	// causing the instance to be unexpectedly recreated in the middle of the component's lifecycle.
	// But useRef and useState values appear to always be preserved whenever this happens.
	// So those two are the only cross-render-persistence methods we can consider safe.
	// @todo Provide a way for users to reflect updated methods code on the existing instance after HMR.
	const methods = useRef(useMemo(() => {
		return new Methods();
	}, [])).current;

	/** A proxy variable to allow typechecking of the assignment to methods.props despite the need for "readonly" error suppression. */
	let _propsProxy_: typeof methods.props;

	// @ts-expect-error
	methods.props = (
		_propsProxy_ = props
	);

	if (state) methods.state = state;

	return methods;
};

export  { useMethods };

testing: {
	let a = async () => { 
		const a: object = {b: ''};

		type t = keyof typeof a;

		class MyMethods extends ComponentMethods<WeakEmptyObject, null> {
			// static getInitialState = () => ({});
		};

		const { useCleanState } = (await import('./state.js'));

		const self = useMethods(MyMethods, {});
		self.state;
	}
}

