import type { TCleanState, ExtractCleanStateData, TStateData } from '@/base/state';

import { useMemo, useRef } from 'react';
import { useCleanState } from '@/base/state';


///////////////////////////////////


export type HardEmpty = HardEmptyObject;
export type WeakEmpty = WeakEmptyObject;

export type THooksBase = object | void;


//////////////////////////////////


type o = object;

export namespace ComponentLogic {
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
	 */
	export class Class<
			/** Describe the values your component expects to be passed as props. */
			TProps extends object = {},
			/** An object type that descibes your component's state. */
			TState extends TStateData = WeakEmpty,
			/** The object type returned by your component's {@link useHooks} method. */
			THooks extends THooksBase = void> {
		declare readonly state: TCleanState<TState>;
		declare readonly props: TProps;
		declare readonly hooks: THooks extends object ? THooks : WeakEmptyObject;

		/**
		 * Called before each instance of your component is mounted.
		 * It receives the initial `props` object and should return
		 * an object with the initial values for your component's state.
		 * 
		 * PS: `p?: object` wierdly causes TS error in v^5.5.4; object is not assignable to the component's TProps.
		 */
		static getInitialState = (p?: any): object => ({});


		/** Do not use. Will be undefined at runtime. */
		declare readonly _thooks: THooks;
		/**
		 * Call React hooks and expose any values your component
		 * needs by return an object with said values. The returned
		 * object will be accessible as `this.hooks`;
		 */
		useHooks = () => {};
	};

	export interface TInstance<Instance extends Class<o, o, THooksBase>>
			extends Class<
			Instance['props'],
			ExtractCleanStateData<Instance['state']>,
			Instance['_thooks']
		> {
		useHooks: Instance['_thooks'] extends void
			? () => (void | HardEmptyObject)
			: () => Instance['_thooks'] // (Instance['_thooks'] extends object ? Instance['_thooks'] : {});
	}

	type TStatics = Omit<typeof Class<o, o, THooksBase>, 'prototype'>;

	export interface ClassType<
				Instance extends Class<o, o, THooksBase>,
			> extends TStatics, Constructor<Instance> {
		getInitialState: (props?: Instance['props']) => ExtractCleanStateData<Instance['state']>;
	}
}

type UseLogic = {
	<Class extends ComponentLogic.ClassType<ComponentLogic.TInstance<ComponentLogic.Class<o, o, THooksBase>>>>(
		Methods: Class & ComponentLogic.ClassType<InstanceType<Class>>,
	): InstanceType<Class>;

	<Class extends ComponentLogic.ClassType<ComponentLogic.TInstance<ComponentLogic.Class<o, o, THooksBase>>>>(
		Methods: Class & ComponentLogic.ClassType<InstanceType<Class>>,
		props: InstanceType<Class>['props']
	): InstanceType<Class>;
}

type ULParams = [
	Class: (
		ComponentLogic.ClassType<ComponentLogic.TInstance<ComponentLogic.Class<o, o, THooksBase>>>
	),
	props?: object
]

type ULReturn = ComponentLogic.Class<o, o, THooksBase>;

export const useLogic: UseLogic = (...args: ULParams): ULReturn => {
	const [Logic, props = {}] = args;

	const state = useCleanState(Logic.getInitialState, props);

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
		_stateProxy_ = state
	);

	// @ts-expect-error
	self.hooks = (
		_hooksProxy_ = self.useHooks() ?? {}
	);

	return self;
};


/** /testing: {
	const a: object = {b: ''};

	type t = keyof typeof a;

	class MyComponentLogic extends Base<{}, {}, {a: string}> {
		static getInitialState = () => ({a: '' as const});
		// b = this.state.put[''] + this.props.b;

		useHooks = () => ({a: 'undefined'});
	};

	type tt = keyof {};

	MyComponentLogic.getInitialState
	const self = useLogic(MyComponentLogic);
	self.useHooks();


	const A = class C extends Base {
		// static getInitialState = () => ({a: 'l'});
		// a = () => this.state.yyy = '';
	}

	A.getInitialState();

	// const oa = {['a' as unknown as symbol]: 'boo'};
	const oa = {['a']: 'boo'};
	// const self = useLogic(A, oa);
}/**/
