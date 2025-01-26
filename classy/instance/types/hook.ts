import type { THooksBase } from '@/classy/logic';
import type { CIBaseType, IComponentInstance } from './instance';
import type { IComponentInstanceClass } from './static';

import { ComponentInstance } from '..';


type o = object;

type UIClassParam = IComponentInstanceClass<
	IComponentInstance<CIBaseType>
>;
type UIProplessClassParam = IComponentInstanceClass<
	IComponentInstance<
		ComponentInstance<HardEmptyObject, o, THooksBase>
	>
>;

export type UseInstance = {
	<Class extends UIProplessClassParam>(
		Methods: Class & Constructor<IComponentInstance<InstanceType<Class>>>
	): InstanceType<Class>;

	<Class extends UIClassParam>(
		Methods: Class & Constructor<IComponentInstance<InstanceType<Class>>>,
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

