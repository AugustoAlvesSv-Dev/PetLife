# 🐾 PetLife

> Website completo para um pet shop, desenvolvido com **HTML5, CSS3 e JavaScript**, com múltiplas páginas, formulários interativos, validações, calendário de agendamento, simulador de hospedagem e diversas interações visuais.

## 📌 Sobre o projeto

O **PetLife** é um projeto acadêmico desenvolvido com o objetivo de colocar em prática conceitos de **desenvolvimento Front-end**, criando um website funcional para um pet shop.

A aplicação possui diferentes páginas para apresentar os serviços oferecidos, incluindo **Banho e Tosa, Hotel Pet e Adoção**, além de uma página inicial com informações, tabela de preços e formulário de agendamento.

O projeto vai além de uma página estática, utilizando **JavaScript para manipulação do DOM, validação de formulários, máscaras de entrada, calendário interativo, cálculos, animações e diferentes interações com o usuário**.

## 🎯 Objetivos

* Desenvolver uma aplicação web utilizando HTML, CSS e JavaScript;
* Praticar a criação de páginas estruturadas e semânticas;
* Criar uma navegação entre múltiplas páginas;
* Desenvolver formulários interativos;
* Implementar validação de dados utilizando JavaScript;
* Trabalhar com manipulação e eventos do DOM;
* Criar componentes interativos sem utilização de frameworks;
* Praticar conceitos de acessibilidade e experiência do usuário;
* Desenvolver um projeto para utilização no portfólio profissional.

## 💻 Tecnologias utilizadas

### HTML5

Utilizado para estruturar todas as páginas, incluindo:

* Cabeçalho e navegação;
* Seções de conteúdo;
* Cards de serviços;
* Tabelas;
* Formulários;
* Imagens;
* Links e navegação interna;
* Elementos semânticos e atributos de acessibilidade.

### CSS3

Utilizado para criar a identidade visual e o layout do projeto, incluindo:

* Flexbox;
* Responsividade;
* Cards;
* Tabelas;
* Formulários;
* Animações;
* Transições;
* Efeitos de hover;
* Layout adaptado para dispositivos menores;
* Componentes visuais interativos.

### JavaScript

Utilizado para adicionar comportamento e interatividade ao website, incluindo:

* Manipulação do DOM;
* Eventos;
* Validação de formulários;
* Máscaras de entrada;
* Calendário personalizado;
* Simulador de hospedagem;
* Atualização dinâmica de valores;
* Interações com tabelas;
* Lightbox de imagens;
* Animações e efeitos visuais.

## ✨ Funcionalidades

### 🏠 Página inicial

* Apresentação do PetLife;
* Navegação entre as páginas;
* Cards de serviços;
* Tabela de preços;
* Formulário de agendamento;
* Seleção do serviço desejado;
* Seleção de data;
* Navegação interna pela página.

### 🛁 Banho e Tosa

Apresentação dos serviços de:

* Banho;
* Tosa;
* Corte de unhas;
* Higienização.

Também possui navegação integrada para o formulário de agendamento.

### 🏨 Hotel Pet

Apresentação dos serviços de hospedagem:

* Hospedagem confortável;
* Alimentação;
* Recreação;
* Monitoramento;
* Diferenciais do hotel;
* Tabela de preços por porte;
* Valores diferenciados para alta temporada.

Além disso, o projeto possui um **simulador de hospedagem**, permitindo selecionar o porte do pet, quantidade de diárias e alta temporada para calcular o valor estimado.

### 🐾 Adoção

Página dedicada à adoção responsável, contendo:

* Pets disponíveis para adoção;
* Informações individuais dos animais;
* Imagens dos pets;
* Interação para ampliar as imagens;
* Formulário de interesse em adoção;
* Seleção automática do pet escolhido.

Os pets apresentados são **Mel, Thor e Luna**.

### 📝 Formulários

Os formulários possuem validações desenvolvidas em JavaScript, incluindo:

* Nome;
* E-mail;
* Telefone;
* Serviço;
* Pet para adoção;
* Data;
* Mensagem.

O projeto também apresenta mensagens de erro e sucesso de acordo com o preenchimento dos campos.

### 📱 Máscaras de entrada

Foram implementadas máscaras utilizando JavaScript para facilitar o preenchimento de:

* Telefone;
* Data.

A validação também verifica formatos inválidos e datas inexistentes.

### 📅 Calendário interativo

O campo de data possui um calendário personalizado desenvolvido em JavaScript.

Entre os recursos estão:

* Seleção visual de datas;
* Navegação entre meses;
* Limite de até 12 meses de antecedência;
* Seleção da data atual;
* Navegação utilizando teclado;
* Teclas de direção;
* Teclas `PageUp` e `PageDown`;
* Tecla `Enter` para selecionar;
* Tecla `Escape` para fechar;
* Integração com a validação do formulário.

