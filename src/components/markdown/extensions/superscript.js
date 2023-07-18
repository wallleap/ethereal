export default {
  name: 'superscript',
  level: 'inline',
  start(src) { return src.indexOf('^') },
  tokenizer(src) {
    const match = src.match(/^\^(\w+)\^/)

    if (!match)
      return

    return {
      type: 'superscript',
      raw: match[0],
      text: match[1],
    }
  },
  renderer(token) {
    return `<sup>${token.text}</sup>`
  },
}
