#  Pryzor Frontend

Aqui é a cara do Pryzor  a interface que os usuários veem e interagem. É um frontend React que conversa com a API do backend pra mostrar previsões de desconto com Machine Learning.

##  Como Rodar

Você vai precisar de:
- **Node.js 16+** (ou superior)
- **npm** ou **yarn**
- Backend rodando em http://localhost:8000

### Instalação Rápida

```bash
# Entra no diretório do frontend
cd pryzor-front

# Instala as dependências
npm install

# Sobe o servidor de desenvolvimento
npm start
```

Pronto! O app vai abrir automaticamente no navegador em http://localhost:3000. Se a API do backend estiver rodando, tá tudo certo pra começar a buscar jogos e ver as previsões.

##  Estrutura do Projeto

```
src/
 components/          # Componentes React organizados por funcionalidade
    Header.tsx       # Cabeçalho com logo e título
    analysis/        # Resultado da análise de previsão (modal)
       PriceAnalysisResult.tsx
    games/           # Busca e listagem de jogos
       GameCard.tsx
       GameList.tsx
       GameSearch.tsx
    ml/              # Métricas do modelo ML
       ModelMetrics.tsx
    ui/              # Componentes reutilizáveis (botões, cards, inputs)
        Badge.tsx
        Button.tsx
        Card.tsx
        Input.tsx
        LoadingSpinner.tsx

 services/            # Camada de comunicação com a API
    api.ts           # Axios client + endpoints do backend

 App.tsx              # Componente principal (orquestrador)
 index.tsx            # Ponto de entrada da aplicação
```

##  Tech Stack

- **React 19**  Framework JavaScript pra construir interfaces
- **TypeScript**  JavaScript com tipagem estática (menos bugs, mais produtividade)
- **Tailwind CSS v4.1**  Utility-first CSS (escreve classes direto no HTML)
- **Axios**  HTTP client pra fazer chamadas na API do backend
- **Vite**  Build tool super rápido (substitui o Create React App)

##  Como se Conecta com a API

O arquivo `src/services/api.ts` é o ponto central de comunicação. Ele define:

### Endpoints Usados

```typescript
// Buscar jogos
GET /api/games?search={query}&limit={n}

// Informações do modelo ML
GET /api/ml/info

// Fazer previsão pra um jogo específico
GET /api/ml/predict/{appid}
```

### Resposta da Previsão

Quando você clica em **"Analisar"** num jogo, o frontend chama `mlApi.predictGame(appid)` e recebe algo assim:

```json
{
  "appid": 570,
  "prediction": 1,
  "probability": 0.87,
  "recommendation": "WAIT",
  "confidence": "high",
  "features": {
    "current_discount_percent": 0,
    "month": 10,
    "quarter": 4
  }
}
```

### Como Interpretar

- **`prediction`**: 0 = não vai ter desconto, 1 = vai ter desconto >20% nos próximos 30 dias
- **`recommendation`**: "BUY" (compra agora) ou "WAIT" (espera uma promo)
- **`confidence`**: "high", "medium", "low" (quão certo o modelo tá)
- **`probability`**: número de 0 a 1 (quanto maior, mais certeza de desconto)

##  Componentes Principais

### 1. **GameSearch** (`components/games/GameSearch.tsx`)
Barra de busca pra procurar jogos. Quando você digita e aperta Enter, chama a API de busca.

### 2. **GameList** (`components/games/GameList.tsx`)
Lista os resultados da busca. Cada jogo aparece num **GameCard** com nome, imagem, preço e botão "Analisar".

### 3. **ModelMetrics** (`components/ml/ModelMetrics.tsx`)
Mostra as métricas do modelo v2.0:
- **F1-Score**: 74.34%
- **Precision**: 90.46%
- **Recall**: 63.09%
- **Accuracy**: 75.18%

### 4. **PriceAnalysisResult** (`components/analysis/PriceAnalysisResult.tsx`)
Modal que abre quando você analisa um jogo. Mostra a recomendação (comprar agora ou esperar), a probabilidade de desconto e um gráfico bonitinho.

##  Fluxo do Usuário

1. **Busca um jogo**  Digite "Dota 2" na barra de busca
2. **Vê os resultados**  Lista aparece com jogos que combinam
3. **Clica em "Analisar"**  Backend processa com ML
4. **Vê a recomendação**  Modal mostra se vale a pena comprar agora ou esperar

Simples assim. 

##  Desenvolvimento

### Scripts Disponíveis

```bash
# Roda o app em modo desenvolvimento
npm start

# Faz o build pra produção
npm run build

# Roda os testes
npm test

# Checa erros de lint
npm run lint
```

### Configuração do Backend

O frontend espera que o backend esteja rodando em `http://localhost:8000`. Se você mudar a porta, edite o `baseURL` em `src/services/api.ts`:

```typescript
const api = axios.create({
  baseURL: 'http://localhost:8000',  // <-- Muda aqui se precisar
  headers: { 'Content-Type': 'application/json' }
});
```

##  Problemas Comuns

**Erro: "Network Error"**  
 Certifique-se de que o backend está rodando em `http://localhost:8000`.

**Erro: "Cannot read property 'games' of undefined"**  
 A API retornou um erro. Confira os logs do backend.

**Jogos não aparecem na busca**  
 Pode ser que não existam jogos com esse nome no banco de dados. Tenta buscar jogos populares tipo "Counter-Strike", "Dota 2", "Portal".

##  To-Do (Melhorias Futuras)

- [ ] Adicionar gráficos históricos de preço (usando Chart.js ou Recharts)
- [ ] Favoritar jogos (salvar no localStorage)
- [ ] Dark mode 
- [ ] Responsividade mobile melhorada

---

**Feito com  para o TCC de Engenharia de Software**  
Se curtiu, deixa uma  no repo!
