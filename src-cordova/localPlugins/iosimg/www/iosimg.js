const exec = require('cordova/exec')

exports.coolMethod = function (canvasId, successCallback, failureCallback) {
  // exec(success, error, 'iosimg', 'coolMethod', [arg0]);
  if (typeof successCallback !== 'function') {
    console.log('iossave Error: successCallback is not a function')
  } else if (typeof failureCallback !== 'function') {
    console.log('iossave Error: failureCallback is not a function')
  } else {
    const canvas = (typeof canvasId === 'string') ? document.getElementById(canvasId) : canvasId
    const imageData = canvas.toDataURL().replace(/data:image\/png;base64,/, '')
    exec(successCallback, failureCallback, 'iosimg', 'saveImageDataToLibrary', [imageData])
  }
}
