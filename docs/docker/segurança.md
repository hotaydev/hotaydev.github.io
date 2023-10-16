---
sidebar_position: 3
slug: security
---

# Recomendações de segurança

É de suma importância que imagens Docker - especialmente as de um ambiente de Produção - estejam com o menor número possível de vulnerabilidades e estejam seguindo boas práticas de segurança. A seguir serão listados alguns pontos para observar quando você estiver criando um `Dockerfile` e `docker-compose.yml`.


### 1. Mantenha o Docker atualizado

Sempre utilize a última versão do Docker, ela quase sempre vai conter correções de segurança. Pode atualizar com:

```
sudo apt update && \
sudo apt upgrade docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
```

Para quem usa Windows ou [Docker Desktop](https://docs.docker.com/desktop/), a interface do programa vai avisar quando tiver uma atualização disponível e oferecerá tutoriais para a atualização.


### 2. Configure um usuário sem permissões root

Uma grande parte das imagens são criadas a partir do Alpine, que tem por padrão o [usuário root, sem senha](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2019-5021). Isso se caracteriza como um problema grave de segurança, que pode ser corrigido das seguintes formas:

1. Ao rodar a imagem direto pelo Docker:
```shell
docker run -u 4000 alpine
```

2. Pela configuração do Dockerfile
```shell
FROM alpine
RUN addgroup -S nonroot && adduser -S nonroot -G nonroot

# Aqui realize as ações que precisam ser feitas como usuário root, como a instalação de pacotes

USER nonroot
```


### 3. Não exponha a socket do Docker daemon

A socket do Docker `/var/run/docker.sock` é o ponto de acesso à API do Docker em sistemas UNIX. O dono desta socket é o usuário root e, ao expor esta socket ao container, é o mesmo que dar ao usuário do container acesso root ao seu host.

Para previnir issto, jamais rode nenhum container pela linha de comando passando o parâmetro `-v /var/run/docker.sock:/var/run/docker.sock`.

E ao trabalhar com Docker COmpose, jamais faça o seguinte bind de volumes:

```shell
volumes:
  - "/var/run/docker.sock:/var/run/docker.sock"
```


### 4. Rode com a flag –no-new-privileges

Sempre rode seus containers passando a flag `--security-opt=no-new-privileges`. Isso previne ataques de escalação de privilégios utilizando os binários `setuid` e `setgid`.

Trabalhando com Docker Compose, isso pode ser configurado utilizando o atributo `security_opt`:

```shell
security_opt:
  - no-new-privileges:true
```


### 5. Defina o nível de log para, no mínimo, INFO

Rodando com Docker Compose, basta utilizar a flag `--log-level`:

```shell
docker-compose --log-level info up
```

O nível de log pode ser `debug`, `info`, `warn`, `error` e `fatal`.


### 6. Especifique a assinatura da imagem base

Na hora de rodar o projeto, geralmente é usado apenas o nome da imagem e sua versão, por exemplo `alpine:3.18.4` (sempre prefira usar versões fixas ao invés de `latest`, para garantir que sua aplicação continue compatível com a versão da imagem de base). Porém, em projetos open source sempre há a possibilidade de algum contribuidor mal-intencionado envie uma alteração danosa propositalmente. É raro, mas já aconteceu no passado.

Por este motivo, para garantir que a imagem que você está utilizando no seu projeto é original, e não uma imagem diferente substituindo a original, certifique-se de adicionar a hash de validação da imagem, da seguinte forma:

```shell
alpine:3.18.4@sha256:48d9183eb12a05c99bcc0bf44a003607b8e941e1d4f41f9ad12bdcc4b5672f86
```

A hash SHA256 da imagem pode ser obtida no [Docker Hub](https://hub.docker.com/), ao selecionar a versão pretendida. A hash irá aparecer logo abaixo do nome da imagem.  


### 7. Não copie a pasta .git para o container

Jamais copie a pasta .git para dentro do Container. Adicione esta pasta ao `.dockerignore`.

Desta forma evitamos a exposição de informações confidenciais como o nome e email dos usuários que contribuem para o projeto, histórico de commits e codigo fonte do projeto.

### 8. Utilize ferramentas de análise estática

Existem diversas ferramentas para análise estática de configurações Docker (assim como análises de código dos projetos). Algumas das melhores ferramentas são:

- **Gratuitas**
  - [Clair](https://github.com/quay/clair)
  - [ThreatMapper](https://github.com/deepfence/ThreatMapper)
  - [Trivy](https://github.com/aquasecurity/trivy)

- **Comerciais**
  - [Snyk](https://snyk.io/) (open source e com opção gratuita disponível)
  - [anchore](https://anchore.com/opensource/) (open source e com opção gratuita disponível)
  - [JFrog XRay](https://jfrog.com/xray/)
  - [Qualys](https://www.qualys.com/apps/container-security/)

- Para encontrar **secrets e variáveis expostas** em containers:
  - [ggshield](https://github.com/GitGuardian/ggshield) (open source e com opção gratuita disponível)
  - [SecretScanner](https://github.com/deepfence/SecretScanner) (open source)


- Para detectar **configurações incorretas** e inseguras em **Kubernetes**:
  - [kubeaudit](https://github.com/Shopify/kubeaudit)
  - [kubesec.io](https://kubesec.io/)
  - [kube-bench](https://github.com/aquasecurity/kube-bench)

- Para detectar **configurações incorretas** e inseguras no **Docker**:
  - [inspec.io](https://docs.chef.io/inspec/resources/docker/)
  - [dev-sec.io](https://dev-sec.io/baselines/docker/)
  - [docker-bench-security](https://github.com/docker/docker-bench-security)


:::info
Estas são apenas as recomendações mais genéricas. Para uma visão ampliada, com mais recomendações, visite a [Cheat Sheet da OWASP](https://cheatsheetseries.owasp.org/cheatsheets/Docker_Security_Cheat_Sheet.html).
:::