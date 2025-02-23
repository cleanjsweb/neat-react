
interface OoreInstanceForHMR {
	hmrPreserveKeys?: Array<keyof this>,
	hmrConstructorParams?: any[],
	hmrWillUpdate: (newInstance: OoreInstanceForHMR) => void,
	hmrDidUpdate: (oldInstance: OoreInstanceForHMR) => void,
}

interface OoreClassForHMR {
	new (...params: any[]): OoreInstanceForHMR,
	instances: InstanceType<OoreClassForHMR>[],
}

declare global {
	interface Window {
		// __OBJECT_ORIENTED_REACT__: {},

		handleOoreHmr: (
			Class: OoreClassForHMR,
			module: { hot?: __WebpackModuleApi.Hot },
			name?: string,
		) => void,
	}
}

// window.__OBJECT_ORIENTED_REACT__ = window.__OBJECT_ORIENTED_REACT__ || {};

if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
	window.handleOoreHmr = (Class, module, name) => {
		type OoreInstancesRecord = Record<string, {
			instances: Array<OoreInstanceForHMR>,
		}>;

		type OoreModuleHotData = {
			ooreClasses: OoreInstancesRecord,
		}

		const classKey = name || Class.name;

		module.hot?.dispose((data: OoreModuleHotData) => {
			data.ooreClasses[classKey] = { instances: Class.instances };
		});

		console.log('New module instances:', Class.instances.length);

		const Classes = module.hot?.data.ooreClasses as OoreInstancesRecord;

		if (!Classes[classKey]) {
			console.warn([
				`New component "${Class.name}" detected.\n\nIf this`,
				'component was renamed, oore will be unable to match it',
				'with the previous name, and a reload may be necessary.',
				'You can pass the name argument to the hmr handler',
				'to ensure a consistent identifier for your component',
				'class across renames and therefore bypass this issue.',
			].join(' '));
			return;
		}

		const { instances } = Classes[classKey];

		instances.forEach((instance) => {
			const newInstance = new Class(...(instance.hmrConstructorParams ?? []));
			instance.hmrPreserveKeys?.forEach((_key) => {
				const key = _key as keyof typeof newInstance;

				// @ts-expect-error Typescript doesn't realize that since both sides have the same key, the value type being assigned will always match the property type it's assigned to.
				newInstance[key] = instance[key];
			});
			// instance.hotReplace(newInstance);
			instance.hmrWillUpdate?.(newInstance);
			newInstance.hmrDidUpdate?.(instance);
		});

		console.log('Updated module instances (max 3):', Class.instances.slice(0, 3));
	};
}
