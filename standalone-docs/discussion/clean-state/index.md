---
title: Clean State
group: Documents
category: Guides
---


| @function       | @description | @params | @returns|
|_________________|______________|_________|_________|
| `useCleanState` |              |         |         |



# Cleaner State Management for React Function Components
Say you have a component with some state like this:

```jsx
const Button = (props) => {
	const [label, setLabel] = useState('Click me');
	const [clicked, setClicked] = useState(false);
	const [state3, setState3] = useState(props.defaultValue);

	return (
		<button onClick={() => setClicked(true)}>
			{label}
		</button>
	);
}
```

As noted in the [introductory page](../index.md), you may consider writing a custom hook to simplify working with these state values.
```jsx
const useButtonState = (props) => {
	const [label, setLabel] = useState('Click me');
	const [clicked, setClicked] = useState(false);
	const [state3, setState3] = useState(props.defaultValue);

	const _set = {
		label: setLabel,
		clicked: setClicked,
		state3: setState3,
	};

	return { label, clicked, state3, _set };
}

const Button = (props) => {
	const state = useButtonState(props);

	return (
		<button onClick={() => state._set.clicked(true)}>
			{label}
		</button>
	);
}
```
> **Important:** Of course this example is only for illustrative purposes. This change would be completely unnecessary for a component as small as our `Button` example here. A setup like this is mostly only useful for larger components with a lot of seperate state variables.

Separating things out like this makes the component look much smaller and definitely much easier to read. This type of decluttering could be of particular value to certain neurodivergent people, but really anyone can appreciate a good decluttering.

If you have a larger function component, it may be easy to see how a pattern like this could be of benefit, except for the extra lines required to define each setter, which must increase linearly with each new state variable. It's possible to improve this of course, and have `_set` dynamically generated. You'll have less code, and won't need double the number of new lines for each new state variable.

## useCleanState
`useCleanState` adds this and a handful of other improvements, making it easy for you to define state variables in a way that doesn't clutter your components, and work with those variables in very convenient ways. Here is what our `Button` component might look like with the `useCleanState` hook:

```jsx
const initialState = {
	label: 'Click me',
	clicked: false,
	inputValue: {},
}

const Button = () => {
	const state = useCleanState(initialState);

	const onClick = useCallback(() => {
		state.clicked = true;
	}, []);

	return <>
		<CustomInput setValue={state.put.inputValue}>

		<button onClick={onClick}>
			{state.label}
		</button>
	</>;
}
```

1. `put` holds setter functions that can be passed around conveniently. Each key in your state object gets a corresponding setter function of the same name in the `state.put` object. This means you cannot have a value named `put` in your state object, as it is a reserved name. To set multiple values simultaneously, use [`state.putMany`](./api#putMany), which works just like `setState` in React class components.

2. Using JavaScript setters, state properties can also be assigned directly, with the same effect as if you called the setter function.
	1. Note that this only works when referencing the property directly on the state object, as in `state.clicked = true`. It will not have the intended effect if the value if first assigned to a separate local variable. So the example below will simply update the local varibale without actually updating the component's state:
	```jsx
	let { clicked } = useCleanState({ clicked: false });
	const onClick = () => clicked = true;
	```
	As a rule of thumb, if you are extracting individual values from the state object, use `const` so it's clear that the ephemeral copy you've created shouldn't be reassigned.


But we want to set the initial `inputValue` based on props, so we might consider moving the `initialState` object into the component and passing it as a literal to `useCleanState`. But that seems like it would undo some of the decluttering advantages of the hook. To avoid that, you can pass a function instead, and a second argument to be passed on to the function. The second argument can be anything: the entire props object, a specific primitive value, or perhaps a tuple (i.e an array of arguments).

> Note that `useCleanState` can be called multiple times in the same component if you prefer to have you component's state grouped into separate objects.

```jsx
const initState = ({ defaultValue }) => {
	return {
		label: 'Click me',
		clicked: false,
		inputValue: defaultValue,
	};
}

const Button = () => {
	const state = useCleanState(initState, props);

	return <>
		<CustomInput setValue={state.put.inputValue}>
		<button onClick={() => state.put.clicked(true)}>
			{state.label}
		</button>
	</>;
}
```
