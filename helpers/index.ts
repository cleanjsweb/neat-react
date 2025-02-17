
/**
 * @module Helpers
 * @mergeModuleWith <project>.API
 */

export * from './mount-state';
export * from './rerender';
export * from './use-component';

// require tsconfig includes

/**
 * An empty function.
 * It returns (void) without performing any operations.
 * 
 * @category Helpers
 */
export const noOp = () => {};
