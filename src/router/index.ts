import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'
import store from '@/store'

Vue.use(VueRouter)

// 路由配置规则
const routes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'login',
    component: () =>
      import(/* webpackChunkName: 'login' */ '@/views/login/index.vue')
  },
  {
    path: '/',
    component: Layout,
    meta: {
      requiresAuth: true // 自定义数据想放啥放啥
    },
    children: [
      {
        path: '', // 默认子路由
        name: 'home',
        component: () =>
          import(/* webpackChunkName: 'home' */ '@/views/home/index.vue'),
        meta: {
          title: '首页'
        }
      },
      {
        path: '/role',
        name: 'role',
        component: () =>
          import(/* webpackChunkName: 'role' */ '@/views/role/index.vue'),
        meta: {
          title: '角色管理'
        }
      },
      {
        path: '/menu',
        name: 'menu',
        component: () =>
          import(/* webpackChunkName: 'menu' */ '@/views/menu/index.vue'),
        meta: {
          title: '菜单管理'
        }
      },
      {
        path: '/resource',
        name: 'resource',
        component: () =>
          import(
            /* webpackChunkName: 'resource' */ '@/views/resource/index.vue'
          ),
        meta: {
          title: '资源管理'
        }
      },
      {
        path: '/course',
        name: 'course',
        component: () =>
          import(/* webpackChunkName: 'course' */ '@/views/course/index.vue'),
        meta: {
          title: '课程管理'
        }
      },
      {
        path: '/user',
        name: 'user',
        component: () =>
          import(/* webpackChunkName: 'user' */ '@/views/user/index.vue'),
        meta: {
          title: '用户管理'
        }
      },
      {
        path: '/advert',
        name: 'advert',
        component: () =>
          import(/* webpackChunkName: 'advert' */ '@/views/advert/index.vue'),
        meta: {
          title: '广告列表'
        }
      },
      {
        path: '/advert-space',
        name: 'advert-space',
        component: () =>
          import(
            /* webpackChunkName: 'advert-space' */ '@/views/advert-space/index.vue'
          ),
        meta: {
          title: '广告位列表'
        }
      },
      {
        path: '/menu/create',
        name: 'menu-create',
        component: () =>
          import(
            /* webpackChunkName: 'menu-create-edit' */ '@/views/menu/create.vue'
          ),
        meta: {
          title: '菜单管理-添加菜单'
        }
      },
      {
        path: '/menu/:id/edit',
        name: 'menu-edit',
        component: () =>
          import(
            /* webpackChunkName: 'menu-create-edit' */ '@/views/menu/edit.vue'
          ),
        meta: {
          title: '菜单管理-编辑菜单'
        }
      },
      {
        path: '/role/:roleId/alloc-menu',
        name: 'alloc-menu',
        component: () =>
          import(
            /* webpackChunkName: 'alloc-menu' */ '@/views/role/alloc-menu.vue'
          ),
        meta: {
          title: '角色管理-分配菜单'
        },
        props: true // 将路由路径参数映射到组件的 props 数据中
      },
      {
        path: '/role/:roleId/alloc-resource',
        name: 'alloc-resource',
        component: () =>
          import(
            /* webpackChunkName: 'alloc-menu' */ '@/views/role/alloc-resource.vue'
          ),
        meta: {
          title: '角色管理-分配资源'
        },
        props: true // 将路由路径参数映射到组件的 props 数据中
      },
      {
        path: '/course/create',
        name: 'course-create',
        component: () =>
          import(
            /* webpackChunkName: 'course-create' */ '@/views/course/create.vue'
          ),
        meta: {
          title: '课程管理-添加课程'
        }
      },
      {
        path: '/course/:courseId/edit',
        name: 'course-edit',
        component: () =>
          import(
            /* webpackChunkName: 'course-edit' */ '@/views/course/edit.vue'
          ),
        props: true,
        meta: {
          title: '课程管理-编辑课程'
        }
      },
      {
        path: '/course/:courseId/section',
        name: 'course-section',
        component: () =>
          import(
            /* webpackChunkName: 'course-section' */ '@/views/course/section.vue'
          ),
        props: true,
        meta: {
          title: '课程管理-内容管理'
        }
      },
      {
        path: '/course/:courseId/video',
        name: 'course-video',
        component: () =>
          import(
            /* webpackChunkName: 'course-video' */ '@/views/course/video.vue'
          ),
        props: true,
        meta: {
          title: '课程管理-上传视频'
        }
      }
    ]
  },
  {
    path: '*',
    name: '404',
    component: () =>
      import(/* webpackChunkName: '404' */ '@/views/error-page/404.vue')
  }
]

const router = new VueRouter({
  routes
})

// 路由拦截器，任何页面访问都会经过这里
// to：要去哪里的路由信息
// from：从哪里来的路由信息
// next：通信标志
router.beforeEach((to, from, next) => {
  console.log('to->', to)
  console.log('from->', from)
  // to.matched是匹配到的路由数据，是一个数组
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // 没有登录状态
    if (!store.state.user) {
      // 跳转登录页面
      next({
        name: 'login',
        query: {
          // 通过 url 传递 查询字符串参数
          redirect: to.fullPath // 登录成功需要返回的页面告诉登录页面
        }
      })
    } else {
      next() // 允许通过
    }
  } else {
    next() // 确保一定要调用 next()
  }
})

export default router
