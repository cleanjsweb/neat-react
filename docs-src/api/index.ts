/**
 * API Reference
 * @module API
 */

import { useCleanState } from '@/base/state';

import { useMethods } from '@/base/methods';

import { useLogic } from '@/classy/logic';
import { useInstance } from '@/classy/instance';
import { ClassComponent } from '@/classy/class';


export {
	useCleanState,
	useMethods,
	useLogic,
	useInstance,
	ClassComponent,
};

/** @namespace */
export * as BaseClasses from './base-classes';

export * as Helpers from '@/helpers';

export * as References from './references';
