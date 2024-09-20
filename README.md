# Backend de Aplicação - Portal de Dados

Esta parte da aplicação implementa o backend, nela estão definidas todas as rotas e endpoints das várias APIs utilizadas no portal de dados. É aqui, também, que estão as conexões aos bancos e as regras de negócios relacionadas a aplicação.

## Estrutura do Projeto
### :file_folder: /
Contém configurações gerais dos _frameworks_ utilizados na aplicação, configurações de ferramentas utilizadas para desenvolvimento e variáveis de ambiente no arquivo `.env`

#### Arquivos importantes
- :memo: `.env`  
Esse arquivo contém as variáveis de ambiente do projeto, dados de conexão de banco de dados e dados 

- :rocket: `package.json`  
Esse arquivo contém os _scripts_ necessários para o desenvolvimento e manutenção da aplicação:
   - **dev**: Executa o backend no modo de desenvolvimento. O backend fica disponível 
   - **build**: Compila (transpila) a aplicação, transformando o código typescript em javascript. Não precisa ser executado diretamente.
   - **instalar**: _script_ criado para facilitar o _deploy_ da aplicação no servidor. Ao executar esse _script_, um _push_ é realizado no repositório GIT de forma a obter a versão mais recente da aplicação e os _scripts_ de `build` e `copy-files` são executados.
   - **copy-files**: Copia arquivos que não são gerados pela compilação para a pasta `dist`.
   - **test**: Executa os testes de aplicação. Não é utilizado na versão atual.
   - **prisma-studio**: Executa a interface gráfica que permite editar o banco de dados `dev.db`, a url de acesso é exibida ao executar o _script_.

### :file_folder: dist/
Após *build* é aqui que os arquivos compilados serão armazenados.


### :file_folder: prisma/
Contém o **banco de dados** da aplicação, esse banco de dados contém os links dos painéis de dados, bem como os títulos e a imagem escolhida. Todos os dados estão armazenados no arquivo `dev.db` que é um banco de dados *SQlite*. 

