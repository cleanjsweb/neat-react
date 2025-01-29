import type { CIBaseType, IComponentInstance } from './instance';
import type { IComponentInstanceClass } from './static';

import { ComponentInstance } from '..';


type o = object;

type UIClassParam = IComponentInstanceClass<
	IComponentInstance<CIBaseType>
>;
type UIProplessClassParam = IComponentInstanceClass<
	IComponentInstance<
		ComponentInstance<HardEmptyObject, o>
	>
>;

export type UseInstance = {
	<Class extends UIProplessClassParam>(
		Methods: Class & Constructor<InstanceType<Class>>
	): InstanceType<Class>;

	<Class extends UIClassParam>(
		Methods: Class & Constructor<InstanceType<Class>>,
		props: InstanceType<Class>['props']
	): InstanceType<Class>;
};

export type UIParams = [
	Class: IComponentInstanceClass<
		IComponentInstance<CIBaseType>
	>,
	props?: object
];

export type UIReturn = CIBaseType;

