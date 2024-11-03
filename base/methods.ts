import type { TCleanState } from './state';
import { useMemo, useRef } from 'react';


export class ComponentMethods<TState extends object, TProps extends object> {
	declare state: TCleanState<TState>;
	declare props: TProps;
};

type ComponentMethodsConstructor = typeof ComponentMethods<any, any>;

type UseMethods = <MethodsClass extends ComponentMethodsConstructor>(
	// Using `typeof Class` instead of `Constructor<ClassInstanceType>` ensures
	// that Methods will carry all properties of ComponentMethods, including any potential static properties.
	Methods: MethodsClass,
	state: InstanceType<MethodsClass>['state'],
	props: InstanceType<MethodsClass>['props']
) => InstanceType<MethodsClass>;

export const useMethods: UseMethods = (Methods, state, props) => {
	// @todo Switch to useRef. Vite HMR seems to sometimes reinitialize useMemo calls after a hot update,
	// causing the instance to be unexpectedly recreated in the middle of the components lifecycle.
	// But useRef and useState values appear to always be preserved whenever this happens.
	// So those two are the only cross-render-persistence methods we can consider safe.
	const methods = useRef(() => {
		// See useLogic implementation for a discussion of this type assertion.
		return new Methods() as InstanceType<typeof Methods>;
	}).current;

	methods.state = state;
	methods.props = props;

	return methods;
};
