# Object Oriented Programming for Modern React
This package provides a set of tools for creating modern React function components with object-oriented code.

## Usage
### Clean State
The `useCleanState` hook provides a clean API for working with a high number of state variables in a unified way. The example below demonstrates how to use it.

```jsx
const initialState = {
	label: 'Click me',
	clicked: false,
	inputValue: {},
};
// or
const getInitialState = (props) => {
	return {
		label: props.label,
		clicked: false,
		inputValue: {},
	};
};

const Button = (props) => {
	const state = useCleanState(initialState);
	// or
	const state = useCleanState(getInitialState, props);
	

	const onClick = useCallback(() => {
		state.clicked = true;
		// or
		state.putMany({
			label: 'Loading',
			clicked: true,
		});
		// or
		state.put.clicked(true);
		// or
		state.put.clicked((oldClicked) => !oldClicked);
	}, []);

	return <>
		<CustomInput setValue={state.put.inputValue}>

		<button onClick={onClick}>
			{state.label}
		</button>
	</>;
}
```

> **Note:** You can call `useCleanState` multiple times in the same component, allowing you to group related state values into separate objects.

[Read the `useCleanState` docs]() for more details.

### Methods
The `useMethods` hooks manage the closures that your component uses in a separate class, keeping the body of the component clean and easier to read. With `useMethods`, your functions are not recreated on every render, yet every method of your component is guaranteed to always have access to the latest props and state without the need for a dependencty array.

```jsx
class ButtonMethods {
	submit = () => {
		const { state1, state2 } = this.state;
		sendData(state1, state2);
		this.state.submitted = true;
	}

	doSomething = () => {
		// Setup...

		return () => {
			// Cleanup...
		}
	} 
}

const initialState = {
	value1: undefined,
	value2: null,
	label: 'Click me',
	submitted: false,
}

const Button = (props) => {
	const state = useCleanState(initialState);
	const methods = useMethods(ButtonMethods, state, props);

	useEffect(methods.doSomething, []);

	return (
		<button onClick={methods.submit}>
			{state.label}
		</button>
	);
}
```

`useMethods` only accepts a single state object. So if you are using multiple calls to `useCleanState`, you may have to group them into a single object when passing to `useMethods`.

```jsx
const getDefaultValues = (props) => ({/* ... */});

const Button = (props) => {
	const formValues = useCleanState(getDefaultValues, props);
	const apiData = useCleanState({});

	const multiState = { formValues, apiData };
	const methods = useMethods(ButtonMethods, multiState, props);

	// ...
}
```

[Read the `useMethods` docs]() for more details.

### Logic
The `useLogic` hook is an expansion of `useMethods`, with the aim of being a more holistic solution. It combines the functionality of `useCleanState` and `useMethods`. In addition, it allows you to externalize _all_ of your component's logic, not just closures and state. Essentially, this means being able to call hooks from within the class, rather than having to do so within the component body.

```jsx
class ButtonLogic {
	static getInitialState = () => {
		return {
			value1: undefined,
			value2: null,
			label: 'Click me',
			submitted: false,
		};
	}

	submit = async () => {
		const { value1, value2 } = this.state;
		await sendData(value1, value2);
		this.state.submitted = true;
	}

	doSomething = () => {
		// Setup...

		return () => {
			// Cleanup...
		}
	}

	useHooks = () => {
		const { param } = this.props;

		useEffect(this.doSomething, []);

		const memoizedValue = useMemo(() => getValue(param), [param]);
		const value2 = useCustomHook();

		return {
			memoizedValue,
			value2,
		};
	}
}

// Button Template
const Button = (props) => {
	const { state, hooks, ...methods } = useLogic(ButtonLogic, props);

	return <>
		<p>{hooks.memoizedValue}</p>
		<button onClick={methods.submit}>
			{state.label}
		</button>
	</>;
}
```

[Read the `useLogic` docs]() for more details.

### Lifecycle (`useInstance`)
The `useInstance` hook provides a simple approach for working with your components lifecycle. It includes all the features of [`useLogic`](#logic), and adds special lifecycle methods. This gives you a declarative way to run certain logic at specific stages of your component's life time. You will likely find this to be less error prone and much easier to reason about than the imperative approach of using React's hooks directly.




