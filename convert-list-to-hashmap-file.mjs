import fs from 'node:fs';
import util from 'node:util';

import objectList from './data.json';

const directAccessObject = {};
const countriesList = [];

const stringifyOptions = {
	compact: false,
	depth: Infinity,
	breakLength: 80,
	numericSeparator: true,
	maxArrayLength: Infinity,
	maxStringLength: Infinity,
	sorted: false,
};

// Sort by country code.
const list = objectList.sort((a, b) => a.country_name.localeCompare(b.country_name));

list.forEach((countryObject) => {
	directAccessObject[countryObject.alpha2] = countryObject;
	countriesList.push(countryObject.alpha2);
});

fs.writeFileSync('./data2.js', `export default ${util.inspect(
	directAccessObject,
	stringifyOptions
)};\n`);

fs.writeFileSync('./countries2.js', `export default ${util.inspect(
	// Sort by country name.
	countriesList.sort((a, b) => a.localeCompare(b)),
	{
		...stringifyOptions,
		compact: 10,
		breakLength: 60,
	}
)};\n`);
