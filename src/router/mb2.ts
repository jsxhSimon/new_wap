import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
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
      }
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