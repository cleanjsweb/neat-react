import type { ExtractCleanStateData } from '@/base';
import type { ComponentLogic, THooksBase } from '@/classy/logic';
import type { CLBaseType } from './instance';


/*************************************
 *        # Utils                    *
**************************************/

type o = object;


/*************************************
 *        # Class Static Side        *
**************************************/

export interface StaticOverrides<
			Instance extends CLBaseType = ComponentLogic,
		> extends Constructor<Instance> {
	getInitialState: (props?: Instance['props']) => ExtractCleanStateData<Instance['state']>;
}

type BaseStatics = Omit<
	typeof ComponentLogic,
	'prototype' | keyof StaticOverrides
>;

export interface IComponentLogicClass<
	Instance extends ComponentLogic<o, o, THooksBase> = ComponentLogic,
> extends BaseStatics, StaticOverrides<Instance> {}
