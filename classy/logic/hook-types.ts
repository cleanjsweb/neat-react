import type { ComponentLogic, THooksBase } from '.';
import type { CLBaseType, IComponentLogic } from './instance-types';
import type { IComponentLogicClass } from './static-types';


/*************************************
 *        # Utils                    *
**************************************/

/** */
type o = object;


/*************************************
 *        # Hooks                    *
**************************************/

/** */
type ULClassParam = IComponentLogicClass<
	IComponentLogic<CLBaseType>
>;

export type UseLogic = {
	<Class extends ULClassParam>(
		Methods: Class,
	): InstanceType<Class>;

	<Class extends ULClassParam>(
		Methods: Class,
		props: InstanceType<Class>['props']
	): InstanceType<Class>;
}

export type ULParams = [
	Class: ComponentLogic.ClassType<
		ComponentLogic.Instance<CLBaseType>
	>,
	props?: object
]

export type ULReturn = CLBaseType;
