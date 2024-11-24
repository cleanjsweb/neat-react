import type { TCleanState } from './state';
import { useMemo, useRef } from 'react';


export class ComponentMethods<TState extends object, TProps extends object> {
	declare state: TCleanState<TState>;
	declare props: TProps;
};

type UseMethods = <TMethods extends typeof ComponentMethods<any, any>>(
	Methods: TMethods & Constructor<InstanceType<TMethods>>,
	state: InstanceType<TMethods>['state'],
	props: InstanceType<TMethods>['props']
) => InstanceType<TMethods>;

export const useMethods: UseMethods = (Methods, state, props) => {
	// @todo Switch to useRef. Vite HMR seems to sometimes reinitialize useMemo calls after a hot update,
	// causing the instance to be unexpectedly recreated in the middle of the components lifecycle.
	// But useRef and useState values appear to always be preserved whenever this happens.
	// So those two are the only cross-render-persistence methods we can consider safe.
	const methods = useRef(useMemo(() => {
		// See useLogic implementation for a discussion of this type assertion.
		return new Methods();
	}, [])).current;

	methods.state = state;
	methods.props = props;

	return methods;
};


testing: {
	let a = async () => { 
		const a: object = {b: ''};

		type t = keyof typeof a;

		class MyMethods extends ComponentMethods<{}, EmptyObject> {
			// static getInitialState = () => ({});
		};

		const { useCleanState } = (await import('./state.js'));

		const self = useMethods(MyMethods, useCleanState({}), {});
	}
}

