<template>
  <div class="match-skeleton">
    <div class="match-skeleton-header">
      <div class="skeleton-title"></div>
    </div>
    <div class="match-skeleton-content">
      <div class="left">
        <div class="skeleton-logo"></div>
        <div class="skeleton-logo"></div>
      </div>
      <div class="right">
        <div class="skeleton-content"></div>
        <div class="skeleton-content"></div>
        <div class="skeleton-content"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
  .match-skeleton {
    height: 211px;
    margin-bottom: 10px;
    border-radius: 4px;
    background: var(--skeleton-bg);
    box-sizing: border-box;
    padding: 10px;
    &-content {
      margin-top: 21px;
      height: 132px;
      background: var(--skeleton-bg);
      box-sizing: border-box;
      padding: 10px;
      display: flex;
      .left {
        width: 95px;
        .skeleton-logo {
          border-radius: 50%;
          width: 36px;
          height: 36px;
          margin-top: 12px;
          margin-left: 10px;
        }
      }
      .right {
        flex: 1;
        .skeleton-content {
          margin: 16px 0;
        }
      }
    }
    &-header {
      height: 36px;
      display: flex;
      align-items: center;
    }
  }
</style>
