import { existsSync } from 'fs';

export const checkConfigFile = (
  path: string
): void => {
  if (!existsSync(path)) {
    console.log('File Not Found');
    process.exit(1);
  }
};
