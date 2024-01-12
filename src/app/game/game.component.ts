import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import { GeneralConfig as Config } from '../core/config/general.config';;
import { ReelsService } from '../core/services/reels.service';
import { AssetsService } from '../core/services/assets.service';
import { Reel } from '../core/types/reel.type';

@Component({
   selector: 'app-game',
   standalone: true,
   imports: [],
   templateUrl: './game.component.html',
   styleUrl: './game.component.scss',
   providers: [ReelsService, AssetsService]
})
export class GameComponent implements OnInit, OnDestroy {
   @ViewChild('canvasContainer', { static: true }) pixiContainer!: ElementRef;

   private app!: PIXI.Application;
   private timeline!: gsap.core.Timeline;
   private lastTime = Date.now();
   private running: boolean = false;

   constructor(
      private reelsService: ReelsService,
      private assetsService: AssetsService
   ) {}

   ngOnInit(): void {
      this.app = new PIXI.Application({
         width:      Config.reelsTotalWidth,
         height:     Config.reelsTotalHeight,
         background: Config.BACKGROUND
      });

      this.assetsService.loadAssets().then(() => {
         this.reelsService.initializeReels();
         this.generateReelsContainer();
         requestAnimationFrame(this.animate.bind(this));
      });

      this.pixiContainer.nativeElement.appendChild(this.app.view);
   }

   private generateReelsContainer(): void {
      const reels = this.reelsService.getReels();
      const reelsContainer = this.reelsService.getReelsContainer();

      reels.forEach((reel) => {
         reelsContainer.addChild(reel.container);
      });

      this.app.stage.addChild(reelsContainer);
   }

   public getRunningState(): boolean {
      return this.running
   }

   public startPlay(): void {

      if (this.running) return;
      this.running = true;

      const reels = this.reelsService.getReels()

      this.timeline = gsap.timeline({ repeat: 0 , onComplete: () => this.animationComplete()});
      this.timeline.add("paralell", 0)

      for (let i = 0; i < reels.length; i++) {
         const duration = Math.random() * (6 - 3) + 3;
         const nextPosition = reels[i].position + Math.floor(Math.random() * ((Config.SYMBOLS_QTY - 3) - 10 + 1) + 10) * Config.SYMBOL_SIZE;

         this.timeline.fromTo(reels[i].container, { y: -reels[i].position }, { y: -nextPosition, duration, ease: Config.SPIN_ANIMATION }, "paralell");
      }
   }

   private animationComplete(): void {
      this.timeline.kill();
      this.running = false;
   }

   private animate(): void {

      const currentTime = Date.now();
      const deltaTime = (currentTime - this.lastTime) / 1000;

      if (this.running) {
         this.app.ticker.update(deltaTime);
      }

      this.lastTime = currentTime;

      requestAnimationFrame(this.animate.bind(this));
   }

   ngOnDestroy(): void {
      if (this.app) {
         this.app.destroy();
      }
   }
}
