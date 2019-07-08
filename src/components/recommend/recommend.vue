<template>
  <div class="recommend">
    <scroll class="recommend_content">
      <div>
        <div class="slider_wrapper" v-if="recommends.length">
          <slider>
            <div v-for="item in recommends" :key="item.id">
              <a :href="item.linkUrl">
                <img :src="item.picUrl">
              </a>
            </div>
          </slider>
        </div>
        <div class="recommend_list">
          <h1 class="list_title">热门歌单推荐</h1>
          <div class="item" v-for="item in singList" :key="item.dissid">
            <div class="icon">
              <img v-lazy="item.imgurl" alt="item.dissname" width="60" height="60">
            </div>
            <div class="text">
              <h2 class="name" v-html="item.creator.name"></h2>
              <p class="desc" v-html="item.dissname"></p>
            </div>
          </div>
        </div>
        <div class="loading-container" v-show="!singList.length">
          <loading></loading>
        </div>
      </div>
    </scroll>
  </div>
</template>

<script>
// 导入初始化的better-scroll的组件
import scroll from 'base/scoll/scoll'
// 导入loading组件
import loading from 'base/loading/loading'
// 导入请求函数
import { getRecommend, getSingList } from 'api/recommend'
// 导入判断成功的常量
import { ERR_OK } from 'api/config'
// 导入slider组件
import slider from 'base/slider'
export default {

  data () {
    return {
      // 轮播图的数据
      recommends: [],
      // 歌单的数据
      singList: []
    }
  },

  methods: {
    // 设置一个请求轮播图的函数
    async _getRecommend() {
      // 调用请求函数
      const res = await getRecommend()
      // 判断是否请求成功
      if (ERR_OK === res.code) {
        this.recommends = res.data.slider
      }
    },
    // 设置一个请求歌单的函数
    async _getSingList() {
      const { data: res } = await getSingList()
      if (res.code === ERR_OK) {
        this.singList = res.data.list
        console.log(this.singList)
      }
    }
  },
  components: {
    slider,
    scroll,
    loading
  },

  created () {
    this._getRecommend()
    this._getSingList()
  }
}
</script>

<style lang='stylus' scoped>
// 导入设置好的字体大小和颜色
@import '~assets/stylus/variable'
.recommend
  position fixed
  width 100%
  top 88px
  bottom 0
  .recommend_content
    height 100%
    overflow hidden
    .slider_wrapper
      position relative
      width 100%
      overflow hidden
    .recommend_list
      .list_title
        height 65px
        line-height 65px
        text-align center
        font-size $font-size-medium
        color $color-theme
      .item
        display flex
        box-sizing border-box
        align-items center
        padding 0 20px 20px 20px
        .icon
          flex 0 0 60px
          width 60px
          padding-right 20px
        .text
          display flex
          flex-direction column
          justify-content center
          flex 1
          line-height 20px
          overflow hidden
          font-size $font-size-medium
          .name
            margin-bottom 10px
            clor $color-text
          .desc
            color $color-text-d
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
