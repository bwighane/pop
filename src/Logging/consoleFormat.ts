import { format } from 'winston';

export const consoleFormat = format.combine(
  format.colorize({ all: true }),
  format.label({ label: '[populate]' }),
  format.timestamp({ format: 'YY-MM-DD HH:MM:SS' }),
  format.printf(info => {
    return `${info.label} ${info.timestamp} ${info.level} : ${info.message}`;
  })
);
