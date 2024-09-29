## useLogic
This hook combines the functionality of `useCleanState` and `useMethods`, making it easier to use both of them together. It also introduces a new special method, allowing you to truly extract all of your components logic from the main function body. The method in question is called `useHooks`, and allows you to call react hooks from the methods class instead of function component's body. With this addition, you can fully have separation of concerns, with the main component function being just a template, and all of the logic that supports said template neatly grouped as methods within a Logic class. Here's an example.

```jsx
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
		useEffect(this.subscribeToExternalDataSource, []);
		const memoizedValue = useMemo(() => getValue(props.param), [props.param]);

		return {
			memoizedValue,
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
