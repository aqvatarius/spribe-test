export class GeneralConfig {
   static readonly REEL_WIDTH: number     = 160;
   static readonly REELS_QUANTITY: number = 5;
   static readonly SYMBOL_SIZE: number    = 150;
   static readonly SYMBOLS_QTY: number    = 30;
   static readonly SPIN_ANIMATION: string = "power4.out"; //power2.out, expo.inOut
   static readonly BACKGROUND: string     = '#1099bb';

   static reelsTotalWidth: number = GeneralConfig.REEL_WIDTH * GeneralConfig.REELS_QUANTITY;
   static reelsTotalHeight: number = GeneralConfig.SYMBOL_SIZE * 3;
}
