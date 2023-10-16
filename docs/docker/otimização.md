---
sidebar_position: 2
slug: otimization
---

# Otimização de Build

Para ambientes de desenvolvimento local muitas vezes configuramos o `Dockerfile` ou `docker-compose.yml` da forma mais rápida, pronta para o desenvolvimento. Mas quando esses projetos precisam rodar em um ambiente de produção, é imprescindível realizar otimizações. Sejam otimizações no **tamanho final da imagem**, de **desempenho**, **tempo de build** ou **segurança**.

### 1. Criação da imagem em duas etapas

O processo mais comum para gerar uma imagem através do `Dockerfile` é copiar os arquivos para a imagem, instalar as dependências, gerar uma build de produção e então rodar a aplicação. Mas podemos quebrar esse processo em duas partes, uma focada no processo de build e uma focada em rodar a aplicação.

Abaixo seguem alguns passos para realizar este processo:

1. Utilize a imagem de base - é sempre recomendado utilizar a imagem [alpine](https://hub.docker.com/_/alpine) ou [scratch](https://hub.docker.com/_/scratch). Importante adicionar o `AS builder` no final, para dar umma espécie de nome à primeira imagem que vamos criar:
```shell
FROM alpine:3.18.4@sha256:48d9183eb12a05c99bcc0bf44a003607b8e941e1d4f41f9ad12bdcc4b5672f86 AS builder
```

2. Copie os arquivos necessários para realizar a build e instalação de dependências:
```shell
WORKDIR /var/www

# Exemplo para um projeto Node JS
COPY package*.json ./
COPY tsconfig*.json ./

# Pasta com o código
COPY ./src/ ./src/

```

3. Instale as ferramentas necessárias (no exemplo vamos instalar o NodeJS):
```shell
RUN apk add --update nodejs npm
```

4. Instale as dependências de produção e de desenvolvimento e gere a build:
```shell
RUN npm install

# Seu comando de build abaixo
RUN npm run build
```

5. No mesmo arquivo, utilize uma nova imagem. Repare que nesta parte não adicionamos o `AS <nome>`:
```shell
FROM alpine:3.18.4@sha256:48d9183eb12a05c99bcc0bf44a003607b8e941e1d4f41f9ad12bdcc4b5672f86
WORKDIR /var/www
```

6. Instale novamente as ferramentas necessárias - mas desta vez apenas as ferramentas realmente necessárias para rodar o projeto. isso significa que, por exemplo, se você precisa do python para gerar a build, mas não precisa de python para rodar o projeto, você não precisa instalar o python nessa etapa:
```shell
RUN apk add --update nodejs npm
```

7. Copie os arquivos necessários para a instalação de dependências e instale as dependências de produção (apenas as de produção):
```shell
COPY package*.json ./

# Caso esteja usando NodeJS, configure a variável NODE_ENV=production para um melhor desempenho
ENV NODE_ENV=production

# Na instalação de dependências de produção vamos utilizar o npm ci ao invés do npm install.
# Fazemos isso pois o npm ci vai instalar apenas as dependências de produção e com base no arquivo package-lock.json
# Baseando-se no arquivo package-lock.json, o npm consegue otimizar o processo de instalação, reduzindo o espaço utilizado
RUN npm ci
```

8. Copie a build gerado no passo 4 para a nova imagem:
```shell
COPY --from=builder /var/www/dist/ .
```

9. Adicione um usuário sem acesso root ([para mais informações, clique aqui](./security/)):
```shell
RUN addgroup -S nonroot && adduser -S nonroot -G nonroot
USER nonroot
```

10. Exponha a porta do projeto e execute o entrypoint:
```shell
ENTRYPOINT [ "node", "index.js" ]
EXPOSE 3012
```

:::info
Lembre-se de verificar o nome dos arquivos, pastas, comandos para rodar e buildar o projeto, etc. Isso varia de projeto para projeto.
:::

### 2. Utilize imagens mínimas como base

Imagens Docker como as do PHP já vem prontas, com PHP e suas dependências instaladas em uma imagem alpine. O problema disso é que, as vulnerabilidades de uma imagem alpine (linux) desatualizada vão estar presentes no ambiente PHP. Para contornar isso, utilizamos imagens Linux mínimas (como [alpine](https://hub.docker.com/_/alpine) ou [scratch](https://hub.docker.com/_/scratch)) como base e instalamos as dependências nesta imagem.

Para utilizar PHP com Laravel, por exemplo, podemos utilizar o seguinte `Dockerfile`:

```shell
FROM alpine:3.18.4@sha256:eece025e432126ce23f223450a0326fbebde39cdf496a85d8c016293fc851978

WORKDIR /var/www/html

RUN echo "http://dl-cdn.alpinelinux.org/alpine/v3.12/community" >> /etc/apk/repositories
RUN apk add --update --no-cache php7 php7-fpm libzip-dev zip unzip git php7-pdo_mysql php7-zip curl php7-json php7-phar php7-iconv php7-dom php7-fileinfo php7-tokenizer php7-session php7-mbstring php7-pdo_sqlite php7-sqlite3

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

```

:::info
Sempre que possível, tente utilizar a imagem [scratch](https://hub.docker.com/_/scratch), instalando apenas o que é realmente necessário.
A Scratch é a imagem base de todas as outras imagens, o kernel mais básico para imagens Docker.
:::


### 3. Configure seu projeto para fazer cache e utilizar configurações de produção

No caso do NodeJS, podemos fazer isso especificando a variável de ambiente `NODE_ENV=production`. No caso do Laravel, podemos usar comandos como `php artisan config:cache`, `php artisan event:generate`, `php artisan route:cache` e `php artisan view:cache`.

Outros frameworks e linguagens vão ter suas próprias formas de informar que o ambiente é de produção e de gerar cache do que for necessário.


---

## Considerações

Sempre que possível utilize a prática de [criação da imagem em duas etapas](#1-criação-da-imagem-em-duas-etapas), utilizando a primeira step para realizar uma build e a segunda step para rodar o projeto, com apenas o que é extremamente necessário para rodar.

Da mesma forma, sempre que possível deve-se utilizar uma imagem mínima como o alpine e instalar as dependências nela. Por menor que pareça, essa mudança costuma salvar cerca de 40% do tamanho da imagem.

A geração de caches e configuração de ambiente de produção ajudam na performance da aplicação como um todo.