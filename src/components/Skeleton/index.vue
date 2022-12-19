<template>
  <div class="sdy-skeleton">
    <component :is="comp" v-for="(item, index) in new Array(len)" :key="`skeleton-${index}`" />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import MatchSeleton from './components/MatchSeleton.vue';
import qb from './components/qb.vue';
import qbwf from './components/qbwf.vue';
import sj from './components/sj.vue';
import sk from './components/sk.vue';

interface Props {
  type?: string
  len?: number;
}

const props = withDefaults(defineProps<Props>(), {
  len: 3,
  type: 'MatchSeleton'
})

const comp = computed(() => {
  switch (props.type) {
    case 'qb':
      return qb
    case 'qbwf':
      return qbwf
    case 'sj':
      return sj
    case 'sk':
      return sk
    default:
      return MatchSeleton
  }
})

</script>

<style lang="scss">
  .sdy-skeleton {
    .skeleton-title,
    .skeleton-content,
    .skeleton-logo {
      height: 16px;
      border-radius: 4px;
      background: linear-gradient(90deg,rgba(190,190,190,.2) 25%,rgba(129,129,129,.24) 37%,rgba(190,190,190,.2) 63%);
      background-size: 400% 100%;
      animation: skeleton-loading 1.4s ease infinite;
    }
    .skeleton-title {
      width: 46%;
    }
    .skeleton-logo {
      width: 26px;
      height: 26px;
      border-radius: 50%;
    }
  }
  @keyframes skeleton-loading {
    0% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0 50%;
    }
  }
</style>
