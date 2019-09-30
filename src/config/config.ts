import { config } from 'dotenv';
import { checkConfigFile } from './checkConfigFile';

const { log } = console;

export const loadConfig = async (
  path: string
): Promise<void> => {
  checkConfigFile(path);

  const { error, parsed } = await config({ path });
  if (error) {
    log(error.message);
    process.exit(0);
  }

  log('environmental variables: ');
  log(JSON.stringify(parsed, undefined, 2));
  log();

};
