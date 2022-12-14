/*
 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements.  See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership.  The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License.  You may obtain a copy of the License at
 
 http://www.apache.org/licenses/LICENSE-2.0
 
 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied.  See the License for the
 specific language governing permissions and limitations
 under the License.
 */

#import "CDVSplashScreen.h"
#import <Cordova/CDVViewController.h>
#import <Cordova/CDVScreenOrientationDelegate.h>
#import "CDVViewController+SplashScreen.h"
//#import <MediaPlayer/MediaPlayer.h>
#import <AVKit/AVKit.h>
#import <AVFoundation/AVFoundation.h>
#define kSplashScreenDurationDefault 3000.0f
#define kFadeDurationDefault 500.0f
#define kScreenWidth                    [[UIScreen mainScreen] bounds].size.width
#define kScreenHeight                   [[UIScreen mainScreen] bounds].size.height
#define RGBAColor(r,g,b,a)              [UIColor colorWithRed:(r)/255.0f green:(g)/255.0f blue:(b)/255.0f alpha:(a)]
#define RGBColor(r,g,b)                 [UIColor colorWithRed:(r)/255.0f green:(g)/255.0f blue:(b)/255.0f alpha:(1)]

@interface CDVSplashScreen()<AVPlayerViewControllerDelegate>
{
    UIButton *skipView;
    BOOL splashPageLoaded;
    NSString *videoPath;
}
//音视频
@property (nonatomic,strong)AVPlayer *player;
@property (nonatomic,strong)AVPlayerLayer *playerLayer;
@property (nonatomic,strong)AVPlayerItem *currentPlayerItem;

@property (nonatomic, strong) id timeObserver;
@end

@implementation CDVSplashScreen

- (void)pluginInitialize
{
    [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(pageDidLoad) name:CDVPageDidLoadNotification object:nil];
    
    [self setVisible:YES];
}

- (void)show:(CDVInvokedUrlCommand*)command
{
    if(command.arguments.count)
    {
        videoPath = [command.arguments objectAtIndex:0];
    }
    [self setVisible:YES];
}

- (void)hide:(CDVInvokedUrlCommand*)command
{
    [self setVisible:NO andForce:YES];
}

- (void)pageDidLoad
{
    id autoHideSplashScreenValue = [self.commandDelegate.settings objectForKey:[@"AutoHideSplashScreen" lowercaseString]];
    if (!skipView && _player != nil) {
        [self initSlipButtonView];
    }
    
    // if value is missing, default to yes
    if ((autoHideSplashScreenValue == nil) || [autoHideSplashScreenValue boolValue]) {
        [self setVisible:NO];
    }
    
    
}

- (void)observeValueForKeyPath:(NSString*)keyPath ofObject:(id)object change:(NSDictionary*)change context:(void*)context
{
    //    [self updateImage];
}

- (void)createViews
{
    /*
     * The Activity View is the top spinning throbber in the status/battery bar. We init it with the default Grey Style.
     *
     *     whiteLarge = UIActivityIndicatorViewStyleWhiteLarge
     *     white      = UIActivityIndicatorViewStyleWhite
     *     gray       = UIActivityIndicatorViewStyleGray
     *
     */
    
    // Determine whether rotation should be enabled for this device
    // Per iOS HIG, landscape is only supported on iPad and iPhone 6+
    CDV_iOSDevice device = [self getCurrentDevice];
    BOOL autorotateValue = (device.iPad || device.iPhone6Plus) ?
    [(CDVViewController *)self.viewController shouldAutorotateDefaultValue] :
    NO;
    
    [(CDVViewController *)self.viewController setEnabledAutorotation:autorotateValue];
    
    NSString* topActivityIndicator = [self.commandDelegate.settings objectForKey:[@"TopActivityIndicator" lowercaseString]];
    UIActivityIndicatorViewStyle topActivityIndicatorStyle = UIActivityIndicatorViewStyleGray;
    
    if ([topActivityIndicator isEqualToString:@"whiteLarge"])
    {
        topActivityIndicatorStyle = UIActivityIndicatorViewStyleWhiteLarge;
    }
    else if ([topActivityIndicator isEqualToString:@"white"])
    {
        topActivityIndicatorStyle = UIActivityIndicatorViewStyleWhite;
    }
    else if ([topActivityIndicator isEqualToString:@"gray"])
    {
        topActivityIndicatorStyle = UIActivityIndicatorViewStyleGray;
    }
    
    UIView* parentView = self.viewController.view;
    parentView.userInteractionEnabled = NO;  // disable user interaction while splashscreen is shown
    _activityView = [[UIActivityIndicatorView alloc] initWithActivityIndicatorStyle:topActivityIndicatorStyle];
    _activityView.center = CGPointMake(parentView.bounds.size.width / 2, parentView.bounds.size.height / 2);
    _activityView.autoresizingMask = UIViewAutoresizingFlexibleTopMargin | UIViewAutoresizingFlexibleLeftMargin
    | UIViewAutoresizingFlexibleBottomMargin | UIViewAutoresizingFlexibleRightMargin;
    [_activityView startAnimating];
    
    // Set the frame & image later.
    _imageView = [[UIImageView alloc] init];
    [parentView addSubview:_imageView];
    
    id showSplashScreenSpinnerValue = [self.commandDelegate.settings objectForKey:[@"ShowSplashScreenSpinner" lowercaseString]];
    // backwards compatibility - if key is missing, default to true
    if ((showSplashScreenSpinnerValue == nil) || [showSplashScreenSpinnerValue boolValue])
    {
        [parentView addSubview:_activityView];
    }
    
    // Frame is required when launching in portrait mode.
    // Bounds for landscape since it captures the rotation.
    [parentView addObserver:self forKeyPath:@"frame" options:0 context:nil];
    [parentView addObserver:self forKeyPath:@"bounds" options:0 context:nil];
    
    [self updateImage];
    _destroyed = NO;
}

