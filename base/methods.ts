import type { TCleanState, TStateData } from './state';
import { useMemo, useRef } from 'react';


export class ComponentMethods<TProps extends object, TState extends TStateData> {
	declare props: TProps;
	declare state: TCleanState<TState>;
};

type UseMethods = <Class extends typeof ComponentMethods<object, object>>(
	Methods: Class & Constructor<InstanceType<Class>>,
	// @todo Use overloads to allow omissions.
	props: InstanceType<Class>['props'],
	state: InstanceType<Class>['state'], // Can omit when <Class extends typeof ComponentMethods<object, HardEmpty>>.
) => InstanceType<Class>;

export const useMethods: UseMethods = (Methods, props, state) => {
	// @todo Switch to useRef. Vite HMR seems to sometimes reinitialize useMemo calls after a hot update,
	// causing the instance to be unexpectedly recreated in the middle of the components lifecycle.
	// But useRef and useState values appear to always be preserved whenever this happens.
	// So those two are the only cross-render-persistence methods we can consider safe.
	const methods = useRef(useMemo(() => {
		return new Methods();
	}, [])).current;

	methods.props = props;
	methods.state = state;

	return methods;
};


testing: {
	let a = async () => { 
		const a: object = {b: ''};

		type t = keyof typeof a;

		class MyMethods extends ComponentMethods<WeakEmptyObject, {}> {
			// static getInitialState = () => ({});
		};

		const { useCleanState } = (await import('./state.js'));

		const self = useMethods(MyMethods, {}, useCleanState({}));
	}
}

