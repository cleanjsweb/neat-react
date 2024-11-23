/**
 * @file
 * This file is created specifically to augment the declarations in
 * [globals.d.ts]({@link ./globals.d.ts}).
 * 
 * **You should not import this file directly.**
 */

/** */
const UniqueSecretSymbolKey = Symbol('asdfghjkliuytrewqaxcvb,nb');

class CEmptyObject {
	[key: keyof any]: never;
}

class CEmptyObject2 {
	[UniqueSecretSymbolKey]?: never;
}

class CEmptyObject3 {
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

export const EmptyObject = new CEmptyObject();
export const EmptyObject2 = new CEmptyObject2();
export const EmptyObject3 = new CEmptyObject3();

testing: {
	const mySymbol = Symbol('asdfgh') as symbol;

	const tt = {
		// [mySymbol]: '' as never,
		// [UniqueSecretSymbolKey]: '',
		// '': '',
	}

	let TT: CEmptyObject = new CEmptyObject();
	TT = tt;
}
