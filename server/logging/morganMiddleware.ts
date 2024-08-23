import Morgan, { StreamOptions } from 'morgan'
import Logger from './winstonLogger.ts'

const stream: StreamOptions = {
  write: (message) => Logger.http(message),
}

const skip = () => {
  const env = process.env.NODE_ENV ?? 'development'

  return env !== 'development'
}

const morganMiddleware = Morgan('combined', { stream, skip })

export default morganMiddleware
