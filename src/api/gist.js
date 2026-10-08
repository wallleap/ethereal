import { gist } from '../utils/request'

const GIST_ID = import.meta.env.VITE_GIST_ID || ''

/*
 * 请求 Gist
 * @param {*} method 请求方法 'get' | 'patch'
 * @param {*} params 请求参数
 * @returns promise
 */
function createGistError(operation, error) {
  const status = error?.response?.status || null
  const statusLabel = status || 'network/configuration'
  const safeError = new Error(`Gist ${operation} request failed (status: ${statusLabel})`)
  safeError.operation = operation
  safeError.status = status
  return safeError
}

function reportGistError(error) {
  const status = error.status || 'network/configuration'
  console.error(`[Gist ${error.operation}] request failed (status: ${status})`)
}

function assertGistConfigured(operation) {
  if (GIST_ID)
    return
  const error = createGistError(operation)
  reportGistError(error)
  throw error
}

async function getGistAPI() {
  assertGistConfigured('GET')
  try {
    return await gist.get(`/${GIST_ID}`)
  }
  catch (error) {
    const safeError = createGistError('GET', error)
    reportGistError(safeError)
    throw safeError
  }
}

async function updateGistAPI(params) {
  assertGistConfigured('PATCH')
  try {
    return await gist.patch(`/${GIST_ID}`, params)
  }
  catch (error) {
    const safeError = createGistError('PATCH', error)
    reportGistError(safeError)
    throw safeError
  }
}

export { getGistAPI, updateGistAPI }
