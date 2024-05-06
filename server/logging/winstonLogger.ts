import winston, { createLogger, format, transports } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'
import { env } from '../index.ts'

const isProd = env === 'production'
const level = isProd ? 'warning' : 'debug'

const consoleTransport = new transports.Console({
  level: 'http',
  format: format.combine(
    format.colorize({ all: true }),
    format.splat(),
    format.simple(),
    format.errors({ stack: true }),
    format.printf(
      ({ timestamp, level, message }) => `${timestamp} - ${level}: ${message}`,
    ),
  ),
})

const fileErrorTransport:DailyRotateFile = new DailyRotateFile({
  filename: 'server/logging/logs/error.log',
  level: 'error',
  format: format.combine(format.json(), format.timestamp()),
  handleExceptions: true,
  handleRejections: true,
  maxFiles: '1',
  maxSize: '1m',
})

const fileCombinedTransport:DailyRotateFile = new DailyRotateFile({
  filename: 'server/logging/logs/combined.log',
  format: format.combine(format.json(), format.timestamp()),
  level: isProd ? 'warning' : 'debug',
})

const Logger = createLogger({
  level,
  // npm levels quick reference:
  // error: 0,
  // warn: 1,
  // info: 2,
  // http: 3,
  // verbose: 4,
  // debug: 5,
  // silly: 6
  levels: winston.config.npm.levels,
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.printf((msg) => `[${msg.level}] ${msg.message}`),
  ),
  transports: [ fileErrorTransport, fileCombinedTransport, consoleTransport ],
})

export default Logger
