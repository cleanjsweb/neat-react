
/**
 * @summary
 * Replace {@link useCallback} calls with methods defined
 * outside your function component's body.
 * 
 * @remarks
 * This keeps your components cleaner and easier to read, and is less error prone.
 * 
 * @ module ComponentMethods
 * @ mergeModuleWith API
 */

import * as ComponentMethods from '@/base/methods';
// export as namespace _Methods;

export {
	/** @namespace */
	ComponentMethods,
};
