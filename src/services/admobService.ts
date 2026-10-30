// Google AdMob Service Architecture for Capacitor Android Integration
// Provides hooks for Rewarded Ads (extra hints/coins) and Interstitials (between levels).
// In development/web browser without Capacitor AdMob plugin, it safely resolves immediately.

export interface AdMobConfig {
  rewardedAdUnitId: string;
  interstitialAdUnitId: string;
  bannerAdUnitId?: string;
  isTesting: boolean;
}

const DEFAULT_CONFIG: AdMobConfig = {
  // Official Google AdMob Test IDs for Android
  rewardedAdUnitId: 'ca-app-pub-3940256099942544/5224354917',
  interstitialAdUnitId: 'ca-app-pub-3940256099942544/1033173712',
  bannerAdUnitId: 'ca-app-pub-3940256099942544/6300978111',
  isTesting: true,
};

class AdMobService {
  private config: AdMobConfig = DEFAULT_CONFIG;
  private isCapacitor = false;
  private isInitialized = false;

  constructor() {
    this.checkEnvironment();
  }

  private checkEnvironment() {
    if (typeof window !== 'undefined') {
      this.isCapacitor = !!(window as any).Capacitor;
    }
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    // When Capacitor AdMob plugin is added:
    // import { AdMob } from '@capacitor-community/admob';
    // await AdMob.initialize({ requestTrackingAuthorization: true });
    
    this.isInitialized = true;
    console.log('MindFlip AdMob Service: Initialized (Ready for native integration)');
  }

  // Show rewarded video ad (for extra coins or free hint)
  public async showRewardedAd(rewardName: string = 'coins'): Promise<{ success: boolean; rewardAmount: number }> {
    console.log(`MindFlip AdMob: Requesting Rewarded Ad for ${rewardName}`);
    
    // If running in pure web mode or offline, simulate immediate reward grant smoothly
    // In production with Capacitor plugin:
    // await AdMob.prepareRewardVideoAd({ adId: this.config.rewardedAdUnitId });
    // const rewardItem = await AdMob.showRewardVideoAd();
    
    return new Promise((resolve) => {
      // Simulate quick friendly watch in dev/web
      setTimeout(() => {
        resolve({
          success: true,
          rewardAmount: rewardName === 'hint' ? 1 : 50,
        });
      }, 500);
    });
  }

  // Non-intrusive interstitial between levels (e.g. every 5 completed levels)
  public async showInterstitialIfAppropriate(completedLevelCount: number): Promise<boolean> {
    // Only trigger every 5 levels to prevent fatigue
    if (completedLevelCount % 5 !== 0 || completedLevelCount === 0) {
      return false;
    }

    console.log('MindFlip AdMob: Interstitial candidate at level milestone', completedLevelCount);
    // In production with Capacitor:
    // await AdMob.prepareInterstitial({ adId: this.config.interstitialAdUnitId });
    // await AdMob.showInterstitial();
    return true;
  }
}

export const admob = new AdMobService();
