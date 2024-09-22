import { useEffect, useMemo } from 'react';

// const reservedKeys = ['put', 'putMany', '_setters_', '_values_'];

function publishChanges() {
	const { state: prevState, hooks: prevHooks } = this.__reserved.__stateSubscription.previousValues;
	const { state: newState, hooks: newHooks } = this.__reserved.__stateSubscription.previousValues;
	
	

	/** Cache the new values. */
	this.__reserved.__stateSubscription.previousValues.state = this.state.__valueKeys.reduce((newPrevState, currentKey) => {
		newPrevState[currentKey] = this.state[currentKey];
	}, {});
	this.__reserved.__stateSubscription.previousValues.hooks = { ...this.hooks };
};

function addSubscribers(bucket, key, ...subscribers) {
	subscribers.forEach((subscriber) => {
		if (this.__reserved.subscribers[bucket][key].includes(subscriber)) {
			console.warn(`The function '${subscriber.name}' is already subscribed to changes on ${bucket}.${key}, so it will be skipped. This attempt to subscribe again was probably a mistake. You should check the flow of execution in your component for potentially redundant function calls.`);
			return;
		};
		this.__reserved.subscribers[bucket][key].push(subscriber);
	});
};

const setHelpers = (bucket, instance) => {
	instance[bucket].addSubs = (keysAndSubs: Record<string, Awaitable<VoidFunction>[]>) => {
		Object.entries(keysAndSubs).forEach(([key, subscribers]) => {
			addSubscribers.call(instance, bucket, key, ...subscribers);
		});
	};

	instance[bucket].sub = {};

	// Object.keys(state).forEach((key) => {
	// 	if (state.__reservedKeys.includes(key)) return;
	const valueKeys = instance[bucket].__valueKeys || Object.keys(instance[bucket]);
	valueKeys.forEach((key) => {
		instance[bucket].sub[key] = (...subscribers) => addSubscribers.call(instance, bucket, key, ...subscribers);
	});
}

export const useStateSubscription = (instance) => {
	// const { state, props, hooks } = instance;

	setHelpers('state', instance);
	setHelpers('hooks', instance);

	// Subscribe to many. Many vals, same subscriber(s).
	instance.subscribe = (bucket, keys, ...subscribers) => {
		keys.forEach((key) => addSubscribers.call(instance, bucket, key, ...subscribers));
	};

	// instance.onStateObservable
	// instance.initStateObservers
	useMemo(instance.initStateListeners, []);
	useEffect(publishChanges.bind(instance));
};