- (void)hideViews
{
    [_imageView setAlpha:0];
    [_activityView setAlpha:0];
    skipView.hidden = NO;
}

- (void)destroyViews
{
    _destroyed = YES;
    [(CDVViewController *)self.viewController setEnabledAutorotation:[(CDVViewController *)self.viewController shouldAutorotateDefaultValue]];
    
    [_imageView removeFromSuperview];
    [_activityView removeFromSuperview];
    _imageView = nil;
    _activityView = nil;
    _curImageName = nil;
    
    self.viewController.view.userInteractionEnabled = YES;  // re-enable user interaction upon completion
    @try {
        //        [self.viewController.view removeObserver:self forKeyPath:@"frame"];
        //        [self.viewController.view removeObserver:self forKeyPath:@"bounds"];
    }
    @catch (NSException *exception) {
        // When reloading the page from a remotely connected Safari, there
        // are no observers, so the removeObserver method throws an exception,
        // that we can safely ignore.
        // Alternatively we can check whether there are observers before calling removeObserver
    }
}

- (CDV_iOSDevice) getCurrentDevice
{
    CDV_iOSDevice device;
    
    UIScreen* mainScreen = [UIScreen mainScreen];
    CGFloat mainScreenHeight = mainScreen.bounds.size.height;
    CGFloat mainScreenWidth = mainScreen.bounds.size.width;
    
    int limit = MAX(mainScreenHeight,mainScreenWidth);
    
    device.iPad = (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPad);
    device.iPhone = (UI_USER_INTERFACE_IDIOM() == UIUserInterfaceIdiomPhone);
    device.retina = ([mainScreen scale] == 2.0);
    device.iPhone4 = (device.iPhone && limit == 480.0);
    device.iPhone5 = (device.iPhone && limit == 568.0);
    // note these below is not a true device detect, for example if you are on an
    // iPhone 6/6+ but the app is scaled it will prob set iPhone5 as true, but
    // this is appropriate for detecting the runtime screen environment
    device.iPhone6 = (device.iPhone && limit == 667.0);
    device.iPhone6Plus = (device.iPhone && limit == 736.0);
    
    return device;
}

- (BOOL) isUsingCDVLaunchScreen {
    NSString* launchStoryboardName = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"UILaunchStoryboardName"];
    if (launchStoryboardName) {
        return ([launchStoryboardName isEqualToString:@"CDVLaunchScreen"]);
    } else {
        return NO;
    }
}

