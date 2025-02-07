[**@cleanweb/react**](../../../README.md)

***

[@cleanweb/react](../../../modules.md) / [classy/class](../README.md) / ClassComponent

# Class: ClassComponent\<TProps\>

Defined in: [classy/class/index.tsx:19](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/classy/class/index.tsx#L19)

A superset of [ComponentInstance](../../instance/classes/ComponentInstance.md) that allows defining your
component's JSX template directly inside the class.

This is designed to closely resemble the old React.Component class,
making it easier to migrate older class components to the newer hooks-based system
with little to no changes to their existing semantics/implementation.

## Extends

- [`ComponentInstance`](../../instance/classes/ComponentInstance.md)\<`TProps`\>

## Type Parameters

• **TProps** *extends* `object` = `WeakEmptyObject`

## Constructors

### new ClassComponent()

> **new ClassComponent**\<`TProps`\>(): [`ClassComponent`](ClassComponent.md)\<`TProps`\>

#### Returns

[`ClassComponent`](ClassComponent.md)\<`TProps`\>

#### Inherited from

[`ComponentInstance`](../../instance/classes/ComponentInstance.md).[`constructor`](../../instance/classes/ComponentInstance.md#constructors)

## Properties

### beforeMount

> **beforeMount**: `IVoidFunction`

Defined in: [classy/instance/index.ts:36](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/classy/instance/index.ts#L36)

Runs only _before_ first render,
i.e before the component instance is mounted.

It is ignored on subsequent rerenders.

PS: You can conditionally update state from here, but with certain caveats.
[See the React docs for more details](https://react.dev/reference/react/useState#storing-information-from-previous-renders).

#### Inherited from

[`ComponentInstance`](../../instance/classes/ComponentInstance.md).[`beforeMount`](../../instance/classes/ComponentInstance.md#beforemount)

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

#### Inherited from

[`ComponentInstance`](../../instance/classes/ComponentInstance.md).[`beforeRender`](../../instance/classes/ComponentInstance.md#beforerender)

***

### cleanUp

> **cleanUp**: `IVoidFunction`

Defined in: [classy/instance/index.ts:81](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/classy/instance/index.ts#L81)

Runs when the component is unmounted.
It is called _after_ the cleanup function returned by onMount.

#### Inherited from

[`ComponentInstance`](../../instance/classes/ComponentInstance.md).[`cleanUp`](../../instance/classes/ComponentInstance.md#cleanup)

***

### forceUpdate

> `readonly` **forceUpdate**: `VoidFunction`

Defined in: [classy/class/index.tsx:65](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/classy/class/index.tsx#L65)

Manually trigger a rerender of your component.
You should rarely ever need this. But if you are migrating
an older React.Component class, this should provide similar functionality
to the React.Component.forceUpdate \| \`forceUpdate\` method provided there.

Note that the callback argument is currently not supported.

***

### hooks

> `readonly` **hooks**: `void` \| `object`

Defined in: [classy/logic/index.ts:48](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/classy/logic/index.ts#L48)

Values received from the hooks your component consumes.
This holds the latest copy of the object returned by
[useHooks](ClassComponent.md#usehooks).

#### Inherited from

[`ComponentInstance`](../../instance/classes/ComponentInstance.md).[`hooks`](../../instance/classes/ComponentInstance.md#hooks)

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

#### Inherited from

[`ComponentInstance`](../../instance/classes/ComponentInstance.md).[`onMount`](../../instance/classes/ComponentInstance.md#onmount)

***

### onRender

> **onRender**: `AsyncAllowedEffectCallback`

Defined in: [classy/instance/index.ts:75](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/classy/instance/index.ts#L75)

Runs **_after_** every render cycle, including the first.

Should usually only be used for logic that does not directly take part in determining what to render, like
synchronize your component with some external system.

Uses `useEffect()` under the hood.

Returns a cleanup function.

#### Inherited from

[`ComponentInstance`](../../instance/classes/ComponentInstance.md).[`onRender`](../../instance/classes/ComponentInstance.md#onrender)

***

### props

> `readonly` **props**: `TProps`

Defined in: [classy/logic/index.ts:41](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/classy/logic/index.ts#L41)

The props pass into your component at the time of rendering.

#### Inherited from

[`ComponentInstance`](../../instance/classes/ComponentInstance.md).[`props`](../../instance/classes/ComponentInstance.md#props)

***

### state

> `readonly` **state**: [`TCleanState`](../../../base/state/hook-types/type-aliases/TCleanState.md)\<`object`\>

Defined in: [classy/logic/index.ts:38](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/classy/logic/index.ts#L38)

A [\`CleanState\`](../../../base/state/hook-types/type-aliases/TCleanState.md) object.
Holds all of your component's state,
and methods for conveniently manipulating those values.

#### Inherited from

[`ComponentInstance`](../../instance/classes/ComponentInstance.md).[`state`](../../instance/classes/ComponentInstance.md#state)

***

### template()

> **template**: (`context`) => `null` \| `Element`

Defined in: [classy/class/index.tsx:53](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/classy/class/index.tsx#L53)

Analogous to React.Component.render. A function that returns
your component's JSX template.

You should place most logic that would usually go here
in [\`beforeRender\`](../../instance/classes/ComponentInstance.md#beforerender) instead.
This helps to separate concerns and keep the template itself clean.

******

Ideally the template method should only be concerned with defining the HTML/JSX structure of
your component's UI. This may include destructuring nested instance members
into more easily accessible local variables, or some simple transformation of data from props/state
into a more appropriate format for display.

******

#### Parameters

##### context

`void` | `object`

#### Returns

`null` \| `Element`

#### Example

```tsx
template = () => {
    const { title } = this.props;

    return (
        <h1>
            {this.props.title}
        </h1>
    );
}
```

***

### extract

> `readonly` `static` **extract**: [`Extractor`](../types/extractor/type-aliases/Extractor.md)

Defined in: [classy/class/index.tsx:95](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/classy/class/index.tsx#L95)

Extract a Function Component (FC) which can be used to render
your ClassComponent just like any other React component.

Each JSX reference to the returned component will render with
a separate instance of your class.

So you only need to call `YourClassComponent.FC()` once, then use the returned
function component as many times as you need.

It is recommended to store this returned value as a static member of
your ClassComponent. While this value may be given any name, the name
RC (for "React Component") is the recommended convention.

#### Example

```ts
class Button extends ClassComponent {
    static readonly RC = this.FC();
    // Because of the static keyword, `this` here refers to the class itself, same as calling `Button.FC()`.
}

// Render with `<Button.RC />`, or export RC to use the component in other files.
export default Button.RC;
```

***

### FC

> `readonly` `static` **FC**: [`Extractor`](../types/extractor/type-aliases/Extractor.md)

Defined in: [classy/class/index.tsx:141](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/classy/class/index.tsx#L141)

#### See

[ClassComponent.extract](ClassComponent.md#extract)

## Accessors

### templateContext

#### Get Signature

> **get** **templateContext**(): `ReturnType`\<`this`\[`"beforeRender"`\]\>

Defined in: [classy/instance/index.ts:52](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/classy/instance/index.ts#L52)

##### Returns

`ReturnType`\<`this`\[`"beforeRender"`\]\>

#### Inherited from

[`ComponentInstance`](../../instance/classes/ComponentInstance.md).[`templateContext`](../../instance/classes/ComponentInstance.md#templatecontext)

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

[`ComponentInstance`](../../instance/classes/ComponentInstance.md).[`getInitialState`](../../instance/classes/ComponentInstance.md#getinitialstate)

***

### useHooks()

> **useHooks**(): `void` \| `object`

Defined in: [classy/logic/index.ts:65](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/classy/logic/index.ts#L65)

Call React hooks from here. If your component needs
access to values return from the hooks you call,
expose those values by returning an object with said values.

The returned object will be accessible as [\`this.hooks\`](ClassComponent.md#hooks) within
your component class.

#### Returns

`void` \| `object`

#### Inherited from

[`ComponentInstance`](../../instance/classes/ComponentInstance.md).[`useHooks`](../../instance/classes/ComponentInstance.md#usehooks)
