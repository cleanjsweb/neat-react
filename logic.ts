import type { CleanState } from "./state";

import { useMemo } from "react";

import { useCleanState } from "./state";


export class ComponentLogic<TState extends object, TProps extends object, THooks extends object> {
	declare state: CleanState<TState>;

	declare props: TProps;
	declare hooks: THooks;

	useCustomHooks?: () => THooks;
};

export interface ComponentLogicConstructor<TState extends object, TProps extends object, THooks extends object> extends Constructor<ComponentLogic<TState, TProps, THooks>> {
	getInitialState: (props?: TProps) => TState;
}


type UseLogic = <TState extends object, LogicClass extends ComponentLogicConstructor<TState, any, any>>(
	Methods: LogicClass,
	props: InstanceType<LogicClass>['props']
) => InstanceType<LogicClass>;


export const useLogic: UseLogic = (Methods, props) => {
	// When ComponentLogicConstructor is extended with <{}, {}, {}>, Typescript fails to determine that LogicClass['getInitialState'] is a function,
	// but gets it right with `typeof Methods.getInitialState;`
	// Changing to <any, any, any> also seems to fix this.
	type LogicClass = typeof Methods;

	// type InitState = CleanStateValues<InstanceType<LogicClass>['state']>;
	type InitState = LogicClass['getInitialState'];
	const state = useCleanState<InitState>(Methods.getInitialState, props);

	// There's apparently a bug? with Typescript that pegs the return type of "new Methods()" to "ComponentLogic<{}, {}, {}>",
	// completely ignoring the type specified for Methods in the function's type definition.
	// `new Methods()` should return whatever the InstanceType of TClass is, as that is the type explicitly specified for Methods.
	// Ignoring the specified type to gin up something else and then complain about it is quite weird.
	// Regardless, even when `extends ComponentLogicConstructor<TState, TProps, THooks>` is specified using generics instead of a set type,
	// the issue persists. Which is absurd since this should ensure that InstanceType<Class> should exactly match ComponentLogic<TState, TProps, THooks>
	const methods = useMemo(() => {
		return new Methods() as InstanceType<typeof Methods>;
	}, []);

	methods.state = state;
	methods.props = props;
	methods.hooks = methods.useCustomHooks?.() || {};

	return methods;
};
