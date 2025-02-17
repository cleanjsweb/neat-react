[**@cleanweb/react v2.1.1-beta.0**](../README.md)

***

[@cleanweb/react](../modules.md) / useLogic

# Function: useLogic()

Returns an instance of the provided class, which holds methods for your component and
encapsulates hook calls with the special [\`useHooks\`](../classes/ComponentLogic.md#usehooks) method.

The class argument must be a subclass of [ComponentLogic](../classes/ComponentLogic.md).

## Call Signature

> **useLogic**\<`Class`\>(`Methods`): [`InstanceType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#instancetypetype)\<`Class`\>

### Type Parameters

• **Class** *extends* *typeof* [`ComponentLogic`](../classes/ComponentLogic.md)

### Parameters

#### Methods

`Class`

### Returns

[`InstanceType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#instancetypetype)\<`Class`\>

## Call Signature

> **useLogic**\<`Class`\>(`Methods`, `props`): [`InstanceType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#instancetypetype)\<`Class`\>

### Type Parameters

• **Class** *extends* *typeof* [`ComponentLogic`](../classes/ComponentLogic.md)

### Parameters

#### Methods

`Class`

#### props

[`InstanceType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#instancetypetype)\<`Class`\>\[`"props"`\]

### Returns

[`InstanceType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#instancetypetype)\<`Class`\>
