//
//  TestPlugin.m
//  testCordova
//
//  Created by Administrator on 16/9/20.
//
//

#import "ShakePlugin.h"


@implementation ShakePlugin

-(void)ShakeAction:(CDVInvokedUrlCommand *)command{
   
    NSString *ResultStr = @"false";
    
    if (@available(iOS 11.0, *))
    {
        UIImpactFeedbackGenerator *feedBackGenertor = [[UIImpactFeedbackGenerator alloc] initWithStyle:UIImpactFeedbackStyleLight];
        [feedBackGenertor impactOccurred];
        ResultStr =  @"true";
     }

    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:ResultStr];
    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}



@end
