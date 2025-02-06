[**@cleanweb/react**](../../../README.md)

***

[@cleanweb/react](../../../modules.md) / [base/methods](../README.md) / ComponentMethods

# Class: ComponentMethods\<TProps, TState\>

Defined in: [base/methods.ts:18](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/base/methods.ts#L18)

Base class for a class that holds methods intended for use in a function component.
These methods will have access to the components state and props via
`this.state` and `this.props` respectively.

Call the [useMethods](../functions/useMethods.md) hook inside your function component to instantiate the class.

## Type Parameters

• **TProps** *extends* `object` = \{\}

• **TState** *extends* [`TStateData`](../../state/hook-types/type-aliases/TStateData.md) \| `null` = `null`

## Constructors

### new ComponentMethods()

> **new ComponentMethods**\<`TProps`, `TState`\>(): [`ComponentMethods`](ComponentMethods.md)\<`TProps`, `TState`\>

#### Returns

[`ComponentMethods`](ComponentMethods.md)\<`TProps`, `TState`\>

## Properties

### props

> `readonly` **props**: `TProps`

Defined in: [base/methods.ts:21](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/base/methods.ts#L21)

***

### state

> **state**: `TState` *extends* [`TStateData`](../../state/hook-types/type-aliases/TStateData.md) ? [`TCleanState`](../../state/hook-types/type-aliases/TCleanState.md)\<`TState`\<`TState`\>\> : `null`

Defined in: [base/methods.ts:22](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/base/methods.ts#L22)
