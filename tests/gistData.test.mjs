import assert from 'node:assert/strict'
import test from 'node:test'
import {
  assertCountersNotRegressed,
  assertLikeNotRegressed,
  assertVisitorsNotRegressed,
  incrementCounter,
  incrementLike,
  incrementVisitor,
  isCounterData,
  isLikeData,
  isVisitorData,
  parseGistFile,
} from '../src/store/modules/gistData.mjs'

const now = '2026-10-08T01:00:00.000Z'
const counter = {
  id: 1,
  title: 'Post',
  site: 'https://example.com/post/1',
  times: 2,
  createdAt: now,
  updatedAt: now,
}
const visitor = {
  referrer: '直接访问',
  times: 2,
  createdAt: now,
  updatedAt: now,
}
const like = {
  count: 2,
  createdAt: now,
  updatedAt: now,
}

test('valid empty statistics are distinct from missing and damaged files', () => {
  assert.deepEqual(parseGistFile({ 'counter.json': { content: '[]' } }, 'counter.json', isCounterData), [])
  assert.throws(() => parseGistFile({}, 'counter.json', isCounterData), /missing/)
  assert.throws(
    () => parseGistFile({ 'counter.json': { content: '[]', truncated: true } }, 'counter.json', isCounterData),
    /truncated/,
  )
  assert.throws(
    () => parseGistFile({ 'counter.json': { content: '[{"id":1}' } }, 'counter.json', isCounterData),
    /invalid or truncated JSON/,
  )
})

test('counter, visitor and like structures reject invalid values', () => {
  assert.equal(isCounterData([counter]), true)
  assert.equal(isCounterData([{ ...counter, times: -1 }]), false)
  assert.equal(isCounterData([{ ...counter, title: 1 }]), false)
  assert.equal(isVisitorData([visitor]), true)
  assert.equal(isVisitorData([{ ...visitor, times: 1.5 }]), false)
  assert.equal(isVisitorData([{ ...visitor, updatedAt: 'yesterday' }]), false)
  assert.equal(isLikeData(like), true)
  assert.equal(isLikeData({ ...like, count: -1 }), false)
  assert.equal(isLikeData([]), false)
})

test('increments create independent copies without mutating confirmed data', () => {
  const counters = [counter]
  const visitors = [visitor]
  const nextCounters = incrementCounter(counters, {
    postNumber: 1,
    title: 'Post',
    site: counter.site,
    now,
  })
  const nextVisitors = incrementVisitor(visitors, { referrer: visitor.referrer, now })
  const nextLike = incrementLike(like, now)

  assert.equal(counters[0].times, 2)
  assert.equal(visitors[0].times, 2)
  assert.equal(like.count, 2)
  assert.equal(nextCounters[0].times, 3)
  assert.equal(nextVisitors[0].times, 3)
  assert.equal(nextLike.count, 3)
})

test('new records use valid initial structures', () => {
  const counters = incrementCounter([], {
    postNumber: 2,
    title: 'New post',
    site: 'https://example.com/post/2',
    now,
  })
  const visitors = incrementVisitor([], { referrer: 'example.com', now })

  assert.equal(isCounterData(counters), true)
  assert.equal(isVisitorData(visitors), true)
  assert.equal(counters[0].times, 1)
  assert.equal(visitors[0].times, 1)
})

test('known newer local statistics reject older remote snapshots', () => {
  assert.doesNotThrow(() => assertCountersNotRegressed([counter], [{ ...counter, times: 3 }]))
  assert.throws(() => assertCountersNotRegressed([counter], [{ ...counter, times: 1 }]), /older/)
  assert.throws(() => assertCountersNotRegressed([counter], []), /older/)

  assert.doesNotThrow(() => assertVisitorsNotRegressed([visitor], [{ ...visitor, times: 3 }]))
  assert.throws(() => assertVisitorsNotRegressed([visitor], [{ ...visitor, times: 1 }]), /older/)

  assert.doesNotThrow(() => assertLikeNotRegressed(like, { ...like, count: 3 }))
  assert.throws(() => assertLikeNotRegressed(like, { ...like, count: 1 }), /older/)
})
