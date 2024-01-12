import { Injectable } from '@angular/core';
import * as PIXI from 'pixi.js';

@Injectable()
export class AssetsService {

   public loadAssets(): Promise<void> {
      return new Promise<void>((resolve) => {
         PIXI.Assets.load([
            'assets/eggHead.png',
            'assets/flowerTop.png',
            'assets/helmlok.png',
            'assets/skully.png'
         ]).then(() => resolve());
      });
   }

   public getRandomSymbolTexture(): PIXI.Texture {
      const slotTextures = [
         PIXI.Texture.from('assets/eggHead.png'),
         PIXI.Texture.from('assets/flowerTop.png'),
         PIXI.Texture.from('assets/helmlok.png'),
         PIXI.Texture.from('assets/skully.png')
      ];

      return slotTextures[Math.floor(Math.random() * slotTextures.length)];
   }
}
