<template>
  <q-dialog
    class="ad"
    ref="dialog"
    :persistent="persistent"
    @hide="onDialogHide"
  >
    <q-card class="dialog-primary-content" :class="contentClass">
      <q-card-section class="dialog-primary-header row no-wrap items-center q-py-sm q-px-none q-pr-xs ellipsis">
        <div class="text-subtitle1 dialog-primary-content-title absolute-center">{{t(title)}}</div>
        <q-btn
          class="absolute-right q-mr-sm"
          v-if="!persistent"
          v-close-popup
          flat
          round
          dense
          icon="close"
        />
      </q-card-section>

      <q-separator />

      <q-card-section class="dialog-primary-main q-pl-lg">
        <slot>{{message}}</slot>
      </q-card-section>

      <q-card-actions class="dialog-primary-button-wrap">
        <button v-if="leftbtnshow"
          class="dialog-primary-button dialog-primary-button__confirm"
          @click="onLeftBtnClick"
        >
          {{t(leftbtnLabel)}}
        </button>

        <button v-if="okbtnshow"
          class="dialog-primary-button dialog-primary-button__confirm"
          @click="onOKClick"
        >
          {{t(okLabel)}}
        </button>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  value: boolean;
  title?: string;
  message: string;
  contentClass: string;
  okLabel?: string;
  persistent?: boolean;
  okbtnshow?: boolean;
  leftbtnshow?: boolean;
  leftbtnLabel?: string;
}

const { t } = useI18n() 

const props = withDefaults(defineProps<Props>(), {
  title: '提示',
  okLabel: '确认',
  leftbtnLabel: '关闭',
  okbtnshow: true,
  leftbtnshow: false,
})
const emits = defineEmits(['input', 'ok', 'leftBtnClicked', 'hide'])


const dialog = ref<any>(null)
const showing = ref(false)

watch(
  () => props.value,
  (val) => {
    handleValueChange(val)
  }
)

onMounted(() => {
  handleValueChange(props.value)
})

const show = () => {
  dialog.value?.show()
  emits('input', true)
}

const hide = () => {
  dialog.value?.hide()
  emits('input', false)
}

const onDialogHide = () => {
  emits('hide')
  emits('input', false)
}

const onOKClick = () => {
  emits('ok')
  hide()
}

const onLeftBtnClick = () => {
  emits('leftBtnClicked')
  hide()
}

const onCancelClick = () => {
  hide()
}

const handleValueChange = (val: boolean) => {
  if (val !== showing.value) {
    if (val) show()
    else hide()
  }
}

</script>

<style lang="scss" scoped>
  .q-dialog {
    :deep(.q-dialog__backdrop) {
      background: rgba(0, 0, 0, 0.7);
    }
    .text-subtitle1 {
      font-size: 14px;
    }
  }
  .dialog-primary-content {
    width: 300px;
    padding-bottom: 10px;
    border-radius: 5px;
    background: var(--dialog-bg);

    .dialog-primary-header {
      position: relative;
      height: 40px;
      background: var(--bg1);
      color: var(--t1);
      font-size: 14px;
    }

    .dialog-primary-content-title {
      flex: 1;
      padding: 0 25px;
      width: 100%;
      text-align: center;
    }

    & :deep(.q-icon) {
      font-size: 18px;
      // color: #FFFFFF;
      color: var(--t4);
    }

    .dialog-primary-main {
      overflow: auto;
      max-height: calc(100vh - 240px);
      text-align: center;
      color: var(--dialog-text);
      font-size: 12px;
    }

    &--pre-line {
      .dialog-primary-main {
        white-space: pre-line;
      }
    }

    .dialog-primary-button-wrap {
      display: flex;
      justify-content: center;
      flex-wrap: nowrap;
      padding: 0;

      .dialog-primary-button {
        width: 100px;
        height: 25px;
        border: 1px solid #A09699;
        border-radius: 5px;
        outline: none;
        color: var(--t2);
        font-size: 12px;
        margin: 0 auto;

        &.dialog-primary-button__confirm {
          border: 0;
          // background: #FBA002;
          background: var(--lg2);
          // color: #fff;
          color: var(--t5);
        }
      }
    }
    .q-separator--horizontal {
      display: none;
    }
  }

</style>
