

#import "CDVOperaInstallStorage.h"

@implementation CDVOperaInstallStorage

+ (CDVOperaInstallStorage *)shareInstance
{
    static CDVOperaInstallStorage *_instance;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        if (_instance == nil)
        {
            _instance = [[CDVOperaInstallStorage alloc] init];
        }
    });
    
    return _instance;
}
@end
