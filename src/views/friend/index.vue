<script>
import { mapActions } from 'vuex'
import Comment from '@/components/comment/index.vue'
import Markdown from '@/components/markdown/index.vue'

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
    friendLink() {
      let link = 'https://github.com/'
      link += `${this.$config.username}/${this.$config.friendsRepo}/issues`
      return link
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
    },
  },
}
</script>

<template>
  <div class="friend-wrap">
    <div class="friend">
      <section>
        <h2><SvgIcon name="lianjie" /> 我的友链信息</h2>
        <div class="info-wrap">
          <p>欢迎各位大佬交换友链 (づ￣ 3￣)づ</p>
          <p>以下是我的友链信息，各位大佬可以在页面下按照这个格式留言，或者前往 <a :href="friendLink">Friend</a> 自行创建</p>
          <Markdown :content="friendInfo" :need-parsed="true" />
        </div>
      </section>
      <section>
        <h2><SvgIcon name="zhinan" /> 小伙伴们</h2>
        <p>※ 以下友链友链随机排序，博主将不定期更新排序并过滤阵亡名单</p>
        <p>※ 为了页面视觉体验，头像将保存到博主自己的存储空间，如果有更新请即时联系博主修改</p>
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
          失联的小伙伴们
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
        <p>请以上失联的小伙伴尽快恢复网站的正常访问，并且通知博主</p>
      </section>
      <section v-if="showNotAdded">
        <p class="strong">
          未添加本站的小伙伴们
        </p>
        <ul class="not-added">
          <li v-for="friend in notAdded" :key="friend.number">
            <h3 class="name">
              {{ friend.name }}
            </h3>
          </li>
        </ul>
        <p>如果需要本博客继续收录您的站点，请于您的站点添加本站后联系博主</p>
      </section>
    </div>
    <Comment />
  </div>
</template>

<style lang="scss" scoped>
@import './index.scss'
</style>
