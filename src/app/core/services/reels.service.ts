import { Injectable } from '@angular/core';
import * as PIXI from 'pixi.js';
import { GeneralConfig as Config } from '../config/general.config';
import { Reel } from '../types/reel.type';
import { AssetsService } from './assets.service';

@Injectable()
export class ReelsService {

   private reels: Array<Reel> = [];
   private reelsContainer: PIXI.Container = new PIXI.Container();

   constructor(private assetsService: AssetsService) {}

   public getReels(): Array<Reel> {
      return this.reels;
   }

   public getReelsContainer(): PIXI.Container {
      return this.reelsContainer;
   }

   public generateReels(): void {
      // Generate n reels depends on config
      for (let i = 0; i < Config.REELS_QUANTITY; i++) {
         // Create new container for Reel
         const reelContainer = new PIXI.Container();
         reelContainer.x = Config.REEL_WIDTH * i;   
         // New reel
         const reel: Reel = {
            container: reelContainer,
            symbols: [],            
            position: 0,
            previousPosition: 0,
            blur: new PIXI.BlurFilter(),
         };
         reel.blur.blurX = 0;
         reel.blur.blurY = 0;
         reelContainer.filters = [reel.blur];         
   
         // Generate symbols for reel
         this.generateReelSymbols(reel);
         this.reels.push(reel);
      }
   }

   private generateReelSymbols(reel: Reel): void {
      // Generate n symbols for reel depends on config
      for (let i = 0; i < Config.SYMBOLS_QTY; i++) {
         const symbol = new PIXI.Sprite(this.assetsService.getRandomSymbolTexture());

         symbol.y = i * Config.SYMBOL_SIZE;
         symbol.x = 0;

         symbol.scale.x = symbol.scale.y = Math.min(Config.SYMBOL_SIZE / symbol.width, Config.SYMBOL_SIZE / symbol.height);

         reel.symbols.push(symbol);
         reel.container.addChild(symbol);
      }
   }

   public buildReelsContainer(): void {
      // Loop all reals and push all containers into master container
      this.reels.forEach((reel) => {
         this.reelsContainer.addChild(reel.container);
      });
   }
}
