import type { TCleanState } from '@/base/state';

import { useMemo, useRef } from 'react';
import { useCleanState } from '@/base/state';


export class ComponentLogic<TState extends object, TProps extends object, THooks extends object> {
	declare state: TCleanState<TState>;

	declare props: TProps;
	declare hooks: THooks;

	declare static getInitialState: <TState extends object, TProps extends object>(props?: TProps) => TState;

	useHooks?: () => THooks;
};

interface ComponentLogicStatics<TState extends object, TProps extends object> {
	getInitialState: (props?: TProps) => TState;
}

export type ComponentLogicConstructor<
		TState extends object,
		TProps extends object,
		THooks extends object> = (
	Constructor<ComponentLogic<TState, TProps, THooks>>
	& ComponentLogicStatics<TState, TProps>
);

export interface IEmpty extends EmptyObject {};

type UseLogic = <LogicClass extends ComponentLogic<{}, object, any>>(
	Methods: Constructor<LogicClass>
		& ComponentLogicStatics<LogicClass['state'], LogicClass['props']>,
	...props: valueof<LogicClass['props']> extends never
		? ([] | [EmptyObject])
		: [LogicClass['props']]
) => LogicClass;


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

	class MyComponentLogic extends ComponentLogic<{}, IEmpty, {}> {};
	useLogic(MyComponentLogic);
}