### 🎨 Interações e animações

O projeto possui diversos efeitos para tornar a experiência mais dinâmica:

* Cabeçalho fixo;
* Cabeçalho que reduz ao rolar a página;
* Animação de títulos;
* Conteúdo aparecendo conforme o usuário rola a página;
* Efeitos nos cards;
* Interação dos cards com o movimento do mouse;
* Destaque de colunas das tabelas;
* Animações em botões e links;
* Imagens com efeito de ampliação;
* Lightbox para imagens;
* Botão "voltar ao topo";
* Animação de calendário;
* Efeitos visuais após o envio dos formulários;
* Animações com elementos relacionados ao tema do PetLife.

### ♿ Acessibilidade

Foram aplicados alguns recursos para melhorar a acessibilidade da aplicação, como:

* `aria-label`;
* `aria-current`;
* `aria-invalid`;
* `aria-describedby`;
* `aria-live`;
* Navegação por teclado no calendário;
* Indicação de estados dos componentes;
* Suporte à preferência do usuário por redução de movimento.

## 📂 Estrutura do projeto

```text
PetLife/
│
├── index.html
├── banho-tosa.html
├── hotel.html
├── adocao.html
│
├── style.css
│
├── script.js
├── calendario.js
├── efeitos.js
│
└── imagens/
    ├── cao-gato.png
    ├── banho.png
    ├── banho2.png
    ├── hotel.png
    ├── adocao.png
    ├── cachorro_gato_hotel.png
    ├── Imagem_adocao1.png
    ├── mel.png
    ├── thor.png
    ├── luna.png
    └── ...
```

> Os arquivos HTML, CSS e JavaScript principais ficam na raiz do projeto. As imagens utilizadas pelo website também fazem parte do projeto.

## 🧠 Principais conceitos praticados

Durante o desenvolvimento do PetLife, foram colocados em prática conceitos importantes de desenvolvimento web:

* HTML semântico;
* CSS e responsividade;
* Flexbox;
* JavaScript puro (Vanilla JavaScript);
* Manipulação do DOM;
* Event Listeners;
* Funções e estruturas de controle;
* Validação de dados;
* Expressões regulares;
* Máscaras de campos;
* Manipulação de datas;
* `Intl.DateTimeFormat`;
* `IntersectionObserver`;
* `requestAnimationFrame`;
* Custom Events;
* Manipulação dinâmica de elementos;
* Acessibilidade;
* Experiência do usuário (UX).

## 🚀 Como executar o projeto

O projeto não utiliza frameworks ou dependências externas obrigatórias.

### 1. Clone o repositório

```bash
git clone https://github.com/SEU-USUARIO/PetLife.git
```

### 2. Acesse a pasta

```bash
cd PetLife
```

### 3. Execute o projeto

Abra o arquivo:

```text
index.html
```

Você também pode utilizar o **Live Server** no Visual Studio Code para executar o projeto localmente.

## 🌐 Compatibilidade

O PetLife foi desenvolvido utilizando tecnologias nativas da web e pode ser executado diretamente em navegadores modernos.

O CSS também possui regras específicas para telas menores, permitindo adaptação do conteúdo para dispositivos móveis.

## 🔮 Possíveis melhorias futuras

Como evolução do projeto, algumas funcionalidades poderiam ser adicionadas:

* Backend para processamento real dos formulários;
* Banco de dados para armazenamento de clientes e pets;
* Sistema real de agendamento;
* Login e cadastro de usuários;
* Área administrativa para gerenciamento dos pets;
* Integração com APIs;
* Sistema de disponibilidade de hospedagem;
* Envio real de solicitações;
* Publicação em um domínio próprio.

## 🎓 Contexto acadêmico

O PetLife foi desenvolvido como projeto acadêmico com o objetivo de aplicar conhecimentos de desenvolvimento web na construção de uma aplicação prática.

Além de atender aos requisitos do trabalho, o projeto foi desenvolvido pensando também na sua utilização como **projeto de portfólio**, buscando demonstrar conhecimentos de HTML, CSS, JavaScript, lógica de programação, manipulação do DOM, validação de dados e desenvolvimento de interfaces interativas.

## 👨‍💻 Autor

**Augusto Alves Silva**

Estudante de **Ciência da Computação**, interessado em desenvolvimento de software, Python, APIs e Inteligência Artificial.

### 🔗 Contato

* 💻 GitHub: [AugustoAlvesSv-Dev](https://github.com/AugustoAlvesSv-Dev)
* 💼 LinkedIn: [Augusto Alves Silva](https://www.linkedin.com/in/augusto-alves-silva-a269532aa/)

---

⭐ **Gostou do projeto? Considere deixar uma estrela no repositório!**
