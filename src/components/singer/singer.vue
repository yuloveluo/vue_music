<template>
  <div class="singer">
    <list-view :data='singerList' @selectInfo='selectDetial'></list-view>
    <router-view></router-view>
  </div>
</template>
<script>
// 导入歌手列表请求函数
import { getSingerList } from 'api/singer'
// 导入判断成功的常量
import { ERR_OK } from 'api/config'
// 导入类
import Singer from 'assets/js/singerClass'
// 导入歌手列表组件
import listView from 'base/listview/listview'
// 导入mutation的方法
import { mapMutations } from 'vuex'

// 设置一个热门的常量
const HOT_TITLE = '热门'
export default {

  data () {
    return {
      singerList: []
    }
  },

  methods: {
    // 解构mapMutations
    ...mapMutations({
      setSinger: 'SET_SINGER'
    }),
    // 获取到子组件传过来的信息
    selectDetial(item) {
      // 跳转到歌手详情页
      this.$router.push({
        path: `/singer/${item.id}`
      })
      // 触发mutations的方法,并将歌手信息传参过去
      this.setSinger(item)
    },
    // 歌手请求的函数
    async _getSingerList() {
      // 发起请求
      const res = await getSingerList()
      // 判断请求成功与否
      if (res.code === ERR_OK) {
        this.singerList = this._changeList(res.data.list)
        console.log(this.singerList)
      }
    },
    // 封装一个将歌手分类的函数
    _changeList(list) {
      // 创建一个分类的对象
      let mapObj = {
        // 设置一个热门的
        hot: {
          title: HOT_TITLE,
          items: []
        }
      }
      // 将要分类的数组进行循环
      list.forEach((item, index) => {
        // 如果当前的索引小于10，就全部放到hot里去
        if (index < 10) {
          // 将new出来创建的对象push到hot分类里面去
          mapObj.hot.items.push(new Singer({
            id: item.Fsinger_mid,
            name: item.Fsinger_name
          }))
        }
        // 获取到分类名称
        let key = item.Findex
        // 先判断mapArr数组里面有没有对应的字母分类
        if (!mapObj[key]) {
          // 没有就创建一个
          mapObj[key] = {
            title: key,
            items: []
          }
        }
        // 将遍历出来的item里面的属性push到这个分类里面去
        mapObj[key].items.push(new Singer({
          id: item.Fsinger_mid,
          name: item.Fsinger_name
        }))
      })
      // 因为对象遍历出来时无序的，所有我们要把对象变成有序的数组
      // 创建两个数组,一个放置热门的对象数据，一个放置所有字母的对象数据
      let hot = []
      let ret = []
      // 循环mapObj对象
      for (let key in mapObj) {
        // 将属性值给提取出来
        const val = mapObj[key]
        // 进行判断是热门还是字母
        if (val.title.match(/[a-zA-Z]/)) {
          // 是字母的话就push到ret数组里
          ret.push(val)
        } else if (val.title === HOT_TITLE) {
          hot.push(val)
        }
      }
      // 对ret进行排序
      ret.sort((a, b) => {
        return a.title.charCodeAt(0) - b.title.charCodeAt(0)
      })
      // 返回一个两个数组拼接起来的新数组
      return hot.concat(ret)
    }
  },
  components: {
    listView
  },

  created () {
    this._getSingerList()
  }
}
</script>

<style lang='stylus' scoped>
.singer
  position fixed
  top 88px
  bottom 0
  width 100%
</style>
