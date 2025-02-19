# API de Gerenciamento de Livraria

Uma API RESTful para gerenciamento de livraria construída com Node.js, Express e Firebase.

## Funcionalidades

- Autenticação de Usuários (JWT)
- Gerenciamento de Livros
- Gerenciamento de Categorias
- Gerenciamento de Empréstimos
- Sistema de Resenhas
- Sistema de Favoritos
- Geração de Relatórios

## Pré-requisitos

- Node.js
- Conta Firebase
- Configuração do Projeto Firebase

## Instalação

1. Clone o repositório
2. Instale as dependências:
```bash
npm install
```
3. Configure o Firebase:
   
   - Crie um projeto no Firebase
   - Ative a Autenticação (Email/Senha)
   - Crie o Banco de Dados Firestore
   - Baixe as credenciais do Firebase e salve como firebase-credentials.json na raiz do projeto
4. Inicie o servidor:
```bash
npm start
 ```

## Configuração do Firebase

1. Acesse o [Firebase Console](https://console.firebase.google.com/)
2. Crie um novo projeto ou selecione um existente
3. No menu lateral, clique em "Project settings" (Configurações do projeto)
4. Na aba "Service accounts" (Contas de serviço):
   - Clique em "Generate new private key" (Gerar nova chave privada)
   - Salve o arquivo JSON gerado como `firebase-credentials.json` na raiz do projeto

5. Na aba "General" (Geral):
   - Role até "Your apps" (Seus aplicativos)
   - Clique no ícone da Web (</>) para criar um novo app
   - Registre o app com um nome
   - Copie o objeto `firebaseConfig`
   - Cole no arquivo `src/config/firebase.js`

6. No menu lateral, acesse "Authentication":
   - Clique em "Get Started" (Começar)
   - Ative o provedor "Email/Password" (Email/Senha)

7. No menu lateral, acesse "Firestore Database":
   - Clique em "Create Database" (Criar banco de dados)
   - Escolha "Start in production mode" (Iniciar no modo de produção)
   - Selecione a região mais próxima
   - Aguarde a criação do banco de dados

8. Configure as regras do Firestore:
```bash
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Endpoints da API
### Autenticação
- POST /api/auth/registro - Registrar novo usuário
- POST /api/auth/login - Login de usuário
- POST /api/auth/recuperar-senha - Recuperação de senha
### Livros
- GET /api/livros - Listar todos os livros
- GET /api/livros/:id - Buscar livro por ID
- POST /api/livros - Criar novo livro
- PUT /api/livros/:id - Atualizar livro
- DELETE /api/livros/:id - Deletar livro
### Categorias
- GET /api/categorias - Listar todas as categorias
- GET /api/categorias/:id - Buscar categoria por ID
- POST /api/categorias - Criar nova categoria
- PUT /api/categorias/:id - Atualizar categoria
- DELETE /api/categorias/:id - Deletar categoria
### Empréstimos
- GET /api/emprestimos/ativos - Listar empréstimos ativos
- GET /api/emprestimos/usuario/:usuarioId - Listar histórico de empréstimos do usuário
- POST /api/emprestimos - Registrar novo empréstimo
- PUT /api/emprestimos/:id/devolucao - Registrar devolução
### Resenhas
- GET /api/resenhas/livro/:livroId - Listar resenhas de um livro
- POST /api/resenhas - Adicionar nova resenha
- PUT /api/resenhas/:id - Atualizar resenha
- DELETE /api/resenhas/:id - Deletar resenha
### Favoritos
- GET /api/favoritos/usuario/:usuarioId - Listar favoritos do usuário
- POST /api/favoritos - Adicionar livro aos favoritos
- DELETE /api/favoritos/:usuarioId/:livroId - Remover livro dos favoritos
### Relatórios
- GET /api/relatorios/livros-mais-emprestados - Relatório de livros mais emprestados
- GET /api/relatorios/livros-mais-favoritados - Relatório de livros mais favoritados
- GET /api/relatorios/usuarios-mais-ativos - Relatório de usuários mais ativos
## Documentação
A documentação completa da API está disponível em /api-docs quando o servidor estiver rodando.

## Tecnologias Utilizadas
- Node.js
- Express
- Firebase (Authentication e Firestore)
- JWT para autenticação
- Swagger para documentação
## Estrutura do Projeto
```plaintext
src/
├── config/         # Configurações (Firebase, etc)
├── controllers/    # Controladores da API
├── middleware/     # Middlewares (autenticação, etc)
├── routes/         # Rotas da API
└── app.js         # Arquivo principal
 ```

## Contribuição
1. Faça o fork do projeto
2. Crie sua feature branch ( git checkout -b feature/nova-feature )
3. Commit suas mudanças ( git commit -m 'Adicionando nova feature' )
4. Push para a branch ( git push origin feature/nova-feature )
5. Crie um Pull Request
## Licença
Este projeto está licenciado sob a licença MIT - veja o arquivo LICENSE para detalhes.