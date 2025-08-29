#!/bin/bash

# Script para iniciar o ExoGame
echo "🚀 Iniciando ExoGame..."

# Função para verificar se uma porta está em uso
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Porta $1 já está em uso!"
        return 1
    else
        return 0
    fi
}

# Verificar se as portas estão disponíveis
echo "🔍 Verificando portas..."
if ! check_port 3001; then
    echo "❌ Backend (porta 3001) já está rodando ou porta ocupada"
    exit 1
fi

if ! check_port 3000; then
    echo "❌ Frontend (porta 3000) já está rodando ou porta ocupada"
    exit 1
fi

echo "✅ Portas disponíveis"

# Instalar dependências se necessário
echo "📦 Verificando dependências..."

if [ ! -d "backend/node_modules" ]; then
    echo "📦 Instalando dependências do backend..."
    cd backend && npm install && cd ..
fi

if [ ! -d "frontend/node_modules" ]; then
    echo "📦 Instalando dependências do frontend..."
    cd frontend && npm install && cd ..
fi

echo "✅ Dependências verificadas"

# Iniciar backend em background
echo "🔧 Iniciando backend (porta 3001)..."
cd backend
npm run start:dev &
BACKEND_PID=$!
cd ..

# Aguardar o backend inicializar
echo "⏳ Aguardando backend inicializar..."
sleep 5

# Verificar se o backend está rodando
if kill -0 $BACKEND_PID 2>/dev/null; then
    echo "✅ Backend iniciado com sucesso!"
else
    echo "❌ Falha ao iniciar backend"
    exit 1
fi

# Iniciar frontend
echo "🎨 Iniciando frontend (porta 3000)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Aguardar o frontend inicializar
echo "⏳ Aguardando frontend inicializar..."
sleep 3

echo ""
echo "🎉 ExoGame iniciado com sucesso!"
echo ""
echo "📱 Frontend: http://localhost:3000"
echo "🔧 Backend:  http://localhost:3001"
echo ""
echo "💡 Para parar os serviços, pressione Ctrl+C"
echo ""

# Função para cleanup quando o script for interrompido
cleanup() {
    echo ""
    echo "🛑 Parando serviços..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Serviços parados"
    exit 0
}

# Capturar Ctrl+C
trap cleanup INT

# Aguardar indefinidamente
wait
