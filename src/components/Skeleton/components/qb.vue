<template>
  <div class="qb-skeleton">
    <div class="qb-header">
      <div class="left">
        <div class="skeleton-title"></div>
        <div class="skeleton-logo"></div>
      </div>
      <div class="right">
        <div class="skeleton-logo"></div>
        <div class="skeleton-title"></div>
      </div>
    </div>
    <div class="qb-content">
      <div class="left">
        <div class="skeleton-title"></div>
        <div class="skeleton-title"></div>
      </div>
      <div class="right">
        <div class="skeleton-title"></div>
        <div class="skeleton-title"></div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .qb-skeleton {
    width: 347px;
    margin: 10px auto;
    background: var( --skeleton-qb-bg);
    box-shadow: var(--box-shadow);
    border-radius: 12px;
    padding: 20px 0;
    .qb-header {
      display: flex;
      justify-content: space-between;
      .left,
      .right {
        display: flex;
      }
      .right {
        justify-content: end;
      }
      .skeleton-logo {
        width: 30px;
        height: 30px;
      }
      .skeleton-title {
        width: 110px;
        height: 28px;
        border-radius: 0;
      }
      .left .skeleton-title {
        border-radius: 0 12px 12px 0;
        margin-right: 10px;
      }
      .right .skeleton-title {
        border-radius: 12px 0 0 12px;
        margin-left: 10px;
      }
    }
    .qb-content {
      display: flex;
      justify-content: space-between;
      margin-top: 20px;
      .left,
      .right {
        width: 168px;
        .skeleton-title {
          width: 100%;
          margin-bottom: 10px;
        }
      }
      .left {
        .skeleton-title:first-child {
          height: 168px;
          border-radius: 0 12px 12px 0;
        }
        .skeleton-title:last-child {
          height: 68px;
          border-radius: 0 12px 12px 0;
        }
      }
      .right {
        .skeleton-title:first-child {
          height: 128px;
          border-radius: 12px 0 0 12px;
        }
        .skeleton-title:last-child {
          height: 108px;
          border-radius: 12px 0 0 12px;
        }
      }
    }
  }
</style>
