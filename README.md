# 📖 CourseSearch Frontend

Este é o repositório do frontend do projeto **CourseSearch**, uma plataforma moderna para busca e visualização de cursos. A aplicação foi desenvolvida com React e Vite, garantindo uma experiência de desenvolvimento ágil e um desempenho otimizado para o usuário final.

O objetivo principal da interface é oferecer uma maneira intuitiva para os usuários encontrarem e receberem recomendação de cursos, com funcionalidades de paginação, busca por nome e uma apresentação visual limpa das informações.

## ✨ Funcionalidades

A interface permite que os usuários realizem as seguintes ações:

* **Busca em Tempo Real:** Filtre cursos dinamicamente digitando no campo de busca.
* **Visualização Clara:** Os cursos são apresentados em cards com informações essenciais como nome, capacidade e número de vagas.
* **Navegação Paginada:** Navegue facilmente por longas listas de cursos usando os controles de paginação.
* **Gerar Recomendações:** Utilize o Auxilio da IA para receber recomendações de Cursos.
* 
## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com um conjunto de tecnologias modernas para o desenvolvimento web:

* **Framework:** [React](https://reactjs.org/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Linguagem:** [TypeScript](https.typescriptlang.org/)
* **Gerenciador de Pacotes:** [NPM](https://www.npmjs.com/)

## 🚀 Como Executar o Projeto Localmente

Para rodar este projeto no seu ambiente de desenvolvimento, siga os passos abaixo.

### Pré-requisitos

* Você precisa ter o [Node.js](https://nodejs.org/) (versão 16 ou superior) e o [NPM](https://www.npmjs.com/) instalados na sua máquina.

### Instalação

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/YannTorres/CourseSearchFrontend.git](https://github.com/YannTorres/CourseSearchFrontend.git)
    ```

2.  **Acesse o diretório do projeto:**
    ```bash
    cd CourseSearchFrontend
    ```

3.  **Instale as dependências:**
    ```bash
    npm install
    ```

### Configuração do Ambiente

A aplicação precisa se conectar a uma API backend para buscar os dados dos cursos.

1.  Crie um arquivo chamado `.env` na raiz do projeto.
2.  Adicione a seguinte variável de ambiente, substituindo a URL pelo endereço do seu backend:
    ```env
    VITE_API_URL=http://localhost:5000/api
    ```

### Executando a Aplicação

1.  **Inicie o servidor de desenvolvimento:**
    ```bash
    npm run dev
    ```

2.  Abra seu navegador e acesse `http://localhost:5173/` (ou a porta que for indicada no seu terminal).


## ✒️ Autor

* **Yann Torres** - [GitHub](https://github.com/YannTorres)
