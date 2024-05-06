import { createLogger, format, transports } from 'winston'
import 'winston-daily-rotate-file'

// const isProd = process.env.NODE_ENV === 'production'

export const getLogger = () => {
  const consoleTransport = new transports.Console({
    level: 'http',
    format: format.combine(
      format.colorize({ all: true }),
      format.splat(),
      format.simple(),
      format.errors({ stack: true }),
      format.printf(
        ({ timestamp, level, message }) => `${timestamp} - ${level}: ${message}`
      )
    ),
  })

  const fileErrorTransport = new transports.DailyRotateFile({
    filename: 'app/lib/logging/logs/error.log',
    level: 'error',
    format: format.combine(format.json(), format.timestamp()),
    maxFiles: '1',
    maxSize: '1m',
  })

  const fileCombinedTransport = new transports.DailyRotateFile({
    filename: 'app/lib/logging/logs/combined.log',
    format: format.combine(format.json(), format.timestamp()),
    level: /**isProd ? 'info' :*/ 'debug',
  })

  const logger = createLogger({
    level: 'info',
    format: format.combine(
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      format.errors({ stack: true }),
      format.printf((msg) => `[${msg.level}] ${msg.message}`)
    ),
    transports: [fileErrorTransport, fileCombinedTransport],
  })

  // if (!isProd) {
  logger.add(consoleTransport)
  // }

  return logger
}
