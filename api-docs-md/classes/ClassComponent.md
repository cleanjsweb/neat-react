[**@cleanweb/react v2.1.1-beta.0**](./../README.md)

***

[@cleanweb/react](./../modules.md) / ClassComponent

# Class: ClassComponent\<TProps\>

A superset of [ComponentInstance](ComponentInstance.md) that allows defining your
component's JSX template directly inside the class.

This is designed to closely resemble the old React.Component class,
making it easier to migrate older class components to the newer hooks-based system
with little to no changes to their existing semantics/implementation.

## Extends

- [`ComponentInstance`](ComponentInstance.md)\<`TProps`\>

## Type Parameters

• **TProps** *extends* [`TPropsBase`](./../type-aliases/TPropsBase.md) = `null`

## Accessors

### templateContext

#### Get Signature

> **get** **templateContext**(): [`ReturnType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype)\<`this`\[`"beforeRender"`\]\>

##### Returns

[`ReturnType`](https://www.typescriptlang.org/docs/handbook/utility-types.html#returntypetype)\<`this`\[`"beforeRender"`\]\>

#### Inherited from

[`ComponentInstance`](ComponentInstance.md).[`templateContext`](ComponentInstance.md#templatecontext)

## Constructors

### new ClassComponent()

> **new ClassComponent**\<`TProps`\>(): [`ClassComponent`](ClassComponent.md)\<`TProps`\>

#### Returns

[`ClassComponent`](ClassComponent.md)\<`TProps`\>

#### Inherited from

[`ComponentInstance`](ComponentInstance.md).[`constructor`](ComponentInstance.md#constructors)

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

[`ComponentInstance`](ComponentInstance.md).[`getInitialState`](ComponentInstance.md#getinitialstate)

***

### useHooks()

> **useHooks**(): `void` \| `object`

Call React hooks from here. If your component needs
access to values return from the hooks you call,
expose those values by returning an object with said values.

The returned object will be accessible as [\`this.hooks\`](ClassComponent.md#hooks) within
your component class.

#### Returns

`void` \| `object`

#### Inherited from

[`ComponentInstance`](ComponentInstance.md).[`useHooks`](ComponentInstance.md#usehooks)

## Properties

### extract

> `readonly` `static` **extract**: `Extractor`

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

> `readonly` `static` **FC**: `Extractor`

#### See

[ClassComponent.extract](ClassComponent.md#extract)

***

### template()

> **template**: (`context`) => `null` \| `Element`

Analogous to React.Component.render. A function that returns
your component's JSX template.

You should place most logic that would usually go here
in [\`beforeRender\`](ComponentInstance.md#beforerender) instead.
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

### forceUpdate

> `readonly` **forceUpdate**: `VoidFunction`

Manually trigger a rerender of your component.
You should rarely ever need this. But if you are migrating
an older React.Component class, this should provide similar functionality
to the React.Component.forceUpdate \| \`forceUpdate\` method provided there.

Note that the callback argument is currently not supported.

***

### beforeMount

> **beforeMount**: `IVoidFunction`

Runs only _before_ first render,
i.e before the component instance is mounted.

It is ignored on subsequent rerenders.

PS: You can conditionally update state from here, but with certain caveats.
[See the React docs for more details](https://react.dev/reference/react/useState#storing-information-from-previous-renders).

#### Inherited from

[`ComponentInstance`](ComponentInstance.md).[`beforeMount`](ComponentInstance.md#beforemount)

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

#### Inherited from

[`ComponentInstance`](ComponentInstance.md).[`onMount`](ComponentInstance.md#onmount)

***

### beforeRender()

> **beforeRender**: () => `void` \| `object`

Runs _before_ every render cycle, including the first.
Useful for logic that is involved in determining what to render.

PS: You can conditionally update state from here, but with certain caveats.
[See the React docs for more details](https://react.dev/reference/react/useState#storing-information-from-previous-renders).

#### Returns

`void` \| `object`

#### Inherited from

[`ComponentInstance`](ComponentInstance.md).[`beforeRender`](ComponentInstance.md#beforerender)

***

### onRender

> **onRender**: `AsyncAllowedEffectCallback`

Runs **_after_** every render cycle, including the first.

Should usually only be used for logic that does not directly take part in determining what to render, like
synchronize your component with some external system.

Uses `useEffect()` under the hood.

Returns a cleanup function.

#### Inherited from

[`ComponentInstance`](ComponentInstance.md).[`onRender`](ComponentInstance.md#onrender)

***

### cleanUp

> **cleanUp**: `IVoidFunction`

Runs when the component is unmounted.
It is called _after_ the cleanup function returned by onMount.

#### Inherited from

[`ComponentInstance`](ComponentInstance.md).[`cleanUp`](ComponentInstance.md#cleanup)

***

### state

> `readonly` **state**: [`TCleanState`](./../base/type-aliases/TCleanState.md)\<`object`\>

A [\`CleanState\`](./../base/type-aliases/TCleanState.md) object.
Holds all of your component's state,
and methods for conveniently manipulating those values.
Initialiazed with the object returned from your `getInitialState` method.

#### Inherited from

[`ComponentInstance`](ComponentInstance.md).[`state`](ComponentInstance.md#state)

***

### props

> `readonly` **props**: `TProps` *extends* `null` ? `EmptyObject` : `TProps`

The props passed into your component at the time of rendering.

#### Inherited from

[`ComponentInstance`](ComponentInstance.md).[`props`](ComponentInstance.md#props-1)

***

### hooks

> `readonly` **hooks**: `void` \| `object`

Values received from the hooks your component consumes.
This holds the latest copy of the object returned by
[useHooks](ClassComponent.md#usehooks).

#### Inherited from

[`ComponentInstance`](ComponentInstance.md).[`hooks`](ComponentInstance.md#hooks)
