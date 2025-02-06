import { CleanStateBase } from './class';


export type TStateData = object & {
	[Key in keyof CleanStateBase<{}>]?: never;
};

/** @see https://github.com/cleanjsweb/neat-react#clean-state */
export type TCleanState<TState extends TStateData> = (
	CleanStateBase<TState>
	& Omit<TState, keyof CleanStateBase<{}>>
);

export type ExtractCleanStateData<
	YourCleanState extends CleanStateBase<{}>
> = Omit<YourCleanState, keyof CleanStateBase<{}>>;


type StateInitFunction = (...args: any[]) => object;
type StateInit = object | StateInitFunction;

export type TInitialState<
	Initializer extends StateInit
> = Initializer extends (...args: any[]) => (infer TState extends object)
	? TState
	: Initializer;

export type TUseCleanState = <TInit extends StateInit>(
	_initialState: TInit,
	...props: TInit extends (...args: infer TProps extends any[]) => (infer TState extends object)
		? TProps
		: []
) => TCleanState<TInitialState<TInit>>;
