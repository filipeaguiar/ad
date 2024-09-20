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

- :page_facing_up: `README.md`  
Este arquivo.

### :file_folder: dist/
Após *build* é aqui que os arquivos compilados serão armazenados. Esta pasta é sobrescrita sempre que a aplicação é compilada.


### :file_folder: prisma/
Contém o **banco de dados** da aplicação, esse banco de dados contém os links dos painéis de dados, bem como os títulos e a imagem escolhida. Todos os dados estão armazenados no arquivo `dev.db` que é um banco de dados *SQlite*. 

### :file_folder: src/
O Código fonte da aplicação. O arquivo `server.ts` é o ponto de entrada da aplicação e é responsável por executar o servidor HTTP que responde às requisições.

Cada uma das sub-pastas serve a um propósito na aplicação, conforme descrito a seguir:

  - :file_folder: config/  
  Pasta que contém arquivos de configuração utilizados na aplicação. Estes arquivos são importados nos módulos correspondentes.

  - :file_folder: controllers/  
  Pasta que contém a lógica da aplicação e implementa as regras de negócio. Cada arquivo nessa pasta é responsável por uma regra de negócio específica ou por um conjunto de regras de negócio relacionadas a um determinado domínio.

  - :file_folder: helpers/
  Pasta que contém módulos específicos utilizados para facilitar o desenvolvimento. Esses módulos são importados somentes nos arquivos que os utilizam e oferecem funções específicas, tais como processar arquivos `.csv`, lidar com _strings_, etc.

  - :file_folder: middlewares/  
  Pasta que contém os _middlewares_ da aplicação, esses _middlewares_ podem ser utilizados em rotas para alterar o comportamento das requisições HTTP, adicionando verificações de autorização, manipulando arquivos, etc.

  - :file_folder: providers/  
Pasta que contém as fontes de dados da aplicação. Cada arquivo nessa pasta representa uma fonte de dados específica. Nessa parte estão os arquivos que implementam as consultas diretas aos diversos bancos de dados da aplicação. Diferente dos _controllers_, essa implementação não faz nenhum tipo de tratamento de dados e nem aplicação de regras de negócios, tendo como responsabilidade retornar os dados brutos.
  
  - :file_folder: resources/  
  Pasta que contém a lógica de comunicação com as fontes de dados. Implementam os métodos que são usados nos providers para consultar as bases de dados.

  - :file_folder: routes/  
  Pasta que contém as rotas da aplicação. Cada rota implementa todos os endpoints de um determinado domínio de negócio. As rotas são importadas no arquivo `server.ts`.

  - :file_folder: types/  
  Pasta que contém os types da aplicação. Esses dados são usados somente para auxiliar o desenvolvimento da aplicação, oferecendo funcionalidades de _autocomplete_ para o editor de código.