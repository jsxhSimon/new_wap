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
    </q-list>
  </q-page>
</template>

<script setup lang="ts">
import headerFemaleImg from 'images/common/headerFemale.png'
import headerMaleImg from 'images/common/headerMale.png'
import { useUserStore } from 'src/stores'

const userStore = useUserStore()
</script>

<style lang="scss">
.setting-page {
  
}
</style>