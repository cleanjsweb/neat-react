[**@cleanweb/react v2.1.1-beta.0**](./../README.md)

***

[@cleanweb/react](./../modules.md) / ComponentInstance

# Class: ComponentInstance\<TProps\>

A superset of [ComponentLogic](ComponentLogic.md) that adds support for lifecycle methods.
This provides a declarative API for working with your React function component's lifecycle,
a simpler alternative to the imperative approach with `useEffect` and/or `useMemo`.

## See

https://github.com/cleanjsweb/neat-react#lifecycle-useinstance

## Extends

- [`ComponentLogic`](ComponentLogic.md)\<`TProps`\>

## Extended by

- [`ClassComponent`](ClassComponent.md)

## Type Parameters

• **TProps** *extends* [`TPropsBase`](./../type-aliases/TPropsBase.md) = `null`

## Accessors

### templateContext

#### Get Signature

> **get** **templateContext**(): [`ReturnType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype)\<`this`\[`"beforeRender"`\]\>

##### Returns

[`ReturnType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype)\<`this`\[`"beforeRender"`\]\>

## Constructors

### new ComponentInstance()

> **new ComponentInstance**\<`TProps`\>(): [`ComponentInstance`](ComponentInstance.md)\<`TProps`\>

#### Returns

[`ComponentInstance`](ComponentInstance.md)\<`TProps`\>

#### Inherited from

[`ComponentLogic`](ComponentLogic.md).[`constructor`](ComponentLogic.md#constructors)

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

#### Inherited from

[`ComponentLogic`](ComponentLogic.md).[`getInitialState`](ComponentLogic.md#getinitialstate)

***

### useHooks()

> **useHooks**(): `void` \| `object`

Call React hooks from here. If your component needs
access to values return from the hooks you call,
expose those values by returning an object with said values.

The returned object will be accessible as [\`this.hooks\`](ComponentInstance.md#hooks) within
your component class.

#### Returns

`void` \| `object`

#### Inherited from

[`ComponentLogic`](ComponentLogic.md).[`useHooks`](ComponentLogic.md#usehooks)

## Properties

### beforeMount

> **beforeMount**: `IVoidFunction`

Runs only _before_ first render,
i.e before the component instance is mounted.

It is ignored on subsequent rerenders.

PS: You can conditionally update state from here, but with certain caveats.
[See the React docs for more details](https://react.dev/reference/react/useState#storing-information-from-previous-renders).

***

### onMount

> **onMount**: `AsyncAllowedEffectCallback`

Runs only **_after_** first render, i.e after the component instance is mounted.
It is ignored on subsequent rerenders.

Should usually only be used for logic that does not directly take part in determining what to render, like
synchronize your component with some external system.

#### Returns

A cleanup function.

Uses `useEffect()` under the hood.

***

### beforeRender()

> **beforeRender**: () => `void` \| `object`

Runs _before_ every render cycle, including the first.
Useful for logic that is involved in determining what to render.

PS: You can conditionally update state from here, but with certain caveats.
[See the React docs for more details](https://react.dev/reference/react/useState#storing-information-from-previous-renders).

#### Returns

`void` \| `object`

***

### onRender

> **onRender**: `AsyncAllowedEffectCallback`

Runs **_after_** every render cycle, including the first.

Should usually only be used for logic that does not directly take part in determining what to render, like
synchronize your component with some external system.

Uses `useEffect()` under the hood.

Returns a cleanup function.

***

### cleanUp

> **cleanUp**: `IVoidFunction`

Runs when the component is unmounted.
It is called _after_ the cleanup function returned by onMount.

***

### state

> `readonly` **state**: [`TCleanState`](./../base/type-aliases/TCleanState.md)\<`object`\>

A [\`CleanState\`](./../base/type-aliases/TCleanState.md) object.
Holds all of your component's state,
and methods for conveniently manipulating those values.
Initialiazed with the object returned from your `getInitialState` method.

#### Inherited from

[`ComponentLogic`](ComponentLogic.md).[`state`](ComponentLogic.md#state)

***

### props

> `readonly` **props**: `TProps` *extends* `null` ? `EmptyObject` : `TProps`

The props passed into your component at the time of rendering.

#### Inherited from

[`ComponentLogic`](ComponentLogic.md).[`props`](ComponentLogic.md#props-1)

***

### hooks

> `readonly` **hooks**: `void` \| `object`

Values received from the hooks your component consumes.
This holds the latest copy of the object returned by
[useHooks](ComponentInstance.md#usehooks).

#### Inherited from

[`ComponentLogic`](ComponentLogic.md).[`hooks`](ComponentLogic.md#hooks)
