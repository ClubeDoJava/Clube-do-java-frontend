#  🧼 Clube do Java - E-commerce

![](https://img.shields.io/badge/Java-17-orange)
![](https://img.shields.io/badge/Spring%20Boot-3.x-green)
![](https://img.shields.io/badge/Project%20Loom-Virtual%20Threads-blue)
![](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)

Uma loja virtual especializada em produtos para desenvolvedores, como camisetas, canecas, adesivos e jaquetas. Projeto desenvolvido com Java 17 (Azul Zulu), Project Loom e Quasar, com recursos para concorrência e alta performance.

<!-- <p align="center">
  <img src="https://via.placeholder.com/800x400?text=Clube+do+Java" alt="Clube do Java Banner" width="600">
</p>
-->


## ✨ Funcionalidades

- 🛍️ **Catálogo de Produtos**: Listagem, filtros e buscas avançadas
- 🛒 **Carrinho de Compras**: Adição, remoção e atualização de itens
- 👤 **Autenticação e Autorização**: Registro, login e controle de acesso
- 💳 **Checkout**: Finalização de compras com seleção de frete e pagamento
- 💰 **Pagamento**: Integração com Asaas para PIX e boleto
- 📦 **Gestão de Pedidos**: Acompanhamento de status e histórico
- 🚚 **Cálculo de Frete**: Integração com Correios, Jadlog e Braspress
- 🔐 **Área do Usuário**: Gerenciamento de perfil, endereços e pedidos

## 🛠️ Tecnologias Utilizadas

### Backend
- ☕ **Java 17 (Azul Zulu)**: Implementação do JDK com suporte LTS
- 🧵 **Project Loom**: Uso de Virtual Threads para alta concorrência
- 🌟 **Quasar**: Programação orientada a fibras para processos assíncronos
- 🍃 **Spring Boot 3**: Framework para desenvolvimento rápido de aplicações
- 🔒 **Spring Security**: Autenticação e autorização com JWT
- 🗃️ **Spring Data JPA**: Persistência de dados simplificada
- 🐘 **PostgreSQL**: Banco de dados relacional
- ⚡ **Redis**: Cache distribuído
- 🔑 **BouncyCastle**: Biblioteca para criptografia avançada
- 🔄 **Flyway**: Migrations e versionamento do banco de dados

### Integrações
- 💸 **Asaas**: Gateway de pagamentos (PIX e boleto)
- 📮 **Correios**: Cálculo de frete e rastreamento
- 🚛 **Jadlog**: Opção adicional de transportadora
- 🚚 **Braspress**: Opção adicional de transportadora

### DevOps
- 🐋 **Docker & Docker Compose**: Containerização da aplicação
- 📊 **Prometheus & Grafana**: Monitoramento e métricas
- 🔄 **Nginx**: Proxy reverso e balanceamento de carga

## 🏗️ Arquitetura

<p align="center">
  <img src="https://via.placeholder.com/800x500?text=Arquitetura+do+Sistema" alt="Arquitetura do Sistema" width="600">
</p>

O sistema utiliza uma arquitetura de microserviços com os seguintes componentes:

- 🌐 **API RESTful**: Interface para comunicação com o frontend
- ⚡ **Serviços Assíncronos**: Processamento de pedidos e pagamentos usando Virtual Threads
- 🚀 **Cache Distribuído**: Otimização de performance e redução de carga no banco de dados
- 🔐 **Segurança**: Implementação de JWT com BouncyCastle para criptografia avançada

## 📋 Pré-requisitos

- ☕ Java 17 (preferencialmente Azul Zulu)
- 🔨 Maven 3.8+
- 🐋 Docker e Docker Compose
- 🐘 PostgreSQL 13+
- ⚡ Redis 6+

## ⚙️ Configuração

### Variáveis de Ambiente

Configure as seguintes variáveis de ambiente ou ajuste o arquivo `application.yml`:

```properties
# Banco de Dados
DB_HOST=localhost
DB_PORT=5432
DB_NAME=clubedojava
DB_USERNAME=postgres
DB_PASSWORD=postgres

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your_jwt_secret_key

# Asaas (Gateway de Pagamentos)
ASAAS_API_URL=https://sandbox.asaas.com/api/v3
ASAAS_API_KEY=your_asaas_api_key
ASAAS_WEBHOOK_SECRET=your_webhook_secret

# Transportadoras
ORIGIN_ZIPCODE=01001000
ORIGIN_CITY=São Paulo
ORIGIN_STATE=SP
CORREIOS_API_URL=https://api.correios.com.br
CORREIOS_API_KEY=your_correios_api_key
JADLOG_API_URL=https://api.jadlog.com.br
JADLOG_API_KEY=your_jadlog_api_key
BRASPRESS_API_URL=https://api.braspress.com
BRASPRESS_API_KEY=your_braspress_api_key
```

## 🚀 Executando a Aplicação

### Usando Maven

```bash
# Compilar o projeto
mvn clean install

# Executar a aplicação
mvn spring-boot:run
```

### Usando Docker Compose

```bash
# Iniciar todos os serviços
docker-compose up -d

# Verificar os logs
docker-compose logs -f app

# Parar todos os serviços
docker-compose down
```

## 🔄 Endpoints da API

### Autenticação e Usuários

- `POST /api/auth/register` - Registro de novo usuário
- `POST /api/auth/login` - Login do usuário
- `GET /api/users/me` - Informações do usuário atual
- `PUT /api/users/{id}` - Atualizar dados do usuário
- `GET /api/users/{id}/addresses` - Listar endereços do usuário
- `POST /api/users/{id}/addresses` - Adicionar novo endereço
- `PUT /api/users/{userId}/addresses/{addressId}` - Atualizar endereço
- `DELETE /api/users/{userId}/addresses/{addressId}` - Remover endereço

### Produtos e Categorias

- `GET /api/products` - Listar produtos
- `GET /api/products/{id}` - Detalhes do produto
- `GET /api/products/featured` - Produtos em destaque
- `GET /api/products/category/{categoryId}` - Produtos por categoria
- `GET /api/categories` - Listar categorias

### Carrinho de Compras

- `GET /api/cart` - Recuperar carrinho atual
- `POST /api/cart/items` - Adicionar item ao carrinho
- `PUT /api/cart/items/{itemId}` - Atualizar quantidade do item
- `DELETE /api/cart/items/{itemId}` - Remover item do carrinho
- `DELETE /api/cart` - Limpar carrinho

### Pedidos

- `GET /api/orders` - Listar pedidos do usuário
- `GET /api/orders/{id}` - Detalhes do pedido
- `POST /api/orders` - Criar novo pedido
- `PATCH /api/orders/{id}/cancel` - Cancelar pedido
- `GET /api/orders/tracking/{trackingNumber}` - Rastrear pedido

### Cálculo de Frete

- `POST /api/shipping/calculate` - Calcular opções de frete
- `GET /api/shipping/tracking/{trackingNumber}` - Rastrear entrega

## ⚡ Recursos Especiais de Project Loom e Quasar

<p align="center">
  <img src="https://via.placeholder.com/800x300?text=Virtual+Threads+Performance" alt="Performance com Virtual Threads" width="600">
</p>

A aplicação faz uso intensivo de Virtual Threads (Project Loom) e Quasar Fibers para alta concorrência:

- 🚀 Processamento assíncrono de pedidos
- ⚡ Cálculo paralelo de fretes de múltiplas transportadoras
- 💸 Verificação de pagamentos em background
- 🔄 Comunicação assíncrona com integrações externas

Esses recursos permitem que a aplicação escale facilmente para lidar com milhares de requisições simultâneas com baixo consumo de recursos.

## 🔒 Segurança

A aplicação implementa diversas medidas de segurança:

- 🔐 Autenticação JWT com BouncyCastle para criptografia avançada
- 🔑 Senhas armazenadas com BCrypt
- 🛡️ Proteção contra ataques CSRF e XSS
- ✅ Validação de entrada em todos os endpoints
- 🔒 HTTPS obrigatório em produção
- 🔐 Comunicação segura com APIs de pagamento

## 📊 Monitoramento

<p align="center">
  <img src="https://via.placeholder.com/800x400?text=Grafana+Dashboard" alt="Dashboard de Monitoramento" width="600">
</p>

O projeto incluí uma configuração pronta para monitoramento com:

- 📈 Prometheus para coleta de métricas
- 📊 Grafana para visualização e dashboards
- ✅ Health checks para todos os serviços
- 📝 Logs estruturados para fácil análise

## 🤝 Contribuindo

1. 🍴 Fork o repositório
2. 🔄 Crie uma branch para sua feature (`git checkout -b feature/nome-da-feature`)
3. ✅ Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. ⬆️ Push para a branch (`git push origin feature/nome-da-feature`)
5. 🔍 Abra um Pull Request

## 📝 Licença

Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.

## 📞 Contato

Para questões ou sugestões, entre em contato através do email: contato@clubedojava.com.br

---

<p align="center">
  Feito com ☕ e 💙 pelo clube do Java para a comunidade Java!
</p>