[**@cleanweb/react v2.1.1-beta.0**](../README.md)

***

[@cleanweb/react](../modules.md) / ComponentLogic

# Class: ComponentLogic\<TProps\>

Base class for a class that holds methods intended for use in a function component,
as well as a static method for initializing state.

These methods will have access to the components state and props via
`this.state` and `this.props` respectively.

The special Class\['useHooks'\] \| useHooks method allows you to consume
React hooks within this class.

Call the [useLogic](../functions/useLogic.md) hook inside your function component to instantiate the class.

## Extended by

- [`ComponentInstance`](ComponentInstance.md)

## Type Parameters

• **TProps** *extends* [`TPropsBase`](../type-aliases/TPropsBase.md) = `null`

## Constructors

### new ComponentLogic()

> **new ComponentLogic**\<`TProps`\>(): [`ComponentLogic`](ComponentLogic.md)\<`TProps`\>

#### Returns

[`ComponentLogic`](ComponentLogic.md)\<`TProps`\>

## Methods

### getInitialState()

> **getInitialState**(`props`?): `object`

Called before each instance of your component is mounted.
It receives the initial `props` object and should return
an object with the initial values for your component's state.

#### Parameters

##### props?

`TProps` *extends* `null` ? `EmptyObject` : `TProps`

#### Returns

`object`

***

### useHooks()

> **useHooks**(): `void` \| `object`

Call React hooks from here. If your component needs
access to values return from the hooks you call,
expose those values by returning an object with said values.

The returned object will be accessible as [\`this.hooks\`](ComponentLogic.md#hooks) within
your component class.

#### Returns

`void` \| `object`

## Properties

### state

> `readonly` **state**: [`TCleanState`](../base/type-aliases/TCleanState.md)\<`object`\>

A [\`CleanState\`](../base/type-aliases/TCleanState.md) object.
Holds all of your component's state,
and methods for conveniently manipulating those values.
Initialiazed with the object returned from your `getInitialState` method.

***

### props

> `readonly` **props**: `TProps` *extends* `null` ? `EmptyObject` : `TProps`

The props passed into your component at the time of rendering.

***

### hooks

> `readonly` **hooks**: `void` \| `object`

Values received from the hooks your component consumes.
This holds the latest copy of the object returned by
[useHooks](ComponentLogic.md#usehooks).
