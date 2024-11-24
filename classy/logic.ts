import type { TCleanState, TState } from '@/base/state';

import { useMemo, useRef } from 'react';
import { useCleanState } from '@/base/state';


export type Empty = EmptyObject;
type o = object;

// React.Component
export class ComponentLogic<
		TState extends o = Empty,
		TProps extends o = Empty,
		THooks extends o = Empty> {
	declare state: TCleanState<TState>;

	declare props: TProps;
	declare hooks: THooks;

	declare static getInitialState: TBaseComponentLogic['getInitialState'];

	useHooks?: () => THooks;
};

type LogicClassParams = ConstructorParameters<typeof ComponentLogic>;

export interface IComponentLogicClass<
			Instance extends ComponentLogic<o, o, o> = ComponentLogic,
			Params extends LogicClassParams = LogicClassParams
		> extends Constructor<Instance, Params> {
	getInitialState: (props?: Instance['props']) => TState<Instance['state']>;
	// new (...params: CnstPrm): Instance;
}

export type TBaseComponentLogic = IComponentLogicClass<ComponentLogic<any, any, any>>;

type UseLogic = <
		Class extends TypeofClass & IComponentLogicClass<InstanceType<TypeofClass>>,
		TypeofClass extends typeof ComponentLogic<o, o, o>>(
	Methods: Class,

	...props: valueof<InstanceType<Class>['props']> extends never
		? ([] | [EmptyObject] | [InstanceType<Class>['props']])
		: [InstanceType<Class>['props']]
) => InstanceType<Class>;

export const useLogic: UseLogic = (Methods, props = {}) => {
	const state = useCleanState(Methods.getInitialState, props);

	const methods = useRef(useMemo(() => {
		return new Methods();
	}, [])).current;

	methods.state = state;
	methods.props = props;

	methods.hooks = methods.useHooks?.() ?? {};

	return methods;
};


testing: {
	const a: object = {b: ''};

	type t = keyof typeof a;

	class MyComponentLogic extends ComponentLogic<{}, Empty, {}> {
		static getInitialState = () => ({});
	};

	const self = useLogic(MyComponentLogic);
}

testing : {
	const A = class C extends ComponentLogic {
		static getInitialState = () => ({a: 'l'});
		b = this.state.a;
	}

	A.getInitialState();

	// const self = useLogic(A);
}




// export type ComponentClassStatics<Instance extends ComponentLogic<object, object, object>> = {
// 	getInitialState: (props?: Instance['props']) => TState<Instance['state']>;
// }

// export type TComponentClass<
// 	Instance extends ComponentLogic<object, object, object>,
// 	Params extends CnstPrm = CnstPrm
// > = ComponentClassStatics<Instance> & Constructor<Instance, Params>;

