import { add, transports } from 'winston';
import { consoleFormat } from '.';

export const addLogging = () => {
  const console = new transports.Console({
    format: consoleFormat,
  });

  add(console);
};
