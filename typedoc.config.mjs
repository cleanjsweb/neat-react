/** @type {Partial<import("typedoc").TypeDocOptions>} */
const config = {
    entryPoints: ['./base', './classy', 'helpers'],
    out: 'doc',
	entryPointStrategy: 'Expand',
	// plugin: 'typedoc-plugin-markdown',
};

export default config;
