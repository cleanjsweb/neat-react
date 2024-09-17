Simplify state management for larger function components.

# Usage
```jsx
const state1 = useCleanState(initialStateObject);
const state2 = useCleanState(initialStateGetter);

return (
	<button onClick={() => state2.clicked = true }>
		{state1.label}
	</button>
)
```
