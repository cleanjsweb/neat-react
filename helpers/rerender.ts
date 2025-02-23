import { useMountState } from '@/helpers/mount-state';
import { useState } from 'react';


/**
 * Returns a function that can be called to manually trigger
 * a rerender of your component.
 */
export const useRerender = () => {
	const isMounted = useMountState();

	// Skip the value, we don't need it. Grab just the setter function.
	const [, _forceRerender] = useState(Date.now());

	const rerender = () => {
		if (isMounted()) {
			_forceRerender(Date.now());
			return;
		}

		setTimeout(() => {
			if (!isMounted()) return;
			_forceRerender(Date.now());
		}, 1000);
	}

	return rerender;
};
