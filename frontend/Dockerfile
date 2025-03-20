# Usa a imagem do Node.js
FROM node:20

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos do projeto
COPY package.json package-lock.json ./

# Instala as dependências
RUN npm install

# Copia o restante dos arquivos
COPY . .

# Compila o projeto
RUN npm run build

# Expõe a porta do React
EXPOSE 3000

# Comando para rodar o frontend
CMD ["npm", "run", "dev"]

# Modo de produção
# CMD ["npx", "serve", "-s", "build"]