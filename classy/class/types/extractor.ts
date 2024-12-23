import type { VoidFunctionComponent } from 'react';
import type { BaseClassComponent, IClassComponent } from './class/instance';
import type { IClassComponentConstructor } from './class/static';


type BaseCCConstructor = IClassComponentConstructor<BaseClassComponent>;

export type Extractor = <TComponent extends BaseCCConstructor>(
	this: TComponent
		// & Constructor<IClassComponent<InstanceType<TComponent>>>
		& IClassComponentConstructor<IClassComponent<InstanceType<TComponent>>>,
	Component?: TComponent
		// & Constructor<IClassComponent<InstanceType<TComponent>>>
		& IClassComponentConstructor<IClassComponent<InstanceType<TComponent>>>
) => VoidFunctionComponent<InstanceType<TComponent>['props']>;
