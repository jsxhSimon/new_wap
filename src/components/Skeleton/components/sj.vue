<template>
  <div class="sj-skeleton">
    <div class="sj-header">
      <div class="left">
        <div class="skeleton-title"></div>
        <div class="skeleton-logo"></div>
      </div>
      <div class="right">
        <div class="skeleton-logo"></div>
        <div class="skeleton-title"></div>
      </div>
    </div>
    <div class="sj-content">
      <div class="skeleton-title"></div>
      <div class="skeleton-title"></div>
      <div class="skeleton-title"></div>
      <div class="skeleton-title"></div>
      <div class="skeleton-title"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .sj-skeleton {
    width: 347px;
    margin: 10px auto;
    background: var(--skeleton-qb-bg);
    box-shadow: var(--box-shadow);
    border-radius: 12px;
    padding: 20px 0;
    .sj-header {
      display: flex;
      justify-content: space-between;
      .left,
      .right {
        display: flex;
        align-items: center;
      }
      .skeleton-title {
        width: 80px;
        border-radius: 0;
        height: 28px;
      }
    }
    .skeleton-logo {
      border-radius: 50%;
      width: 30px;
      height: 30px;
    }
    .left .skeleton-logo {
      transform: translateX(-8px);
    }
    .right .skeleton-logo {
      transform: translateX(8px);
    }
    .sj-content {
      margin-top: 20px;
      padding: 0 14px;
      .skeleton-title {
        width: auto;
        height: 20px;
        margin: 14px 0;
      }
    }
  }
</style>
