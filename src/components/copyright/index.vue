<script>
export default {
  name: 'Copyright',
  data() {
    return {
      createdTime: this.$config.createdTime,
      currentYear: new Date().getFullYear(),
    }
  },
  computed: {
    year() {
      const createdYear = new Date(this.createdTime).getFullYear()
      return this.currentYear === this.createdYear ? this.currentYear : `${createdYear} - ${this.currentYear}`
    },
  },
}
</script>

<template>
  <div class="copyright">
    <div v-if="$config.icp" class="beian">
      <a :href="$config.icpLink" target="_blank"><img src="//cdn.wallleap.cn/img/logo/ICP.png" style="margin-right: .4em; vertical-align: text-bottom; width: 17px; display: inline-block;">{{ $config.icp }}</a>
      <span v-if="$config.beian">
        <span class="separate"> | </span>
        <a href="$config.beianLink" target="_blank"><img src="https://www.beian.gov.cn/img/ghs.png" style="margin-right: .4em; vertical-align: text-bottom; width: 17px;">{{ $config.beian }}</a>
      </span>
    </div>
    <div class="copyright-text">
      <p>Blog <a :href="$config.url" class="blog-link">{{ $config.name }}</a>, Copyright &copy; {{ year }} by <a :href="$config.link" target="_blank">{{ $config.author }}</a></p>
    </div>
    <div class="recommend-site">
      <p>
        <a href="//www.travellings.cn" target="_blank" class="travel"><SvgIcon name="travel" /> Travelling</a>
        <a :href="$config.github" target="_blank" class="github"><SvgIcon name="github" /> MyGitHub</a>
        <a href="//github.com/wallleap/ethereal" target="_blank" class="theme"><SvgIcon name="theme" /> ethereal</a>
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.copyright {
  position: absolute;
  bottom: 0;
  width: 100%;
  text-align: center;
  padding: 1.2rem 0;
  font-size: 14px;
  z-index: 0;
  a {
    color: var(--minor);
    transition: 0.4s;
    &:hover {
      color: var(--primary);
    }
    &.travel, &.github, &.theme {
      display: inline-block;
      font-size: 13px;
      margin-right: .4em;
      padding: 0.2em 0.8em;
      border-radius: .3em;
      background-color: var(--major);
      color: var(--bg-thin);
      svg {
        color: var(--bg-thin);
      }
      &:hover {
        background-color: var(--primary);
        color: var(--bg-thin);
        svg {
          color: var(--bg-thin);
        }
      }
    }
  }
  .recommend-site {
    margin-top: .4em;
  }
  .beian {
    .separate {
      color: var(--weak);
    }
  }
  @include xs-layout {
    margin-bottom: 72px;
  }
}
</style>
