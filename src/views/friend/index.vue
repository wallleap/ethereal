<script>
import { mapActions } from 'vuex'
import Comment from '@/components/comment/index.vue'
import Markdown from '@/components/markdown/index.vue'
import config from '@/config'
import { getBlogFriendUrlAPI } from '@/api/github'

const isBlogFriends = config.friendsRepo === '' || config.friendsRepo === undefined

export default {
  name: 'Friend',
  components: {
    Comment,
    Markdown,
  },
  data() {
    return {
      filterFriends: [],
      loseContact: [],
      notAdded: [],
      loading: true,
    }
  },
  computed: {
    friendInfo() {
      const string = '```js' + '\n'
        + `name: ${this.$config.name}` + '\n'
        + `url: ${this.$config.url}` + '\n'
        + `avatar: ${this.$config.avatar}` + '\n'
        + `desc: ${this.$config.desc}` + '\n'
        + '```'
      return string
    },
    showLoseContact() {
      return this.loseContact.length > 0
    },
    showNotAdded() {
      return this.notAdded.length > 0
    },
  },
  created() {
    this.getFriendsFn()
  },
  methods: {
    ...mapActions({
      getFriendsCountAction: 'github/getFriendsCountAction',
      getFriendsAction: 'github/getFriendsAction',
      getBlogFriendsAction: 'github/getBlogFriendsAction',
    }),
    parseFriends(friends) {
      friends.forEach((friend) => {
        const labels = friend.labels
        const labelsNames = labels.map(label => label.name)
        if (labelsNames.includes('未添加'))
          this.notAdded.push(friend)
        else if (labelsNames.includes('失联'))
          this.loseContact.push(friend)
        else
          this.filterFriends.push(friend)
      })
    },
    parseBlogFriends(friends) {
      friends.forEach((friend) => {
        const tag = friend.tag
        if (tag.name === '未添加')
          this.notAdded.push(friend)
        else if (tag.name === '失联')
          this.loseContact.push(friend)
        else
          this.filterFriends.push(friend)
      })
    },
    async getFriendsCountFn() {
      return await this.getFriendsCountAction().catch((err) => {
        this.$message({
          content: '获取友链总数失败',
          type: 'error',
        })
        throw new Error(err)
      })
    },
    async getFriendsFn() {
      if (isBlogFriends) {
        const { url, pageSize } = await getBlogFriendUrlAPI().catch((err) => {
          this.$message({
            content: '获取友链失败',
            type: 'error',
          })
          throw new Error(err)
        })
        const friends = await this.getBlogFriendsAction({ url, page: 1, pageSize }).catch((err) => {
          this.$message({
            content: '获取友链失败',
            type: 'error',
          })
          throw new Error(err)
        }).finally(() => {
          this.loading = false
        })
        this.parseBlogFriends(friends)
      }
      else {
        const totalCount = await this.getFriendsCountFn().catch((err) => {
          this.$message({
            content: '获取友链总数失败',
            type: 'error',
          })
          throw new Error(err)
        })
        const friends = await this.getFriendsAction({ page: 1, pageSize: totalCount }).catch((err) => {
          this.$message({
            content: '获取友链失败',
            type: 'error',
          })
          throw new Error(err)
        }).finally(() => {
          this.loading = false
        })
        this.parseFriends(friends)
      }
    },
  },
}
</script>

<template>
  <div class="friend-wrap">
    <div class="friend">
      <section>
        <h2><SvgIcon name="lianjie" /> {{ $t('friend_info') }}</h2>
        <div class="info-wrap">
          <p>{{ $t('exchange_link') }}</p>
          <p>{{ $t('this_is_my_friend') }}</p>
          <Markdown :content="friendInfo" :need-parsed="true" />
        </div>
      </section>
      <section>
        <h2><SvgIcon name="zhinan" /> {{ $t('my_friends') }}</h2>
        <p>※ {{ $t('randomly_sorted') }}</p>
        <p>※ {{ $t('own_storage_space') }}</p>
        <ul v-loading="loading" class="content">
          <li v-for="friend in filterFriends" :key="friend.number">
            <a :href="friend.url" rel="noopener noreferrer" class="info" target="_blank">
              <figure class="avatar">
                <img :src="friend.avatar" alt="avatar" loading="lazy">
              </figure>
              <div class="text">
                <h3 class="name">{{ friend.name }}</h3>
                <p class="desc">{{ friend.desc }}</p>
              </div>
            </a>
          </li>
        </ul>
      </section>
      <section v-if="showLoseContact">
        <p class="strong">
          {{ $t('cannot_visit') }}
        </p>
        <ul class="content">
          <li v-for="friend in loseContact" :key="friend.number">
            <a :href="friend.url" rel="noopener noreferrer" class="info" target="_blank">
              <figure class="avatar">
                <img :src="friend.avatar" alt="avatar" loading="lazy">
              </figure>
              <div class="text">
                <h3 class="name">{{ friend.name }}</h3>
                <p class="desc">{{ friend.desc }}</p>
              </div>
            </a>
          </li>
        </ul>
        <p>{{ $t('please_restore') }}</p>
      </section>
      <section v-if="showNotAdded">
        <p class="strong">
          {{ $t('unblied_friends') }}
        </p>
        <ul class="not-added">
          <li v-for="friend in notAdded" :key="friend.number">
            <h3 class="name">
              {{ friend.name }}
            </h3>
          </li>
        </ul>
        <p>{{ $t('continue_include') }}</p>
      </section>
    </div>
    <Comment />
  </div>
</template>

<style lang="scss" scoped>
@import './index.scss'
</style>
