[**@cleanweb/react**](../../../README.md)

***

[@cleanweb/react](../../../modules.md) / [classy/instance](../README.md) / ComponentInstance

# Class: ComponentInstance\<TProps\>

Defined in: [classy/instance/index.ts:25](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/classy/instance/index.ts#L25)

A superset of [ComponentLogic](../../logic/classes/ComponentLogic.md) that adds support for lifecycle methods.
This provides a declarative API for working with your React function component's lifecycle,
a simpler alternative to the imperative approach with `useEffect` and/or `useMemo`.

## See

https://github.com/cleanjsweb/neat-react#lifecycle-useinstance

## Extends

- [`ComponentLogic`](../../logic/classes/ComponentLogic.md)\<`TProps`\>

## Extended by

- [`ClassComponent`](../../class/classes/ClassComponent.md)

## Type Parameters

• **TProps** *extends* `object` = `NonPrimitive`

## Constructors

### new ComponentInstance()

> **new ComponentInstance**\<`TProps`\>(): [`ComponentInstance`](ComponentInstance.md)\<`TProps`\>

#### Returns

[`ComponentInstance`](ComponentInstance.md)\<`TProps`\>

#### Inherited from

[`ComponentLogic`](../../logic/classes/ComponentLogic.md).[`constructor`](../../logic/classes/ComponentLogic.md#constructors)

## Properties

### beforeMount

> **beforeMount**: `IVoidFunction`

Defined in: [classy/instance/index.ts:36](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/classy/instance/index.ts#L36)

Runs only _before_ first render,
i.e before the component instance is mounted.

It is ignored on subsequent rerenders.

PS: You can conditionally update state from here, but with certain caveats.
[See the React docs for more details](https://react.dev/reference/react/useState#storing-information-from-previous-renders).

***

### beforeRender()

> **beforeRender**: () => `void` \| `object`

Defined in: [classy/instance/index.ts:63](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/classy/instance/index.ts#L63)

Runs _before_ every render cycle, including the first.
Useful for logic that is involved in determining what to render.

PS: You can conditionally update state from here, but with certain caveats.
[See the React docs for more details](https://react.dev/reference/react/useState#storing-information-from-previous-renders).

#### Returns

`void` \| `object`

***

### cleanUp

> **cleanUp**: `IVoidFunction`

Defined in: [classy/instance/index.ts:81](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/classy/instance/index.ts#L81)

Runs when the component is unmounted.
It is called _after_ the cleanup function returned by onMount.

***

### hooks

> `readonly` **hooks**: `void` \| `object`

Defined in: [classy/logic/index.ts:48](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/classy/logic/index.ts#L48)

Values received from the hooks your component consumes.
This holds the latest copy of the object returned by
[useHooks](ComponentInstance.md#usehooks).

#### Inherited from

[`ComponentLogic`](../../logic/classes/ComponentLogic.md).[`hooks`](../../logic/classes/ComponentLogic.md#hooks)

***

### onMount

> **onMount**: `AsyncAllowedEffectCallback`

Defined in: [classy/instance/index.ts:49](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/classy/instance/index.ts#L49)

Runs only **_after_** first render, i.e after the component instance is mounted.
It is ignored on subsequent rerenders.

Should usually only be used for logic that does not directly take part in determining what to render, like
synchronize your component with some external system.

#### Returns

A cleanup function.

Uses `useEffect()` under the hood.

***

### onRender

> **onRender**: `AsyncAllowedEffectCallback`

Defined in: [classy/instance/index.ts:75](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/classy/instance/index.ts#L75)

Runs **_after_** every render cycle, including the first.

Should usually only be used for logic that does not directly take part in determining what to render, like
synchronize your component with some external system.

Uses `useEffect()` under the hood.

Returns a cleanup function.

***

### props

> `readonly` **props**: `TProps`

Defined in: [classy/logic/index.ts:41](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/classy/logic/index.ts#L41)

The props pass into your component at the time of rendering.

#### Inherited from

[`ComponentLogic`](../../logic/classes/ComponentLogic.md).[`props`](../../logic/classes/ComponentLogic.md#props)

***

### state

> `readonly` **state**: [`TCleanState`](../../../base/state/hook-types/type-aliases/TCleanState.md)\<`object`\>

Defined in: [classy/logic/index.ts:38](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/classy/logic/index.ts#L38)

A [\`CleanState\`](../../../base/state/hook-types/type-aliases/TCleanState.md) object.
Holds all of your component's state,
and methods for conveniently manipulating those values.

#### Inherited from

[`ComponentLogic`](../../logic/classes/ComponentLogic.md).[`state`](../../logic/classes/ComponentLogic.md#state)

## Accessors

### templateContext

#### Get Signature

> **get** **templateContext**(): `ReturnType`\<`this`\[`"beforeRender"`\]\>

Defined in: [classy/instance/index.ts:52](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/classy/instance/index.ts#L52)

##### Returns

`ReturnType`\<`this`\[`"beforeRender"`\]\>

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

#### Inherited from

[`ComponentLogic`](../../logic/classes/ComponentLogic.md).[`getInitialState`](../../logic/classes/ComponentLogic.md#getinitialstate)

***

### useHooks()

> **useHooks**(): `void` \| `object`

Defined in: [classy/logic/index.ts:65](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/classy/logic/index.ts#L65)

Call React hooks from here. If your component needs
access to values return from the hooks you call,
expose those values by returning an object with said values.

The returned object will be accessible as [\`this.hooks\`](ComponentInstance.md#hooks) within
your component class.

#### Returns

`void` \| `object`

#### Inherited from

[`ComponentLogic`](../../logic/classes/ComponentLogic.md).[`useHooks`](../../logic/classes/ComponentLogic.md#usehooks)
