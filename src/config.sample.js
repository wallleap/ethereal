/**
 * 博客配置文件，没有说明的就是必填项
 * @type {Object}
 * @property {String} title         博客标题
 * @property {String} subtitle      博客副标题
 * @property {String} description   博客描述
 * @property {String} keywords      博客关键字
 * @property {String} logo          博客图标 180x180
 * @property {String} favicon16     博客图标 16x16
 * @property {String} favicon32     博客图标 32x32
 * @property {String} createdTime   博客创建时间
 * @property {String} icp           ICP 备案号
 * @property {String} icpLink       ICP 备案链接
 * @property {String} beian         [选填] 公安备案号 '京公网安备 00000000000000号'
 * @property {String} beianLink     [选填] 公安备案链接 'http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=00000000000000'
 * @property {String} username      GitHub 用户名
 * @property {String} repository    GitHub 仓库名
 * @property {String} friendsRepo   友链仓库名
 * @property {String} author        博客作者
 * @property {String} email         博客作者邮箱
 * @property {String} link          个人链接
 * @property {String} github        GitHub 链接
 * @property {String} name          友链名称
 * @property {String} url           友链链接
 * @property {String} avatar        友链头像
 * @property {String} desc          友链描述
 * @property {String} pageSize      文章列表每页显示文章数
 * @property {String} defaultCover  文章默认封面图
 */

export default {
  // 博客基础配置
  title: '博客名称',
  subtitle: '博客副标题',
  description: '博客描述信息',
  keywords: '关键词1, 关键词2, 关键词3',
  logo: './logo.svg',
  favicon16: './favicon.ico',
  favicon32: './favicon.ico',
  createdTime: '2019-08-01',
  icp: '',
  icpLink: '',
  beian: '',
  beianLink: '',
  // 关于页二维码
  alipay_qr: '/images/alipayQr.jpg',
  // GitHub Issues 配置
  username: 'GitHub用户名',
  repository: 'Issue所在仓库名',
  // friendsRepo: 'friends', // 留空则默认使用上方仓库获取
  // 您的信息
  author: '作者名',
  email: '联系邮箱',
  link: '个人链接',
  github: 'GitHub链接',
  // 友链信息
  name: '作者名或博客名',
  url: '博客链接',
  avatar: '作者或博客头像链接',
  desc: '描述信息',
  // 文章相关
  pageSize: 12,
  defaultCover: '/images/cover.jpg',
  errorImg: '/images/error.gif',
  // Twikoo 评论配置
  twikoo: {
    src: '//cdn.staticfile.org/twikoo/1.6.22/twikoo.all.min.js',
  },
}
