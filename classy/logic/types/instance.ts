import type { ExtractCleanStateData } from '@/base';
import type { ComponentLogic } from '@/classy/logic';


/*************************************
 *        # Utils                    *
**************************************/

/** */
export type CLBaseType = ComponentLogic<object, object>;

type CLFromSubType<SubType extends CLBaseType> = ComponentLogic<
	SubType['props'],
	ExtractCleanStateData<SubType['state']>
>;


/*************************************
 *        # Instance Type            *
**************************************/

/** */
export interface InstanceOverrides<Instance extends CLBaseType = ComponentLogic> {

}

type BaseInstance<
	Instance extends CLBaseType = ComponentLogic
> = Omit<CLFromSubType<Instance>, keyof InstanceOverrides>

export interface IComponentLogic<
	Instance extends CLBaseType = ComponentLogic
> extends BaseInstance<Instance>, InstanceOverrides<Instance> {}
