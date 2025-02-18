import type { ClassComponentHookWrapper } from './types';

import { useEffect } from 'react';


/**
 * A component you can use to consume hooks
 * in a {@link Component | React.Component} class component.
 * 
 * @_category Helpers
 */
export const Use: ClassComponentHookWrapper = (params) => {
	const { hook: useGenericHook, argumentsList, onUpdate } = params;

	const output = useGenericHook(...argumentsList);

	useEffect(() => {
		onUpdate(output);
	}, [output]);

	return null;
};
