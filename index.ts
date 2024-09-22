
export * from "@/classy";


// Single useEffect call that runs on every render.
// Initialize the publisher by calling a `useSubscriptions(self);` hook,
// Which sets up self.{state|hooks}.{subscribe|unsubscribe} methods on the instance.
// @todo Instrument self.state.sub.myVar(self.myMethod[, ...otherSubs]) mechanism for subscribing.
// @todo Instrument self.state.addSubs({'key': [self.myMethod[, ...otherSubs]]}) mechanism for subscribing.
// @todo Instrument self.state.subToMany(['key1', 'key2'], self.myMethod[, ...otherSubs])
// @todo Instrument analogous unsubscribe mechanisms
// Calls self.initSubscriptions() when ready, so the component knows when to register subscribers.
// Generates a list of every changed var.
// Generates a deduplicated list of subscribers for those vars.
// (i.e, merge self._reserved.subscriptions['key'] for each changed key).
// Call each subscriber with a key/value map of all changed vars.

// To subscribe, do self._reserved.subscriptions['key'].push(subscriber) if it doesn't already exist.
// To unsubscribe, do array.findIndex on self._reserved.subscriptions['key'], then delete the index.

// PS: Lifecycle arrays for component inheritance.
// PS: Use this.stateResetKey (or instanceId?) to replicate this without needed to refactor and wrap components: https://react.dev/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes
// PS: beforeFirstRender() (or beforeMount), analogous to onMount (or afterFirstRender?), but runs before the mounting as it's implemented like beforeRender but with useMemo(func, []) instead of useEffect(func, []);
// Due to react's remounting behaviour, components must externally track when some logic has run, if it really really must only ever run once. Tricky to get right for components that may have multiple instance rendered simultaneously at different parts of a page.


// Note: There is an alternative clean-state implementation that uses a single useState call and passes the clean state instance.
// Then when a state setter is used, it mutates the cleanstate object, then calls setState on the updated cleanstate.
// But setState might ignore calls with the same object ref as the existing state value, so perhaps create a new cleanstate
// instance instead, spreading existing values with the changed values, and call setState with that.
// It could be more performant as it would remove the need for looping over Object.keys in useCleanState.
// Investigate this for a potential minor version update.


