import { gist } from "../utils/request";

const GIST_ID = import.meta.env.VITE_GIST_ID || ''

/* 
 * 请求 Gist
 * @param {*} method 请求方法 'get' | 'patch'
 * @param {*} params 请求参数
 * @returns promise
 */
async function getGistAPI() {
  return gist.get(`/${GIST_ID}`)
}

async function updateGistAPI(params) {
  return gist.patch(`/${GIST_ID}`, params)
}

export { getGistAPI, updateGistAPI }
