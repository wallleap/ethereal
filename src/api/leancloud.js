import AV from 'leancloud-storage'

const isDev = /^(10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|::1|127\.0\.0\.1|localhost)/.test(window.location.host)

// 文章热度
export async function queryHot(ids) {
  return new Promise((resolve) => {
    const query = new AV.Query('Counter')
    query.containedIn('id', ids)
    query
      .find()
      .then((res) => {
        const hot = {}
        res.forEach(o => (hot[o.attributes.id] = o.attributes.time))
        resolve(hot)
      })
      .catch(
        (e) => {
          resolve({})
        }
      )
  }).catch(
    (e) => {
      console.log(e)
      return {}
    }
  )
}

// 增加热度
export async function increaseHot(post) {
  return new Promise((resolve) => {
    if (isDev)
      return resolve(1)
    const query = new AV.Query('Counter')
    const Counter = AV.Object.extend('Counter')
    const { title, id } = post
    query.equalTo('id', id)
    query
      .find()
      .then((res) => {
        if (res.length > 0) {
          // 已存在则返回热度
          const counter = res[0]
          counter
            .increment('time', 1)
            .save(null, { fetchWhenSave: true })
            .then((counter) => {
              const time = counter.get('time')
              resolve(time)
            })
            .catch(console.error)
        }
        else {
          // 不存在则新建
          const newCounter = new Counter()
          newCounter.set('title', title)
          newCounter.set('id', id)
          newCounter.set('time', 1)
          newCounter.set('site', location.href)
          newCounter
            .save()
            .then(() => resolve(1))
            .catch(console.error)
        }
      })
      .catch(
        () => {
          resolve(1)
        }
      )
  }).catch(
    (e) => {
      console.error(e)
      resolve(1)
    }
  )
}

// 查询点赞数
export async function queryLike(type) {
  return new Promise((resolve) => {
    const query = new AV.Query('Counter')
    const Counter = AV.Object.extend('Counter')
    query.equalTo('title', 'site')
    query
      .first()
      .then((res) => {
        if (res) {
          if (type === 'getTimes') {
            resolve(res.get('time'))
          }
          else {
            if (!isDev) {
              res
                .increment('time', 1)
                .save(null, { fetchWhenSave: true })
                .then(counter => resolve(counter.get('time')))
                .catch(
                  () => {
                    resolve(1)
                  }
                )
            }
          }
        }
        else {
          const newCounter = new Counter()
          newCounter.set('title', 'site')
          newCounter.set('time', 1)
          newCounter.set('site', location.href)
          newCounter
            .save()
            .then(counter => resolve(counter.get('time')))
            .catch(
              () => {
                resolve(1)
              }
            )
        }
      })
      .catch(
        () => {
          resolve(1)
        }
      )
  }).catch(
    e => {
      console.error(e)
      resolve(1)
    }
  )
}

// 访问来源
export async function visitorStatistics(referrer) {
  return new Promise((resolve) => {
    if (isDev)
      return resolve()
    const query = new AV.Query('Visitor')
    const Visitor = AV.Object.extend('Visitor')
    query.equalTo('referrer', referrer)
    query
      .first()
      .then((res) => {
        if (res) {
          res
            .increment('time', 1)
            .save(null, { fetchWhenSave: true })
            .then(() => resolve())
            .catch(console.error)
        }
        else {
          const newVisitor = new Visitor()
          newVisitor.set('referrer', referrer)
          newVisitor.set('time', 1)
          newVisitor
            .save()
            .then(() => resolve())
            .catch(console.error)
        }
      })
      .catch(
        () => {
          resolve()
        }
      )
  }).catch(console.error)
}
