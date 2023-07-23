<script>
import { mapActions } from 'vuex'
import ArchiveCard from '@/components/archive_card/index.vue'
import { hexToHsl } from '@/utils'

export default {
  name: 'Archives',
  components: {
    ArchiveCard,
  },
  data() {
    return {
      totalCount: 0,
      archives: [],
      archiveMap: {},
      tags: [],
      isFilter: false,
      filterCount: 0,
      loading: true,
    }
  },
  computed: {
    editLink() {
      let link = 'https://github.com/'
      link += `${this.$config.username}/${this.$config.repository}/issues`
      return link
    },
  },
  created() {
    this.getArchiveCountFn()
    this.getArchivesFn()
    this.getTagsFn()
  },
  methods: {
    ...mapActions({
      getPostsCountAction: 'github/getPostsCountAction',
      getPostsAction: 'github/getPostsAction',
      getTagsAction: 'github/getTagsAction',
    }),
    async getArchiveCountFn() {
      this.totalCount = await this.getPostsCountAction()
    },
    async getArchivesFn() {
      this.archives = this.archives.concat(await this.getPostsAction({ page: 1, pageSize: 100 }))
      this.archiveMap = this.parseArchives(this.archives)
      if (this.archives)
        this.loading = false
    },
    async getTagsFn() {
      this.tags = await this.getTagsAction()
      this.tags.forEach((tag) => {
        tag.hslColor = hexToHsl(`#${tag.color}}`)
      })
    },
    parseArchives(archives) {
      const result = {}
      archives.forEach((archive) => {
        const year = archive.created_at.slice(0, 4)
        if (!result[year])
          result[year] = []
        result[year].push(archive)
      })
      return result
    },
    parseArchivesByTag(archives) {
      const result = {}
      archives.forEach((archive) => {
        const year = archive.created_at.slice(0, 4)
        if (!result[year])
          result[year] = []
        result[year].push(archive)
      })
      return result
    },
    filterArchives(e) {
      const target = e.target
      const tags = this.tags || []
      if (target.classList.contains('tag')) {
        const tagId = Number(target.getAttribute('data-tag'))
        const tag = tags.find(item => item.id === tagId)
        if (tag) {
          const archives = this.archives.filter(archive => archive.tags.find(item => item.id === tag.id))
          target.parentNode.querySelectorAll('.tag').forEach((item) => {
            item.classList.remove('active')
          })
          target.classList.add('active')
          this.archiveMap = this.parseArchives(archives)
          this.filterCount = archives.length
          this.isFilter = true
        }
      }
    },
    clearAll() {
      this.$refs.tagList.querySelectorAll('.tag').forEach((item) => {
        item.classList.remove('active')
      })
      this.archiveMap = this.parseArchives(this.archives)
      this.isFilter = false
    },
  },
}
</script>

<template>
  <div class="archives-wrap">
    <div v-loading="loading" class="archives">
      <div class="tags">
        <div class="tags-header">
          <h2><SvgIcon name="biaoqian" /> 标签</h2>
          <div v-if="isFilter" class="clear-all" @click="clearAll">
            清除选中
          </div>
        </div>
        <div class="tags-body">
          <ul ref="tagList" class="tag-list" @click="filterArchives">
            <li v-for="tag in tags" :key="tag.id" class="tag" :data-tag="tag.id" :style="{ '--color': `#${tag.color}`, '--tag-hsl': tag.hslColor }">
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
            <SvgIcon name="danju" /> 该标签下有 {{ filterCount }} 篇文章~
          </h2>
        </div>
        <div class="archives-body">
          <div v-for="key in Object.keys(archiveMap).reverse()" :key="key" class="archive-items">
            <div class="archive-year">
              {{ key }}
            </div>
            <div class="archive-item-list">
              <router-link
                v-for="archive in archiveMap[key]"
                :key="archive.id"
                :to="{ name: 'Post', params: { number: archive.number } }"
              >
                <ArchiveCard :cover="archive.cover" :title="archive.title" :created-at="archive.created_at" />
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import './index.scss'
</style>
