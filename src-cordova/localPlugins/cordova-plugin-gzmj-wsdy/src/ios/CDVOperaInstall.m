

#import "CDVOperaInstall.h"
#import "CDVOperaInstallStorage.h"

@interface CDVOperaInstall()

@property (nonatomic, strong) NSMutableArray *timeoutTimersArr;

@end

@implementation CDVOperaInstall

#pragma mark "API"
- (void)pluginInitialize {

    NSString* appKey = [[self.commandDelegate settings] objectForKey:@"com.operainstall.APP_KEY"];
    [OperaInstallSDK defaultManager];
//    if (appKey){
//        self.appkey = appKey;
//        [OperaInstallSDK setAppKey:self.appkey withDelegate:self];
//    }else{
        NSString *infoPath = [[NSBundle mainBundle] pathForResource:@"Info" ofType:@"plist"];
        NSDictionary *infoDic = [NSDictionary dictionaryWithContentsOfFile:infoPath];

        if ([infoDic.allKeys containsObject:@"com.operainstall.APP_KEY"]) {
            id keyValue = [infoDic objectForKey:@"com.operainstall.APP_KEY"];
            if ([keyValue isKindOfClass:[NSString class]]) {
                NSString *value = [NSString stringWithFormat:@"%@",keyValue];
                if (value.length != 0) {
                    self.appkey = value;
//                    [OperaInstallSDK setAppKey:self.appkey withDelegate:self];
                    [OperaInstallSDK initWithDelegate:self];
                }
            }
        }
//    }
}
-(BOOL)setUniversallinksHandler:(NSUserActivity *)userActivity{
    if ([OperaInstallSDK continueUserActivity:userActivity]) {
        return YES;
    }
    return NO;
}

#pragma mark "CDVPlugin Overrides"
- (void)handleOpenURL:(NSNotification *)notification
{
    NSURL* url = [notification object];

    if ([url isKindOfClass:[NSURL class]])
    {
        [OperaInstallSDK handLinkURL:url];
    }
}

-(void)getInstall:(CDVInvokedUrlCommand *)command{

    self.currentCallbackId = command.callbackId;
    float outtime = 10.0f;
    if (command.arguments.count != 0) {
        id time = [command.arguments objectAtIndex:0];
        if ([time isKindOfClass:[NSNumber class]]){
            NSNumber *timeResult = (NSNumber *)time;
            outtime = [timeResult floatValue];
        }
    }
    [[OperaInstallSDK defaultManager] getInstallParmsWithTimeoutInterval:outtime completed:^(OperainstallData * _Nullable appData) {

        NSString *channelID = @"";
        NSString *datas = @"";
        if (appData.data) {
            datas = [self jsonStringWithObject:appData.data];
        }
        if (appData.channelCode) {
            channelID = appData.channelCode;
        }
        NSDictionary *installDicResult = @{@"channel":channelID,@"data":datas};

        CDVPluginResult *commandResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:installDicResult];
        [self.commandDelegate sendPluginResult:commandResult callbackId:command.callbackId];

        self.currentCallbackId = nil;

    }];

}
-(void)registerWakeUpHandler:(CDVInvokedUrlCommand *)command{

    NSDictionary *resultDic;
    @synchronized(self){
        if (self.wakeupDic) {
            resultDic = [self.wakeupDic copy];
        }
    }
    self.wakeupCallbackId = command.callbackId;
    if (resultDic.count != 0) {
        CDVPluginResult *commandResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:resultDic];
        commandResult.keepCallback = @(YES);
        [self.commandDelegate sendPluginResult:commandResult callbackId:command.callbackId];
        self.wakeupDic = nil;
    }else{
        if ([CDVOperaInstallStorage shareInstance].schemeUrl) {
            [OperaInstallSDK handLinkURL:[CDVOperaInstallStorage shareInstance].schemeUrl];
            [CDVOperaInstallStorage shareInstance].schemeUrl = nil;
        }else if ([CDVOperaInstallStorage shareInstance].userActivity){
            [OperaInstallSDK continueUserActivity:[CDVOperaInstallStorage shareInstance].userActivity];
            [CDVOperaInstallStorage shareInstance].userActivity = nil;
        }
    }
}

-(void)getWakeUp:(CDVInvokedUrlCommand *)command{

}

-(void)reportRegister:(CDVInvokedUrlCommand *)command{

    [OperaInstallSDK reportRegister];

}

-(void)reportEffectPoint:(CDVInvokedUrlCommand *)command{

    NSString *effectPoint = @"";
    long value = 0;
    if (command.arguments.count != 0) {
        id point = [command.arguments objectAtIndex:0];
        if ([point isKindOfClass:[NSString class]]) {
            effectPoint = (NSString *)point;
        }
        id val = [command.arguments objectAtIndex:1];
        if ([val isKindOfClass:[NSNumber class]]){
            NSNumber *valResult = (NSNumber *)val;
            value = [valResult longValue];
        }
        [[OperaInstallSDK defaultManager] reportEffectPoint:effectPoint effectValue:value];
    }
}


- (void)getWakeUpParams:(nullable OperainstallData *)appData{

    NSString *channelID = @"";
    NSString *datas = @"";
    if (appData.data) {
        datas = [self jsonStringWithObject:appData.data];
    }
    if (appData.channelCode) {
        channelID = appData.channelCode;
    }
    NSDictionary *wakeupDicResult = @{@"channel":channelID,@"data":datas};

    NSString *wakeupcallbacId;
    @synchronized(self){
        wakeupcallbacId = [self.wakeupCallbackId copy];
    }
    if (wakeupcallbacId) {
        CDVPluginResult *commandResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsDictionary:wakeupDicResult];
        commandResult.keepCallback = @(YES);
        [self.commandDelegate sendPluginResult:commandResult callbackId:self.wakeupCallbackId];
    }else{
        @synchronized(self){
            self.wakeupDic = [[NSDictionary alloc]init];
            self.wakeupDic = wakeupDicResult;
        }
    }
}

- (void)dealloc
{
    [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (NSString *)jsonStringWithObject:(id)jsonObject{

    id arguments = (jsonObject == nil ? [NSNull null] : jsonObject);

    NSArray* argumentsWrappedInArr = [NSArray arrayWithObject:arguments];

    NSString* argumentsJSON = [self cp_JSONString:argumentsWrappedInArr];

    if (argumentsJSON.length>2) {argumentsJSON = [argumentsJSON substringWithRange:NSMakeRange(1, [argumentsJSON length] - 2)];}

    return argumentsJSON;
}
- (NSString *)cp_JSONString:(NSArray *)array{
    NSError *error = nil;
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:array
                                                       options:0
                                                         error:&error];

    NSString *jsonString = [[NSString alloc] initWithData:jsonData
                                                 encoding:NSUTF8StringEncoding];

    if ([jsonString length] > 0 && error == nil){
        return jsonString;
    }else{
        return @"";
    }
}

@end
