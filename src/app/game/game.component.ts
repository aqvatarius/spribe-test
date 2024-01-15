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
      private assetsService: AssetsService,
      private reelsService: ReelsService    
   ) {}

   ngOnInit(): void {
      // Create new app.
      this.app = new PIXI.Application({
         width:      Config.reelsTotalWidth,
         height:     Config.reelsTotalHeight,
         background: Config.BACKGROUND
      });

      // Load assets + generate reels for game.
      this.assetsService.loadAssets().then(() => {
         this.handleReels();
         requestAnimationFrame(this.animate.bind(this));
      });

      // Add canvas to html container.
      this.pixiContainer.nativeElement.appendChild(this.app.view);
   }

   // Handle generate reels and adding container with reels to app.
   private handleReels(): void {
      this.reelsService.generateReels();
      this.reelsService.buildReelsContainer();
      this.app.stage.addChild(this.reelsService.getReelsContainer());      
   }

   // Get running state for button.
   public getRunningState(): boolean {
      return this.running
   }

   // Start game method call on button.
   public startPlay(): void {

      if (this.running) return;
      this.running = true;

      const reels = this.reelsService.getReels()

      // GSAP create master timeline for animation, and adding parallel timelines to run all reals same time.
      this.timeline = gsap.timeline({ repeat: 0 , onComplete: () => this.animationComplete()});
      this.timeline.add("paralell", 0)

      for (let i = 0; i < reels.length; i++) {
         // Random animation speed
         const duration = Math.random() * (6 - 3) + 3;
         // The final position of a reel. Result can be calculated here or we can set result here from API.
         const nextPosition = reels[i].position + Math.floor(Math.random() * ((Config.SYMBOLS_QTY - 3) - 10 + 1) + 10) * Config.SYMBOL_SIZE;
         // GSAP animation
         this.timeline.fromTo(reels[i].container, { y: -reels[i].position }, { y: -nextPosition, duration, ease: Config.SPIN_ANIMATION }, "paralell");
      }
   }

   // Fires once all animations completed, releases the play button.
   private animationComplete(): void {
      this.timeline.kill();
      this.running = false;
   }

   // DeltaTime solution for fps increase.
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
