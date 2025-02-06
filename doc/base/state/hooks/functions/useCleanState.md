[**@cleanweb/react**](../../../../README.md)

***

[@cleanweb/react](../../../../modules.md) / [base/state/hooks](../README.md) / useCleanState

# Function: useCleanState()

> **useCleanState**\<`TInit`\>(`_initialState`, ...`props`): [`TCleanState`](../../hook-types/type-aliases/TCleanState.md)\<[`TInitialState`](../../hook-types/type-aliases/TInitialState.md)\<`TInit`\>\>

Defined in: [base/state/hooks.ts:10](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/base/state/hooks.ts#L10)

Creates a state object, which includes the provided values, and helper methods for
updating those values and automatically rerendering your component's UI accordingly.

## Type Parameters

• **TInit** *extends* `StateInit`

## Parameters

### \_initialState

`TInit`

### props

...`TInit` *extends* (...`args`) => `TState` ? `TProps` : \[\]

## Returns

[`TCleanState`](../../hook-types/type-aliases/TCleanState.md)\<[`TInitialState`](../../hook-types/type-aliases/TInitialState.md)\<`TInit`\>\>
