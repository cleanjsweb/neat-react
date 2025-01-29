
import type { ExtractCleanStateData } from '@/base';
import type { InstanceOverrides as CIInstanceOverrides } from '@/classy/instance/types/instance';

import { ClassComponent } from '@/classy/class';



export type BaseClassComponent = ClassComponent<object, object>;
export type CCBaseType = ClassComponent<object, object>;


type CCFromSubType<SubType extends CCBaseType> = ClassComponent<
	SubType['props'],
	ExtractCleanStateData<SubType['state']>
>;

export interface InstanceOverrides<
	Instance extends CCBaseType = ClassComponent
> extends CIInstanceOverrides<Instance> {/* Define types here. */}

type BaseInstance<
	Instance extends CCBaseType = ClassComponent
> = Omit<CCFromSubType<Instance>, keyof InstanceOverrides>

export interface IClassComponent<
	Instance extends CCBaseType = ClassComponent
> extends BaseInstance<Instance>, InstanceOverrides<Instance> {/* Keep empty */}

