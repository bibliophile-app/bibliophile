# bibliophile

Projeto MAC0350 -  Introdução ao Desenvolvimento de Sistemas de Software (2025).

## Stack do Projeto

O projeto utiliza das seguintes tecnologias:

* API de Livros: Integração com a Open Library API para obter informações detalhadas sobre livros.
* Backend: Desenvolvido em Kotlin, utilizando o framework Ktor para criar uma RestAPI.
* Frontend: Construído com React JSX, garantindo uma interface dinâmica e responsiva.
* Bibliotecas Utilizadas:
  * Material-UI (MUI) para componentes visuais modernos e acessíveis.

## Como Rodar o Projeto  

Siga as instruções abaixo para o backend e o frontend estarem em execução e prontos para uso.

### Backend

1. Acesse a pasta do backend: `cd backend`
2. Caso seja a primeira vez rodando o projeto ou tenha alterações nas dependências, execute o build: `./gradlew build`
3. Inicie o servidor: `./gradlew run`

### Frontend

1. Acesse a pasta do frontend: `cd frontend`
2. Instale as dependências (necessário apenas na primeira vez ou quando houver mudanças no package.json): `npm install`
3. Inicie o ambiente de desenvolvimento: `npm run dev`
