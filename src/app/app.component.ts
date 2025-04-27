import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { NgxSpinnerModule } from 'ngx-spinner';
import { DukeChatbotComponent } from './shared/components/duke-chatbot/duke-chatbot.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    NgxSpinnerModule,
    DukeChatbotComponent
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'clube-do-java-frontend';

  constructor() {
    // Lógica inicial do AppComponent, se houver
    // Ex: Iniciar serviço de monitoramento de conexão, etc.
  }
} 