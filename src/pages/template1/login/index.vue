<template>
  <div class="login-page">
    <div class="login-bg"></div>
    <div class="logo-box">
      <img src="~site_theme_images/logo.png" />
    </div>
    <div class="main-container mt-60">
      <Login v-if="type === 'login'" @toggleUserInfo="toggleUserInfo" />
      <Register v-if="type === 'register'" @toggleUserInfo="toggleUserInfo" />
      <Reset v-if="type === 'resetPass'" @toggleUserInfo="toggleUserInfo" />
    </div>
    <div class="partner-pic">
      <div class="partner-title">
        {{ $t('合作伙伴') }}
      </div>
      <div class="partner-list">
        <div class="partner">
          <div class="logo com"></div>
          <div class="name">
            <p>{{$t('英国GC')}}</p>
            <p>{{$t('监督委员会')}}</p>
          </div>
        </div>
        <div class="partner">
          <div class="logo mga"></div>
          <div class="name">
            <p>{{$t('马耳他牌照')}}</p>
            <p>{{$t('(MGA)认证')}}</p>
          </div>
        </div>
        <div class="partner">
          <div class="logo fsc"></div>
          <div class="name">
            <p>{{$t('英属维尔京剧院')}}</p>
            <p>{{$t('(BVI)认证')}}</p>
          </div>
        </div>
        <div class="partner">
          <div class="logo pag"></div>
          <div class="name">
            <p>{{$t('菲律宾')}}</p>
            <p>{{$t('(PAGCOR)监督牌照')}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import Login from './Login.vue'
import Register from './Register.vue'
import Reset from './Reset.vue'

const router = useRouter()
const route = useRoute()
const type = computed(() => {
  return route.params?.field || 'login'
})

const toggleUserInfo = (type: string) => {
  router.push(type !== 'login' ? `/login/${type}` : '/login')
}
</script>

<style lang="scss">
  .login-page {
    .login-bg {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('images/login/login-bg.jpg') no-repeat center top;
      background-size: cover;
      z-index: -1;
    }
    .logo-box {
      padding-top: 60px;
      margin-bottom: 28px;
      img {
        display: block;
        height: 42px;
        margin-left: auto;
        margin-right: auto;
      }
    }
    .app-logo {
      width: 173px;
      height: 42px;
      margin: 0 auto;
      background: url('site_images/logo.png') no-repeat center center;
      background-size: contain;
    }
    .main-container {
      width: 251px;
      margin: 0 auto;
    }
    .partner-pic {
      margin-top: 20px;
      text-align: center;
      color: var(--t2);
      margin-bottom: 60px;
      .partner-title {
        display: inline-block;
        width: auto;
        position: relative;
        font-weight: 600;
        margin-bottom: 10px;
        &:after,
        &:before {
          content: "";
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          width: 40px;
          height: 1px;
        }
        &:before {
          left: -55px;
          background: var(--partner-line-left-bg);
        }
        &:after {
          right: -55px;
          background: var(--partner-line-right-bg);
        }
      }
      .partner-list {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        padding: 0 55px;
        .partner {
          font-size: 8px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          flex: 1;
          .logo {
            width: 44px;
            height: 44px;
            background-repeat: no-repeat;
            background-position: center center;
            background-size: contain;
            margin-bottom: 5px;
            @each $icon in com mga fsc pag {
              &.#{$icon} {
                background-image: url("images/login/partner-" + $icon + ".png");
              }
            }
          }
          .name {
            white-space: nowrap;
          }
        }
      }
    }
    .sign-dialog-field {
      .q-field__marginal {
        height: 100%;
      }
      .q-field__inner {
        background: var(--login-input-bg);
        border-radius: 22px;
        padding-right: 10px;
        .q-field__prepend {
          .iconfont {
            width: 44px;
            text-align: center;
          }
          padding-right: 0;
          justify-content: center;
          .iconfont {
            color: var(--t1);
            font-size: 18px;
          }
        }
        .relative-position {
          .q-field__native {
            color: var(--t2);
          }
          height: var(--login-input-height);
          line-height: var(--login-input-height);
        }
      }
    }
    .noCountToRegister {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 13px;
    }
  }
</style>