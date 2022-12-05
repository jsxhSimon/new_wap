# cordova-plugin-gzmj-wsdy

operainstall 的 cordova 插件   

文档最后提供了在 capacitor 中使用需要做的配置

## 一、安装插件

使用下列命令安装并配置插件
```
cordova plugin add cordova-plugin-gzmj-wsdy --variable APPKEY=appkey --variable SCHEME=scheme
```

*如配置错误，可先卸载再安装插件*
```
cordova plugin rm cordova-plugin-gzmj-wsdy --variable APPKEY=appkey --variable SCHEME=scheme
```

## 二、调用API

### 1 初始化
App 启动时，请确保用户同意《隐私政策》之后，再调用初始化；如果用户不同意，则不进行SDK初始化。   
``` js
window.operainstall.init();
```
### 2 快速安装和一键拉起
#### 拉起参数获取
调用以下代码注册拉起回调，应尽早调用。如在 `deviceready` 事件回调之时注册
``` js
window.operainstall.registerWakeUpHandler(function(data){
  console.log("wakeup success : " + JSON.stringify(data));
}, function(msg){
  console.log("wakeup error : " + msg)
});
```
成功回调的data数据格式  
``` json
{"channel": "渠道号", "data": {"自定义key": "自定义value"}}
```

对于 iOS，为确保能正常跳转，AppID 必须开启 Associated Domains 功能，请到 [苹果开发者网站](https://developer.apple.com)，选择 Certificate, Identifiers & Profiles，选择相应的 AppID，开启 Associated Domains。注意：当 AppID 重新编辑过之后，需要更新相应的 mobileprovision 证书。


### 3 携带参数安装 （高级版功能）
#### 获取安装参数  
``` js
window.operainstall.getInstall(function(data){
    console.log('getInstall success: ' + JSON.stringify(data));
}, function(msg){
    console.log('getInstall error: ' + msg);
});
```
也可传入一个整形数值，单位秒，指定时间未返回将超时  
``` js
window.operainstall.getInstall(function(data){
    console.log('getInstall success: ' + JSON.stringify(data));
}, function(msg){
    console.log('getInstall error: ' + msg);
}, 10);
```
成功回调的data数据格式  
``` json
{"channel": "渠道号", "data": {"自定义key": "自定义value"}}
```

### 4 渠道统计 （高级版功能）  
SDK 会自动完成访问量、点击量、安装量、活跃量、留存率等统计工作。其它业务相关统计由开发人员使用 api 上报

#### 4.1 注册量统计  
根据自身的业务规则，在确保用户完成 app 注册的情况下调用 api  
``` js
window.operainstall.reportRegister();
```

#### 4.2 渠道效果统计  
统计终端用户对某些特殊业务的使用效果，如充值金额，分享次数等等。  
请在 operainstall 控制台 的 “效果点管理” 中添加对应的效果点  

调用接口进行效果点的上报，第一个参数对应控制台中的 **效果点ID**  

``` js
window.operainstall.reportEffectPoint("effect_test", 1);
```


## 三、导出apk/ipa包并上传

代码集成完毕后，需要导出安装包上传operainstall后台，自动完成所有的应用配置工作。  


上传完成后即可开始在线模拟测试，体验完整的App安装/拉起流程；待测试无误后，再完善下载配置信息。  

---

## 广告平台接入

### Android平台

1、针对广告平台接入，新增配置接口，在调用 init 之前调用。
``` js
    var options = {
        adEnabled: true, 
    }
    window.operainstall.configAndroid(options);
```
options 可选参数如下：   
| 参数名| 参数类型 | 描述 |  
| --- | --- | --- |
| adEnabled| bool | 广告平台接入开关（必须） |
| macDisabled | bool | 是否禁止 SDK 获取 mac 地址 |
| imeiDisabled | bool | 是否禁止 SDK 获取 imei |
| gaid | string | 通过 google api 获取到的 advertisingId，SDK 将不再获取gaid |
| oaid | string | 通过移动安全联盟获取到的 oaid，SDK 将不再获取oaid |

2、为了精准地匹配到渠道，需要获取设备唯一标识码（IMEI），因此需要在 AndroidManifest.xml 中添加权限声明 
``` xml
<uses-permission android:name="android.permission.READ_PHONE_STATE"/>
```
3、请自行进行权限申请，在权限申请成功后，再进行operainstall初始化。**无论终端用户是否同意，都要调用初始化**


## 如何在 capacitor 中使用？
#### 1.安装插件
``` js
npm install cordova-plugin-gzmj-wsdy
```
#### 2.同步到原生平台
``` js
npx cap sync
```

#### 3.手动修改：

**Android平台**  

1）修改 capacitor-cordova-android-plugins module 下的 AndroidManifest.xml 文件，将
``` xml
<meta-data
   android:name="com.operainstall.APP_KEY"
   android:value="$APPKEY"/>
```
中的 `$APPKEY` 修改为 operainstall 为应用分配的 appkey  

2）修改 app module 下的 `AndroidManifest.xml` 文件，将
``` xml
<intent-filter>
   <action android:name="android.intent.action.VIEW" />
   <category android:name="android.intent.category.DEFAULT" />
   <category android:name="android.intent.category.BROWSABLE" />
   <data android:scheme="@string/custom_url_scheme" />
</intent-filter>
```
的 `@string/custom_url_scheme` 修改为 operainstall 为应用分配的 scheme 或者新增配置
``` xml
<intent-filter>
   <action android:name="android.intent.action.VIEW" />
   <category android:name="android.intent.category.DEFAULT" />
   <category android:name="android.intent.category.BROWSABLE" />
   <data android:scheme="operainstall为应用分配的scheme" />
</intent-filter>
```

**iOS平台**

1）找到 `Info.plist` 文件，添加appkey
``` xml
    <key>com.operainstall.APP_KEY</key>
    <string>“从operainstall后台获取应用的appkey”</string>
```

2）找到 `Info.plist` 文件，添加scheme
``` xml
    <key>CFBundleURLTypes</key>
    <array>
        <dict>
        <key>CFBundleTypeRole</key>
        <string>Editor</string>
        <key>CFBundleURLName</key>
        <string>operainstall</string>
        <key>CFBundleURLSchemes</key>
        <array>
            <string>"从operainstall后台获取应用的scheme"</string>
        </array>
        </dict>
    </array>
```