- (NSString*)getImageName:(UIInterfaceOrientation)currentOrientation delegate:(id<CDVScreenOrientationDelegate>)orientationDelegate device:(CDV_iOSDevice)device
{
    // Use UILaunchImageFile if specified in plist.  Otherwise, use Default.
    NSString* imageName = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"UILaunchImageFile"];
    
    // detect if we are using CB-9762 Launch Storyboard; if so, return the associated image instead
    if ([self isUsingCDVLaunchScreen]) {
        imageName = @"LaunchStoryboard";
        return imageName;
    }
    
    NSUInteger supportedOrientations = [orientationDelegate supportedInterfaceOrientations];
    
    // Checks to see if the developer has locked the orientation to use only one of Portrait or Landscape
    BOOL supportsLandscape = (supportedOrientations & UIInterfaceOrientationMaskLandscape);
    BOOL supportsPortrait = (supportedOrientations & UIInterfaceOrientationMaskPortrait || supportedOrientations & UIInterfaceOrientationMaskPortraitUpsideDown);
    // this means there are no mixed orientations in there
    BOOL isOrientationLocked = !(supportsPortrait && supportsLandscape);
    
    if (imageName)
    {
        imageName = [imageName stringByDeletingPathExtension];
    }
    else
    {
        imageName = @"Default";
    }
    
    // Add Asset Catalog specific prefixes
    if ([imageName isEqualToString:@"LaunchImage"])
    {
        if (device.iPhone4 || device.iPhone5 || device.iPad) {
            imageName = [imageName stringByAppendingString:@"-700"];
        } else if(device.iPhone6) {
            imageName = [imageName stringByAppendingString:@"-800"];
        } else if(device.iPhone6Plus) {
            imageName = [imageName stringByAppendingString:@"-800"];
            if (currentOrientation == UIInterfaceOrientationPortrait || currentOrientation == UIInterfaceOrientationPortraitUpsideDown)
            {
                imageName = [imageName stringByAppendingString:@"-Portrait"];
            }
        }
    }
    
    if (device.iPhone5)
    { // does not support landscape
        imageName = [imageName stringByAppendingString:@"-568h"];
    }
    else if (device.iPhone6)
    { // does not support landscape
        imageName = [imageName stringByAppendingString:@"-667h"];
    }
    else if (device.iPhone6Plus)
    { // supports landscape
        if (isOrientationLocked)
        {
            imageName = [imageName stringByAppendingString:(supportsLandscape ? @"-Landscape" : @"")];
        }
        else
        {
            switch (currentOrientation)
            {
                case UIInterfaceOrientationLandscapeLeft:
                case UIInterfaceOrientationLandscapeRight:
                    imageName = [imageName stringByAppendingString:@"-Landscape"];
                    break;
                default:
                    break;
            }
        }
        imageName = [imageName stringByAppendingString:@"-736h"];
        
    }
    else if (device.iPad)
    {   // supports landscape
        if (isOrientationLocked)
        {
            imageName = [imageName stringByAppendingString:(supportsLandscape ? @"-Landscape" : @"-Portrait")];
        }
        else
        {
            switch (currentOrientation)
            {
                case UIInterfaceOrientationLandscapeLeft:
                case UIInterfaceOrientationLandscapeRight:
                    imageName = [imageName stringByAppendingString:@"-Landscape"];
                    break;
                    
                case UIInterfaceOrientationPortrait:
                case UIInterfaceOrientationPortraitUpsideDown:
                default:
                    imageName = [imageName stringByAppendingString:@"-Portrait"];
                    break;
            }
        }
    }
    
    return imageName;
}

- (UIInterfaceOrientation)getCurrentOrientation
{
    UIInterfaceOrientation iOrientation = [UIApplication sharedApplication].statusBarOrientation;
    UIDeviceOrientation dOrientation = [UIDevice currentDevice].orientation;
    
    bool landscape;
    
    if (dOrientation == UIDeviceOrientationUnknown || dOrientation == UIDeviceOrientationFaceUp || dOrientation == UIDeviceOrientationFaceDown) {
        // If the device is laying down, use the UIInterfaceOrientation based on the status bar.
        landscape = UIInterfaceOrientationIsLandscape(iOrientation);
    } else {
        // If the device is not laying down, use UIDeviceOrientation.
        landscape = UIDeviceOrientationIsLandscape(dOrientation);
        
        // There's a bug in iOS!!!! http://openradar.appspot.com/7216046
        // So values needs to be reversed for landscape!
        if (dOrientation == UIDeviceOrientationLandscapeLeft)
        {
            iOrientation = UIInterfaceOrientationLandscapeRight;
        }
        else if (dOrientation == UIDeviceOrientationLandscapeRight)
        {
            iOrientation = UIInterfaceOrientationLandscapeLeft;
        }
        else if (dOrientation == UIDeviceOrientationPortrait)
        {
            iOrientation = UIInterfaceOrientationPortrait;
        }
        else if (dOrientation == UIDeviceOrientationPortraitUpsideDown)
        {
            iOrientation = UIInterfaceOrientationPortraitUpsideDown;
        }
    }
    
    return iOrientation;
}

