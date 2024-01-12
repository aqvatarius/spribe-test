import { Injectable } from '@angular/core';
import * as PIXI from 'pixi.js';
import { GeneralConfig as Config } from '../config/general.config';
import { Reel } from '../types/reel.type';
import { AssetsService } from '../services/assets.service';

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

   public initializeReels(): void {
      for (let i = 0; i < Config.REELS_QUANTITY; i++) {
         const reelContainer = this.createReelContainer(i);
         const reel = this.createReel(reelContainer);
         this.generateReelSymbols(reel);
         this.reels.push(reel);
      }
   }

   private createReelContainer(index: number): PIXI.Container {
      const reelContainer = new PIXI.Container();
      reelContainer.x = index * Config.REEL_WIDTH;
      this.reelsContainer.addChild(reelContainer);
      return reelContainer;
   }

   private createReel(container: PIXI.Container): Reel {
      const reel: Reel = {
         container: container,
         symbols: [],
         position: 0,
         previousPosition: 0,
         blur: new PIXI.BlurFilter(),
      };
      reel.blur.blurX = 0;
      reel.blur.blurY = 0;
      container.filters = [reel.blur];
      return reel;
   }

   private generateReelSymbols(reel: Reel): void {
      for (let i = 0; i < Config.SYMBOLS_QTY; i++) {
         const symbol = new PIXI.Sprite(this.assetsService.getRandomSymbolTexture());
         symbol.y = i * Config.SYMBOL_SIZE;
         symbol.x = 0;//Math.round((Config.SYMBOL_SIZE - symbol.width) / 2);
         symbol.scale.x = symbol.scale.y = Math.min(Config.SYMBOL_SIZE / symbol.width, Config.SYMBOL_SIZE / symbol.height);
         reel.symbols.push(symbol);
         reel.container.addChild(symbol);
      }
   }
}
