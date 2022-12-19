<template>
  <q-page class="transaction-records">
    <BalanceHeader />
    <q-pull-to-refresh
      @refresh="refresh"
      color="yellow-9"
      bg-color="white-10"
      icon="refresh"
    >
      <div class="four-btn">
        <q-btn
          outline
          class="unselected-btn"
          :label="$t('存款')"
          @click="$router.push('/wallet/deposit')"
        />
        <q-btn
          outline
          class="unselected-btn"
          :label="$t('提款')"
          @click="$router.push('/wallet/withdraw')"
        />
        <q-btn outline class="selected-btn" :label="$t('交易记录')" />
        <q-btn
          outline
          class="unselected-btn"
          :label="$t('银行卡')"
          @click="$router.push('/mine/bank-cards')"
        />
      </div>
      <div class="transaction-records-tabs__wrapper">
        <TransactionRecordsTabs
          v-model="activeTab"
          @change="handleActiveTabChange"
        />
      </div>
    </q-pull-to-refresh>

    <van-list
      ref="scrollWrapper"
      v-model:loading="loading"
      :finished="finished"
      @load="scrollPullUpLoad"
      class="scroll-wrapper"
    >
      <div class="scroll-wrapper--expend">
        <!-- 赞无数据 -->
        <div
          v-if="listGroup.length === 0 && finished"
          class="column items-center q-pt-xl no-data-img-wrap"
        >
          <q-img class="no-data-img" :src="emptyIconImg" />
        </div>

        <q-list v-else separator>
          <!-- 存款列表 -->
          <template v-if="activeTab === 'deposit'">
            <q-item
              v-for="item in listGroup"
              :key="item.id"
              class="items-end border-primary q-px-none"
            >
              <q-item-section side>
                <span class="text-caption text-no-wrap">{{
                  timeFilter(item.createTime, 'YYYY-MM-DD HH:mm')
                }}</span>
                <span class="text-caption name">{{
                  item.depositTypeName
                }}</span>
              </q-item-section>
              <q-item-section> </q-item-section>
              <q-item-section side>
                <span class="amount">{{ amountFilter(item.depositAmount) }}{{ envStore.envCurrencySymbol }}</span
                >
                <span
                  v-if="item.status === 0"
                  class="text-negative text-caption status"
                  >{{ $t('失败') }}</span
                >
                <span
                  v-if="item.status === 1"
                  class="text-positive text-caption status"
                  >{{ $t('成功') }}</span
                >
                <span
                  v-if="item.status === 2"
                  class="text-info text-caption status"
                  >{{ $t('处理中') }}</span
                >
              </q-item-section>
            </q-item>
          </template>
          <!-- 提款列表 -->
          <template v-if="activeTab === 'withdraw'">
            <q-item
              v-for="item in listGroup"
              :key="item.id"
              class="items-center border-primary q-pb-md q-px-none"
            >
              <q-item-section side class="on-left">
                <span class="text-caption text-no-wrap">{{
                  timeFilter(item.createTime, 'YYYY-MM-DD HH:mm')
                }}</span>
              </q-item-section>
              <q-item-section>
                <span class="amount center-amount">{{ amountFilter(item.drawingAmount) }}{{ envStore.envCurrencySymbol }}</span
                >
              </q-item-section>
              <q-item-section side>
                <span
                  v-if="item.status === 0 || item.status === 7"
                  class="text-negative text-caption"
                  >{{ $t('失败') }}</span
                >
                <span
                  v-if="item.status === 1"
                  class="text-positive text-caption"
                  >{{ $t('成功') }}</span
                >
                <span v-if="item.status === 2" class="text-info text-caption"
                  >{{ $t('处理中') }}</span
                >
                <span v-if="item.status === 3" class="text-info text-caption"
                  >{{ $t('出款中') }}</span
                >
                <span v-if="item.status === 6" class="text-info text-caption"
                  >{{ $t('审核中') }}</span
                >
              </q-item-section>
            </q-item>
          </template>
          <!-- 优惠列表 -->
          <template v-if="activeTab === 'coupons'">
            <q-item
              v-for="item in listGroup"
              :key="item.orderNo"
              class="items-end border-primary q-pb-md q-px-none"
            >
              <q-item-section side style="max-width: 70%">
                <span class="text-caption text-no-wrap">{{
                  timeFilter(item.applicationTime, 'YYYY-MM-DD HH:mm')
                }}</span>
                <span class="text-caption name">{{ item.tmplName }}</span>
              </q-item-section>

              <q-item-section> </q-item-section>

              <q-item-section side>
                <span v-if="item.prizetype === 1" class="text-caption amount">{{
                  item.prizename
                }}</span>
                <span v-else class="text-caption amount"

                  >{{ amountFilter(item.bonusAmount) }}{{ envStore.envCurrencySymbol }}</span
                >
                <span
                  v-if="item.status === 0"
                  class="text-negative text-caption status"
                  >{{ $t('拒绝') }}</span
                >
                <span
                  v-if="item.status === 1"
                  class="text-positive text-caption status"
                  >{{ $t('已发放') }}</span
                >
                <span
                  v-if="item.status === 2"
                  class="text-info text-caption status"
                  >{{ $t('处理中') }}</span
                >
              </q-item-section>
            </q-item>
          </template>
          <!-- 奖补列表 -->
          <template v-if="activeTab === 'bonus'">
            <q-item
              v-for="item in listGroup"
              :key="item.orderNo"
              class="items-end border-primary q-pb-md q-px-none"
            >
              <!-- <template v-if="item.auditAddType === 0 || item.auditAddType === 1 ||item.auditAddType === 3"> -->
              <q-item-section side>
                <span class="text-caption text-no-wrap">{{
                  timeFilter(item.createTime, 'YYYY-MM-DD HH:mm')
                }}</span>
                <span class="text-caption name" v-if="item.auditAddType === 0"
                  >{{ $t('优惠增加') }}</span
                >
                <span class="text-caption name" v-if="item.auditAddType === 1"
                  >{{ $t('额度补回') }}</span
                >
                <span class="text-caption name" v-if="item.auditAddType === 2"
                  >{{ $t('入款冲销') }}</span
                >
                <span class="text-caption name" v-if="item.auditAddType === 3"
                  >{{ $t('其他') }}</span
                >
                <span class="text-caption name" v-if="item.auditAddType === 4"
                  >{{ $t('代理充值') }}</span
                >
              </q-item-section>

              <q-item-section> </q-item-section>

              <q-item-section side>
                <span class="text-caption amount"
                  >{{ amountFilter(item.actualArrival) }}{{ envStore.envCurrencySymbol }}</span
                >
                <span
                  v-if="item.status === 0"
                  class="text-negative text-caption status"
                  >{{ $t('拒绝') }}</span
                >
                <span
                  v-if="item.status === 1"
                  class="text-positive text-caption status"
                  >{{ $t('已发放') }}</span
                >
                <span
                  v-if="item.status === 2"
                  class="text-info text-caption status"
                  >{{ $t('处理中') }}</span
                >
              </q-item-section>
            </q-item>
          </template>
          <!-- 洗码列表 -->
          <template v-if="activeTab === 'washcode'">
            <q-item
              v-for="item in listGroup"
              :key="item.orderNo"
              class="items-end border-primary q-pb-md q-px-none"
            >
              <q-item-section side>
                <span class="text-caption text-no-wrap">{{
                  timeFilter(item.applicationTime, 'YYYY-MM-DD HH:mm')
                }}</span>
                <span class="text-caption name"
                  >{{ item.catName }}-{{ item.depotName }}</span
                >
              </q-item-section>

              <q-item-section> </q-item-section>

              <q-item-section side>
                <span class="text-caption amount">{{ amountFilter(item.amount) }}{{ envStore.envCurrencySymbol }}</span
                >
                <span
                  v-if="item.status === 0"
                  class="text-negative text-caption status"
                  >{{ $t('拒绝') }}</span
                >
                <span
                  v-if="item.status === 1"
                  class="text-positive text-caption status"
                  >{{ $t('已发放') }}</span
                >
                <span
                  v-if="item.status === 2"
                  class="text-info text-caption status"
                  >{{ $t('处理中') }}</span
                >
              </q-item-section>
            </q-item>
          </template>
        </q-list>
      </div>
      <template #loading></template>
    </van-list>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ComponentPublicInstance } from 'vue'
