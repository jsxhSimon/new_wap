<template>
  <div class="updatenickname">
    <div class="box-nicheng">
      <span>{{ $t('新昵称') }}</span>
      <div class="form row items-center nickname--color">
        <q-input
          v-model="newNickname"
          :placeholder="$t('4-30位中文、英文、数字')"
          dense
          class="q-ml-lg col nickname"
          borderless
          @update:model-value="validNewNickname"
        />
      </div>
      <div class="text-overline text-red-6 q-ml-sm" v-show="newNickIsErr">
        {{ $t('输入格式不正确，请重新输入') }}
      </div>
    </div>
    <q-btn
      :label="$t('提 交')"
      :disable="!valid"
      :color="!valid ? 'unvalid-btn' : 'valid-btn'"
      :loading="isLoading"
      :class="['submit', !valid?'unvalid-btn':'valid-btn']"
      @click="handleSubmit"
    />
    <q-dialog v-model="alert" position="top">
      <q-card style="width: 350px">
        <q-card-section class="row items-center no-wrap">
          <div>
            <div class="text-weight-bold">{{ $t('提示') }}</div>
            <div class="text-grey">{{ $t('昵称修改成功') }}</div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from 'src/stores';

const router = useRouter()
const userStore = useUserStore()
const newNickname = ref('')
const isLoading = ref(false)
const valid = ref(false)
const newNickIsErr = ref(false)
const alert = ref(false)

watch(
  () => newNickname.value,
  () => {
    validNewNickname()
  }
)

const validNewNickname = () => {
  const flag = !new RegExp("[`~')}}#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？1234567890]").test(newNickname.value)
  if (flag && newNickname.value.length >= 4 && newNickname.value.length <= 30) {
    newNickIsErr.value = false
    valid.value = true
  } else {
    newNickIsErr.value = true
    valid.value = false
  }
}

const handleSubmit = () => {
  isLoading.value = true
  userStore.getUpdateNicknameForSptv(newNickname.value)
    .then(() => {
      newNickname.value = ''
      isLoading.value = false
      router.go(-1)
    })
}
</script>

<style lang="scss" scoped>
.box-nicheng{
  margin: 10px 14px 0 14px;
  padding: 20px;
  background: var(--bg1);
  box-shadow: var(--box-shadow);
  border-radius: 8px;
  font-size: 14px;
  font-weight: 400;
  color: var(--t2);
  line-height: 20px;
}
.form {
  // border: 1px solid rgba($color: #999, $alpha: 0.1);
  border-radius: 4px;
  padding: 0 20px;
}
.nickname--color {
  color: var(--t1);
  background: var(--input-bg);
  padding: 0;
  margin-top: 5px;
}
.nickname{
  background: var(--input-bg);
  margin: 0 0 0 10px;
}
.submit {
  width: 255px;
  height: 40px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 600;
  background: var(--lg2);
  color: var(--t5) !important;
  border-radius: 20px !important;
  line-height: 20px;
  margin-top: 20px;
  margin-left: 60px;
  &.unvalid-btn{
    opacity: .5 !important;
  }
  &.valid-btn{
    opacity: 1 !important;
  }
}
</style>
