<script>
export default {
  name: 'Pagination',
  props: {
    total: {
      type: Number,
      default: 0,
    },
    pageSize: {
      type: Number,
      default: 12,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
  },
  emits: { 'update:currentPage': null, 'pageChange': null },
  data() {
    return {
      pageList: [],
    }
  },
  computed: {
    totalPage() {
      return Math.ceil(this.total / this.pageSize)
    },
    current: {
      get() {
        return this.currentPage
      },
      set(val) {
        this.$emit('update:currentPage', val)
      },
    },
    showPrevDot() {
      return this.pageList[2] - 2 > 1
    },
    showNextDot() {
      return this.totalPage - this.pageList[2] > 1
    },
  },
  watch: {
    currentPage(val) {
      this.calcPage(val)
    },
    totalPage() {
      this.initData()
      this.calcPage(this.currentPage)
    },
  },
  created() {
    this.initData()
    this.calcPage(this.currentPage)
  },
  methods: {
    initData() {
      this.pageList = []
      let i = 1
      do {
        this.pageList.push(i)
        i++
      } while (i <= this.totalPage)
      this.pageList.length > 4 && this.pageList.splice(4)
    },
    calcPage(val) {
      if (this.totalPage <= 4)
        return
      if (val < 4) {
        this.pageList = []
        let i = 1
        do {
          this.pageList.push(i)
          i++
        } while (i <= this.totalPage)
        this.pageList.length > 4 && (this.pageList = this.pageList.slice(0, 4))
      }
      else if (val === this.totalPage) {
        this.pageList = [val - 3, val - 2, val - 1, val]
      }
      else if (val === this.totalPage - 1) {
        this.pageList = [val - 2, val - 1, val, val + 1]
      }
      else {
        this.pageList = [val - 2, val - 1, val, val + 1]
      }
    },
    pageChange(e) {
      if (e.target.classList.contains('prev') || e.target.classList.contains('btn-prev')) {
        if (this.currentPage === 1)
          return
        this.current--
      }
      else if (e.target.classList.contains('next') || e.target.classList.contains('btn-next')) {
        if (this.currentPage === this.totalPage)
          return
        this.current++
      }
      else if (e.target.classList.contains('btn-num')) {
        if (this.currentPage === Number(e.target.innerText))
          return
        this.current = Number(e.target.innerText)
      }
      else {
        return
      }
      this.$emit('pageChange', this.current)
    },
  },
}
</script>

<template>
  <div class="pagination" @click="pageChange">
    <p v-if="currentPage === totalPage">
      已经是最后一篇文章了~
    </p>
    <div v-if="totalPage > 1" class="btn-wrap">
      <button class="btn btn-prev" :disabled="currentPage === 1">
        <i class="prev" />
      </button>
      <span v-if="showPrevDot">...</span>
      <button v-for="n in pageList" :key="n" class="btn btn-num" :class="currentPage === n ? 'active' : ''">
        {{ n }}
      </button>
      <span v-if="showNextDot">...</span>
      <button class="btn btn-next" :disabled="currentPage === totalPage">
        <i class="next" />
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.pagination {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
  user-select: none;
  transition: .3s;
  p {
    font-size: 1em;
    color: var(--minor);
    margin-bottom: 2em;
  }
  .btn-wrap {
    display: flex;
    gap: 1em;
    justify-content: center;
    align-items: center;
    .btn {
      position: relative;
      font-size: 1.3rem;
      width: 50px;
      height: 50px;
      border-radius: 50%;
      text-align: center;
      background-color: var(--bg-thin);
      border: 1px solid var(--thin);
      color: var(--minor);
      cursor: pointer;
      transition: .3s;
      i {
        position: absolute;
        top: 18px;
        left: 20px;
        display: inline-block;
        border: solid var(--minor);
        border-width: 0 2px 2px 0;
        padding: 5px;
      }
      .next {
        left: 17px;
        transform: rotate(-45deg);
        vertical-align: middle;
      }
      .prev {
        transform: rotate(135deg);
      }
      &:hover {
        background-color: var(--primary);
        color: white;
        i {
          border-color: white;
        }
      }
      &.active {
        border-color: var(--primary);
        color: var(--primary);
        &:hover {
          background-color: var(--bg-thin);
        }
      }
      &:disabled {
        cursor: not-allowed;
        background-color: var(--bg-major);
        &:hover {
          i {
            border-color: var(--minor);
          }
        }
      }
    }
  }
  @include xs-layout {
    & {
      transform: scale(.7);
    }
  }
}
</style>
