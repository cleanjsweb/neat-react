import type { ComponentLogic } from '..';
import type { CLBaseType, IComponentLogic } from './instance';
import type { IComponentLogicClass } from './static';


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
type ULProplessClassParam = IComponentLogicClass<
    IComponentLogic<
        ComponentLogic<HardEmptyObject, o>
    >
>;

export type UseLogic = {
    <Class extends ULProplessClassParam>(
        Methods: Class & Constructor<IComponentLogic<InstanceType<Class>>>
    ): InstanceType<Class>;

	<Class extends ULClassParam>(
        Methods: Class & Constructor<IComponentLogic<InstanceType<Class>>>,
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
