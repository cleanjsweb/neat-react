# Structured React Function Components — Quick Start
This package provides a suite of tools for writing cleaner React function components. It is particularly useful for larger components with lots of state variables and multiple closure functions that need to access those variables. The most likely use cases will use one of the two main exported members.

## Extracting and Structuring Component Logic
The `useLogic` allows you to write your component's logic outside the function component's body, and helps you keep them all better organized. Here's what a function component looks like with the `useLogic` hook.

**Before**
```js
const Button = (props) => {
	const { param } = props;

	const [state1, setState1] = useState();
	const [state2, setState2] = useState();
	const [label, setLabel] = useState('Click me');
	const [submitted, setSubmitted] = useState(false);

	const memoizedValue = useMemo(() => getValue(param), [param]);

	const subscribeToExternalDataSource = useCallback(() => {
		externalDataSource.subscribe((data) => {
			setLabel(data.label);
		});
	}, [setLabel]);

	useEffect(subscribeToExternalDataSource, []);

	const submit = useCallback(() => {
		sendData(state1, state2);
		setSubmitted(true);
	}, [state1]);

	return <>
		<p>{memoizedValue}</p>
		<button onClick={submit}>
			{label}
		</button>
	</>;
}
```

**After**
```js
class ButtonLogic {
	static getInitialState = () => {
		return {
			state1: undefined,
			state2: null,
			label: 'Click me',
			submitted: false,
		};
	}

	submit = () => {
		const { state1, state2 } = this.state;
		sendData(state1, state2);
		this.state.submitted = true;
	}

	subscribeToExternalDataSource = () => {
		externalDataSource.subscribe((data) => {
			this.state.label = data.label;
		});
	}

	useHooks = () => {
		const { param } = this.props;

		useEffect(this.subscribeToExternalDataSource, []);
		const memoizedValue = useMemo(() => getValue(param), [param]);

		return { memoizedValue };
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

The `useLogic` hook combines the functionality of two base hooks which can also be used directly. They are [`useCleanState`](./docs/clean-state/index.md) and [`useMethods`](./docs/methods/index.md). `useCleanState` can be used independently if you only want a cleaner state management API. `useMethods` is designed to be used together with `useCleanState`, but rather than calling both individually, you may find it more convenient to use `useLogic`, which combines both and also adds additional functionality.

> It is possible to have multiple calls to `useLogic` in the same component. This allows your function component template to consume state and logic from multiple sources, or it can simply be used to group distinct pieces of related logic into separate classes.

For a fuller discussion of how `useLogic` works, start at the [clean-state documentation](./docs/clean-state/index.md). For an API reference, see the [API reference](./docs/logic/api.md).


## Working With Lifecycle, and Migrating From React.Component to a Function Component
In addition to having cleaner and more structured component logic, you can also simplify the process of working with your component's lifecycle with the final two exported members. The `useInstance` hook builds on the functionality of `useLogic` and adds lifecyle methods to the class. This means the class can now be thought of as truly representing a single instance of a React component. The `ClassComponent` class extends this to its fullest by allowing you to write the function component itself as a method within the class, and removing the need to explicitly call `useInstance`.

**Before**
```js
const Button = (props) => {
	const [state1, setState1] = useState(props.defaultValue);
	const [state2, setState2] = useState();
	const [label, setLabel] = useState('Click me');
	const [submitted, setSubmitted] = useState(false);
	const [store, updateStore] = useGlobalStore();

	// Required to run once *before* the component mounts.
	const memoizedValue = useMemo(() => getValue(), []);

	// Required to run once *after* the component mounts.
	useEffect(() => {
		const unsubscribe = externalDataSource.subscribe((data) => {
			setLabel(data.label);
		});

		const onWindowResize = () => {};

		window.addEventListener('resize', onWindowResize);

		return () => {
			unsubscribe();
			window.removeEventListener('resize', onWindowResize);
		};
	 // The lifecycle timing easily breaks if the logic is updated to use some state value,
	 // and someone mistakenly adds that variable to the deps array after being prompted by a linter.
	}, []);

	// Run *after* every render.
	useEffect(() => {
		doSomething();
		return () => {};
	})

	const submit = useCallback(() => {
		sendData(state1, state2);
		setSubmitted(true);
	}, [state1]);

	// Run before every render.
	const text = `${label}, please.`;

	return <>
		{memoizedValue ? memoizedValue.map((copy) => (
			<p>{copy}</p>
		)) : null}
		<button onClick={submit}>
			{text}
		</button>
	</>;
}

export default Button;
```

**After**
```js
class Button extends ClassComponent {
	static getInitialState = (props) => {
		return {
			state1: props.defaultValue,
			state2: null,
			label: 'Click me',
			submitted: false,
		};
	}

	useHooks = () => {
		const [store, updateStore] = useGlobalStore();
		return { store, updateStore };
	}

	/***************************
	 *  New Lifecycle Methods  *
	 ***************************/

	beforeMount = () => {
		this.memoizedValue = getValue();
	}

	// Run after the component is mounted.
	onMount = () => {
		const unsubscribe = this.subscribeToExternalDataSource();
		window.addEventListener('resize', this.onWindowResize);

		return () => {
			unsubscribe();
			window.removeEventListener('resize', this.onWindowResize);
		};
	}

	beforeRender = () => {
		this.text = `${label}, please.`;
	}

	// Run after every render.
	onRender = () => {
		doSomething();
		return () => {};
	}

	cleanUp = () => {
		// Run some non-mount-related cleanup when the component unmounts.
		// onMount (and onRender) returns its own cleanup function.
	}

	/***************************
	 * [End] Lifecycle Methods *
	 ***************************/

	submit = () => {
		const { state1, state2 } = this.state;
		sendData(state1, state2);
		this.state.submitted = true;
	}

	onWindowResize = () => {
		;
	}

	subscribeToExternalDataSource = () => {
		const unsubscribe = externalDataSource.subscribe((data) => {
			this.state.label = data.label;
		});

		return unsubscribe;
	}

	/**
	 * @see https://react.dev/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes
	 * This special instance property allows you to use the state reset feature
	 * without having to refactor and nest your component.
	 */
	instanceId = 42;

	/** You can also separate out discreet chunks of your UI template. */
	Paragraphs = () => {
		if (!this.memoizedValue) return null;

		return this.memoizedValue.map((content, index) => (
			<p key={index}>
				{content || this.state.label}
			</p>
		));
	}

	/** Button Template */
	Render = () => {
		const { Paragraphs, submit } = this;

		return <>
			<Paragraphs />

			<button onClick={submit}>
				{this.text}
			</button>
		</>;
	}
}

export default Button.FC();
```

> If you would like to keep the actual function component separate and call `useInstance` directly, see the [`useInstance` docs](./docs/instance/index.md) for more details and examples.

At its core, any component you write with `ClassComponent` is still just a React function component. This has the added advantage of making it significantly easier to migrate class components written with `React.Component` to the newer hooks-based function components, while still maintaining the overall structure of a class component, and the advantages that the class component approach provided.

For a fuller discussion of how this works, start at the [`useInstance` documentation](./docs/instance/index.md).
For a full list of available lifecycle methods, see the [`ClassComponent` API docs](./docs/class-component/api.md).

## The `<Use>` Component
If you only want to use hooks in your `React.Component` class without having to refactor anything, use the [`Use` component](./docs/class-component/index#the-use-component).

```js
```
