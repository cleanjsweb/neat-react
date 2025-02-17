[**@cleanweb/react v2.1.1-beta.0**](../../README.md)

***

[@cleanweb/react](../../modules.md) / [base](../README.md) / useMethods

# Function: useMethods()

Returns an instance of the provided class,
with the state and props arguments added as instance members.

`state` must be an instance of `CleanState` created with [useCleanState](useCleanState.md).

## Call Signature

> **useMethods**\<`Class`\>(`Methods`, `props`, `state`): [`InstanceType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#instancetypetype)\<`Class`\>

### Type Parameters

• **Class** *extends* *typeof* [`ComponentMethods`](../classes/ComponentMethods.md)

### Parameters

#### Methods

`Class` & `Constructor`\<[`InstanceType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#instancetypetype)\<`Class`\>, `never`[]\>

#### props

[`InstanceType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#instancetypetype)\<`Class`\>\[`"props"`\]

#### state

[`InstanceType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#instancetypetype)\<`Class`\>\[`"state"`\]

### Returns

[`InstanceType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#instancetypetype)\<`Class`\>

## Call Signature

> **useMethods**\<`Class`\>(`Methods`, `props`, `state`?): [`InstanceType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#instancetypetype)\<`Class`\>

### Type Parameters

• **Class** *extends* *typeof* [`ComponentMethods`](../classes/ComponentMethods.md)

### Parameters

#### Methods

`Class` & `Constructor`\<[`InstanceType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#instancetypetype)\<`Class`\>, `never`[]\>

#### props

[`InstanceType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#instancetypetype)\<`Class`\>\[`"props"`\]

#### state?

`null`

### Returns

[`InstanceType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#instancetypetype)\<`Class`\>

## Call Signature

> **useMethods**\<`Class`\>(`Methods`): [`InstanceType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#instancetypetype)\<`Class`\>

### Type Parameters

• **Class** *extends* *typeof* [`ComponentMethods`](../classes/ComponentMethods.md)

### Parameters

#### Methods

`Class` & `Constructor`\<[`InstanceType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#instancetypetype)\<`Class`\>, `never`[]\>

### Returns

[`InstanceType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#instancetypetype)\<`Class`\>
