<template>
  <div class="qbwf-skeleton">
    <div class="qbwf-header">
      <div class="skeleton-title"></div>
    </div>
    <div class="qbwf-content">
      <div class="skeleton-title"></div>
      <div class="skeleton-title"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .qbwf-skeleton {
    width: 347px;
    margin: 10px auto ;
    background: var(--skeleton-qb-bg);
    box-shadow: var(--box-shadow);
    border-radius: 12px;
    padding-bottom: 10px;
    .qbwf-header {
      display: flex;
      justify-content: space-between;
      .skeleton-title {
        width: 110px;
        height: 30px;
      }
    }
    .qbwf-content {
      margin-top: 8px;
      display: flex;
      justify-content: space-around;
      .skeleton-title {
        width: 110px;
        height: 50px;
      }
    }
  }
</style>
