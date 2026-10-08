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
} from './gistData.mjs'
import { getGistAPI, updateGistAPI } from '@/api/gist.js'

const FILES = {
  counter: { name: 'counter.json', validate: isCounterData },
  visitor: { name: 'visitor.json', validate: isVisitorData },
  like: { name: 'like.json', validate: isLikeData },
}

const memoryQueues = new Map()
const recordedPosts = new Set()
const pendingCounters = new Map()
let visitorPromise = null
let likePromise = null

function state() {
  return {
    counter: [],
    visitor: [],
    like: {},
  }
}

const mutations = {
  setCounter(currentState, counter) {
    currentState.counter = structuredClone(counter)
  },
  setVisitor(currentState, visitor) {
    currentState.visitor = structuredClone(visitor)
  },
  setLike(currentState, like) {
    currentState.like = structuredClone(like)
  },
}

async function withMemoryLock(file, task) {
  const previous = memoryQueues.get(file) || Promise.resolve()
  let release
  const current = new Promise((resolve) => {
    release = resolve
  })
  memoryQueues.set(file, current)
  await previous
  try {
    return await task()
  }
  finally {
    release()
    if (memoryQueues.get(file) === current)
      memoryQueues.delete(file)
  }
}

async function withStatisticsLock(file, task) {
  if (typeof navigator !== 'undefined' && navigator.locks)
    return navigator.locks.request(`ethereal-gist-${file}`, task)
  return withMemoryLock(file, task)
}

function parseFile(files, type) {
  const { name, validate } = FILES[type]
  return parseGistFile(files, name, validate)
}

async function readGistFile(type) {
  const response = await getGistAPI()
  return parseFile(response?.data?.files, type)
}

function assertNotRegressed(type, known, remote) {
  if (type === 'counter')
    assertCountersNotRegressed(known, remote)
  else if (type === 'visitor')
    assertVisitorsNotRegressed(known, remote)
  else
    assertLikeNotRegressed(known, remote)
}

async function persistGistFile(type, data) {
  const fileName = FILES[type].name
  const content = JSON.stringify(data)
  const response = await updateGistAPI({
    files: {
      [fileName]: { content },
    },
  })
  const saved = parseFile(response?.data?.files, type)
  if (JSON.stringify(saved) !== content)
    throw new Error(`Gist PATCH response did not confirm ${fileName}`)
  return saved
}

const actions = {
  async getGistAction({ state: currentState, commit }, { files = Object.keys(FILES) } = {}) {
    const response = await getGistAPI()
    const result = {}
    for (const type of files) {
      if (!FILES[type])
        throw new Error(`Unknown Gist statistics file: ${type}`)
      const data = parseFile(response?.data?.files, type)
      assertNotRegressed(type, currentState[type], data)
      commit(`set${type[0].toUpperCase()}${type.slice(1)}`, data)
      result[type] = structuredClone(data)
    }
    return result
  },

  async updateCounterAction({ state: currentState, commit }, { postNumber, title }) {
    if (import.meta.env.DEV)
      return structuredClone(currentState.counter)

    postNumber = Number(postNumber)
    if (!Number.isInteger(postNumber) || postNumber <= 0)
      throw new Error('Post number must be a positive integer')
    if (recordedPosts.has(postNumber))
      return structuredClone(currentState.counter)
    if (pendingCounters.has(postNumber))
      return pendingCounters.get(postNumber)

    const operation = withStatisticsLock('counter', async () => {
      const remote = await readGistFile('counter')
      assertNotRegressed('counter', currentState.counter, remote)
      const next = incrementCounter(remote, {
        postNumber,
        title: String(title || ''),
        site: window.location.href,
        now: new Date().toISOString(),
      })
      const saved = await persistGistFile('counter', next)
      commit('setCounter', saved)
      recordedPosts.add(postNumber)
      return structuredClone(saved)
    }).finally(() => {
      pendingCounters.delete(postNumber)
    })
    pendingCounters.set(postNumber, operation)
    return operation
  },

  async updateVisitorAction({ state: currentState, commit }, { referrer }) {
    if (import.meta.env.DEV)
      return structuredClone(currentState.visitor)
    if (!visitorPromise) {
      visitorPromise = withStatisticsLock('visitor', async () => {
        const remote = await readGistFile('visitor')
        assertNotRegressed('visitor', currentState.visitor, remote)
        const next = incrementVisitor(remote, {
          referrer: String(referrer || '').trim(),
          now: new Date().toISOString(),
        })
        const saved = await persistGistFile('visitor', next)
        commit('setVisitor', saved)
        return structuredClone(saved)
      })
    }
    return visitorPromise
  },

  async updateLikeAction({ state: currentState, commit }) {
    if (import.meta.env.DEV)
      return isLikeData(currentState.like) ? currentState.like.count : 0
    if (!likePromise) {
      likePromise = withStatisticsLock('like', async () => {
        const remote = await readGistFile('like')
        assertNotRegressed('like', currentState.like, remote)
        const next = incrementLike(remote, new Date().toISOString())
        const saved = await persistGistFile('like', next)
        commit('setLike', saved)
        return saved.count
      }).finally(() => {
        likePromise = null
      })
    }
    return likePromise
  },
}

export default {
  namespaced: true,
  state,
  mutations,
  actions,
}
