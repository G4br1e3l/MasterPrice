# MasterPrice - Javascript WhatsApp Web API
### MasterPrice é um bot para gerenciamento de grupos no Whatsapp.

MasterPrice é um bot gerenciado diretamente pelo terminal, seja via Termux/Linux ou Via Prompt de Comando em computadores Windows, onde, suporta interações com multi-dispositivos & versões Web do WhatsApp[^1].

**Leia a documentação e conecte-se em nosso Discord.**

## Instalação
```
git clone [repositório].
```
> __Note__
> Repositório Atual: [${branch}](https://github.com/G4br1e3l/MasterPrice).

[^1]: Utiliza a Web API Baileys. 

## Exemplo de Uso

Para rodar o bot, baixe ou clone o repositório e depois digite os comandos abaixo em um terminal (cmd):

1 - `path/to/MasterPrice`<br>
2 - `node MP.js` ou `npm start`<br>

Em caso de necessidade de alguma nova dependência proveniente de uma atualização, utilize:

3 - `npm i`<br>

Caso você esteja utilizando alguns dos terminais comnetados, segue um atalho para habilitar funções extras ao iniciar o bot:

4 - [Documentos](functions/)

## Testes
PARA FAZER

## Conectando
```
LOGO 
```
## Configurando a conexão/dependências
<img src="https://c.tenor.com/CSujft_P7eIAAAAS/adm-ta-saindo-adm.gif" alt="My cool logo"/>
O bot atualmente está completo neste repositório!!!

### Configurações para o BOT[^2]

Acesse o arquivo [configuracoes.json](root/config.json) na fonte do BOT para configurar os valores de acordo com suas necessidades:

```
{
  "bot": {
    "name":"MasterPrice",
    "user_id":"",
    "user_name":"",
    "verified":"",
    },
    "prefix": "!"
   }
}
```
> Para este arquivo, há comandos para resolver quaisquer dependencias.

### Configurações para as mensagens[^3]

Acesse o arquivo [mensagens.json](fonte/configuracoes/mensagens.json) na fonte do BOT para configurar os valores de acordo com suas necessidades:

```
{
  "params": {
      "index": {
          "upconnection" : "Ouvindo Conexão.",
          "connecting": "Conectando.",
          "reconecting": "Reconectando.",
          "online": "@botname ::: ONLINE.",
          "downconnection": "Conexão anterior caiu.",
          "lostconnection": "Não consegui reconectar... Por favor, faça login novamente."
      },
      ..... opts
      }}}}
```
> Para este arquivo, recomenda-se não alterar os parâmetros que contenham **@**<br>
Pois isto pode prejudicar algum possivel funcionamento.

[^2]: Definição de parametros vitais para alguns comandos. 
[^3]: Definição de parametros de resposta para mensagens, comandos e eventuais textos possiveis. 
