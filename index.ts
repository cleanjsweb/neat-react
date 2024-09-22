
export * from "@/classy";



// PS: Lifecycle arrays for component inheritance.
// PS: Use this.stateResetKey (or instanceId?) to replicate this without needed to refactor and wrap components: https://react.dev/learn/you-might-not-need-an-effect#resetting-all-state-when-a-prop-changes
// PS: beforeFirstRender() (or beforeMount), analogous to onMount (or afterFirstRender?), but runs before the mounting as it's implemented like beforeRender but with useMemo(func, []) instead of useEffect(func, []);
// Due to react's remounting behaviour, components must externally track when some logic has run, if it really really must only ever run once per mounted instance. Tricky to get right for components that may have multiple instance rendered simultaneously at different parts of a page.


// Note: There is an alternative clean-state implementation that uses a single useState call and passes the clean state instance.
// Then when a state setter is used, it mutates the cleanstate object, then calls setState on the updated cleanstate.
// But setState might ignore calls with the same object ref as the existing state value, so perhaps create a new cleanstate
// instance instead, spreading existing values with the changed values, and call setState with that.
// It could be more performant as it would remove the need for looping over Object.keys in useCleanState.
// Investigate this for a potential minor version update.


