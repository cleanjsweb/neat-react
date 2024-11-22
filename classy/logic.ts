import type { TCleanState } from '@/base/state';

import { useMemo, useRef } from 'react';
import { useCleanState } from '@/base/state';


export class ComponentLogic<TState extends object, TProps extends object, THooks extends object> {
	declare state: TCleanState<TState>;

	declare props: TProps;
	declare hooks: THooks;

	// declare static getInitialState: <TState extends object, TProps extends object>(props?: TProps) => TState;

	useHooks?: () => THooks;
};

export type ComponentLogicConstructor<
	TState extends object,
	TProps extends object,
	THooks extends object
> = Constructor<ComponentLogic<TState, TProps, THooks>> & {
	getInitialState: (props?: TProps) => TState;
}

type ComponentLogicStatics<
	TState extends object,
	TProps extends object
> = {
	getInitialState: (props?: TProps) => TState;
}

// export interface _ComponentLogicConstructor<TState extends object, TProps extends object, THooks extends object> {
// 	new <TState extends object>(
// 		...args: ConstructorParameters<typeof ComponentLogic<TState, TProps, THooks>>
// 	): ComponentLogic<TState, TProps, THooks>;
// 	// ComponentLogic<TState, TProps, THooks>

// 	getInitialState: (props?: TProps) => TState;
// }


type UseLogic = <LogicClass extends ComponentLogic<{}, object, any>>(
	Methods: Constructor<LogicClass>
		& ComponentLogicStatics<LogicClass['state'], LogicClass['props']>,
	props?: LogicClass['props']
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
