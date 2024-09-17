import type { SpawnOptionsWithStdioTuple, StdioNull } from 'child_process';

import { spawn } from 'child_process';
import { version } from '../package.json';

type TSpawnOptions = SpawnOptionsWithStdioTuple<StdioNull, StdioNull, StdioNull>;
const spawnOptions: TSpawnOptions = {
	stdio: ['inherit', 'inherit', 'inherit'],
	shell: true,
};

const bumpVersionToMatch = `npm version ${version}`;
spawn(bumpVersionToMatch, [], spawnOptions);
