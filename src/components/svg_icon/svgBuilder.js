import { readFileSync, readdirSync } from 'node:fs'

let idPrefix = ''
const svgTitle = /<svg([^>+].*?)>/
const fillReg = /fill="([^>+].*?)"/g
const clearHeightWidth = /(width|height)="([^>+].*?)"/g
// 需要替换的颜色
const clearColors = ['#333333', '#303135']

const hasViewBox = /(viewBox="[^>+].*?")/g

const clearReturn = /(\r)|(\n)/g

function findSvgFile(dir) {
  const svgRes = []
  const dirEntries = readdirSync(dir, {
    withFileTypes: true,
  })
  for (const dirEntry of dirEntries) {
    if (dirEntry.isDirectory()) {
      svgRes.push(...findSvgFile(`${dir + dirEntry.name}/`))
    }
    else {
      let svg = readFileSync(dir + dirEntry.name)
        .toString()
        .replace(clearReturn, '')
        .replace(svgTitle, ($1, $2) => {
          let width = 0
          let height = 0
          let content = $2.replace(clearHeightWidth, (s1, s2, s3) => {
            if (s2 === 'width')
              width = s3

            else if (s2 === 'height')
              height = s3

            return ''
          })
          if (!hasViewBox.test($2))
            content += `viewBox="0 0 ${width} ${height}"`

          return `<symbol id="${idPrefix}-${dirEntry.name.replace('.svg', '')}" ${content}>`
        })
        .replace('</svg>', '</symbol>')
      // 处理单色图标，将 fill 属性替换为 currentColor
      const svgFills = svg.match(fillReg)
      if (svgFills && svgFills.length > 0) {
        if (svgFills.every(match => match === svgFills[0]) || svgFills.length === 1) { svg = svg.replace(fillReg, 'fill="currentColor"') }
        // 处理多色图标，匹配到需要替换的颜色，替换为 currentColor
        else {
          svg = svg.replace(fillReg, (s1, s2) => {
            if (clearColors.includes(s2))
              return 'fill="currentColor"'
            return s1
          })
        }
      }
      svgRes.push(svg)
    }
  }
  return svgRes
}

export function svgBuilder(path, prefix = 'icon') {
  if (path === '')
    return
  idPrefix = prefix
  const res = findSvgFile(path)

  return {
    name: 'svg-transform',
    transformIndexHtml(html) {
      return html.replace(
        '<body>',
          `
          <body>
            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="display: none">
              ${res.join('')}
            </svg>
        `,
      )
    },
  }
}
