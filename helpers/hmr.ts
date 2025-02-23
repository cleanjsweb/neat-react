import { canIndex } from "./type-guards";

interface BaseInstanceForHMR {
	hmrPreserveKeys: Array<keyof this>,
	constructorParams: any[],
}

interface BaseClassForHMR {
	new (...params: any[]): BaseInstanceForHMR,

	instances: InstanceType<BaseClassForHMR>[],
}

interface OoreInstanceForHMR extends BaseInstanceForHMR {
	state: any,
	props: any,
	hooks?: any,
	forceUpdate: () => void,
	hotReplace: (newInstance: OoreInstanceForHMR) => void,
}

interface OoreClassForHMR {
	new (...params: any[]): OoreInstanceForHMR,
	instances: InstanceType<OoreClassForHMR>[],
}

declare global {
	interface Window {
		// __OBJECT_ORIENTED_REACT__: {},

		handleClassHmr: (
			Class: BaseClassForHMR,
			module: { hot?: __WebpackModuleApi.Hot },
			name?: string,
		) => void,

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
			const newInstance = new Class();
			instance.hmrPreserveKeys.forEach((_key) => {
				const key = _key as (typeof instance.hmrPreserveKeys)[number];

				newInstance[key] = instance[key];
			});
			instance.hotReplace(newInstance);
		});

		console.log('Updated module instances (max 3):', Class.instances.slice(0, 3));
	};

	window.handleClassHmr = (Class, module, name) => {
		type BaseInstancesRecord = Record<string, {
			instances: Array<BaseInstanceForHMR>,
		}>;

		type HotData = {
			ooreClasses: BaseInstancesRecord,
		}

		const classKey = name || Class.name;

		module.hot?.dispose((dataToSend: HotData) => {
			dataToSend.ooreClasses[classKey] = { instances: Class.instances };
			// Class.onHmrDispose(dataToSend.ooreClasses[classKey]);
		});

		console.log('New module instances:', Class.instances.length);

		const Classes = module.hot?.data.ooreClasses as BaseInstancesRecord;

		if (!Classes[classKey]) {
			console.warn([
				`New class "${Class.name}" detected.\n\nIf this`,
				'class was renamed, oore will be unable to match it',
				'with the previous name, and a reload may be necessary.',
				'You can pass the name argument to the hmr handler',
				'to ensure a consistent identifier for your class',
				'class across renames and therefore bypass this issue.',
			].join(' '));
			return;
		}

		const { instances } = Classes[classKey];

		instances.forEach((instance) => {
			// Class.onHmrUpdate(instance, Classes[classKey]);

			const newInstance = new Class(...instance.constructorParams);
			Reflect.ownKeys(newInstance).forEach((key) => {
				// @todo Change to Class.hmrPreserveKeys;
				if (instance.hmrPreserveKeys.includes(key as keyof typeof instance)) return;
				instance[key as keyof typeof instance] = newInstance[key as keyof typeof instance];
			});
			Object.setPrototypeOf(newInstance, instance);
		});

		console.log('Updated module instances:', Class.instances.length);
	};
}
