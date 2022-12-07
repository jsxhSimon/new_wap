const openAppBrowser = (url: string, title: string, orientation = 'AUTO', closeBtnCallback: () => void, type = '_blank', isFullScreen = '0') => {
  // 横屏 orientation = LANDSCAPE
  // 竖屏 orientation = PORTRAIT
  // 横竖屏 orientation = AUTO
  // isFullScreen 0 不全屏 1 全屏
  (window.cordova as any).ThemeableBrowser.open(url, type, {
    browerfullscreen: isFullScreen === '1' ? true : false,
    fullscreen: true,
    orientation: orientation,
    allowinlinemediaplayback: true,
    mediaplaybackrequiresuseraction: false,
    statusbar: {
        color: '#ffffff00'
    },
    toolbar: {
        height: 44,
        color: '#ffffff00'
    },
    browserProgress: {
        showProgress: true,
        progressBgColor: '#007e9c',
        progressColor: '#FF5E00'
    },
    backButtonCanClose: false,
    allowsBackForwardNavigationGestures: true,
})
    // .addEventListener('closePressed', function (e) {
    //     console.log('close Pressed',e);
    // })
    .addEventListener('cusClosePressed', function (e: any) {
        // console.log('cusClosePressed',e);
        if (closeBtnCallback && typeof (closeBtnCallback) === 'function') {
            closeBtnCallback()
        }
    })
    // .addEventListener('helloPressed', function (e) {
    //     alert('hello pressed');
    // }).addEventListener('sharePressed', function (e) {
    //     alert(e.url);
    // })
    .addEventListener((window.cordova as any).ThemeableBrowser.EVT_ERR, function (e: any) {
        console.error(e.message);
    }).addEventListener((window.cordova as any).ThemeableBrowser.EVT_WRN, function (e: any) {
        console.log(e.message);
    });
}

const switchOrientation = (num: number) => {
  switch (num) {
    case 0:
      return 'AUTO'
    case 1:
      return 'PORTRAIT'
    case 2:
      return 'LANDSCAPE'
    default:
      return 'AUTO'
  }
}

export { openAppBrowser, switchOrientation }