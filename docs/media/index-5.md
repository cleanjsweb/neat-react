---
title: Class Component
group: Guides
category: Discussion
---


## ClassComponent
This class builds on `useInstance` with one simple addition. It moves the function component template directly into the class. This allows the class to truly be a self contained entity containing everything that makes up the component. When you write a class that extends `ClassComponent`, you no longer need to call `useInstance` in the template function. This is handled for you internally. You template component can instead access the component instance using the `this` keyword, as it is now part of the class, and therefore part of the instance. As far as React is concerned, this template function is the real component, it is all React sees. The rest of the class provides the logic that powers the component, allowing the function component to be just a template. The example below shows how to use it.

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
	template = () => <>
		<p>{this.hooks.memoizedValue}</p>
		<button onClick={this.submit}>
			{this.state.label}
		</button>
	</>;
}

// Call the static method FC() to get a function component that you can render like any other function component.
export default Button.FC();
```

## What About `this`?
This is a non-issue. Simply use arrow functions.

If you're still unsure, it might help to consider that the logic of the `this` value in JavaScript is not as complicated as you might think. The value of `this` can be demystified in 5 sentences.
1. Only relevant in function-keyword functions. Everything else inherits from parent context. At the root level, it's undefined, or globalThis (i.e `window`) in older browsers.
2. Refers to the object before the dot when the function is called. It's evaluated at runtime, so if the method is passed around, `this` value changes accordingly. The key here is "before the dot".
3. If there is no dot...
4. To decide what `this` will be at the time of writing the code, use an arrow function, or use `Function.prototype.bind(thisValue);`. `bind` can be called inline with an assignment at the time of declaring the function, so you don't have to declare the function first and bind separately. `foo = (function foo(a) {}).bind(this);`.

For more details and examples, the website javascript.info has [a brilliant chapter explaining this]() very well.

## The `<Use>` Component
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
