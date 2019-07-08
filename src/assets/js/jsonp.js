import originJSONP from 'jsonp'

// 封装一个jsonp
// url是要请求地址
// data是请求的参数
// option是jsonp的一些配置
export default function jsonp(url, data, option) {
  // 如果url没有？就加一个？
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  // 返回一个promise对象
  return new Promise((resolve, reject) => {
    // 这个就是元素的jsonp
    originJSONP(url, option, (err, data) => {
      // 如果err为null，表示成功，就后台返回的data抛出去
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}

// 封装一个处理data请求参数的函数
export function param(data) {
  let url = ''
  // 循环data请求对象里面的参数
  for (var i in data) {
    // 判断参数是否存在，如果存在就返回，如果不存在就返回一个空
    let value = data[i] !== undefined ? data[i] : ''
    // 拼接参数
    url += '&' + i + '=' + encodeURIComponent(value)
  }
  // 如果url都为空就返回一个空，要么就返回url
  return url ? url.substring(1) : ''
}