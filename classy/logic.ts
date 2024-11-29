import type { TCleanState, ExtractCleanStateData, TStateData } from '@/base/state';

import { useMemo, useRef } from 'react';
import { useCleanState } from '@/base/state';


export type HardEmpty = HardEmptyObject;
export type WeakEmpty = WeakEmptyObject;

export type THooksBase = o | void;

type o = object;


export class ComponentLogic<
		TProps extends object = {},
		TState extends TStateData = WeakEmpty,
		THooks extends THooksBase = void> { // @todo Try void/never/null for the empty case.
	declare state: TCleanState<TState>;
	declare readonly props: TProps;
	declare readonly hooks: THooks extends object ? THooks : WeakEmptyObject;

	static getInitialState = (p?: object): object => ({});

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


testing: {
	const a: object = {b: ''};

	type t = keyof typeof a;

	class MyComponentLogic extends ComponentLogic<{a: string}> {
		static getInitialState = () => ({a: '' as const});
		// b = this.state.put[''] + this.props.b;
	};

	type tt = keyof {};

	MyComponentLogic.getInitialState
	// const self = useLogic(MyComponentLogic);
}

testing : {
	const A = class C extends ComponentLogic {
		// static getInitialState = () => ({a: 'l'});
		// a = () => this.state.yyy = '';
	}

	A.getInitialState();

	// const oa = {['a' as unknown as symbol]: 'boo'};
	const oa = {['a']: 'boo'};
	// const self = useLogic(A, oa);
}




// export type ComponentClassStatics<Instance extends ComponentLogic<object, object, object>> = {
// 	getInitialState: (props?: Instance['props']) => TState<Instance['state']>;
// }

// export type TComponentClass<
// 	Instance extends ComponentLogic<object, object, object>,
// 	Params extends CnstPrm = CnstPrm
// > = ComponentClassStatics<Instance> & Constructor<Instance, Params>;

