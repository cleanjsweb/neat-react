
export const canIndex = (key: keyof any, targetObject: any): key is keyof typeof targetObject => {
	return Reflect
		.ownKeys(targetObject)
		.includes(typeof key === 'number' ? `${key}` : key)
	;
};
