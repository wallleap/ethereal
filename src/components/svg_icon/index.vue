<script>
export default {
  name: 'SvgIcon',
  props: {
    prefix: {
      type: String,
      default: 'icon',
    },
    name: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      default: 'currentColor',
    },
  },
  computed: {
    symbolId() {
      return `#${this.prefix}-${this.name}`
    },
    svgClass() {
      return this.name ? `svg-icon ${this.prefix}-${this.name}` : 'svg-icon'
    },
  },
}
</script>

<template>
  <svg :class="svgClass" aria-hidden="true">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<style lang="scss">
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  color: inherit;
  fill: currentColor;
  overflow: hidden;
}
</style>
