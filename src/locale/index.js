import VueI18n from "vue-i18n"
import Vue from "vue"
import enUS from "./lang/en-US"
import zhCN from "./lang/zh-CN"
import { getLocale } from "@/utils/i18n"

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: getLocale(),
  messages: {
    "en-US": enUS,
    "zh-CN": zhCN
  }
})

export default i18n
