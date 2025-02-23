
export const canIndex = (key: keyof any, targetObject: any): key is keyof typeof targetObject => {
	return key in targetObject;
};
