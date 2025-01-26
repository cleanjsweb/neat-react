import { CleanStateBase } from './class';
import { TCleanState } from './hook-types';

export type TCleanStateBase = typeof CleanStateBase;
export type TCleanStateBaseKeys = keyof TCleanStateBase;

export type PutState<TState extends object> = {
	[Key in keyof TState]: React.Dispatch<React.SetStateAction<TState[Key]>>;
}

export interface ICleanStateConstructor {
	new <TState extends object>(
		...args: ConstructorParameters<typeof CleanStateBase>
	): TCleanState<TState>;
}

export type ICleanStateClass = {
	new <TState extends object>(
		...args: ConstructorParameters<typeof CleanStateBase>
	): TCleanState<TState>;
	[Key in TCleanStateBaseKeys]: (typeof CleanStateBase)[Key];
}
