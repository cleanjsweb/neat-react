import type { ExtractCleanStateData } from '@/base';
import type { ComponentLogic, THooksBase } from './logic';

type o = object;

// Class

type CLBaseType = ComponentLogic<o, o, THooksBase>;
type CLFromSubType<SubType extends CLBaseType> = ComponentLogic<
	SubType['props'],
	ExtractCleanStateData<SubType['state']>,
	SubType['_thooks']
>;

// ## Instance Side
interface InstanceOverrides<Instance extends CLBaseType = ComponentLogic> {
	useHooks: Instance['_thooks'] extends void
		? () => (void | HardEmptyObject)
		: () => Instance['_thooks'];
}

type BaseInstance<
	Instance extends CLBaseType = ComponentLogic
> = Omit<CLFromSubType<Instance>, keyof InstanceOverrides<Instance>>

export interface IComponentLogic<
	Instance extends CLBaseType = ComponentLogic
> extends BaseInstance<Instance>, InstanceOverrides<Instance> {}

// ## Static Side
interface StaticOverrides<
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


// Hooks

type ULClassParam = ComponentLogic.ClassType<
	ComponentLogic.Instance<ComponentLogic.Class<o, o, THooksBase>>
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
		ComponentLogic.Instance<ComponentLogic.Class<o, o, THooksBase>>
	>,
	props?: object
]

export type ULReturn = ComponentLogic.Class<o, o, THooksBase>;
