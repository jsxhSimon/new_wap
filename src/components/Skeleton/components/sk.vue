<template>
  <div class="sk-skeleton">
    <div class="sk-header">
      <div class="skeleton-title"></div>
      <div class="skeleton-title"></div>
    </div>
    <div class="sk-content">
      <div class="flex">
        <div class="w-50">
          <div class="skeleton-logo"></div>
        </div>
        <div class="w-50">
          <div class="skeleton-logo"></div>
        </div>
      </div>
    </div>
    <div class="sk-footer">
      <div class="skeleton-content"></div>
      <div class="skeleton-content"></div>
      <div class="skeleton-content"></div>
      <div class="skeleton-content"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .sk-skeleton {
    width: 347px;
    margin: 10px auto ;
    background: var(--skeleton-qb-bg);
    box-shadow: var(--box-shadow);
    border-radius: 12px;
    padding: 20px 10px;
    .sk-header {
      display: flex;
      justify-content: space-between;
      .skeleton-title {
        width: 120px;
      }
    }
    .sk-content {
      margin-top: 30px;
    }
    .skeleton-logo {
      width: 60px;
      height: 60px;
    }
    .w-50 {
      flex: 1;
      display: flex;
      justify-content: center;
    }
    .skeleton-content {
      margin-top: 20px;
    }
  }
</style>
