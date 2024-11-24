import type { TCleanState, TState } from '@/base/state';

import { useMemo, useRef } from 'react';
import { useCleanState } from '@/base/state';

type o = object;

export class ComponentLogic<
		TState_ extends object = EmptyObject,
		TProps extends object = EmptyObject,
		THooks extends object = EmptyObject> {
	declare state: TCleanState<TState_>;

	declare props: TProps;
	declare hooks: THooks;
	// declare static getInitialState: IComponentClass['getInitialState'];
	declare static getInitialState: <ThisT extends typeof ComponentLogic<o, o, o>>(
		this: ThisT,
		props?: InstanceType<ThisT>['props']
	) => TState<InstanceType<ThisT>['state']> & any;
	// getInitialState: (props?: Instance['props']) => TState<Instance['state']>;

	useHooks?: () => THooks;
};

type CnstPrm = ConstructorParameters<typeof ComponentLogic>;

// type ComponentLogicStatics<TInstance extends ComponentLogic> = {
// 	[Key in 'getInitialState']: T[Key]<TInstance['state']>;
// };

//{
// 	new (
// 		...params: ConstructorParameters<Constructor<Instance>>
// 	): Instance;
//}

// export type ComponentLogicConstructor<
// 		Instance extends ComponentLogic> = Constructor<Instance, CnstPrm> & {
// 	getInitialState: (props?: Instance['props']) => Instance['state'];
// }

export interface IComponentClass<Instance extends ComponentLogic = ComponentLogic> {
	new (...params: CnstPrm): Instance;

	getInitialState: (props?: Instance['props']) => TState<Instance['state']>;
}

export type ComponentClassStatics<Instance extends ComponentLogic<object, object, object>> = {
	getInitialState: (props?: Instance['props']) => TState<Instance['state']>;
}

export type TComponentClass<
	Instance extends ComponentLogic<object, object, object>,
	Statics extends ComponentClassStatics<Instance> =  ComponentClassStatics<Instance>,
	Params extends CnstPrm = CnstPrm
> = Statics & Constructor<Instance, Params>;


testing : {
	const A: IComponentClass<ComponentLogic<{}, {}, {}>> = class C extends ComponentLogic<{}, {}, {}> {
		static getInitialState = () => ({});
	}

	A.getInitialState();
}

// export type ComponentLogicConstructor<
// 		TState extends object,
// 		TProps extends object,
// 		THooks extends object> = (
// 	Constructor<ComponentLogic<TState, TProps, THooks>>
// 	& ComponentLogicStatics<TState, TProps>
// );

export interface IEmpty extends EmptyObject {};

// type UseLogic = <CLogic extends ComponentLogic<object, object, object>>(
// 	Methods: TComponentClass<CLogic>,
// 	...props: valueof<CLogic['props']> extends never
// 		? ([] | [EmptyObject] | [CLogic['props']])
// 		: [CLogic['props']]
// ) => CLogic;


type UseLogic = <
		Class extends typeof ComponentLogic<object, object, object>,
		Instance extends InstanceType<Class> = InstanceType<Class>>(
	Methods: Class & Constructor<Instance>,
	...props: valueof<Instance['props']> extends never
		? ([] | [EmptyObject] | [Instance['props']])
		: [Instance['props']]
) => Instance;

export const useLogic: UseLogic = (Methods, props = {}) => {
	type TLogicClass = typeof Methods;

	const state = useCleanState(Methods.getInitialState, props);

	const methods: InstanceType<TLogicClass> = useRef(useMemo(() => {
		return new Methods();
	}, [])).current;

	methods.state = state;
	methods.props = props;

	methods.hooks = methods.useHooks?.() || {};

	return methods;
};


testing: {
	const a: object = {b: ''};

	type t = keyof typeof a;

	// class MyComponentLogic extends ComponentLogic<{}, IEmpty, {}> {
	// 	static getInitialState = () => ({});
	// };

	// useLogic(MyComponentLogic);
}
