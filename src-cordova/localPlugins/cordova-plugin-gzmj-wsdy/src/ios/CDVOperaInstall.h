
#import <Cordova/CDVPlugin.h>
#import "OperaInstallSDK.h"

@interface CDVOperaInstall : CDVPlugin<OperaInstallDelegate,UIApplicationDelegate>

@property (nonatomic, copy) NSString *appkey;
@property (nonatomic, copy) NSString *currentCallbackId;
@property (nonatomic, copy) NSString *wakeupCallbackId;
@property (nonatomic, copy) NSDictionary *wakeupDic;

-(void)getInstall:(CDVInvokedUrlCommand *)command;//获取动态安装参数
-(void)registerWakeUpHandler:(CDVInvokedUrlCommand *)command;//注册获取唤醒参数的方法
-(void)reportRegister:(CDVInvokedUrlCommand *)command;//注册统计
-(void)reportEffectPoint:(CDVInvokedUrlCommand *)command;//渠道效果统计
-(BOOL)setUniversallinksHandler:(NSUserActivity *)userActivity;
@end
