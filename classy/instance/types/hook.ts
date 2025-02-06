import { ComponentInstance } from '..';


type UIClassParam = typeof ComponentInstance<any>;
type UIProplessClassParam = typeof ComponentInstance<HardEmptyObject>;


export type UseInstance = {
	<Class extends UIProplessClassParam>(
		Methods: Class
	): InstanceType<Class>;

	<Class extends UIClassParam>(
		Methods: Class,
		props: InstanceType<Class>['props']
	): InstanceType<Class>;
};

export type UIParams = [
	Class: typeof ComponentInstance<any>,
	props?: object
];

export type UIReturn = ComponentInstance<any>;