// Sets the view's frame and image.
- (void)updateImage
{
    NSString* imageName = [self getImageName:[self getCurrentOrientation] delegate:(id<CDVScreenOrientationDelegate>)self.viewController device:[self getCurrentDevice]];
    
    if (![imageName isEqualToString:_curImageName])
    {
        UIImage* img = [UIImage imageNamed:imageName];
        _imageView.image = img;
        _curImageName = imageName;
    }
    
    // Check that splash screen's image exists before updating bounds
    if (_imageView.image)
    {
        [self updateBounds];
    }
    else
    {
        NSLog(@"WARNING: The splashscreen image named %@ was not found", imageName);
    }
}

- (void)updateBounds
{
    if ([self isUsingCDVLaunchScreen]) {
        // CB-9762's launch screen expects the image to fill the screen and be scaled using AspectFill.
        CGSize viewportSize = [UIApplication sharedApplication].delegate.window.bounds.size;
        _imageView.frame = CGRectMake(0, 0, viewportSize.width, viewportSize.height);
        _imageView.contentMode = UIViewContentModeScaleAspectFill;
        return;
    }
    
    UIImage* img = _imageView.image;
    CGRect imgBounds = (img) ? CGRectMake(0, 0, img.size.width, img.size.height) : CGRectZero;
    
    CGSize screenSize = [self.viewController.view convertRect:[UIScreen mainScreen].bounds fromView:nil].size;
    UIInterfaceOrientation orientation = [UIApplication sharedApplication].statusBarOrientation;
    CGAffineTransform imgTransform = CGAffineTransformIdentity;
    
    /* If and only if an iPhone application is landscape-only as per
     * UISupportedInterfaceOrientations, the view controller's orientation is
     * landscape. In this case the image must be rotated in order to appear
     * correctly.
     */
    CDV_iOSDevice device = [self getCurrentDevice];
    if (UIInterfaceOrientationIsLandscape(orientation) && !device.iPhone6Plus && !device.iPad)
    {
        imgTransform = CGAffineTransformMakeRotation(M_PI / 2);
        imgBounds.size = CGSizeMake(imgBounds.size.height, imgBounds.size.width);
    }
    
    // There's a special case when the image is the size of the screen.
    if (CGSizeEqualToSize(screenSize, imgBounds.size))
    {
        CGRect statusFrame = [self.viewController.view convertRect:[UIApplication sharedApplication].statusBarFrame fromView:nil];
        if (!(IsAtLeastiOSVersion(@"7.0")))
        {
            imgBounds.origin.y -= statusFrame.size.height;
        }
    }
    else if (imgBounds.size.width > 0)
    {
        CGRect viewBounds = self.viewController.view.bounds;
        CGFloat imgAspect = imgBounds.size.width / imgBounds.size.height;
        CGFloat viewAspect = viewBounds.size.width / viewBounds.size.height;
        // This matches the behaviour of the native splash screen.
        CGFloat ratio;
        if (viewAspect > imgAspect)
        {
            ratio = viewBounds.size.width / imgBounds.size.width;
        }
        else
        {
            ratio = viewBounds.size.height / imgBounds.size.height;
        }
        imgBounds.size.height *= ratio;
        imgBounds.size.width *= ratio;
    }
    
    _imageView.transform = imgTransform;
    _imageView.frame = imgBounds;
}

- (void)setVisible:(BOOL)visible
{
    [self setVisible:visible andForce:NO];
}

