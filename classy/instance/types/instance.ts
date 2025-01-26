import type { InstanceOverrides as CLInstanceOverrides } from '@/classy/logic/types/instance';
import type { ExtractCleanStateData } from '@/base';
import type { THooksBase } from '@/classy/logic';

import { ComponentInstance } from '@/classy/instance';


export type CIBaseType = ComponentInstance<object, object, THooksBase>;

type CIFromSubType<SubType extends CIBaseType> = ComponentInstance<
	SubType['props'],
	ExtractCleanStateData<SubType['state']>,
	SubType['_thooks']
>;


export interface InstanceOverrides<
	Instance extends CIBaseType = ComponentInstance
> extends CLInstanceOverrides<Instance> {/* Define types here. */}

type BaseInstance<
	Instance extends CIBaseType = ComponentInstance
> = Omit<CIFromSubType<Instance>, keyof InstanceOverrides>

export interface IComponentInstance<
	Instance extends CIBaseType = ComponentInstance
> extends BaseInstance<Instance>, InstanceOverrides<Instance> {/* Keep empty */}
