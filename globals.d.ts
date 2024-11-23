////// -------------------------------------------------------------------------------------
/*//// -------------------------------------------------------------------------------------

This file is an "Ambient declarations file". The types defined here are available globally.
More info here: https://stackoverflow.com/a/73389225/985454

Don't use `import` and `export` in this file directly! It breaks ambience.
To import external types in an ambient declarations file (this file) use the following:

*//**
* @example
* declare type React = import('react')
*//*

To contribute ambient declarations from any file, even non-ambient ones, use this:

*//**
* @example
* declare global {
*   interface Window {
*     ethereum: any
*   }
* }
*//*

/*//// ------------------------------------------------------
////// ------------------------------------------------------


type Optional<
			BaseType,
			AllowNull extends boolean = true
		> = (
	AllowNull extends true
		? BaseType | undefined | null
		: BaseType | undefined
)

type Awaitable<Type> = Type | Promise<Type>;

type Constructor<
	TInstance extends any = any,
	TParams extends any[] = never[]
> = new (...args: TParams) => TInstance;


/**
 * @example
 * ```js
 * const getNumber: AsyncFunction<number> = async () => {
 * 	return 5;
 * }
 * ```
 */
declare type AsyncFunction<
	TReturnValue extends any = void,
	Params extends any[] = never[]
> = (...params: Params) => Promise<TReturnValue>

/**
 * A function that takes no arguments and returns nothing.
 * Pass a type argument to set whether `async` and/or `sync` functions are allowed.
 */
declare interface IVoidFunction<AsyncType extends 'async' | 'sync' | 'both' = 'both'> {
	(): AsyncType extends 'async' ? Promise<void>
		: AsyncType extends 'sync' ? void
		: Promise<void> | void
}

declare type FunctionType = (...args: any) => any;


declare interface Window {
}

declare namespace JSX {
	interface IntrinsicElements {
	}
}

declare namespace NodeJS {
	interface ProcessEnv {
	}
}

const UniqueSecretSymbolKey = Symbol('asdfghjkliuytrewqaxcvb,nb');

type TEmptyObject = {''?: never};
type TEmptyObject2 = Record<symbol, never>;
interface IEmptyObject {
	[UniqueSecretSymbolKey]?: never;
};

class IObject {
	private static a: string;
	private k: number;

}

const b = IObject['a'];
const c = (new IObject()).k;


namespace IU {
	const us = "Symbol('ff')";

	interface IE {
		[us]?: never;
	}
}
