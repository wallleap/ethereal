<script>
import { mapActions } from 'vuex'
import ArchiveCard from '@/components/archive_card/index.vue'
import Loading from '@/components/loading/index.vue'
import { hexToHsl, parseArchives, sortArchiveMap } from '@/utils'

export default {
  name: 'Archives',
  components: {
    ArchiveCard,
    Loading,
  },
  data() {
    return {
      totalCount: 0,
      archives: [],
      archiveMap: {},
      tags: [],
      isFilter: false,
      filterCount: 0,
      timer: null,
      loading: true,
    }
  },
  computed: {
    editLink() {
      let link = 'https://github.com/'
      link += `${this.$config.username}/${this.$config.repository}/issues`
      return link
    },
    filterText() {
      return this.filterCount === 0 ? '该标签下暂时没有文章~' : `该标签下有 ${this.filterCount} 篇文章~`
    },
  },
  created() {
    this.getArchiveCountFn()
    this.getArchivesFn()
    this.getTagsFn()
  },
  beforeUnmount() {
    clearTimeout(this.timer)
  },
  methods: {
    ...mapActions({
      getPostsCountAction: 'github/getPostsCountAction',
      getPostsAction: 'github/getPostsAction',
      getTagsAction: 'github/getTagsAction',
    }),
    async getArchiveCountFn() {
      this.totalCount = await this.getPostsCountAction().catch((err) => {
        this.$message({
          content: '获取文章总数失败',
          type: 'error',
        })
        throw new Error(err)
      })
    },
    async getArchivesFn() {
      this.archives = this.archives.concat(await this.getPostsAction({ page: 1, pageSize: 100 }).catch((err) => {
        this.$message({
          content: '获取文章列表失败',
          type: 'error',
        })
        throw new Error(err)
      }).finally(() => {
        this.loading = false
      }))
      const archiveMap = parseArchives(this.archives)
      this.archiveMap = sortArchiveMap(archiveMap)
    },
    async getTagsFn() {
      this.tags = await this.getTagsAction().catch((err) => {
        this.$message({
          content: '获取标签列表失败',
          type: 'error',
        })
        throw new Error(err)
      })
      this.tags.forEach((tag, index) => {
        tag.index = index
        tag.hslColor = hexToHsl(`#${tag.color}}`)
      })
    },
    filterArchives(e) {
      const target = e.target
      const tags = this.tags || []
      if (target.classList.contains('tag')) {
        this.loading = true
        const tagId = Number(target.getAttribute('data-tag'))
        const duration = Math.random() * (1300 - 300) + 300
        const tag = tags.find(item => item.id === tagId)
        if (tag) {
          const archives = this.archives.filter(archive => archive.tags.find(item => item.id === tag.id))
          target.parentNode.querySelectorAll('.tag').forEach((item) => {
            item.classList.remove('active')
          })
          target.classList.add('active')
          const archiveMap = parseArchives(archives)
          this.archiveMap = sortArchiveMap(archiveMap)
          this.filterCount = archives.length
          this.isFilter = true
          this.timer = setTimeout(() => {
            clearTimeout(this.timer)
            this.loading = false
          }, duration)
        }
      }
    },
    clearAll() {
      this.$refs.tagList.querySelectorAll('.tag').forEach((item) => {
        item.classList.remove('active')
      })
      const archiveMap = parseArchives(this.archives)
      this.archiveMap = sortArchiveMap(archiveMap)
      this.isFilter = false
    },
  },
}
</script>

<template>
  <div class="archives-wrap">
    <div class="archives">
      <div class="tags">
        <div class="tags-header">
          <h2><SvgIcon name="biaoqian" /> 标签</h2>
          <div v-if="isFilter" class="clear-all" @click="clearAll">
            清除选中
          </div>
        </div>
        <div class="tags-body">
          <ul ref="tagList" class="tag-list" @click="filterArchives">
            <li v-for="tag in tags" :key="tag.id" class="tag" :data-tag="tag.id" :style="{ '--color': `#${tag.color}`, '--tag-hsl': tag.hslColor, '--delay': `${tag.index}` }">
              {{ tag.name || '' }}
            </li>
          </ul>
        </div>
      </div>
      <div class="archives-list">
        <div class="archives-header">
          <h2 v-if="!isFilter">
            <SvgIcon name="danju" /> 你已经写了 {{ totalCount }} 篇文章了，继续坚持哦~
            <a class="edit" :href="editLink" target="_blank">
              <SvgIcon name="shuru" />
            </a>
          </h2>
          <h2 v-else>
            <SvgIcon name="danju" /> {{ filterText }}
          </h2>
        </div>
        <div class="archives-body">
          <Loading v-if="loading" />
          <transition name="from-bottom">
            <div v-if="!loading">
              <div v-for="year in Object.keys(archiveMap).reverse()" :key="year" class="archive-items">
                <div class="archive-year">
                  {{ year }}
                </div>
                <div class="archive-item-list">
                  <router-link
                    v-for="archive in archiveMap[year]"
                    :key="archive.id"
                    :to="{ name: 'Post', params: { number: archive.number } }"
                  >
                    <ArchiveCard :cover="archive.cover" :title="archive.title" :created-at="archive.created_at" />
                  </router-link>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './index.scss'
</style>
