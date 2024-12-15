import type { ExtractCleanStateData } from '@/base';
import type { ComponentLogic, THooksBase } from '.';


/*************************************
 *        # Utils                    *
**************************************/

/** */
export type CLBaseType = ComponentLogic<object, object, THooksBase>;

type CLFromSubType<SubType extends CLBaseType> = ComponentLogic<
	SubType['props'],
	ExtractCleanStateData<SubType['state']>,
	SubType['_thooks']
>;


/*************************************
 *        # Instance Type            *
**************************************/

/** */
export interface InstanceOverrides<Instance extends CLBaseType = ComponentLogic> {
	useHooks: Instance['_thooks'] extends void
		? () => (void | HardEmptyObject)
		: () => Instance['_thooks'];
}

type BaseInstance<
	Instance extends CLBaseType = ComponentLogic
> = Omit<CLFromSubType<Instance>, keyof InstanceOverrides>

export interface IComponentLogic<
	Instance extends CLBaseType = ComponentLogic
> extends BaseInstance<Instance>, InstanceOverrides<Instance> {}
