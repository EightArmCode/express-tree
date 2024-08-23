import { RequestHandler } from 'express'
import asyncHandler from 'express-async-handler'

export function asyncMiddleware(asyncEndpointHandler: AsyncHandler) {
  return asyncHandler(asyncEndpointHandler)
}

// duplicated some types here for ease of use
// from Express core and 'express-async-handler'
export type AsyncHandler<
  P = ParamsDictionary,
  ResBody = unknown,
  ReqBody = unknown,
  ReqQuery = Query
> = (...args: Parameters<RequestHandler<P, ResBody, ReqBody, ReqQuery>>) => void | Promise<void>

type ParamsDictionary = Record<string, string>

interface ParsedQs {
  [key: string]: undefined | string | string[] | ParsedQs | ParsedQs[];
}

type Query = ParsedQs

