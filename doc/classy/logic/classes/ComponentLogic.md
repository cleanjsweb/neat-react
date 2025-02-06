[**@cleanweb/react**](../../../README.md)

***

[@cleanweb/react](../../../modules.md) / [classy/logic](../README.md) / ComponentLogic

# Class: ComponentLogic\<TProps\>

Defined in: [classy/logic/index.ts:32](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/classy/logic/index.ts#L32)

Base class for a class that holds methods intended for use in a function component,
as well as a static method for initializing state.

These methods will have access to the components state and props via
`this.state` and `this.props` respectively.

The special Class\['useHooks'\] \| useHooks method allows you to consume
React hooks within this class.

Call the [useLogic](../functions/useLogic.md) hook inside your function component to instantiate the class.

## Extended by

- [`ComponentInstance`](../../instance/classes/ComponentInstance.md)

## Type Parameters

• **TProps** *extends* `object` = `NonPrimitive`

## Constructors

### new ComponentLogic()

> **new ComponentLogic**\<`TProps`\>(): [`ComponentLogic`](ComponentLogic.md)\<`TProps`\>

#### Returns

[`ComponentLogic`](ComponentLogic.md)\<`TProps`\>

## Properties

### hooks

> `readonly` **hooks**: `void` \| `object`

Defined in: [classy/logic/index.ts:48](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/classy/logic/index.ts#L48)

Values received from the hooks your component consumes.
This holds the latest copy of the object returned by
[useHooks](ComponentLogic.md#usehooks).

***

### props

> `readonly` **props**: `TProps`

Defined in: [classy/logic/index.ts:41](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/classy/logic/index.ts#L41)

The props pass into your component at the time of rendering.

***

### state

> `readonly` **state**: [`TCleanState`](../../../base/state/hook-types/type-aliases/TCleanState.md)\<`object`\>

Defined in: [classy/logic/index.ts:38](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/classy/logic/index.ts#L38)

A [\`CleanState\`](../../../base/state/hook-types/type-aliases/TCleanState.md) object.
Holds all of your component's state,
and methods for conveniently manipulating those values.

## Methods

### getInitialState()

> **getInitialState**(`props`?): `object`

Defined in: [classy/logic/index.ts:55](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/classy/logic/index.ts#L55)

Called before each instance of your component is mounted.
It receives the initial `props` object and should return
an object with the initial values for your component's state.

#### Parameters

##### props?

`TProps`

#### Returns

`object`

***

### useHooks()

> **useHooks**(): `void` \| `object`

Defined in: [classy/logic/index.ts:65](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/classy/logic/index.ts#L65)

Call React hooks from here. If your component needs
access to values return from the hooks you call,
expose those values by returning an object with said values.

The returned object will be accessible as [\`this.hooks\`](ComponentLogic.md#hooks) within
your component class.

#### Returns

`void` \| `object`