import { SessionStorage } from 'quasar';

interface IInstance extends ComponentPublicInstance {
  onChangeActiveTab: (str: string) => void
}

export default defineComponent({
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      const instance = vm as IInstance
      if (from.fullPath === '/refresh') {
        instance.onChangeActiveTab(SessionStorage.getItem('activeTabCache') ?? '')
      } else {
        instance.onChangeActiveTab('deposit')
      }
    })
  }
})
</script>

<script setup lang="ts">
import { ref, onMounted, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { usePayStore, useEnvStore } from 'src/stores';
import useFilter from 'src/hooks/useFilter'
import emptyIconImg from 'images/common/No-data-status-page-bg@3x.png'
import { getminheight } from 'src/utils/tool'
import BalanceHeader from 'src/components/BalanceHeader.vue';
import { List as VanList } from 'vant'
import TransactionRecordsTabs from './TransactionRecordsTabs.vue';

const { amountFilter, timeFilter } = useFilter()
const router = useRouter()
const payStore = usePayStore()
const envStore = useEnvStore()
const activeTab = ref('')
const pageNo = ref(1)
const finished = ref(false)
const listGroup = ref<ITransactionRecord[]>([])
const scrollWrapper = ref<any>(null)
const loading = ref(false)

onMounted(() => {
  (document.querySelector('.scroll-wrapper') as HTMLDivElement).style.height = `${getminheight('body', 191)}px`
})

const refresh = () => {
  SessionStorage.set('activeTabCache', activeTab.value)
  router.replace({
    path: '/refresh',
  })
}

const handleActiveTabChange = () => {
  pageNo.value = 1
  listGroup.value = []
  finished.value = false
  // getListGroup()
  // scrollWrapper.value?.scrollTo(0, 0)
}

const scrollPullUpLoad = () => {
  getListGroup()
}

const getListGroup = () => {
  if (finished.value) return
  payStore.getTransactionRecords(activeTab.value, { pageNo: pageNo.value })
    .then((data) => {
      listGroup.value.push(...(data.list || data.page.list))
      if (listGroup.value.length >= (data.totalCount ?? data.page.totalCount)) {
        finished.value = true
      } else {
        pageNo.value += 1
      }
    }).finally(() => loading.value = false)
}

const onChangeActiveTab = (tab: string) => {
  activeTab.value = tab
}

defineExpose({
  onChangeActiveTab,
})
</script>

<style lang="scss" scoped>
.no-data-img-wrap {
  .no-data-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: var(--placeholder-img-opacity);
  }
  .no-data-text {
    color: var(--placeholder-text);
  }
}

