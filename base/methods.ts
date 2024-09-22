import type { TCleanState } from './state';
import { useMemo } from 'react';


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
	const methods = useMemo(() => {
		// See useLogic implementation for a discussion of this type assertion.
		return new Methods() as InstanceType<typeof Methods>;
	}, []);

	methods.state = state;
	methods.props = props;

	// Return a gate object to "passthrough" all methods but filter out properties that should be private.
	return {
		...methods,
		props: undefined, // Since props already exists in the calling scope, we omit it from the returned object to avoid confusion.
		state: undefined, // Ditto.
	};
};
