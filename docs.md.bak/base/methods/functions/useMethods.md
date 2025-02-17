[**@cleanweb/react**](../../../README.md)

***

[@cleanweb/react](../../../modules.md) / [base/methods](../README.md) / useMethods

# Function: useMethods()

Returns an instance of the provided class,
with the state and props arguments added as instance members.

`state` must be an instance of `CleanState` created with [useCleanState](../../state/hooks/functions/useCleanState.md).

## Call Signature

> **useMethods**\<`Class`\>(`Methods`, `props`, `state`): `InstanceType`\<`Class`\>

Defined in: [base/methods.ts:61](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/base/methods.ts#L61)

### Type Parameters

• **Class** *extends* *typeof* [`ComponentMethods`](../classes/ComponentMethods.md)

### Parameters

#### Methods

`Class` & `Constructor`\<`InstanceType`\<`Class`\>, `never`[]\>

#### props

`InstanceType`\<`Class`\>\[`"props"`\]

#### state

`InstanceType`\<`Class`\>\[`"state"`\]

### Returns

`InstanceType`\<`Class`\>

## Call Signature

> **useMethods**\<`Class`\>(`Methods`, `props`, `state`?): `InstanceType`\<`Class`\>

Defined in: [base/methods.ts:61](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/base/methods.ts#L61)

### Type Parameters

• **Class** *extends* *typeof* [`ComponentMethods`](../classes/ComponentMethods.md)

### Parameters

#### Methods

`Class` & `Constructor`\<`InstanceType`\<`Class`\>, `never`[]\>

#### props

`InstanceType`\<`Class`\>\[`"props"`\]

#### state?

`null`

### Returns

`InstanceType`\<`Class`\>

## Call Signature

> **useMethods**\<`Class`\>(`Methods`): `InstanceType`\<`Class`\>

Defined in: [base/methods.ts:61](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/base/methods.ts#L61)

### Type Parameters

• **Class** *extends* *typeof* [`ComponentMethods`](../classes/ComponentMethods.md)

### Parameters

#### Methods

`Class` & `Constructor`\<`InstanceType`\<`Class`\>, `never`[]\>

### Returns

`InstanceType`\<`Class`\>
