import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http'; // Importar provider HTTP
import { provideAnimations } from '@angular/platform-browser/animations'; // Importar provider Animations

import { appRoutes } from './app.routes'; // Usaremos app.routes.ts em vez de app-routing.module

// Importar Configurações de Libs Externas
import { provideToastr } from 'ngx-toastr';
import { provideNgxMask } from 'ngx-mask';
// NgxSpinner não parece ter um provider dedicado, será importado no AppComponent

// Importar Configuração NgRx (Exemplo)
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { isDevMode } from '@angular/core';
// import { reducers } from './store/reducers'; // Importar reducers
// import { effects } from './store/effects'; // Importar effects

// Importar Provedores de Interceptors/Guards (se existirem e forem standalone)
// Ex: import { provideAuthInterceptor } from './core/interceptors/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // Roteamento
    provideRouter(appRoutes),

    // HTTP Client e Animações
    provideHttpClient(withInterceptorsFromDi()), // Habilita interceptors definidos em providers abaixo ou em root
    provideAnimations(),

    // Configuração de Libs
    provideToastr({
      timeOut: 5000,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
      progressBar: true,
      closeButton: true,
    }),
    provideNgxMask(), // Provider para NgxMask

    // Configuração NgRx
    provideStore({}), // Passar objeto de reducers aqui: provideStore(reducers)
    provideEffects([]), // Passar array de effects aqui: provideEffects(effects)
    provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() }), // DevTools apenas em dev

    // Configuração de Interceptors/Guards (se não forem providedIn: 'root')
    // Ex: provideAuthInterceptor(),

    // Serviços (geralmente são providedIn: 'root' nos próprios serviços)
  ]
}; 