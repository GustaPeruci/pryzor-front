
# 🎯 Pryzor Frontend

> **TCC - Engenharia de Software**  
> Interface React para previsão de descontos na Steam

## 💡 O que é?

Frontend do Pryzor: interface moderna em React + TypeScript que consome a API do backend para mostrar previsões de desconto em jogos da Steam usando Machine Learning.

---

## 🚀 Como Rodar

### Requisitos

- **Node.js 16+**
- **npm** ou **yarn**
- Backend rodando em http://localhost:8000

### Passos

```bash
# 1. Entre na pasta do frontend
cd pryzor-front

# 2. Instale as dependências
npm install

# 3. Rode o servidor de desenvolvimento
npm start
```

O app abrirá em http://localhost:3000. Se a API estiver rodando, já é possível buscar jogos e ver previsões.

---

## 📁 Estrutura do Projeto

```
src/
   components/
      Header.tsx
      analysis/
         PriceAnalysisResult.tsx
      games/
         GameCard.tsx
         GameList.tsx
         GameSearch.tsx
      ml/
         ModelMetrics.tsx
      ui/
         Badge.tsx
         Button.tsx
         Card.tsx
         Input.tsx
         LoadingSpinner.tsx
   services/
      api.ts
   App.tsx
   index.tsx
```

---

## 🛠️ Tecnologias

- **React 19**
- **TypeScript**
- **Tailwind CSS v4.1**
- **Axios**
- **Vite**

---

## 📡 Integração com a API

O arquivo `src/services/api.ts` centraliza a comunicação com o backend.

### Endpoints Usados

```typescript
GET /api/games?search={query}&limit={n}
GET /api/ml/info
GET /api/ml/predict/{appid}
```

### Exemplo de resposta de previsão

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

---


## 🧪 Testes Automatizados

- Cobertura completa dos principais componentes e fluxos de usuário
- Testes para busca, análise, exibição de métricas, callbacks e estados de interface
- Componentes testados:
   - `GameCard`, `GameList`, `GameSearch`, `ModelMetrics`, `PriceAnalysisResult`, `Header`, `App`
- Testes incluem:
   - Renderização, interações, callbacks, estados de loading/erro, múltiplos elementos, integração com mocks
- Configuração robusta para TypeScript, ESM e React 19
- Todos os testes passam e cobrem os fluxos essenciais para apresentação de portfólio/TCC

### Como rodar os testes

```bash
npm test
```

Os testes utilizam Jest + React Testing Library. Para detalhes, veja os arquivos em `src/components/*/*.test.tsx`.

---

---


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
