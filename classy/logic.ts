import type { TCleanState, ExtractCleanStateData, TStateData } from '@/base/state';

import { useMemo, useRef } from 'react';
import { useCleanState } from '@/base/state';


export type Empty = EmptyObject;
type o = object;


export class ComponentLogic<
		TProps extends o = Empty,
		TState extends TStateData = Empty,
		THooks extends o = Empty> {
	declare state: TCleanState<TState>;
	declare props: TProps;
	declare hooks: THooks;

	static getInitialState = (p?: object) => ({});

	useHooks: THooks extends Empty
		? undefined | (() => Empty | undefined)
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

type UseLogic = <Class extends typeof ComponentLogic<o, o, o>>(
	Methods: Class & IComponentLogicClass<InstanceType<Class>>,

	...props: valueof<InstanceType<Class>['props']> extends never
		? ([] | [EmptyObject] | [InstanceType<Class>['props']])
		: [InstanceType<Class>['props']]
) => InstanceType<Class>;


/* 
(
	Methods: typeof C & IComponentLogicClass<C, []>,
	props_0: EmptyObject
): C
*/

type UseLogic2 = {
	<Class extends typeof ComponentLogic<Empty, o, o>>(
		Methods: Class & IComponentLogicClass<InstanceType<Class>>,
		...props: ([] | [EmptyObject])
	): InstanceType<Class>;

	<Class extends typeof ComponentLogic<o, o, o>>(
		Methods: Class & IComponentLogicClass<InstanceType<Class>>,
		...props: [InstanceType<Class>['props']]
	): InstanceType<Class>;
}

type ULProps = [
	Methods:(
		ComponentLogic<o, o, o>
		& IComponentLogicClass<ComponentLogic<o, o, o>>
	),
	...props: [] | [object]
]

type ULReturn = ComponentLogic<o, o, o>;

const useLogic: UseLogic2 = (...args: ULProps): ULReturn => {
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

	class MyComponentLogic extends ComponentLogic<Empty, {a: ''}, {}> {
		static override getInitialState = (p: Empty) => ({a: '' as const});
		b = this.state.a
	};

	MyComponentLogic.getInitialState
	const self = useLogic(MyComponentLogic);
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

