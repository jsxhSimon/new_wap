<template>
  <q-page class="setting-page">
    <q-list class="setting-list">
      <div class="setting q-mt-sm">
        <span class="title">{{ $t('头像') }}</span>
        <q-img
          class="task-center-btn"
          :src="
            userStore.userInfo.gender === '女' ? headerFemaleImg : headerMaleImg
          "
        />
      </div>

      <div class="cardList shadow-1 box-style">
        <q-item v-ripple clickable :disable="!!userStore.userInfo.loginName">
          <q-item-section>
            <q-item-label>{{ $t('用户名') }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="row items-center">
              <span v-if="userStore.userInfo.loginName" class="disable text-caption">{{
                userStore.userInfo.loginName
              }}</span>
              <span v-else class="no-input"
                >{{ $t('姓名需与银行卡持卡人姓名一致,否则无法提款') }}</span
              >
              <div
                class="account-setting-side row justify-end"
                v-if="!userStore.userInfo.loginName"
              >
                <q-icon size="sm" name="keyboard_arrow_right" />
              </div>
            </div>
          </q-item-section>
        </q-item>

        <q-item v-ripple clickable class="q-pr-sm" to="/mine/updateNickname">
          <q-item-section>
            <q-item-label>{{ $t('昵称') }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="row items-center">
              <span class="no-input nickname--txt">{{
                userStore.nickNameInfo.nickName
              }}</span>
              <div class="account-setting-side row justify-end">
                <q-icon size="sm" name="keyboard_arrow_right" />
              </div>
            </div>
          </q-item-section>
        </q-item>

        <q-item
          v-ripple
          clickable
          to="/mine/setting/realName"
          :disable="!!userStore.userInfo.realName"
        >
          <q-item-section>
            <q-item-label>{{ $t('真实姓名') }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <div class="row items-center">
              <span class="no-input" v-if="!userStore.userInfo.realName"
                >{{ $t('需与银行卡特卡人姓名一致，否则无法提款') }}</span
              >
              <span class="disable text-caption" v-else>{{
                realNameFilter(userStore.userInfo.realName)
              }}</span>
              <div
                class="account-setting-side row justify-end"
                v-if="!userStore.userInfo.realName"
              >
                <q-icon size="sm" name="keyboard_arrow_right" />
              </div>
            </div>
          </q-item-section>
        </q-item>

        <q-item
          v-ripple
          clickable
          to="/mine/setting/gender"
          :disable="!!userStore.userInfo.gender"
        >
          <q-item-section>
            <q-item-label>{{ $t('性别') }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <div class="row items-center">
              <span class="disable">{{ userStore.userInfo.gender }} </span>
              <div
                class="account-setting-side row justify-end"
                v-if="!userStore.userInfo.gender"
              >
                <q-icon size="sm" name="keyboard_arrow_right" />
              </div>
            </div>
          </q-item-section>
        </q-item>
      </div>

      <div class="cardList shadow-1 box-style">
        <q-item
          v-ripple
          clickable
          class="q-pr-sm"
          to="/mine/setting/birthday"
          :disable="!!userStore.userInfo.birthday"
        >
          <q-item-section>
            <q-item-label>{{ $t('出生日期') }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="row items-center">
              <span class="no-input" v-if="!userStore.userInfo.birthday"
                >{{ $t('添加日期，确保您已满18周岁') }}</span
              >
              <span class="text-caption disable" v-else>{{
                userStore.userInfo.birthday
                  ? userStore.userInfo.birthday
                  : $t("添加日期，确保您已满18周岁")
              }}</span>
              <div
                class="account-setting-side row justify-end"
                v-if="!userStore.userInfo.birthday"
              >
                <q-icon size="sm" name="keyboard_arrow_right" />
              </div>
            </div>
          </q-item-section>
        </q-item>
        <q-item
          v-ripple
          clickable
          class="q-pr-sm"
          to="/mine/setting/mobile"
          :disable="!!userStore.userInfo.mobile"
        >
          <q-item-section>
            <q-item-label>{{ $t('手机号码') }}</q-item-label>
          </q-item-section>
          <q-item-section side>
            <div class="row items-center">
              <span v-if="userStore.userInfo.mobile" class="disable">{{
                mobileFilter(userStore.userInfo.mobile)
              }}</span>
              <span v-else class="no-input">{{ $t('绑定手机号码') }}</span>

              <div
                class="account-setting-side row justify-end"
                v-if="!userStore.userInfo.mobile"
              >
                <q-icon size="sm" name="keyboard_arrow_right" />
              </div>
            </div>
          </q-item-section>
        </q-item>
        <q-item
          v-ripple
          clickable
          class="q-pr-sm"
          to="/mine/setting/email"
          :disable="!!userStore.userInfo.email"
        >
          <!-- :disable="!!userInfo.email" -->
          <q-item-section>
            <q-item-label>{{ $t('电子邮箱') }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="row items-center">
              <span class="disable text-caption" v-if="userStore.userInfo.email">{{
                emailFilter(userStore.userInfo.email)
              }}</span>
              <span class="no-input" v-else>{{ $t('绑定邮箱保护账号安全') }}</span>

              <div
                class="account-setting-side row justify-end"
                v-if="!userStore.userInfo.email"
              >
                <q-icon size="sm" name="keyboard_arrow_right" />
              </div>
            </div>
          </q-item-section>
        </q-item>
      </div>

      <div class="cardList shadow-1 box-style" @click="$router.push('/mine/setting/pwd')">
        <q-item class="q-pr-sm">
          <q-item-section>
            <q-item-label>{{ $t('修改密码') }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="row items-center">
              <div class="account-setting-side row justify-end">
                <q-icon size="sm" name="keyboard_arrow_right" />
              </div>
            </div>
          </q-item-section>
        </q-item>
      </div>

      <div class="cardList shadow-1 box-style" v-if="isCordovaShake">
        <q-item class="q-pr-sm">
          <q-item-section>
            <q-item-label>{{ $t('震动设置') }}</q-item-label>
          </q-item-section>

          <q-item-section side>
            <div class="row items-center">
              <div class="account-setting-side row justify-end switch">
                <van-switch
                  v-model="vibrationVal"
                  size="28px"
                  @change="changeVibration"
                />
              </div>
            </div>
          </q-item-section>
        </q-item>
      </div>

      <div class="tips">
        <span class="text-mark">{{ $t('为了您的隐私安全，信息在确认后将无法修改。需要帮助，请') }}<i class="theme-color" @click="$router.push('/customerService')">{{ $t('联系客服') }}</i></span>
      </div>
    </q-list>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import headerFemaleImg from 'images/common/headerFemale.png'
import headerMaleImg from 'images/common/headerMale.png'
import { useUserStore } from 'src/stores'
import useFilter from 'src/hooks/useFilter'
import { LocalStorage, Platform } from 'quasar'

const { realNameFilter, mobileFilter, emailFilter } = useFilter()

const userStore = useUserStore()
const vibrationVal = computed(() => {
  return !(LocalStorage.getItem('vibrationVal') === 'off')
})
const isCordovaShake = computed(() => {
  return Platform.is.cordova && Platform.is.ios && window.testModel && window.testModel.appshakemethod
})

const changeVibration = (val: boolean) => {
  if (val) {
    LocalStorage.set('vibrationVal', 'on')
  } else {
    LocalStorage.set('vibrationVal', 'off')
  }
}
</script>

<style lang="scss">
.set-box{
  background:#F8F9FD;
}
.setting-list {
  .disabled {
    opacity: 1 !important;
  }
  .van-switch__node {
    background: #fff;
  }
}
.cardList {
  margin: 10px 0 !important;
  border-radius: 10px;
  padding: 0 10px;
  // background: var(--bg-2);
  .q-item {
    min-height: 40px !important;
    border-bottom: 1px solid rgba($color: #999, $alpha: 0.2);
    &:last-child {
      border-bottom: none;
    }
  }
}
.datepick {
  padding: 0;
}
</style>
<style lang="scss" scoped>
.account-setting-side {
  width: 24px;
}
.account-setting-side.switch{
  width: auto;
}
.box-style {
  background: var(--bg1);
  border-radius: 10px;
}
.setting-list {
  padding: 0 10px;
  color: var(--text-label2);
  border-radius: 10px;
  font-size: 14px;
  .q-icon {
    color: var(--t2);
  }
  .q-item {
    padding: 0 !important;
  }
  .q-item__label {
    font-size:14px;
    color: var(--primary-text);
  }
  .tips {
    margin-top: 10px;
    span {
      color: var(--t2);
      display: block;
      text-align: left;
      font-size: 13px;
      i {
        font-style: normal;
        color: var(--t7);
      }
    }
  }
  .setting {
    padding: 0 10px;
    // border: 1px solid rgba($color: #999, $alpha: 0.1);
    width: 100%;
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--bg1);
    // background: var(--bg-2);
    .task-center-btn {
      height: 40px;
      width: 40px;
    }
    .items-center {
      .text-primary {
        font-size: 12px;
      }
    }
    border-radius: 10px;
  }
  .disable {
    color: var(--text-label);
  }
  .no-input {
    color: var(--text-label2);
    font-size: 10px;
  }
  .nickname--txt {
    color: var(--primary-text);
  }
}
.exit {
  text-align: center;
  font-size: 18px;
  color: #444444;
  line-height: 40px;
  margin: 20px auto 0 auto;
  width: 306px;
  height: 40px;
  // background: url("~images/common/but-quit@2x.png");
  background: linear-gradient(180deg, #FBBB98 0%, #E1956E 100%);
  border-radius: 21px;
  background-size: 100% 100%;
}
</style>
