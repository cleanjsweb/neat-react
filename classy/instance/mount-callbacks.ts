import { useEffect } from 'react';
import { useMountState } from '@/base/state';
import { ComponentInstance } from '.';
import { CIBaseType, IComponentInstance } from './types/instance';

type UseMountCallbacks = <
	// eslint-disable-next-line no-use-before-define
	TInstance extends IComponentInstance<CIBaseType> // ComponentInstance<any, any, any>
>(instance: TInstance) => void;

export const useMountCallbacks: UseMountCallbacks = (instance) => {
	const mounted = useMountState();

	if (!mounted) instance.beforeMount?.();

	useEffect(() => {
		const mountHandlerCleanUp = instance.onMount?.();

		return () => {
			const doCleanUp = (runMountCleaners: IVoidFunction) => {
				runMountCleaners?.();

				// onDismount? willUnmount?
				instance.cleanUp?.();
			};

			if (typeof mountHandlerCleanUp === 'function') {
				doCleanUp(mountHandlerCleanUp);
			} else {
				mountHandlerCleanUp?.then(doCleanUp);
			}
		};
	}, []);
};
