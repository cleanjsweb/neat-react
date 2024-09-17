module.exports = {};

const { spawn } = require('child_process');
const { version } = require('./package.json');

const spawnOptions = {
	stdio: ['inherit', 'inherit', 'inherit'],
	shell: true,
};

const installCanonical = `npm i @cleanweb/react@${version}`;
spawn(installCanonical, [], spawnOptions);
