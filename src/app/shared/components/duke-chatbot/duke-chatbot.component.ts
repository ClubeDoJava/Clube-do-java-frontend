import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DukeChatbotService } from '../../../core/services/duke-chatbot.service';

interface ChatMessage {
    text: string;
    isBot: boolean;
    timestamp: Date;
}

@Component({
    selector: 'app-duke-chatbot',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FontAwesomeModule
    ],
    templateUrl: './duke-chatbot.component.html',
    styleUrls: ['./duke-chatbot.component.scss'],
    animations: [
        trigger('fadeInOut', [
            transition(':enter', [
                style({ opacity: 0, transform: 'translateY(10px)' }),
                animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
            ]),
            transition(':leave', [
                animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))
            ])
        ]),
        trigger('slideInOut', [
            transition(':enter', [
                style({ transform: 'translateY(100%)' }),
                animate('300ms ease-out', style({ transform: 'translateY(0)' }))
            ]),
            transition(':leave', [
                animate('300ms ease-in', style({ transform: 'translateY(100%)' }))
            ])
        ])
    ]
})
export class DukeChatbotComponent implements OnInit {
    @ViewChild('chatContainer') private chatContainer!: ElementRef;

    isChatOpen = false;
    chatForm: FormGroup;
    messages: ChatMessage[] = [];
    isTyping = false;

    // Sugestões rápidas para o usuário
    quickSuggestions = [
        'Como faço para comprar?',
        'Formas de pagamento',
        'Prazo de entrega',
        'Política de troca',
        'Rastrear meu pedido'
    ];

    constructor(
        private formBuilder: FormBuilder,
        private chatbotService: DukeChatbotService
    ) {
        this.chatForm = this.formBuilder.group({
            message: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        // Adiciona uma mensagem inicial após um pequeno delay para simular carregamento
        setTimeout(() => {
            this.addBotMessage('Olá! 👋 Eu sou o Duke, mascote do Java e assistente virtual do Clube do Java! Como posso ajudar você hoje?');
        }, 500);
    }

    toggleChat(): void {
        this.isChatOpen = !this.isChatOpen;

        if (this.isChatOpen && this.messages.length === 0) {
            this.addBotMessage('Olá! 👋 Eu sou o Duke, mascote do Java e assistente virtual do Clube do Java! Como posso ajudar você hoje?');
        }
    }

    sendMessage(): void {
        if (this.chatForm.invalid) {
            return;
        }

        const userMessage = this.chatForm.value.message;
        this.addUserMessage(userMessage);
        this.chatForm.reset();

        // Simula o bot digitando
        this.isTyping = true;

        // Obtém a resposta do serviço
        this.chatbotService.getResponse(userMessage)
            .subscribe({
                next: (response) => {
                    setTimeout(() => {
                        this.isTyping = false;
                        this.addBotMessage(response);
                    }, 1000 + Math.random() * 1000); // Delay aleatório para parecer mais humano
                },
                error: (err) => {
                    console.error('Erro ao obter resposta do chatbot', err);
                    this.isTyping = false;
                    this.addBotMessage('Desculpe, estou tendo problemas técnicos no momento. Pode tentar novamente mais tarde?');
                }
            });
    }

    addUserMessage(text: string): void {
        this.messages.push({
            text,
            isBot: false,
            timestamp: new Date()
        });
        this.scrollToBottom();
    }

    addBotMessage(text: string): void {
        this.messages.push({
            text,
            isBot: true,
            timestamp: new Date()
        });
        this.scrollToBottom();
    }

    useQuickSuggestion(suggestion: string): void {
        this.chatForm.patchValue({ message: suggestion });
        this.sendMessage();
    }

    private scrollToBottom(): void {
        setTimeout(() => {
            try {
                if (this.chatContainer && this.chatContainer.nativeElement) {
                    const element = this.chatContainer.nativeElement;
                    element.scrollTop = element.scrollHeight;
                }
            } catch (err) {
                console.error('Erro ao tentar rolar o chat para baixo:', err);
            }
        }, 50);
    }
}