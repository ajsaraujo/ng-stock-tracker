import { Observable, share, shareReplay } from 'rxjs'

type GetCacheKeyFn = (...args: any[]) => string

const defaultGetCacheKeyFn = (...args: any[]) =>
  args.length > 0 ? String(args[0][0]) : ''

const caches: Record<string, Map<string, unknown>> = {}

export const Cache = (
  cacheName: string,
  getKey: GetCacheKeyFn = defaultGetCacheKeyFn
) => {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    if (!caches[cacheName]) {
      caches[cacheName] = new Map()
    }

    const cache = caches[cacheName]

    const childFunction = descriptor.value

    descriptor.value = function (...args: any[]) {
      const key = getKey(args)

      if (!cache.has(key)) {
        let returnValue = childFunction.apply(this, args)

        if (returnValue instanceof Observable) {
          returnValue = returnValue.pipe(shareReplay(1))
        }

        cache.set(key, returnValue)
      }

      return cache.get(key)
    }

    return descriptor
  }
}
