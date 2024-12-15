import { ComponentInstance } from '.';
import { THooksBase } from '../logic';
import { IComponentInstanceClass } from './static-types';



type o = object;


export type UseInstance = {
	<Class extends IComponentInstanceClass<ComponentInstance<o, o, THooksBase>>>(
		Methods: Class,
	): InstanceType<Class>;

	// "has no props in common" error doesn't fire when comparing types in generic argument.
	// only shown when assigning actual values.

	<Class extends IComponentInstanceClass<ComponentInstance<o, o, THooksBase>>>(
		Methods: Class,
		props: InstanceType<Class>['props']
	): InstanceType<Class>;
}

export type UIParams = [
	Methods: (
		IComponentInstanceClass<ComponentInstance<o, o, THooksBase>>
	),
	props?: object
]

export type UIReturn = ComponentInstance<o, o, THooksBase>;

