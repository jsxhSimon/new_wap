var exec = require('cordova/exec');

module.exports = {


    /**
     * 新添加api（android初始化前配置）
     * @param options 配置参数：
     * {
     *      adEnabled: true,
     *      macDisabled: true,
     *      imeiDisabled: true,
     *      gaid: "通过 google api 获取到的 advertisingId",
     *      oaid: "通过移动安全联盟获取到的 oaid"
     * }
     */
    configAndroid: function(options){
        function pass() {};

        exec(pass, pass, "OperaInstallPlugin", "config", [options.adEnabled,
            options.macDisabled, options.imeiDisabled, options.gaid, options.oaid]);
    },

    /**
     * 新添加api（android 初始化调用）
     * 初始化
     */
    init: function(){
        function pass() {};
        exec(pass, pass, "OperaInstallPlugin", "init", []);
    },

    /**
     * 获取安装参数
     * @param onSuccess 成功回调：数据格式为 {'channel': 1002, 'data': {'key': 'value'}}
     * @param onError 错误回调：返回错误信息
     * @param time 超时时间：整形值，单位秒
     */
    getInstall: function (onSuccess, onError, time){
        exec(onSuccess, onError, "OperaInstallPlugin", "getInstall", [time]);
    },

    /**
     * 获取安装参数（仅 Android 支持）
     * @param onSuccess 成功回调：数据格式为 {'channel': 1002, 'data': {'key': 'value'}}
     * @param onError 错误回调：返回错误信息
     * @param time 超时时间：整形值，单位秒
     */
    getInstallCanRetry: function (onSuccess, onError, time){
        exec(onSuccess, onError, "OperaInstallPlugin", "getInstallCanRetry", [time]);
    },

    /**
     * 注册唤醒监听
     * @param onSuccess 成功回调：数据格式为 {'channel': 1002, 'data': {'key': 'value'}}
     * @param onError 错误回调：返回错误信息
     */
    registerWakeUpHandler: function(onSuccess, onError){
        exec(onSuccess, onError, "OperaInstallPlugin", "registerWakeUpHandler", []);
    },

    /**
     * 上报注册量
     */
    reportRegister: function(){
        function pass() {};
        exec(pass, pass, "OperaInstallPlugin", "reportRegister", []);
    },

    /**
     * 上报效果点
     * @param pointId 效果点ID
     * @param pointValue 效果点值 (数字类型)
     */
    reportEffectPoint: function(pointId, pointValue){
        function pass() {};
        exec(pass, pass, "OperaInstallPlugin", "reportEffectPoint", [pointId, pointValue]);
    }

};
