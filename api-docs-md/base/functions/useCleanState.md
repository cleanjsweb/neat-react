[**@cleanweb/react v2.1.1-beta.0**](./../../README.md)

***

[@cleanweb/react](./../../modules.md) / [base](./../README.md) / useCleanState

# Function: useCleanState()

> **useCleanState**\<`TInit`\>(`_initialState`, ...`props`): [`TCleanState`](./../type-aliases/TCleanState.md)\<`TInitialState`\<`TInit`\>\>

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

[`TCleanState`](./../type-aliases/TCleanState.md)\<`TInitialState`\<`TInit`\>\>
