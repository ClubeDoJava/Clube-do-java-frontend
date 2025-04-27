// Arquivo: src/app/core/services/duke-chatbot.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

interface ChatbotResponse {
    answer: string;
    intent: string;
}

@Injectable({
    providedIn: 'root'
})
export class DukeChatbotService {
    private readonly ENDPOINT = `${environment.apiUrl}/chatbot`;

// Respostas pré-programadas para quando a API estiver indisponível
    private readonly FALLBACK_RESPONSES: { [key: string]: string } = {
        greeting: 'Olá! Como posso ajudar você hoje?',
        payment: 'Aceitamos PIX, boleto bancário e pagamento com cartão de crédito!',
        shipping: 'As entregas são feitas pelos Correios, Jadlog e Braspress. O prazo varia conforme sua localização.',
        products: 'Temos camisetas, canecas, adesivos e jaquetas com temas do Java. Qual desses produtos você gostaria de conhecer?',
        order: 'Para consultar o status do seu pedido, acesse a seção "Meus Pedidos" no seu perfil.',
        help: 'Posso ajudar com informações sobre produtos, pagamentos, entregas, trocas e muito mais. O que você gostaria de saber?',
        java: 'Java é uma linguagem de programação e plataforma computacional lançada pela primeira vez pela Sun Microsystems em 1995. E eu, Duke, sou o mascote oficial do Java!',
        thanks: 'Por nada! Estou aqui para ajudar. Precisa de mais alguma coisa?',
        default: 'Desculpe, não entendi sua pergunta. Poderia reformular?'
    };

    constructor(private http: HttpClient) { }

    getResponse(userMessage: string): Observable<string> {
// Tenta obter resposta da API
        return this.http.post<ChatbotResponse>(`${this.ENDPOINT}/message`, { message: userMessage })
            .pipe(
                map(response => response.answer),
                catchError(error => {
                    console.warn('Erro ao comunicar com API do chatbot, usando respostas locais', error);
                    return of(this.getFallbackResponse(userMessage));
                })
            );
    }

    private getFallbackResponse(userMessage: string): string {
        const message = userMessage.toLowerCase();

        if (message.includes('olá') || message.includes('oi') || message.includes('bom dia') || message.includes('boa tarde') || message.includes('boa noite')) {
            return this.FALLBACK_RESPONSES['greeting'];
        } else if (message.includes('pagamento') || message.includes('pagar') || message.includes('boleto') || message.includes('pix') || message.includes('cartão')) {
            return this.FALLBACK_RESPONSES['payment'];
        } else if (message.includes('entrega') || message.includes('frete') || message.includes('envio') || message.includes('prazo') || message.includes('correio')) {
            return this.FALLBACK_RESPONSES['shipping'];
        } else if (message.includes('produto') || message.includes('camiseta') || message.includes('caneca') || message.includes('adesivo') || message.includes('jaqueta')) {
            return this.FALLBACK_RESPONSES['products'];
        } else if (message.includes('pedido') || message.includes('status') || message.includes('compra') || message.includes('rastreio')) {
            return this.FALLBACK_RESPONSES['order'];
        } else if (message.includes('ajuda') || message.includes('ajudar') || message.includes('dúvida')) {
            return this.FALLBACK_RESPONSES['help'];
        } else if (message.includes('java') || message.includes('programação') || message.includes('desenvolver')) {
            return this.FALLBACK_RESPONSES['java'];
        } else if (message.includes('obrigado') || message.includes('valeu') || message.includes('obrigada')) {
            return this.FALLBACK_RESPONSES['thanks'];
        } else {
            return this.FALLBACK_RESPONSES['default'];
        }
    }
}