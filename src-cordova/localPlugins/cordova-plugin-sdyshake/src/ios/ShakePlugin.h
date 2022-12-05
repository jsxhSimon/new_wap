//
//  TestPlugin.h
//  testCordova
//
//  Created by Administrator on 16/9/20.
//
//

#import <Cordova/CDVPlugin.h>

@interface ShakePlugin : CDVPlugin

-(void)ShakeAction:(CDVInvokedUrlCommand *)command;

@end
