const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/

function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNonNegativeInteger(value) {
  return Number.isInteger(value) && value >= 0
}

function isPositiveInteger(value) {
  return Number.isInteger(value) && value > 0
}

function isISODate(value) {
  return typeof value === 'string'
    && ISO_DATE_PATTERN.test(value)
    && !Number.isNaN(Date.parse(value))
}

function hasValidOptionalDates(value) {
  return (value.createdAt === undefined || isISODate(value.createdAt))
    && (value.updatedAt === undefined || isISODate(value.updatedAt))
}

export function isCounterData(value) {
  return Array.isArray(value) && value.every(item => isObject(item)
    && isPositiveInteger(item.id)
    && typeof item.title === 'string'
    && isNonNegativeInteger(item.times)
    && (item.site === undefined || typeof item.site === 'string')
    && hasValidOptionalDates(item))
}

export function isVisitorData(value) {
  return Array.isArray(value) && value.every(item => isObject(item)
    && typeof item.referrer === 'string'
    && isNonNegativeInteger(item.times)
    && hasValidOptionalDates(item))
}

export function isLikeData(value) {
  return isObject(value)
    && isNonNegativeInteger(value.count)
    && hasValidOptionalDates(value)
}

export function parseGistFile(files, fileName, validate) {
  const file = files?.[fileName]
  if (!file)
    throw new Error(`Gist file ${fileName} is missing`)
  if (file.truncated)
    throw new Error(`Gist file ${fileName} is truncated`)
  if (typeof file.content !== 'string' || file.content.trim() === '')
    throw new Error(`Gist file ${fileName} has no content`)

  let parsed
  try {
    parsed = JSON.parse(file.content)
  }
  catch {
    throw new Error(`Gist file ${fileName} contains invalid or truncated JSON`)
  }
  if (!validate(parsed))
    throw new Error(`Gist file ${fileName} has an invalid data structure`)
  return parsed
}

export function incrementCounter(counters, { postNumber, title, site, now }) {
  const next = structuredClone(counters)
  const index = next.findIndex(item => item.id === postNumber)
  if (index === -1) {
    next.push({
      id: postNumber,
      site,
      times: 1,
      title,
      createdAt: now,
      updatedAt: now,
    })
  }
  else {
    next[index] = {
      ...next[index],
      times: next[index].times + 1,
      updatedAt: now,
    }
  }
  return next
}

export function incrementVisitor(visitors, { referrer, now }) {
  const next = structuredClone(visitors)
  const index = next.findIndex(item => item.referrer === referrer)
  if (index === -1) {
    next.push({
      referrer,
      times: 1,
      createdAt: now,
      updatedAt: now,
    })
  }
  else {
    next[index] = {
      ...next[index],
      times: next[index].times + 1,
      updatedAt: now,
    }
  }
  return next
}

export function incrementLike(like, now) {
  return {
    ...structuredClone(like),
    count: like.count + 1,
    createdAt: like.createdAt || now,
    updatedAt: now,
  }
}

export function assertCountersNotRegressed(known, remote) {
  if (!isCounterData(known) || known.length === 0)
    return
  const remoteById = new Map(remote.map(item => [item.id, item]))
  if (known.some(item => !remoteById.has(item.id) || remoteById.get(item.id).times < item.times))
    throw new Error('counter.json is older than the last confirmed local state')
}

export function assertVisitorsNotRegressed(known, remote) {
  if (!isVisitorData(known) || known.length === 0)
    return
  const remoteByReferrer = new Map(remote.map(item => [item.referrer, item]))
  if (known.some(item => !remoteByReferrer.has(item.referrer) || remoteByReferrer.get(item.referrer).times < item.times))
    throw new Error('visitor.json is older than the last confirmed local state')
}

export function assertLikeNotRegressed(known, remote) {
  if (isLikeData(known) && remote.count < known.count)
    throw new Error('like.json is older than the last confirmed local state')
}
