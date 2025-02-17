[**@cleanweb/react v2.1.1-beta.0**](./../../README.md)

***

[@cleanweb/react](./../../modules.md) / [base](./../README.md) / ComponentMethods

# Class: ComponentMethods\<TProps, TState\>

Base class for a class that holds methods intended for use in a function component.
These methods will have access to the components state and props via
`this.state` and `this.props` respectively.

Call the [useMethods](./../functions/useMethods.md) hook inside your function component to instantiate the class.

## Type Parameters

• **TProps** *extends* `object` = \{\}

• **TState** *extends* [`TStateData`](./../type-aliases/TStateData.md) \| `null` = `null`

## Constructors

### new ComponentMethods()

> **new ComponentMethods**\<`TProps`, `TState`\>(): [`ComponentMethods`](ComponentMethods.md)\<`TProps`, `TState`\>

#### Returns

[`ComponentMethods`](ComponentMethods.md)\<`TProps`, `TState`\>

## Properties

### props

> `readonly` **props**: `TProps`

***

### state

> **state**: `TState` *extends* [`TStateData`](./../type-aliases/TStateData.md) ? [`TCleanState`](./../type-aliases/TCleanState.md)\<`TState`\<`TState`\>\> : `null`
