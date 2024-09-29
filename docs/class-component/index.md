## ClassComponent
This class builds on `useInstance` with one simple addition. It moves the function component template directly into the class. This allows the class to truly be a self contained entity containing everything that makes up the component. When you write a class that extends `ClassComponent`, you no longer need to call `useInstance` in the template function. This is handled for you internally. You template component can instead access the component instance using the `this` keyword, as it is now part of the class, and therefore part of the instance. As far as React is concerned, this template function is the real component, it is all React sees. The rest of the class provides the logic that powers the component, allowing the function component to be just a template. The example below shows how to use it.

```jsx
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
		useEffect(this.subscribeToExternalDataSource, []);
		const memoizedValue = useMemo(() => getValue(props.param), [props.param]);
		[this.store, this.updateStore] = useGlobalStore();

		return {
			memoizedValue,
		};
	}

	/* New Lifecycle Methods */
	beforeMount = () => {}
	onMount = () => {
		return () => {};
	}

	beforeRender = () => {}
	onRender = () => {
		return () => {};
	}

	cleanUp = () => {}
	/* [End] Lifecycle Methods */


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

	/** Button Template */
	Render = () => <>
		{/* const self = useInstance(ButtonComponent, this.props); */}
		<p>{this.hooks.memoizedValue}</p>
		<button onClick={this.submit}>
			{this.state.label}
		</button>
	</>;
}

// Call FC() to get a function component that you can render like any other function component.
export default Button.FC();
```

## Migrating From `React.Component`
Having a class-based way to use function components makes it much easier to migrate older `React.Component` classes to function components, while maintaining much of their existing semantics. If you want to move because class components are increasingly being discouraged, or because you would like to be able to use React hooks, the `ClassComponent` class allows you to do this with significantly less effort. See below for a side-by-side comparison.

**React.Component**
```jsx
class Button extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			state1: props.defaultValue,
			state2: null,
			label: 'Click me',
			submitted: false,
		};
	}

	componentDidMount() {
		this.unsubscribe = this.subscribeToExternalDataSource();
	}

	componentWillUnmount() {
		this.unsubscribe();
		doSomethingElse();
	}

	subscribeToExternalDataSource = () => {
		return externalDataSource.subscribe((data) => {
			this.state.label = data.label;
		});
	}

	handleGlobalStore = ([store, updateStore]) => {
		this.setState({ userId: store.userId });
		this.store = store;
		this.updateStore = updateStore;
	}

	UseHooks = () => {
		return <>
			<Use hook={useGlobalStore}
				onUpdate={handleGlobalStore}
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

**ClassComponent**
```jsx
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
		useEffect(this.subscribeToExternalDataSource, []);
		const memoizedValue = useMemo(() => getValue(props.param), [props.param]);
		[this.store, this.updateStore] = useGlobalStore();

		return {
			memoizedValue,
		};
	}

	onMount = () => {
		const unsubscribe = this.subscribeToExternalDataSource();
		return () => {
			unsubscribe();
		};
	}

	cleanUp = () => {
		doSomethingElse();
	}

	submit = () => {
		const { state1, state2 } = this.state;
		sendData(state1, state2);
		this.state.submitted = true;
	}

	subscribeToExternalDataSource = () => {
		return externalDataSource.subscribe((data) => {
			this.state.label = data.label;
		});
	}

	/** Button Template */
	Render = () => <>
		<p>{this.hooks.memoizedValue}</p>
		<button onClick={this.submit}>
			{this.state.label}
		</button>
	</>;
}

// Call FC() to get a function component that you can render like any other function component.
export default Button.FC();
```

## The `<Use>` Component
If you simply want to use hooks in your `React.Component` class without having to rewrite anything, this module also exports a `<Use>` component that helps you achieve this easily. The mechanism is simple, and you could easily [write a minimal function component to achieve this](https://feranmi.dev/posts/react-class-hook) yourself. `Use` is exported as a convenience if you would rather not write one yourself. Here's how to use it.

```jsx
import { useGlobalStore } from '@/hooks/store';

class Button extends React.Component {
	handleGlobalStore = ([store, updateStore]) => {
		this.setState({ userId: store.userId });
		this.store = store;
		this.updateStore = updateStore;
	}

	UseHooks = () => {
		return <>
			<Use hook={useGlobalStore}
				onUpdate={handleGlobalStore}
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

Now your component will get updated whenever there is an updated value from the hook, and the hook will be called with updated input whenever the props to `<Use>` change.
