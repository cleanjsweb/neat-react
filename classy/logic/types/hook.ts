import type { ComponentLogic } from '..';


/*************************************
 *        # Utils                    *
**************************************/

/** */
type o = object;


/*************************************
 *        # Hooks                    *
**************************************/

/** */
type ULClassParam = typeof ComponentLogic<any>;
type ULProplessClassParam = typeof ComponentLogic<HardEmptyObject>;

export type UseLogic = {
    <Class extends ULProplessClassParam>(
        Methods: Class
    ): InstanceType<Class>;

	<Class extends ULClassParam>(
        Methods: Class,
		props: InstanceType<Class>['props']
	): InstanceType<Class>;
}

export type ULParams = [
	Class: typeof ComponentLogic<any>,
	props?: object
]

export type ULReturn = ComponentLogic<any>;
