

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface CDVOperaInstallStorage : NSObject

@property (nonatomic, strong)NSUserActivity *_Nullable userActivity;
@property (nonatomic, strong) NSURL *_Nullable schemeUrl;
@property (nonatomic, copy) NSString *wakeupCallbackId;

+ (CDVOperaInstallStorage *)shareInstance;

@end

NS_ASSUME_NONNULL_END
