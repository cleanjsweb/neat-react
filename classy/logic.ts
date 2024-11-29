import type { TCleanState, ExtractCleanStateData, TStateData } from '@/base/state';

import { useMemo, useRef } from 'react';
import { useCleanState } from '@/base/state';


export type HardEmpty = HardEmptyObject;
export type WeakEmpty = WeakEmptyObject;

export type THooksBase = o | void;

type o = object;


/**
 * Base class for a class that holds methods intended for use in a function component,
 * as well as a static method for initializing state.
 * 
 * These methods will have access to the components state and props via
 * `this.state` and `this.props` respectively.
 * 
 * The special {@link ComponentLogic.useHooks | useHooks} method allows you to consume
 * React hooks within this class.
 * 
 * Call the {@link useLogic} hook inside your function component to instantiate the class.
 */
export class ComponentLogic<
		/** Describe the values your component expects to be passed as props. */
		TProps extends object = {},
		/** An object type that descibes your component's state. */
		TState extends TStateData = WeakEmpty,
		/** The object type returned by your component's {@link useHooks} method. */
		THooks extends THooksBase = void> {
	declare state: TCleanState<TState>;
	declare readonly props: TProps;
	declare readonly hooks: THooks extends object ? THooks : WeakEmptyObject;

	/**
	 * Called before each instance of your component is mounted.
	 * It receives the initial `props` object and should return
	 * an object with the initial values for your component's state.
	 */
	static getInitialState = (p?: object): object => ({});

	/**
	 * This allows you to seamlessly consume React hooks in
	 * your class component.
	 * 
	 * It is called after state and props are updated on each render.
	 * Call any hooks (e.g `useEffect`) you which to consume inside this function.
	 * 
	 * To expose any returned values from your hooks to the rest of your component,
	 * return an object that contains all the relevant values.
	 * 
	 * This object will be accessible as `this.hooks` to the rest of your class.
	 */
	useHooks: THooks extends void
		? undefined | (() => void | HardEmptyObject)
		: () => THooks;
};

type LogicClassParams = ConstructorParameters<typeof ComponentLogic>;

export interface IComponentLogicClass<
			Instance extends ComponentLogic<o, o, THooksBase> = ComponentLogic,
			Params extends LogicClassParams = LogicClassParams
		> extends Constructor<Instance, Params> {
	getInitialState: (props?: Instance['props']) => ExtractCleanStateData<Instance['state']>;
	// new (...params: CnstPrm): Instance;
}

type UseLogic = {
	<Class extends typeof ComponentLogic<HardEmptyObject, o, THooksBase>>(
		Methods: Class & IComponentLogicClass<InstanceType<Class>>,
	): InstanceType<Class>;

	<Class extends typeof ComponentLogic<o, o, THooksBase>>(
		Methods: Class & IComponentLogicClass<InstanceType<Class>>,
		props: InstanceType<Class>['props']
	): InstanceType<Class>;
}

type ULParams = [
	Class: (
		typeof ComponentLogic<o, o, THooksBase>
		& IComponentLogicClass<ComponentLogic<o, o, THooksBase>>
	),
	props?: object
]

type ULReturn = ComponentLogic<o, o, THooksBase>;

const useLogic: UseLogic = (...args: ULParams): ULReturn => {
	const [Logic, props = {}] = args;

	const state = useCleanState(Logic.getInitialState, props);

	const self = useRef(useMemo(() => {
		return new Logic();
	}, [])).current;

	/** A proxy variable to allow typechecking of the assignment to `self.props` despite the need for "readonly" error suppression. */
	let _propsProxy_: typeof self.props;
	/** A proxy variable to allow typechecking of the assignment to `self.hooks` despite the need for "readonly" error suppression. */
	let _hooksProxy_: typeof self.hooks;

	self.state = state;

	// @ts-expect-error
	self.props = (
		_propsProxy_ = props
	);

	// @ts-expect-error
	self.hooks = (
		_hooksProxy_ = self.useHooks?.() ?? {} // @todo Improve UseLogic types to reflect that this may be undefined.
	);

	return self;
};

export { useLogic };


/*testing: {
	const a: object = {b: ''};

	type t = keyof typeof a;

	class MyComponentLogic extends ComponentLogic<{a: string}> {
		static getInitialState = () => ({a: '' as const});
		// b = this.state.put[''] + this.props.b;
	};

	type tt = keyof {};

	MyComponentLogic.getInitialState
	// const self = useLogic(MyComponentLogic);


	const A = class C extends ComponentLogic {
		// static getInitialState = () => ({a: 'l'});
		// a = () => this.state.yyy = '';
	}

	A.getInitialState();

	// const oa = {['a' as unknown as symbol]: 'boo'};
	const oa = {['a']: 'boo'};
	// const self = useLogic(A, oa);
}*/

