interface EmptyObject3 {
	/**
	 * It appears keys of the base `symbol` type are excluded from
	 * excess property checks. This is likely a bug in TypeScript.
	 * Even the "has no properties in common" error disappears if the
	 * value being placed into a variable has a key typed as `symbol`.
	 * This only applies to the base `symbol` type. Specifc `'unique symbol'`
	 * types are unaffected.
	 * 
	 * @example
	 * // Consider the following object:
	 * const myUniqueSymbol = Symbol('lkjhgfc');
	 * let myObj = { [myUniqueSymbol]?: 'a string value' };
	 * 
	 * // We can attempt to reassign `myObj` with the expectation that TS will
	 * // warn if any key other than `myUniqueSymbol` is used in the new object.
	 * // But this breaks in one specific scenario.
	 * 
	 * // No excess property check when this is used as a key.
	 * // Error "no properties in common" also suppressed when this is used as a key.
	 * const differentBasicSymbol = Symbol('qwertiop[') as symbol;
	 * myObj = { [differentBasicSymbol]: 5 };
	 * 
	 * // Errors emitted as expected when this is used as a key.
	 * const differentUniqueSymbol = Symbol('zxcvbnm');
	 * myObj = { [differentUniqueSymbol]: 5 };
	 */
	[key: symbol]: never;
}


/////////////
const UniqueSecretSymbolKey = Symbol('asdfghjkliuytrewqaxcvb,nb');

type TEmptyObject1 = { ''?: never };
type TEmptyObject2 = Record<keyof any, never>;

/** /testing: {
	const mySymbol = Symbol('asdfgh') as symbol;

	const tt = {
		// [mySymbol]: '' as never,
		// [UniqueSecretSymbolKey]: '',
		// '': '',
	}

	let TT: WeakEmptyObject = {};
	TT = tt;
}/**/


//////////////
// @todo Use rollup.
// Insert globals.ts reference tag to all d.ts output files.
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

	type AnyFunction = (...args: any) => any;
	type FunctionType = AnyFunction;
	type TFunction = AnyFunction;

	type NotNullish = {};
	type NonPrimitive = object;

	interface WeakEmptyObject {
		[UniqueSecretSymbolKey]?: never;
	}

	interface HardEmptyObject {
		[key: keyof any]: never;
	}

	type valueof<TObject> = TObject[keyof TObject];


	//////////////////
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
}

export {};