- (void)setVisible:(BOOL)visible andForce:(BOOL)force
{
    if (visible != _visible || force)
    {
        _visible = visible;
        
        id fadeSplashScreenValue = [self.commandDelegate.settings objectForKey:[@"FadeSplashScreen" lowercaseString]];
        id fadeSplashScreenDuration = [self.commandDelegate.settings objectForKey:[@"FadeSplashScreenDuration" lowercaseString]];
        
        float fadeDuration = fadeSplashScreenDuration == nil ? kFadeDurationDefault : [fadeSplashScreenDuration floatValue];
        
        id splashDurationString = [self.commandDelegate.settings objectForKey: [@"SplashScreenDelay" lowercaseString]];
        float splashDuration = splashDurationString == nil ? kSplashScreenDurationDefault : [splashDurationString floatValue];
        
        id autoHideSplashScreenValue = [self.commandDelegate.settings objectForKey:[@"AutoHideSplashScreen" lowercaseString]];
        BOOL autoHideSplashScreen = true;
        
        if (autoHideSplashScreenValue != nil) {
            autoHideSplashScreen = [autoHideSplashScreenValue boolValue];
        }
        
        if (!autoHideSplashScreen) {
            // CB-10412 SplashScreenDelay does not make sense if the splashscreen is hidden manually
            splashDuration = 0;
        }
        
        
        if (fadeSplashScreenValue == nil)
        {
            fadeSplashScreenValue = @"true";
        }
        
        if (![fadeSplashScreenValue boolValue])
        {
            fadeDuration = 0;
        }
        else if (fadeDuration < 30)
        {
            // [CB-9750] This value used to be in decimal seconds, so we will assume that if someone specifies 10
            // they mean 10 seconds, and not the meaningless 10ms
            fadeDuration *= 1000;
        }
        
        if (_visible)
        {
            if (_imageView == nil)
            {
                [self createPlayerView];
                
                //                if(!splashPageLoaded)
                //                {
                //                    [self createViews];
                //                }
                //                else
                //                {
                //                    skipView.hidden = NO;
                //                }
            }
        }
        else if (fadeDuration == 0 && splashDuration == 0)
        {
            [self destroyViews];
        }
        else
        {
            __weak __typeof(self) weakSelf = self;
            float effectiveSplashDuration;
            
            // [CB-10562] AutoHideSplashScreen may be "true" but we should still be able to hide the splashscreen manually.
            if (!autoHideSplashScreen || force) {
                effectiveSplashDuration = (fadeDuration) / 1000;
            } else {
                effectiveSplashDuration = (splashDuration - fadeDuration) / 1000;
            }
            [self hideViews];
            
            
            dispatch_after(dispatch_time(DISPATCH_TIME_NOW, (uint64_t) effectiveSplashDuration * NSEC_PER_SEC), dispatch_get_main_queue(), CFBridgingRelease(CFBridgingRetain(^(void) {
                
                if (!self->_destroyed) {
                    
                    [UIView transitionWithView:self.viewController.view
                                      duration:(fadeDuration / 1000)
                                       options:UIViewAnimationOptionTransitionNone
                                    animations:^(void) {
                        //                                                                [weakSelf hideViews];
                    }
                                    completion:^(BOOL finished) {
                        // Always destroy views, otherwise you could have an
                        // invisible splashscreen that is overlayed over your active views
                        // which causes that no touch events are passed
                        if (!self->_destroyed) {
                            [weakSelf destroyViews];
                            // TODO: It might also be nice to have a js event happen here -jm
                        }
                    }
                     ];
                }
            })));
        }
    }
}

- (NSString *)urlDecode:(NSString *)value
{
    NSString *decodedString  = (__bridge_transfer NSString *)CFURLCreateStringByReplacingPercentEscapesUsingEncoding(NULL,
                                                                                                                     (__bridge CFStringRef)value,
                                                                                                                     CFSTR(""),
                                                                                                                     CFStringConvertNSStringEncodingToEncoding(NSUTF8StringEncoding));
    return decodedString;
}

- (BOOL)fileExist:(NSString *)path
{
    path = [self getFilePath:path];
    NSFileManager *fm = [NSFileManager new];
    return [fm fileExistsAtPath:path];
}

- (NSString *)getFilePath:(NSString *)path
{
    if([path rangeOfString:@"file:///"].location == 0)
    {
        path = [path substringFromIndex:@"file://".length];
        path = [self urlDecode:path];
    }
    return path;
}

