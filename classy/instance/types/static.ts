import type { StaticOverrides as CLStaticOverrides } from '@/classy/logic/types/static';
import type { CIBaseType } from './instance';

import { ComponentInstance } from '@/classy/instance';


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
// 	Instance extends ComponentInstance<o, o> = ComponentInstance,
// > extends
// 	Constructor<IComponentInstance<Instance>>,
// 	ComponentInstanceOwnStatics,
// 	ComponentLogic.ClassType<Instance>
// {};
