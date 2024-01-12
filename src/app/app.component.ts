import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { GameComponent } from './game/game.component'

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GameComponent, CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  
}
