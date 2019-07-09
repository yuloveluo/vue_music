// 暴露出去一个类
export default class Singer {
  // 添加实例的参数
  constructor({ id, name }) {
    this.id = id
    this.name = name
    this.avater = `https://y.gtimg.cn/music/photo_new/T001R300x300M000${id}.jpg?max_age=2592000`
  }
}
