
/**
 * <!-- @ mergeModuleWith API -->
 * @module Helpers
 */

import type { ComponentLogic } from '@/classy';

export * from './mount-state';
export * from './rerender';
export * from './use-component';

// export * from './hmr';

export * from './type-guards';


/**
 * An empty function.
 * It returns (void) without performing any operations.
 */
export const noOp = () => {};

export type StateFragment<
	TComponent extends ComponentLogic<any>
> = Partial<ReturnType<TComponent['getInitialState']>>;

export type { StateFragment as SF };
