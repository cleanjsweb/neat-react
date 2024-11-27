
export * from '@/classy';



// PS: Document component inheritance pattern with lifecycle callback arrays and namespaces.
// Due to react's remounting behaviour, components must externally track when some logic has run,
// if it really really must only ever run once per mounted instance. Tricky to get right for components that may have multiple instance rendered simultaneously at different parts of a page.


// useCleanState => useState, separate call for each key
// useMergedState => useState, same call for all keys
// useMethods => useCallback
// useLogic => useCallback + all other hook calls.
// useInstance => useLogic + lifecycle methods.

/* 
- Write usage doc
- Push to git and publish to site
	- Follow-up personal post on class component inheritance can be published on GH Pages from profile repo.
- Publish to NPM
- Finalize package and repo names, then post to Twitter.
*/

/* 
withFetchApi(baseUrl); To mimic axios.get and axios.post type calls.
@cleanweb/mem-store - Release global-store package here.
Use mem-store to cache requests in createApi(); Use md5 hashed url as key.
@todo Add simple persistence layer with indexed db.
@cleanweb/subscribable - To publish changes in the data to subscribers.
@cleanweb/reactive-data - To combine all 4.
*/
