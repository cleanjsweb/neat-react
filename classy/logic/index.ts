import type { TCleanState } from '@/base/state';
import type { ULParams, ULReturn, UseLogic } from './types/hook';

import { useMemo, useRef } from 'react';
import { useCleanState } from '@/base/state';


/**
 * The base type for the props type argument.
 * This is not the type the `props` property itself.
 * It merely defines the type constraint for the type argument
 * passed when extending any of the advanced external classes.
 * 
 * It differs from the type of the actual props object
 * in that it accepts null for components that don't take any props.
 * 
 * @category Types
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
 * 
 * @group ComponentLogic
 * @category External Classes
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
};


/**
 * Returns an instance of the provided class, which holds methods for your component and
 * encapsulates hook calls with the special {@link ComponentLogic.useHooks | `useHooks`} method.
 * 
 * The class argument must be a subclass of {@link ComponentLogic}.
 * 
 * @group ComponentLogic
 * @category Advanced Tools
 */
export const useLogic: UseLogic = (...args: ULParams): ULReturn => {
	const [Logic, props = {}] = args;

	const self = useRef(useMemo(() => {
		return new Logic();
	}, [])).current;

	/** A proxy variable to allow typechecking of the assignment to `self.props` despite the need for "readonly" error suppression. */
	let _propsProxy_: typeof self.props;
	/** A proxy variable to allow typechecking of the assignment to `self.state` despite the need for "readonly" error suppression. */
	let _stateProxy_: typeof self.state;
	/** A proxy variable to allow typechecking of the assignment to `self.hooks` despite the need for "readonly" error suppression. */
	let _hooksProxy_: typeof self.hooks;

	// @ts-expect-error
	self.props = (
		_propsProxy_ = props
	);

	// @ts-expect-error
	self.state = (
		_stateProxy_ = useCleanState(self.getInitialState, props)
	);

	// @ts-expect-error
	self.hooks = (
		_hooksProxy_ = self.useHooks() ?? {}
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
