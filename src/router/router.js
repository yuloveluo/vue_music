export default [
  {
    // 配置首页
    path: '/',
    redirect: '/recommend'
  },
  {
    // 导入推荐页面
    path: '/recommend',
    component: () => import('_c/recommend/recommend')
  },
  {
    // 配置歌手页面路由
    path: '/singer',
    component: () => import('_c/singer/singer'),
    // 配置singer的子路由
    children: [
      {
        // 歌手详情路由
        path: ':id',
        component: () => import('_c/singer-detail/singer-detail')
      }
    ]
  },
  {
    // 配置排行榜路由
    path: '/rank',
    component: () => import('_c/rank/rank')
  },
  {
    // 配置搜索路由
    path: '/search',
    component: () => import('_c/search/search')
  }
]