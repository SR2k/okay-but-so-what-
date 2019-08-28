interface ICloneDeepCache<T> {
  raw: T
  copied: T
}

/**
 * 深拷贝，无法拷贝数组
 * @param object
 * @param cache
 */
function cloneDeep<T>(object: T, cache: ICloneDeepCache<any>[] = []): T {
  if (!object || typeof object !== 'object') {
    return object
  }

  for (const { raw, copied } of cache) {
    if (raw === object) return copied
  }

  const result: T = <T>{}
  cache.push({
    raw: object,
    copied: result,
  })

  for (const [key, value] of Object.entries(object)) {
    // @ts-ignore
    result[key] = cloneDeep(value, cache)
  }

  return <T>result
}
