/** @type {Partial<import("typedoc").TypeDocOptions>} */
const config = {
	// alwaysCreateEntryPointModule: false,
    // entryPoints: [
	// 	'./base/state/hooks.ts', './base/methods.ts', './base/merged-state.ts',
	// 	'./classy/class/index.ts', './classy/instance/index.ts', './classy/logic/index.ts',
	// 	'helpers',
	// ],
    out: 'docs',
    // out: 'api-docs',
	entryPointStrategy: 'expand', // 'resolve',
	plugin: [
		// 'typedoc-plugin-markdown',
		// '@shipgirl/typedoc-plugin-versions',
		// '@8hobbies/typedoc-plugin-404',
		// 'typedoc-plugin-include-example',
		// 'typedoc-plugin-redirect',
		'typedoc-plugin-mdn-links',
		'typedoc-plugin-coverage',
	],
	"validation": {
		"notExported": true,
		"invalidLink": true,
		"rewrittenLink": true,
		"notDocumented": true,
		"unusedMergeModuleWith": true
	},
	"requiredToBeDocumented": [
		//"Project",
		"Module",
		//"Namespace",
		"Enum",     "EnumMember", "Variable",
		"Function", "Class",      "Interface",
		// "Constructor",
		"Property", "Method",
		/**
		 * Implicitly set if function/method is set (this means you can't require docs on methods, but not functions)
		 * This exists because methods/functions can have multiple signatures due to overloads, and TypeDoc puts comment
		 * data on the signature. This might be improved someday, so you probably shouldn't set this directly.
		 */
		// "CallSignature",
		/** Index signature { [k: string]: string } "properties" */
		// "IndexSignature",
		/** Equivalent to Constructor due to the same implementation detail as CallSignature */
		// "ConstructorSignature",
		// "Parameter",
		/** 
		 * Used for object literal types. You probably should set TypeAlias instead,
		 * which refers to types created with `type X =`.
		 * This only really exists because of an implementation detail.
		 */
		// "TypeLiteral",
		// "TypeParameter",
		"Accessor", // shorthand for GetSignature + SetSignature
		// "GetSignature",
		// "SetSignature",
		"TypeAlias"
		/** 
		 * TypeDoc creates reference reflections if a symbol is exported
		 * from a package with multiple names. Most projects won't have
		 * any of these, and they just render as a link to the canonical name.
		 */
		// "Reference",
	],
	// excludeNotDocumented: true,
	// "excludeNotDocumentedKinds": ["Property", "Interface", "TypeAlias"]
	// externalPattern: 'standalone-docs/**/*.md',
	exclude: "**/internal/**/*",
	projectDocuments: [/* "standalone-docs/discussion/index.md" */],
	excludeInternal: true, // Use @internal doc tag.
	// name: 'Oore',
	includeVersion: true,
	disableSources: true,
	groupReferencesByType: false,
	"navigation": {
		"includeCategories": true,
		"includeGroups": true,
		"includeFolders": true,
		"compactFolders": false,
		"excludeReferences": true,
	},
	categorizeByGroup: true,
	defaultCategory: "Default Category Name",
	// categoryOrder: ["Category Name", "Other Category", "*"],
	groupOrder: ["ComponentLogic", "*"],
	sort: [
		// "source-order",
		// "alphabetical",
		// "alphabetical-ignoring-documents",
		// "enum-value-ascending",
		// "enum-value-descending",
		// "enum-member-source-order",
		"static-first",
		// "instance-first",
		// "visibility",
		// "required-first",
		// "kind",
		"external-last",
		// "documents-first",
		"documents-last",
	],
	// sortEntryPoints: false,
	kindSortOrder: [
		"Reference",
		"Project",
		"Module",
		"Namespace",
		"Enum",
		"EnumMember",
		"Class",
		"Interface",
		"TypeAlias",
		"Constructor",
		"Property",
		"Variable",
		"Function",
		"Accessor",
		"Method",
		"Parameter",
		"TypeParameter",
		"TypeLiteral",
		"CallSignature",
		"ConstructorSignature",
		"IndexSignature",
		"GetSignature",
		"SetSignature",
	],
	highlightLanguages: ['jsx', 'tsx', 'ts', 'js', 'css', 'scss', 'html'],
};

export default config;
