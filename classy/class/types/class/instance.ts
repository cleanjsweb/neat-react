import type { IComponentInstanceClass, StaticOverrides as CIStaticOverrides } from '@/classy/instance/static-types';
import type { THooksBase } from '@/classy/logic';
import type { ExtractCleanStateData } from '@/base';
import type { InstanceOverrides as CIInstanceOverrides } from '@/classy/instance/instance-types';

import { ClassComponent } from '../..';



export type BaseClassComponent = ClassComponent<object, object, THooksBase>;
export type CCBaseType = ClassComponent<object, object, THooksBase>;


type CCFromSubType<SubType extends CCBaseType> = ClassComponent<
	SubType['props'],
	ExtractCleanStateData<SubType['state']>,
	SubType['_thooks']
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

