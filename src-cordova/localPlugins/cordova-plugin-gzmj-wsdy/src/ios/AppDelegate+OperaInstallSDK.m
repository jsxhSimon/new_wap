

#import "AppDelegate.h"
#import "CDVOperaInstall.h"
#import "CDVOperaInstallStorage.h"
#import <objc/runtime.h>

#define CDVOPERAINSTALLPARAMS @"OperaInstallplugin"

@interface AppDelegate (OperaInstallSDK)

@end

@implementation AppDelegate (OperaInstallSDK)

static BOOL systemFuncExist = NO;

+ (void)load {
    NSProcessInfo *processInfo = [NSProcessInfo processInfo];
    if ([processInfo respondsToSelector:@selector(operatingSystemVersion)]) {
        Method systemFunc = class_getInstanceMethod(self, @selector(application:continueUserActivity:restorationHandler:));
        Method cooFunc = class_getInstanceMethod(self, @selector(cooFuncApplication:continueUserActivity:restorationHandler:));
        if (systemFunc) {
            method_exchangeImplementations(systemFunc, cooFunc);
            systemFuncExist = YES;
        } else {
            const char *typeEncoding = method_getTypeEncoding(cooFunc);
            class_addMethod(self, @selector(application:continueUserActivity:restorationHandler:), method_getImplementation(cooFunc), typeEncoding);
        }
    }
}

-(BOOL)cooFuncApplication:(UIApplication *)application continueUserActivity:(NSUserActivity *)userActivity restorationHandler:(void (^)(NSArray * _Nullable))restorationHandler{
    if (systemFuncExist) {
        [self cooFuncApplication:application continueUserActivity:userActivity restorationHandler:restorationHandler];
    }
    CDVOperaInstall *plugin = [self.viewController getCommandInstance:CDVOPERAINSTALLPARAMS];
    if (plugin==nil) {
        return NO;
    }
    return [plugin setUniversallinksHandler:userActivity];
}

@end
