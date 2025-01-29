import type { InstanceOverrides as CLInstanceOverrides } from '@/classy/logic/types/instance';
import type { ExtractCleanStateData } from '@/base';

import { ComponentInstance } from '@/classy/instance';


// Remove any private or protected members with Omit, to prevent weird TS issues.
export type CIBaseType = Omit<ComponentInstance<object, object>, never>;

type CIFromSubType<SubType extends CIBaseType> = ComponentInstance<
	SubType['props'],
	ExtractCleanStateData<SubType['state']>
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
