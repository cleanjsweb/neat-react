import { useState } from 'react';


export const useRerender = () => {
	// Skip the value, we don't need it. Grab just the setter function.
	const [, _forceRerender] = useState(Date.now());

	const rerender = () => _forceRerender(Date.now());

	return rerender;
};
