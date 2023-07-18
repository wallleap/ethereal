export default {
  name: 'subscript',
  level: 'inline',
  start(src) { return src.indexOf('~') },
  tokenizer(src) {
    const match = src.match(/^~(\w+)~/)

    if (!match)
      return

    return {
      type: 'subscript',
      raw: match[0],
      text: match[1],
    }
  },
  renderer(token) {
    return `<sub>${token.text}</sub>`
  },
}
