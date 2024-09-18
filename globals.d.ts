
type Optional<
			BaseType,
			AllowNull extends boolean = true
		> = (
	AllowNull extends true
		? BaseType | undefined | null
		: BaseType | undefined
)

type Constructor<
	TInstance extends any = any,
	TParams extends any[] = never[]
> = new (...args: TParams) => TInstance


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
