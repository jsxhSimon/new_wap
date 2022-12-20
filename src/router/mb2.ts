import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/refresh',
    meta: {
      title: '刷新跳转',
      loginFree: false,
    },
    component: () => import('components/Refresh.vue'),
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        meta: {
          title: '主页',
          loginFree: true,
          footerVisible: true,
          isBack: true,
          hideHeader: true,
        },
        component: () => import('pages/home/Home.vue')
      },
      {
        path: '/sports',
        component: () => import(/* webpackChunkName: "sports" */ 'pages/sports/index.vue'),
        meta: {
          footerVisible: true,
          hideHeader: true,
        },
      },
      {
        path: '/minePage',
        meta: {
          title: '我的',
          footerVisible: true,
          showKf: true,
        },
        component: () => import('pages/mine/Mypage.vue')
      },
      {
        path: 'mine/setting',
        meta: {
          title: '个人资料',
          showKf: true,
        },
        component: () => import(/* webpackChunkName: "mineSetting" */ 'pages/mine/Setting.vue'),
      },
      {
        path: 'mine/updateNickname',
        meta: {
          title: '昵称修改',
        },
        component: () => import(/* webpackChunkName: "mineUpdateNickname" */ 'pages/mine/UpdateNickname.vue'),
      },
      {
        path: 'mine/helpCenter',
        meta: {
          title: '帮助中心',
          showKf: true,
          // hideHeader: true,
        },
        component: () => import(/* webpackChunkName: "HelpCenter" */ 'pages/mine/HelpCenter.vue'),
      },
      {
        path: 'vip',
        meta: {
          title: '我的VIP',
          // hideHeader: true,
        },
        component: () => import(/* webpackChunkName: "mineVip" */ 'pages/vip/index.vue'),
      },
      {
        path: 'mySponsor',
        meta: {
          title: '历史赞助',
        },
        component: () => import(/* webpackChunkName: "mySponsor" */ 'pages/mySponsor/index.vue'),
      },
      {
        path: 'vipDetails',
        meta: {
          title: 'VIP详情',
          showKf: true,
        },
        component: () => import(/* webpackChunkName: "mineVipDetail" */ 'pages/vip/details.vue'),
      },
      {
        path: 'mine/transaction-records',
        meta: {
          title: '支付',
          hideHeader: true,
          footerVisible: true,
        },
        component: () => import(/* webpackChunkName: "mine" */ 'pages/mine/TransactionRecords.vue'),
      },
      {
        path: 'mine/setting/:field',
        meta: {
          title: ({ params }) => {
            const mapper: Record<string, string> = {
              realName: '真实姓名',
              mobile: '手机号码',
              email: '认证邮箱',
              pwd: '更改密码',
              gender: '性别',
              // birth: '修改出生日期',
              birthday: '出生日期',
            }
            const { field } = params
            return mapper[field]
          },
          showKf: true,
        },
        component: () => import(/* webpackChunkName: "mine" */ 'pages/mine/SettingItem.vue'),
      },
    ],
  },
  {
    path: '/login/:field?',
    meta: {
      title: ({ params }) => {
        const mapper: any = {
          login: '登录页',
          register: '注册页',
          resetPass: '忘记密码',
        }
        return mapper[params.field ?? 'login']
      }
    },
    component: () => import('pages/login/index.vue')
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('src/pages/ErrorNotFound.vue'),
  },
];

export default routes;
