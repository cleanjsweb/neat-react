
export * from "@/classy";



// PS: Document component inheritance pattern with lifecycle callback arrays and namespaces.

// Due to react's remounting behaviour, components must externally track when some logic has run, if it really really must only ever run once per mounted instance. Tricky to get right for components that may have multiple instance rendered simultaneously at different parts of a page.

// Create state instance.
// Retrieve updated state values and setters.
// Call static CleanState function to apply state values and setters on the cleanState instance.
// CleanState.update.apply(instance, valuesAndSetters);

// Note: There is an alternative clean-state implementation that uses a single useState call and passes the clean state instance.
// Then when a state setter is used, it mutates the cleanstate object, then calls setState on the updated cleanstate.
// But setState might ignore calls with the same object ref as the existing state value, so perhaps create a new cleanstate
// instance instead, spreading existing values with the changed values, and call setState with that.
// It could be more performant as it would remove the need for looping over Object.keys in useCleanState.
// Investigate this for a potential minor version update.


// useCleanState => useState
// useMethods => useCallback
// useLogic => useCallback + all other hook calls.
// useInstance => useLogic + lifecycle methods.

