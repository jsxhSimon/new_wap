<template>
  <van-popup
    position="bottom"
    v-model:show="newShow"
    get-container="#q-app"
    round
    @click-overlay="onClose"
  >
    <div class="area-code-list">
      <input type="text" placeholder="输入国家名称、区号搜索" v-model="areaText">
      <div class="list-box">
        <div class="list">
          <div class="item" @click="onClick(code)" v-for="code in areaCodeList" :key="code.id">
            <span>{{ code.countryName }}</span> <span class="remark">+{{ code.mobileAreaCode }}</span>
          </div>
        </div>
      </div>
    </div>
  </van-popup>
</template>

<script setup lang="ts">
import { Popup as VanPopup } from 'vant'
import { ref, computed } from 'vue'
import { useSysStore } from 'src/stores/sys'

interface Props {
  show: boolean;
}
const props = defineProps<Props>()

const emits = defineEmits(['update:show', 'change', 'close'])

const sysStore = useSysStore()
const areaText = ref('')
const areaCodeList = computed(() => {
  return sysStore.areaCodes.filter(item => item.countryName.includes(areaText.value) || item.mobileAreaCode.includes(areaText.value))
})
const newShow = computed({
  get() {
    return props.show
  },
  set(val) {
    emits('update:show', val)
  }
})

const onClick = (code: IAreaCode) => {
  emits('change', code.mobileAreaCode)
  areaText.value = ''
}

const onClose = () => {
  emits('close')
}
</script>

<style lang="scss">
.area-code-list {
  padding: 20px 16px 10px;
  color: var(--t1);
  font-size: 14px;
  input {
    line-height: 38px;
    display: block;
    width: 100%;
    border: 1px solid #eee;
    margin-bottom: 10px;
    border-radius: 6px;
    outline: none;
    box-sizing: border-box;
    padding: 0 12px;
  }
  .list-box {
    height: 280px;
    @include overflow();
  }
  .list {
    min-height: 110%;
    .item {
      display: flex;
      span:first-child{
        flex-grow: 1;
      }
      span:last-child{
        width: 90px;
        text-align: right;
        flex-grow: 0;
        flex-basis: 90px;
      }
    }
  }
  .item {
    line-height: 30px;
    .remark {
      margin-left: 10px;
      color: var(--t2);
    }
  }
}
</style>
