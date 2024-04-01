/* eslint-disable max-statements-per-line */
import { Marked } from 'marked'
import { markedSmartypants } from 'marked-smartypants'
import hljs from 'highlight.js'
import subscript from './extensions/subscript.js'
import superscript from './extensions/superscript.js'
import { markedHighlight } from './extensions/marked_highlight.js'
import 'highlight.js/styles/monokai-sublime.css'

const marked = new Marked()
const tocObj = {
  add(text, level) {
    const anchor = `toc${level}${++this.index}`
    this.toc.push({ anchor, level, text })
    return anchor
  },
  toHTML() {
    const levelStack = []
    let result = ''
    const addStartUL = () => { result += '<ul class="anchor-ul" id="anchor-fix">' }
    const addEndUL = () => { result += '</ul>\n' }
    const addLI = (anchor, text, className) => {
      text = text.replace(/<\/?a[^>]*>/gi, '')
      className = className || ''
      return result += `<li><a class="toc-link ${className}" href="#${anchor}">${text}<a></li>\n`
    }

    this.toc.forEach((item) => {
      let levelIndex = levelStack.indexOf(item.level)
      // 没有找到相应level的ul标签，则将li放入新增的ul中
      if (levelIndex === -1) {
        levelStack.unshift(item.level)
        addStartUL()
        if (item.anchor.indexOf('1') && item.level <= 2)
          addLI(item.anchor, item.text, 'active')
        else
          addLI(item.anchor, item.text)
      } // 找到了相应level的ul标签，并且在栈顶的位置则直接将li放在此ul下
      else if (levelIndex === 0) {
        addLI(item.anchor, item.text)
      } // 找到了相应level的ul标签，但是不在栈顶位置，需要将之前的所有level出栈并且打上闭合标签，最后新增li
      else {
        while (levelIndex--) {
          levelStack.shift()
          addEndUL()
        }
        addLI(item.anchor, item.text)
      }
    })
    // 如果栈中还有level，全部出栈打上闭合标签
    while (levelStack.length) {
      levelStack.shift()
      addEndUL()
    }
    // 清理先前数据供下次使用
    this.toc = []
    this.index = 0
    return result
  },
  toc: [],
  index: 0,
}

class MarkIt {
  constructor() {
    this.rendererMD = new marked.Renderer()
    this.rendererMD.html = (html) => {
      return html
    }
    this.rendererMD.heading = (text, level, raw) => {
      const anchor = tocObj.add(text, level)
      return `<h${level} id=${anchor}>${text}</h${level}>\n`
    }
    this.rendererMD.paragraph = (text) => {
      if (!text.includes('<figure'))
        return `<p class="post-paragraph">${text}</p>`
      return text
    }
    this.rendererMD.hr = () => {
      return '<hr class="post-hr" />'
    }
    this.rendererMD.blockquote = (quote) => {
      return `<blockquote class="blockquote">${quote}</blockquote>`
    }
    this.rendererMD.list = (body, ordered, start) => {
      const type = ordered ? 'ol' : 'ul'
      const startatt = (ordered && start !== 1) ? (` start="${start}"`) : ''
      return `<${type}${startatt} class="${type}-list">\n${body}</${type}>\n`
    }
    this.rendererMD.listitem = (text, task, checked) => {
      if (task)
        return `<li class="list-item"><input type="checkbox" id="task-list-item-checkbox" ${checked ? 'checked' : ''} /><label for="task-list-item-checkbox">${text}</label></li>`
      return `<li class="list-item">${text}</li>`
    }
    this.rendererMD.checkbox = () => {
      return ''
    }
    this.rendererMD.image = (href, title, text) => {
      const imgEl = text ? `<figure class="picture-wrap"><img src="${href}" alt="${text}" loading="lazy" /><figcaption>${text}</figcaption></figure>` : `<img src="${href}" alt="文章配图" loading="lazy" />`
      return imgEl
    }
    this.rendererMD.link = (href, title, text) => {
      const isExternal = href.startsWith('http') || href.startsWith('//')
      const origin = window.location.origin
      const openInNewTab = (isExternal && !href.startsWith(origin)) ? 'target="_blank"' : ''
      return `<a href="${href}" title="${title || ''}" ${openInNewTab}>${text}</a>`
    }
    this.rendererMD.del = (text) => {
      return `<del class="del"><span>${text}</span></del>`
    }
    this.rendererMD.codespan = (code) => {
      return `<code class="code-inline">${code}</code>`
    }
    this.rendererMD.text = (text) => {
      const regexMark = /==([^=]+)==/g
      return text.replace(regexMark, '<mark>$1</mark>')
    }
    marked.use(markedHighlight({
      async: true,
      highlight(code, lang) {
        return new Promise((resolve, reject) => {
          const language = hljs.getLanguage(lang) ? lang : 'plaintext'
          const html = hljs.highlight(code, { language }).value
          if (html)
            resolve(html)
          else
            reject(new Error('no highlight'))
        })
      },
    }))
    marked.use({
      renderer: this.rendererMD,
      headerIds: false,
      gfm: true,
      tables: true,
      breaks: false,
      mangle: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      extensions: [
        superscript,
        subscript,
      ],
    },
    markedSmartypants())
  }

  async parse(data) {
    if (data) {
      // 处理零宽字符
      // eslint-disable-next-line no-misleading-character-class
      data = data.replace(/^[\u200B\u200C\u200D\u200E\u200F\uFEFF]/, '')
      const content = await marked.parse(data)
      const toc = tocObj.toHTML()
      return { content, toc }
    }
    else {
      return null
    }
  }
}

export default MarkIt
