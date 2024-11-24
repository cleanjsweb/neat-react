
	/**
	 * @file
	 * This file is an "Ambient declarations file". The types defined here are available globally.
	 * More info here: https://stackoverflow.com/a/73389225/985454
	 *
	 * Don't use `import` and `export` in this file directly! It breaks ambience.
	 * To import external types in an ambient declarations file (this file) use the following:
	 *
	 * @example
	 * declare type React = typeof import('react');
	 *
	 * To contribute ambient declarations from any file, even non-ambient ones, use this:
	 *
	 * @example
	 * declare global {
	 *   interface Window {
	 *     ethereum: any
	 *   }
	 * }
	**/

	/** */

declare global {
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
	type AsyncFunction<
		TReturnValue extends any = void,
		Params extends any[] = never[]
	> = (...params: Params) => Promise<TReturnValue>

	/**
	 * A function that takes no arguments and returns nothing.
	 * Pass a type argument to set whether `async` and/or `sync` functions are allowed.
	 */
	interface IVoidFunction<AsyncType extends 'async' | 'sync' | 'both' = 'both'> {
		(): AsyncType extends 'async' ? Promise<void>
			: AsyncType extends 'sync' ? void
			: Promise<void> | void
	}

	type FunctionType = (...args: any) => any;


	interface Window {
	}

	namespace JSX {
		interface IntrinsicElements {
		}
	}

	namespace NodeJS {
		interface ProcessEnv {
		}
	}


	type __FromPrivateHelpers = typeof import('globals.private');

	type TEmptyObject1 = { ''?: never };
	type TEmptyObject2 = Record<symbol, never>;

	type EmptyObject = __FromPrivateHelpers['EmptyObject'];
	type EmptyObject2 = __FromPrivateHelpers['EmptyObject2'];
	type EmptyObject3 = __FromPrivateHelpers['EmptyObject3'];


	type valueof<TObject> = TObject[keyof TObject];

	interface T extends __FromPrivateHelpers {}
}

export {};