-(void)createPlayerView
{
    NSString *mp4Path = @"assets/openAnimate.mp4";
    mp4Path = [[self.commandDelegate settings] objectForKey:[@"SplashScreenVideoPath" lowercaseString]];
    if(videoPath.length)
    {
        mp4Path = videoPath;
    }
    if(!mp4Path)
    {
        NSLog(@"video path is nil");
        return;
    }
    NSLog(@"play video: %@", mp4Path);
    NSString *showOnlyOnce = [[self.commandDelegate settings] objectForKey:[@"SplashScreenVideoShowOnlyOnce" lowercaseString]];
    if([@"true" isEqualToString:showOnlyOnce])
    {
        NSString *key = @"SplashScreenVideoViewed";
        NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
        if([defaults boolForKey:key])
        {
            NSLog(@"splash video show only once, let's skip it");
            return;
        }
        [defaults setBool:YES forKey:key];
        [defaults synchronize];
    }
    
    NSURL* mp4URL = [NSURL URLWithString:mp4Path];
    NSString* mp4FilePath = [self.commandDelegate pathForResource:[mp4URL path]];
    if(!mp4FilePath && ((CDVViewController *)self.viewController).wwwFolderName.length)
    {
        NSString *folder = [self getFilePath:((CDVViewController *)self.viewController).wwwFolderName];
        mp4FilePath = [NSString stringWithFormat:@"%@%@", folder, mp4Path];
    }
    if(!mp4FilePath || ![self fileExist:mp4FilePath])
    {
        mp4FilePath = [[NSBundle mainBundle] pathForResource:[NSString stringWithFormat:@"www/statics/%@", mp4Path] ofType:nil];
    }
    
    if(!mp4FilePath || ![self fileExist:mp4FilePath])
    {
        NSLog(@"Video not exist: %@, %@", mp4Path, mp4FilePath);
        return;
    }
    
    //视频文件路径
    //    NSString *path = [[NSBundle mainBundle] pathForResource:@"welcome_movie.mp4" ofType:nil];
    //视频url
    NSURL *url = [NSURL fileURLWithPath:mp4FilePath];
    //    视频链接
    AVPlayerItem *playerItem = [[AVPlayerItem alloc] initWithURL:url];
    self.currentPlayerItem = playerItem;
    
    //    初始化音视频
    self.player = [[AVPlayer alloc] initWithPlayerItem:playerItem];
    //    初始化音视频的播放层layer
    self.playerLayer = [AVPlayerLayer playerLayerWithPlayer:self.player];
    //    layer的frame
    self.playerLayer.frame = CGRectMake(0, 0, kScreenWidth, kScreenHeight);
    //    设置提示(可设置layer的背景等)
    self.playerLayer.videoGravity = AVLayerVideoGravityResize;
    //    音视频的layer层添加到视图上
    [self.viewController.view.layer addSublayer:self.playerLayer];
    
    [self.player play];
    __weak __typeof(self) weakSelf = self;
    
    self.timeObserver = [self.player addPeriodicTimeObserverForInterval:CMTimeMake(1, 1) queue:dispatch_get_main_queue() usingBlock:^(CMTime time) {
        
        //当前播放的时间
        NSTimeInterval currentTime = CMTimeGetSeconds(time);
        //视频的总时间
        NSTimeInterval totalTime = CMTimeGetSeconds(weakSelf.player.currentItem.duration);
        if (currentTime == totalTime) {
            [weakSelf disposeVideo];
        }
        
    }];
    
}


/*!
 *  跳出播放按钮
 */
- (void)initSlipButtonView
{
    CGFloat vmaring = 30;
    CGFloat hmaring = 50;
    CGFloat slitpW = 60;
    CGFloat slitpH = 40;
    
    if (skipView) {
        return;
    }
    skipView = [UIButton buttonWithType:UIButtonTypeCustom];
    skipView.clipsToBounds = YES;
    skipView.layer.cornerRadius = 5;
    skipView.frame = CGRectMake(kScreenWidth - vmaring - slitpW, hmaring, slitpW, slitpH);
    [skipView setBackgroundColor:RGBAColor(0x0, 0x0, 0x0, .3)];
    [skipView setTintColor:RGBColor(0xff, 0xff, 0xff)];
    [skipView setTitle:@"跳过" forState:UIControlStateNormal];
    skipView.titleLabel.font = [UIFont systemFontOfSize:14];
    [skipView addTarget:self action:@selector(skipVideo) forControlEvents:UIControlEventTouchUpInside];
    [[UIApplication sharedApplication].keyWindow addSubview:skipView];
}

#pragma mark 视频播放结束委托
/*!
 *  当视频播放完毕释放对象
 */
- (void)myMovieFinishedCallback:(NSNotification*)notify
{
    [self disposeVideo];
}

- (void)skipVideo
{
    
    [self disposeVideo];
}

- (void)disposeVideo
{
    [self.player pause];
    [self.playerLayer removeFromSuperlayer];
    _player = nil;
    [skipView removeFromSuperview];
    skipView = nil;
    splashPageLoaded = YES;
    videoPath = nil;
    _visible = NO;
    [self hideViews];
    
    if (!_destroyed) {
        [self destroyViews];
    }
}
@end
