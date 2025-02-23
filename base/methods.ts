/**
 * @module ComponentMethods
 */


// JSDoc references
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

	_hmrPreserveKeys: Array<keyof this | (string & {})> = [];
	declare _onHmrUpdate: <
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
 * @summary
 * Returns an instance of the provided class,
 * with the state and props arguments added as instance members.
 * 
 * @remarks
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

	if (process.env.NODE_ENV === 'development') {
		// const rerender = useRerender();

		useEffect(() => {
			if (instanceRef.current === latestInstance) return;

			console.log([
				'HMR-updated component class detected.',
				'Creating a new instance with the updated class.',
				'All stateful values will be copied over.\n\n',
				'Note that this mechanism only works in the `development` environment during HMR.',
				'In production, the class argument will be ignored after the first render.\n\n',
				'If this wasn\'t an HMR update, you should refactor your code to make sure',
				'all clean-react hooks receive the same class object on every render.'
			].join( ));

			const oldInstance = instanceRef.current;
			const hmrPreserveKeys = [
				...(latestInstance._hmrPreserveKeys ?? []),
				'state', 'props', 'hooks',
			];

			hmrPreserveKeys.forEach((_key) => {
				const key = _key as keyof typeof latestInstance;
				// @ts-expect-error We're assigning to readonly properties. Also, Typescript doesn't know that the type of the left and right side will always match, due to the dynamic access.
				latestInstance[key] = oldInstance[key];
			});

			latestInstance._onHmrUpdate(oldInstance);
			instanceRef.current = latestInstance;
			// rerender();
		});
	}

	const methods = instanceRef.current;

	/**
	 * A proxy variable to allow typechecking of the assignment
	 * to a readonly property,
	 * despite the need for "readonly" error suppression.
	 */
	let _propsProxy: typeof methods.props;
	/** @see {@link _propsProxy} */
	let _stateProxy: typeof methods.state;

	// @ts-expect-error
	methods.props = (
		_propsProxy = props
	);

	// @ts-expect-error
	if (state) methods.state = (
		_stateProxy = state
	);

	return methods;
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

