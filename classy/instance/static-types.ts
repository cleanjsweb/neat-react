import { ExtractCleanStateData } from "@/base";
import { ComponentInstance } from ".";
import { ComponentLogic, THooksBase } from "../logic";
import { CIBaseType, IComponentInstance } from "./instance-types";
import { StaticOverrides as CLStaticOverrides } from "../logic/static-types";


type o = object;

/** */

export interface StaticOverrides<
	Instance extends CIBaseType = ComponentInstance,
> extends CLStaticOverrides<Instance> {/* Types here */}

type BaseStatics = Omit<
	typeof ComponentInstance,
	'prototype' | keyof StaticOverrides
>;

export interface IComponentInstanceClass<
	Instance extends CIBaseType = ComponentInstance,
> extends BaseStatics, StaticOverrides<Instance> {/* Keep empty */}

/** */

// type ComponentInstanceOwnStaticKeys = Exclude<
// 	keyof typeof ComponentInstance,
// 	keyof ComponentLogic.ClassType
// >;

// type ComponentInstanceOwnStatics = {
// 	[Key in ComponentInstanceOwnStaticKeys]: (typeof ComponentInstance)[Key];
// }

// export interface IComponentInstanceClass<
// 	Instance extends ComponentInstance<o, o, THooksBase> = ComponentInstance,
// > extends
// 	Constructor<IComponentInstance<Instance>>,
// 	ComponentInstanceOwnStatics,
// 	ComponentLogic.ClassType<Instance>
// {};
