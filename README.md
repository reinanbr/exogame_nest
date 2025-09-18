# ExoGame - Quiz em Tempo Real

Um jogo de perguntas e respostas em tempo real estilo Kahoot, desenvolvido com NestJS, Next.js e Socket.IO.

## 🚀 Funcionalidades

- **Criação de Jogos**: Host pode criar um jogo e obter um código único
- **Entrada de Jogadores**: Jogadores podem entrar usando o código do jogo
- **Perguntas Embaralhadas**: Perguntas e opções são embaralhadas aleatoriamente
- **Header do Jogador**: Nome do jogador, pontuação e código do jogo sempre visíveis
- **Perguntas em Tempo Real**: Sistema de perguntas com timer visual
- **Confirmação de Resposta**: Botão de confirmação para evitar envios acidentais
- **Estatísticas de Resposta**: Mostra quantos jogadores já responderam em tempo real
- **Sistema de Pontuação**: Pontos baseados em acertos e velocidade de resposta
- **Leaderboard**: Ranking em tempo real dos jogadores
- **Impressão de Resultados**: Botão para imprimir o resultado final formatado
- **Interface Responsiva**: Funciona em desktop e mobile

## 🛠️ Tecnologias Utilizadas

### Backend
- **NestJS** - Framework Node.js para APIs
- **Socket.IO** - Comunicação em tempo real
- **TypeScript** - Tipagem estática
- **Class Validator** - Validação de dados

### Frontend
- **Next.js 15** - Framework React
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Framework CSS utilitário
- **Socket.IO Client** - Cliente WebSocket

## 📦 Estrutura do Projeto

```
exogame/
├── backend/          # API NestJS + WebSocket
│   ├── src/
│   │   ├── game/     # Módulo do jogo
│   │   ├── player/   # Módulo de jogadores
│   │   ├── question/ # Módulo de perguntas
│   │   └── interfaces/
│   └── package.json
├── frontend/         # Interface Next.js
│   ├── src/
│   │   ├── app/      # App Router do Next.js
│   │   ├── components/
│   │   ├── contexts/
│   │   └── types/
│   └── package.json
└── README.md
```

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ instalado
- npm ou yarn

### 1. Executar o Backend

```bash
cd backend
npm install
npm run start:dev
```

O backend estará rodando na porta **3001**.

### 2. Executar o Frontend

```bash
cd frontend
npm install
npm run dev
```

O frontend estará rodando na porta **3000**.

### 3. Acessar o Jogo

Abra seu navegador e acesse: `http://localhost:3000`

## 🎮 Como Jogar

### Para o Host (Criador do Jogo):
1. Clique em "Criar Jogo"
2. Digite seu nome
3. Compartilhe o código do jogo com outros jogadores
4. Aguarde os jogadores entrarem
5. Clique em "Iniciar Jogo" quando estiver pronto
6. Controle o fluxo do jogo (mostrar resultados, próxima pergunta)

### Para os Jogadores:
1. Clique em "Entrar em Jogo"
2. Digite o código do jogo
3. Digite seu nome
4. Aguarde o host iniciar o jogo
5. Responda as perguntas o mais rápido possível
6. Veja sua pontuação no leaderboard

## 📊 Sistema de Pontuação

- **Resposta Correta**: 1000 pontos base
- **Bônus de Velocidade**: Até 10 pontos por segundo restante
- **Resposta Incorreta**: 0 pontos

## 🔧 Configurações

### Backend (Porta 3001)
As configurações do backend estão em `backend/src/main.ts`:
- CORS configurado para aceitar conexões do frontend
- WebSocket configurado na mesma porta

### Frontend (Porta 3000)
As configurações do frontend estão em `frontend/src/contexts/GameContext.tsx`:
- URL do backend: `http://localhost:3001`

## 📝 Perguntas Padrão

O jogo vem com 5 perguntas pré-definidas sobre conhecimentos gerais. Para adicionar mais perguntas, edite o arquivo `backend/src/question/question.service.ts`.

## 🎨 Personalização

### Cores e Tema
O design usa Tailwind CSS. Para personalizar cores, edite os componentes em `frontend/src/components/`.

### Tempo das Perguntas
Para alterar o tempo padrão das perguntas, edite as perguntas em `backend/src/question/question.service.ts`.

## 🚀 Deploy

### Backend
O backend pode ser deployado em qualquer serviço que suporte Node.js (Heroku, Vercel, DigitalOcean, etc.).

### Frontend
O frontend pode ser deployado no Vercel, Netlify ou qualquer serviço que suporte Next.js.

**⚠️ Importante**: Lembre-se de atualizar a URL do backend no frontend para a URL de produção.

## 🐛 Solução de Problemas

### "Não consegue conectar ao servidor"
- Verifique se o backend está rodando na porta 3001
- Verifique se não há firewall bloqueando a conexão

### "Jogadores não conseguem entrar no jogo"
- Verifique se o código do jogo está correto (6 caracteres)
- Verifique se o jogo não foi iniciado ainda

### "Respostas não são enviadas"
- Verifique a conexão WebSocket
- Verifique se o tempo da pergunta não esgotou

## 🤝 Contribuição

Sinta-se livre para contribuir com melhorias:
1. Fork o projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo LICENSE para mais detalhes.

## 🎉 Diversão Garantida!

Agora você tem seu próprio Kahoot! Convide amigos, família ou colegas de trabalho para testar seus conhecimentos em tempo real. 🧠⚡