.transaction-records {
  // padding-top: 45px;
  // background: #000;

  .text-negative {
    color: #f44949 !important;
  }

  .text-positive {
    color: #26c97f !important;
  }
  .four-btn {
    padding-top: 10px;
    padding-bottom: 10px;
    background: #f8f8f8;
    display: flex;
    justify-content: space-evenly;
    :deep(.q-btn--outline:before) {
      border: none;
    }
    :deep(.block) {
      padding-bottom: 0;
      white-space: nowrap;
    }
    z-index: 1;
    .selected-btn {
      width: 79px;
      height: 32px;
      // line-height: 1px;
      background: var(--lg) !important;
      color: var(--t5);
      // margin-right:10px;
      font-size: 14px;
      font-family: PingFangSC-Regular;
    }
    .unselected-btn {
      width: 79px;
      height: 32px;
      background: var(--lg5) !important;
      color: var(--t2);
      font-size: 14px;
      font-family: PingFangSC-Regular;
    }
    :deep(.q-btn__wrapper) {
      padding-left: 0px;
      padding-right: 0px;
    }
  }
  .q-item {
    margin: 0 10px 0px 10px;
    padding: 8px;
    background: linear-gradient(180deg, #EFF0F9 2.4%, #DFE5F3 100%);
    box-shadow: 0px 2px 4px rgba(76, 78, 129, 0.25);
    color: #505679;
    border-radius: 5pt;
    margin-bottom: 8px;
    .text-caption {
      font-size: 11px;
      color: var(--t2);
    }
    .name {
      padding-top: 5px;
      font-size: 12px;
    }
    .status {
      padding-top: 5px;
    }
    .amount {
      font-size: 12px;
      line-height: 13pt;
      color: #E49A73;
    }
    .center-amount {
      text-align: center;
    }
  }
  .transaction-records-tabs__wrapper {
    margin-bottom: 10px;
  }
  .scroll-wrapper {
    position: relative;
    overflow: hidden;
  }
  .scroll-wrapper--expend {
    min-height: 100%;
  }
  :deep(.q-btn--outline .q-btn__wrapper:before) {
    border: 0;
    // background: #F8F8F8;
  }
}
:deep(.q-tab--active .q-tab__indicator) {
  height: 1px;
}
:deep(.q-page-container) {
  background: #000;
}
</style>
