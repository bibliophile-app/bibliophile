# bibliophile

Projeto MAC0350 - Introdução ao Desenvolvimento de Sistemas de Software (2025).

## Stack do Projeto

O projeto utiliza as seguintes tecnologias:

- **API de Livros**: Integração com a Open Library API para obter informações detalhadas sobre livros.
- **Backend**: Desenvolvido em Kotlin, utilizando o framework Ktor para criar uma RestAPI.
- **Banco de Dados**: Utiliza MySQL ou MariaDB para persistência de dados.
- **Frontend**: Construído com React JSX, garantindo uma interface dinâmica e responsiva.
- **Containerização**: Utiliza Docker e Docker Compose para facilitar a execução e o gerenciamento do ambiente.

### Bibliotecas Utilizadas:
- **Material-UI (MUI)** para componentes visuais modernos e acessíveis.

## Como Rodar o Projeto

O projeto está containerizado, sendo possível iniciá-lo facilmente com Docker Compose.

### Configuração do Ambiente

Antes de iniciar o projeto, copie o arquivo .env.example e configure suas variáveis de ambiente:
Edite o arquivo .env e preencha os valores necessários, como credenciais do banco de dados.

### Utilizando Docker

1. Certifique-se de que o Docker e o Docker Compose estão instalados em sua máquina.
2. No diretório raiz do projeto, execute: `docker-compose up --build`
3. O backend e o frontend estarão acessíveis nos endpoints configurados no `docker-compose.yml`.
