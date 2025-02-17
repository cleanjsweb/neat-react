[**@cleanweb/react**](../../../../README.md)

***

[@cleanweb/react](../../../../modules.md) / [base/state/class](../README.md) / CleanStateBase

# Class: CleanStateBase\<TState\>

Defined in: [base/state/class.ts:7](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/base/state/class.ts#L7)

## Type Parameters

• **TState** *extends* `Record`\<`string`, `any`\>

## Constructors

### new CleanStateBase()

> **new CleanStateBase**\<`TState`\>(`initialState`): [`CleanStateBase`](CleanStateBase.md)\<`TState`\>

Defined in: [base/state/class.ts:17](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/base/state/class.ts#L17)

#### Parameters

##### initialState

`TState`

#### Returns

[`CleanStateBase`](CleanStateBase.md)\<`TState`\>

## Properties

### reservedKeys

> `readonly` **reservedKeys**: `string`[]

Defined in: [base/state/class.ts:8](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/base/state/class.ts#L8)

***

### valueKeys

> `readonly` **valueKeys**: `string`[]

Defined in: [base/state/class.ts:9](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/base/state/class.ts#L9)

***

### update()

> `static` **update**: \<`TState`\>(`this`) => `void`

Defined in: [base/state/class.ts:48](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/base/state/class.ts#L48)

#### Type Parameters

• **TState** *extends* `object`

#### Parameters

##### this

[`CleanStateBase`](CleanStateBase.md)\<`TState`\>

#### Returns

`void`

## Accessors

### initialState

#### Get Signature

> **get** **initialState**(): `TState`

Defined in: [base/state/class.ts:84](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/base/state/class.ts#L84)

##### Returns

`TState`

***

### put

#### Get Signature

> **get** **put**(): [`PutState`](../../class-types/type-aliases/PutState.md)\<`TState`\>

Defined in: [base/state/class.ts:81](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/base/state/class.ts#L81)

##### Returns

[`PutState`](../../class-types/type-aliases/PutState.md)\<`TState`\>

## Methods

### putMany()

> `readonly` **putMany**(`newValues`): `void`

Defined in: [base/state/class.ts:88](https://github.com/cleanjsweb/neat-react/blob/14baaff619a13096b0ac0ffe8ec82445197edebb/base/state/class.ts#L88)

#### Parameters

##### newValues

`Partial`\<`TState`\>

#### Returns

`void`
