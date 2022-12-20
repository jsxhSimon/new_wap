<template>
  <q-page class="help-center-page">
    <div class="input-container">
      <van-cell-group inset>
        <van-field v-model="searchVal" :placeholder="$t('搜索游戏或者问题')">
          <template #label>
            <span class="iconfont icon-wangdianquanxihuaxiangICON-06"></span>
          </template>
          <template #button>
            <van-button size="small" type="primary" @click="searchBtnClick">{{ $t('搜索') }}</van-button>
          </template>
        </van-field>
      </van-cell-group>
    </div>

    <van-collapse v-model="firstActiveName" accordion ref="collapseRef">
      <van-collapse-item :title="item.helpCategoryName" :name="item.id" v-for="(item, index) in categoryList"
        :key="index" :is-link="false" :readonly="!item.categoryDetail" title-class="outer_item" ref="collapseItemRef">
        <van-collapse v-model="secondeActiveName" accordion v-if="item.categoryDetail" :border="false">
          <van-collapse-item :title="_.titleName" :name="_.id" v-for="(_,
          i) in item.categoryDetail" :key="i" :is-link="false" title-class="inner_item"
            @click="itemClick(_.titleName)">
            <div class="content_wrapper">
              <div class="content_item" v-for="(c, j) in _.oprHelpContentList" :key="j">
                <div class="content_item_title">{{ c.contentTitle }}</div>
                <div class="content_item_msg">{{ c.helpContent }}</div>
              </div>
            </div>
          </van-collapse-item>
        </van-collapse>
      </van-collapse-item>
    </van-collapse>
  </q-page>
</template>
  
<script setup lang='ts'>

import { Notify } from 'quasar';
import { i18n } from 'boot/i18n'
import { useUserStore } from 'src/stores';
import { Field as VanField, CellGroup as VanCellGroup, Button as VanButton, Collapse as VanCollapse, CollapseItem as VanCollapseItem } from 'vant';

import { onBeforeMount, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
const firstActiveName = ref<number>();
const secondeActiveName = ref<number>();
const searchVal = ref<string>('');
const userState = useUserStore();
const categoryList = reactive<MineAPI.ICategoryList[]>([])
const { t: lang } = i18n.global
const router = useRouter()

onBeforeMount(() => {
  _initCategoryList()
})

const _initCategoryList = async () => {
  const res = await userState.helpCategoryList()
  if (res.code) return
  categoryList.push(...res.categoryList);
  const tempList: Promise<any>[] = [];
  categoryList.forEach((_: MineAPI.ICategoryList) => tempList.push(userState.findTitleAndContent({ id: _.id })))
  const contentRes = await Promise.all(tempList);
  contentRes.forEach((_, i: number) => {
    categoryList[i].categoryDetail = _.categoryDetail;
  })
}

const searchBtnClick = () => {
  if (!searchVal.value) {
    return Notify.create({
      message: lang('搜索内容不能为空'),
    })
  }
  categoryList.some(item => {
    const findRes = item.categoryDetail && item.categoryDetail.some(_ => {
      if (_.titleName.includes(searchVal.value)) {
        secondeActiveName.value = _.id;
        firstActiveName.value = item.id;
        return true;
      } else {
        return false;
      }
    })
    if (!findRes && item.helpCategoryName.includes(searchVal.value)) {
      secondeActiveName.value = -1;
      return firstActiveName.value = item.id;
    }
    return false;
  })
}

const itemClick = (_: string) => {
  const mapArr = ['USDT充值教程', 'USDT存款教程', 'USDT购买教程'];
  if (mapArr.includes(_)) {
    router.push({
      path: '/mine/usdtTeach',
    })
  }
}

</script>
  
<style lang="scss">
.help-center-page {
  padding: 0 14px;
}

.input-container {
  margin: 10px 0 20px;
}

.van-cell-group {
  margin: 0;
}

.van-cell {
  padding: 0;
  height: 40px;
  padding: 0 5px 0 12px;
}

.van-field__label {
  display: flex;
  align-items: center;
  margin-right: 5px;
  width: auto;
  color: var(--t4);
}

.van-field__value {
  display: flex;
  align-items: center;
}

.van-field__body {
  width: 100%;
}

.van-button--small {
  padding: 0 15px !important;
  background: var(--lg);
  border: none;
  font-size: 14px;
  height: 30px;
}

.van-cell__title {
  display: flex;
  align-items: center;
}

.van-cell--clickable:active {
  background-color: var(--bg1);
}

.outer_item {
  color: var(--t2);
}

.inner_item {
  color: var(--theme-text-color);
}

.content_wrapper {
  background-color: var(--body-bg);
  font-size: 12px;
  color: var(--t2);
  padding: 10px;

  .content_item {
    margin-bottom: 20px;

    .content_item_title {
      margin-bottom: 10px;
    }

    .content_item_msg {
      padding-left: 10px;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>