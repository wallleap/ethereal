import { readFileSync, readdirSync } from 'node:fs'

let idPrefix = ''
const svgTitle = /<svg([^>+].*?)>/
const fillReg = /fill="([^>+].*?)"/g
const clearHeightWidth = /(width|height)="([^>+].*?)"/g

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
      // 处理单色图标，去除 fill 属性值
      const svgFills = svg.match(fillReg)
      if (svgFills.every(match => match === svgFills[0]) || svgFills.length === 1)
        svg = svg.replace(fillReg, '')
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
