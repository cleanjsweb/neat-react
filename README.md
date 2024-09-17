# Structured React Function Components
This package provides a suite of tools for writing cleaner React function components. It is particularly useful for larger components with lots of state variables and multiple closure functions that need to access those variables. Below is a brief summary of the exported members. A more robust documentation is in the works.

## useCleanState
Example:
```jsx
const state1 = useCleanState(initialStateObject); // { myValue: 'initial-value' }
const state2 = useCleanState(initialStateGetter); // () => ({ myValue: 'initial-value' })

return (
	{/* or state2.put.clicked(true) or state2.putMany({ clicked: true }) */}
	<button onClick={() => state2.clicked = true }>
		{state1.label}
	</button>
)
```

## useMethods
To be finished

## useLogic
To be finished

## useInstance
To be finished
Define all of your component's logic and lifecycle effects in a seperate class. Allow your function component to remain neat as just a JSX template. Access the instance of your class within the template with the useInstance hook.

## ClassComponent
To be finished.
Wrap your function component in a class, allowing you to organize logic into discreet methods and work with a persistent instance throughout the component's lifecycle that's much easier to reason about. At it's core, your component remains a function component and maintains all features of function components.
