
import type { StaticOverrides as CIStaticOverrides } from '@/classy/instance/types/static';
import type { CCBaseType } from './instance';

import { ClassComponent } from '../..';


export interface StaticOverrides<
	Instance extends CCBaseType = ClassComponent,
> extends CIStaticOverrides<Instance> {/* Types here */}

type BaseStatics = Omit<
	typeof ClassComponent,
	'prototype' | keyof StaticOverrides
>;

export interface IClassComponentConstructor<
	Instance extends CCBaseType = ClassComponent,
> extends BaseStatics, StaticOverrides<Instance> {/* Keep empty */}



// type ComponentClassOwnStaticKeys = Exclude<
// 	keyof typeof ClassComponent,
// 	keyof IComponentInstanceClass
// >;

// type ComponentClassOwnStatics = {
// 	[Key in ComponentClassOwnStaticKeys]: (typeof ClassComponent)[Key];
// }

// export interface ClassComponentConstructor<
// 	Instance extends BaseClassComponent = ClassComponent
// > extends Constructor<Instance>, ComponentClassOwnStatics, IComponentInstanceClass<Instance> {};

