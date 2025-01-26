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

```jsx
/** Button Component Class. */
class ButtonCC extends ComponentInstance {
	// ...
	// Static method(s), same as useLogic...
	// ...


	/* Lifecycle Methods */

	beforeMount = () => {
		// Runs before the component is first rendered.
	}

	onMount = () => {
		// Runs after the component is first rendered.
		// Same as `useEffect(() => {}, []);`

		return () => {
			// Required clean up function must be returned.
			// Return an empty function if you have no cleanup.
		};
	}

	beforeRender = () => {
		// Runs before every single render.
		// Same as code placed before the return statement in a function component.

		// Example: Generate display values from state and props,
		// and store them as instance members for use in your JSX template.
		const displayValue2 = this.hooks.memoizedValue + this.state.value2;

		this.templateContext = {
			intro: `Hello, ${this.props.name}`,
			displayValue2,
		};
	}

	onRender = () => {
		// Runs after every single render.
		// Same as `useEffect(() => {});`

		return () => {
			// Required clean up function must be returned.
			// Return an empty function if you have no cleanup.
		};
	}

	cleanUp = () => {
		// Runs when the component is unmounted.
		// Similar to the function returned by `onMount`.
	}

	/* [End] Lifecycle Methods */


	// ...
	// Other instance methods, same as useLogic...
	// ...
}

// Button Template
const Button = (props) => {
	const self = useInstance(ButtonCC, props);
	const { intro } = self.templateContext;

	return <>
		<p>{intro}</p>
		<button onClick={self.submit}>
			{self.state.label}
		</button>
	</>;
}
```

[Read the `useInstance` docs]() for more details.

### Class Component
With `useInstance`, pretty much every aspect of your component is now part of the class, except for the JSX template. The `ClassComponent` class takes that final step and provides a fully integrated class-based React component.

If you're currently maintaining older components writtend with the `React.Component` class and haven't had time to rewrite them as function components with hooks, porting them to `ClassComponent` should be _significantly_ simplify and speed up the process. You can access all the latest React features, without changing the overall structure of your existing component classes.


```jsx
class Button extends ClassComponent {
	static RC = Button.extract();
	// Or...
	static RC = Button.FC();
	// Or...
	static RC = this.extract(); // Here, `this` refers to the class itself (not an instance) because of the "static" keyword.
	// Or...
	static RC = this.FC();

	// ...
	// Other static and instance members, same as useInstance...
	// ...


	/**
	 * Unlike in `useInstance`, there's no need to manually store
	 * values from `beforeRender` for use in the template.
	 * Simply return an object and it will be passed as an argument to
	 * to the template function.
	 */
	beforeRender = () => {
		const displayValue2 = this.hooks.memoizedValue + this.state.value2;

		return {
			intro: `Hello, ${this.props.name}`,
			displayValue2,
		};
	}

	/** Button Template */
	template = (context) => (
		<section>
			<p>{context.intro}</p>

			<button onClick={this.submit}>
				{this.state.label}
			</button>
		</section>
	);
}

export default Button.RC;
// Or render directly with `<Button.RC />`.
```

Every class derived from the base `ClassComponent` is not itself a React component. Instead, it has a static `extract()` method (also aliased as `FC()` for "Function Component") which returns a function component that can be rendered like any other react component. Each instance of this component mounted in the React tree will create a separate new instance of your `ClassComponent` for itself. To make it easier to use the class component directly, you should create a static property that holds the function component returned by `extract`. The recommended convention is to use the name `RC` for "React Component". Such a class can then easily be rendered as JSX by writing `<MyClass.RC />`.

[Read the `ClassComponent` docs]() for more details.

### Other Exports
#### The `<Use>` Component
If you simply want to use hooks in your `React.Component` class without having to rewrite anything, this package also exports a `<Use>` component that helps you achieve this easily. Here's how to use it.

```jsx
import { useGlobalStore } from '@/hooks/store';

class Button extends React.Component {
	syncGlobalStore = ([store, updateStore]) => {
		this.setState({ userId: store.userId });
		this.store = store;
		this.updateStore = updateStore;
	}

	UseHooks = () => {
		return <>
			<Use hook={useGlobalStore}
				onUpdate={syncGlobalStore}
				argumentsList={[]}
				key="useGlobalStore"
			/>
		</>;
	}

	render() {
		const { UseHooks } = this;

		return <>
			<UseHooks />

			<button>Click me</button>
		</>;
	}
}
```

The provided hook is called with the `argumentsList` array passed in (the array is spread, so each item in the list is a separate argument). The return value from the hook is passed on to the `onUpdate` callback. So ypu can use this to update your component's state and trigger a rerender when something changes.

#### Merged State


### Issues
If observe an issue or bug, please report it by creating an issue on the [Oore repo on GitHub]().


