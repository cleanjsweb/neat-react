import type { TCleanState, ExtractCleanStateData, TStateData } from '@/base/state';

import { useMemo, useRef } from 'react';
import { useCleanState } from '@/base/state';


export type HardEmpty = HardEmptyObject;
export type WeakEmpty = WeakEmptyObject;

type o = object;


export class ComponentLogic<
		TProps extends o = WeakEmpty,
		TState extends TStateData = WeakEmpty, // WeakEmpty,
		THooks extends o = WeakEmpty> {
	declare state: TCleanState<TState>;
	declare props: TProps;
	declare hooks: THooks;

	static getInitialState = (p?: object): object => ({});

	useHooks: THooks extends HardEmptyObject
		? undefined | (() => HardEmptyObject | undefined)
		: () => THooks;
};

type LogicClassParams = ConstructorParameters<typeof ComponentLogic>;

export interface IComponentLogicClass<
			Instance extends ComponentLogic<o, o, o> = ComponentLogic,
			Params extends LogicClassParams = LogicClassParams
		> extends Constructor<Instance, Params> {
	getInitialState: (props?: Instance['props']) => ExtractCleanStateData<Instance['state']>;
	// new (...params: CnstPrm): Instance;
}

type UseLogic = {
	<Class extends typeof ComponentLogic<HardEmptyObject, o, o>>(
		Methods: Class & IComponentLogicClass<InstanceType<Class>>,
		props?: HardEmptyObject
	): InstanceType<Class>;

	<Class extends typeof ComponentLogic<o, o, o>>(
		Methods: Class & IComponentLogicClass<InstanceType<Class>>,
		props: InstanceType<Class>['props']
	): InstanceType<Class>;
}

type ULProps = [
	Methods:(
		ComponentLogic<o, o, o>
		& IComponentLogicClass<ComponentLogic<o, o, o>>
	),
	props?: object
]

type ULReturn = ComponentLogic<o, o, o>;

const useLogic: UseLogic = (...args: ULProps): ULReturn => {
	const [Methods, props = {}] = args;

	const state = useCleanState(Methods.getInitialState, props);

	const methods = useRef(useMemo(() => {
		return new Methods();
	}, [])).current;

	methods.state = state;
	methods.props = props;

	methods.hooks = methods.useHooks?.() ?? {};

	return methods;
};

export { useLogic };


testing: {
	const a: object = {b: ''};

	type t = keyof typeof a;

	class MyComponentLogic extends ComponentLogic {
		static getInitialState = () => ({a: '' as const});
		// b = this.state.put[''] + this.props.b;
	};

	type tt = keyof {};

	MyComponentLogic.getInitialState
	const self = useLogic(MyComponentLogic, {});
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

