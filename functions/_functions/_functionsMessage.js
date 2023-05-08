// Importa o módulo 'readFileSync' e 'writeFileSync' do Node.js para leitura de arquivos
import { readFileSync, writeFileSync } from "fs"

// Importa o módulo 'chalk' para estilização de texto no console
import chalk from "chalk"

// Importa o módulo 'tz' para segmentação de datas e periodos.
import pkg from 'moment-timezone'
const { tz } = pkg

import { sendReaction } from '../_functions/_sendMessage.js'

// Função que recebe uma string e um separador e retorna a primeira parte da string antes do separador
export const Splitt = (value, where) => where.split(value)[0]

// Função que recebe um valor em milissegundos e retorna uma Promise que resolve após o tempo especificado
export const Delay = (x) => new Promise(resolve => setTimeout(resolve, x))

// Função que retorna a data atual formatada como "DD/MM/YY" no fuso horário de São Paulo
export const Date = () => tz("America/Sao_Paulo").format("DD/MM/YY")

// Função que retorna a hora atual formatada como "HH:mm:ss" no fuso horário de São Paulo
export const Hour = () => tz("America/Sao_Paulo").format("HH:mm:ss")

// Função que recebe um objeto com o caminho e nome do arquivo e o conteúdo a ser salvo em JSON
// e escreve o conteúdo no arquivo especificado
export const Save = ({file_path, filename}) =>  writeFileSync(file_path, JSON.stringify(filename))

// Função que recebe um objeto e retorna o valor da primeira chave que não é 'messageTimestamp', 'pushName' ou 'message'
export const Key = (a) => a[Object.keys(a).find((key) => !['messageTimestamp', 'pushName', 'message'].includes(key))]

// Função que recebe um objeto com um valor a ser testado e uma expressão regular e retorna true se o valor corresponde à expressão regular
export const Audition = ({ from, where }) => new RegExp(from).test(where)

// Conjunto para armazenar temporariamente valores que foram processados recentemente
const Protect = new Set()

// Função que recebe um valor e adiciona-o ao conjunto de valores protegidos por um período de 8 segundos
export const Spam = (x) => { Protect.add(x); setTimeout(() => Protect.delete(x), 4000) }

// Função que recebe um valor e verifica se ele está atualmente protegido pelo conjunto de valores protegidos
export const isSpam = (x) => !!Protect.has(x)

// Conjunto para armazenar temporariamente valores que estão sendo processados
const Await = new Set()

// Função que recebe um valor e adiciona-o ao conjunto de valores aguardando processamento por um período de 4 segundos
export const Cooldown = (x) => { Await.add(x); setTimeout(() => Await.delete(x), 6000) }

// Função que recebe um valor e remove-o do conjunto de valores aguardando processamento
export const DownColling = (x) => Await.delete(x)

// Função que recebe um valor e verifica se ele está atualmente aguardando processamento pelo conjunto de valores aguardando processamento
export const isColling = (x) => !!Await.has(x)

// Função que retorna o número de valores atualmente aguardando processamento pelo conjunto de valores aguardando processamento
export const sizeCooldown = (x) => Await

// Conjunto para armazenar temporariamente valores que estão sendo processados
const Ignore = new Set()

// Função que recebe um valor e adiciona-o ao conjunto de valores aguardando processamento por um período de 4 segundos
export const doIgnore = (x) => { Ignore.add(x); setTimeout(() => Ignore.delete(x), 8000) }

// Função que recebe um valor e verifica se ele está atualmente aguardando processamento pelo conjunto de valores aguardando processamento
export const IsIgnoring = (x) => !!Ignore.has(x)

// Função responsável por imprimir mensagens no console
export const console_message = ({ message_param, config }) => {

    // Faz a leitura do arquivo de configuração
    var Config = JSON.parse(readFileSync("./root/configurations.json"))

    // Extrai a mensagem de texto e o número do remetente da mensagem a partir do objeto de configuração
    const {
        messageText: Text = undefined,
        messageNumber: Sender = undefined,
    } = config.parameters?.details[1]?.sender || {}

    // Função que retorna o nome do grupo a partir do objeto de configuração
    // Extrai o ID do grupo a partir do objeto de configuração
    // Procura o índice do grupo no objeto 'metadata'
    // Retorna o nome do grupo
    const group = ({
        metadata,
        config
    }) => metadata.remoteJid[metadata?.remoteJid?.map(chat => Object.keys(chat)[0].split('@')[0])?.indexOf(config.parameters?.details[0]?.messageJid.split('@')[0])][config.parameters?.details[0]?.messageJid].subject

    // Imprime a mensagem formatada no console
    console.log(
        // Utiliza o módulo 'chalk' para estilizar o texto com a cor especificada
        chalk.rgb(123, 45, 67).bold(
            // Substitui as variáveis no texto da mensagem com seus valores correspondentes
            message_param
            .replace(/@botname/g, `${Config.parameters.bot[0].name} ::: ${Config.parameters.bot[0].username}`)
            .replace(/@user/g, Sender)
            .replace(/@entry/g, chalk.hex('#DEADED').bgGreen.bold(Text))
            .replace(/@hour/g, Hour()) // Não foi declarada a função 'Hour', deve ser definida em outro lugar
            .replace(/@date/g, Date())
            .replace(/@group/g, config.boolean?.isGroup? group({ metadata: Config?.parameters?.metadata?.store[0], config: config }) : '')
        )
    );
}

// Esta função recebe dois parâmetros: Key e MP.
export const createdData = async (Key, MP) => {

    // Lê o arquivo de configurações.
    var Config = JSON.parse(readFileSync("./root/configurations.json"))

    // Obtém o caminho do arquivo onde as configurações serão salvas.
    const Path = Config.parameters.commands[1].paths.config_file

    // Obtém a lista de grupos armazenados nas configurações.
    const { remoteJid } = Config.parameters.metadata.store[0]

    // Cria uma função que retorna um objeto JSON com as informações do grupo.
    var jsonData = async () => `{"${Key.remoteJid}": ${JSON.stringify(await MP.groupMetadata(Key.remoteJid))}}`

    // Converte a string JSON em um objeto JavaScript.
    var jsonObj = JSON.parse(await jsonData())

    // Adiciona o objeto JSON à lista de grupos armazenados.
    remoteJid.push(jsonObj)

    // Salva as configurações atualizadas no arquivo de configurações.
    writeFileSync(Path, JSON.stringify(Config))
}

/**
 * Atualiza o arquivo de configuração do bot com as informações de autenticação fornecidas.
 * @param {object} MP - Objeto contendo informações de autenticação do bot.
 */
export const Named = ({ MP }) => {

    // Lê o arquivo de configurações.
    var Config = JSON.parse(readFileSync("./root/configurations.json"))

    // Obtém o caminho do arquivo de configuração.
    const Path = Config.parameters.commands[1].paths.config_file

    /**
     * Extrai o ID do bot a partir do ID de autenticação.
     *
     * @param {string} id - ID de autenticação do bot.
     * @returns {string} - ID do bot.
     */
    function extractBotId(id) {
        const [, N_1ID = ''] = id.match(/(\w+)(@\w+)?/) || []
        const [, N_2ID = ''] = N_1ID.match(/(\w+)(:\w+)?/) || []
        return N_2ID
    }

    /**
     * Atualiza as propriedades de configuração do bot com as informações de autenticação fornecidas.
     * @param {object} config - Objeto de configuração do bot.
     * @param {object} authState - Objeto contendo as informações de autenticação do bot.
     * @returns {object} - Objeto de configuração atualizado.
     * @throws {Error} - Se as propriedades do bot não forem encontradas no arquivo de configuração.
     */
    function updateBotConfig(config, authState) {
        const Config = config.parameters.bot[0]

        if (!Config) {
            throw new Error('Não foi possível encontrar as propriedades do bot no arquivo de configuração.')
        }

        const { id, name } = authState?.creds?.me || {}

        // Extrai o ID do bot e atualiza as propriedades correspondentes no objeto de configuração.
        Config.id = extractBotId(id) || '00000000000'
        Config.username = name || 'BOT'
        Config.trusted = 'trusted'

        return config
    }

    // Escreve o objeto de configuração atualizado no arquivo.
    writeFileSync(Path, JSON.stringify(updateBotConfig(Config, MP.authState)))
}

// Esta função recebe dois parâmetros: MP (o cliente do WhatsApp) e a mensagem que receberá as reações.
export const TenCount = async ({ MP, message, value }) => {

    // Cria uma função assíncrona que enviará as reações de forma sequencial.
    // A função é autoexecutável (IIFE) e inicia com o parâmetro "x" igual a 0.
    (async function sendReactionLoop(x){

        // Cria um array com as reações que serão enviadas.
        
        // Se o parâmetro "x" for maior ou igual a 12, encerra a execução.
        if (x > value.length) return

        // Chama a função "sendReaction" para enviar a reação "x" na mensagem recebida.
        await sendReaction({
            client: MP,
            param: message,
            answer: value
        })

        // Aguarda 1 segundo antes de chamar a próxima iteração da função.
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Chama a função novamente com o parâmetro "x" incrementado em 1.
        sendReactionLoop( x + 1 )

    })(0)

    return
}

/**
 * Obtém informações do grupo, como se o usuário é um administrador ou se o bot é um administrador do grupo.
 * @param {string} Type - O tipo de informação a ser obtida. Pode ser "isAdmin" ou "isBotAdmin".
 * @param {object} groupMetadata - Metadados do grupo, contendo informações sobre os participantes.
 * @param {object} message - Objeto da mensagem que disparou a função.
 * @returns {boolean} - Retorna true se o usuário ou o bot é um administrador do grupo, dependendo do valor de Type. Retorna false caso contrário.
 */
export const getGroupData = ({ Type, groupMetadata, message }) => {

    // Lê o arquivo de configurações.
    var Config = JSON.parse(readFileSync("./root/configurations.json"))

    // Cria uma função interna que retorna um array com os JID's dos participantes que são admin ou superadmin.
    const getAdminUsers = participants => 
    participants.filter(user => user.admin === 'admin').map(user => user.id)

    // Extrai o JID remoto e o JID do participante da mensagem.
    const { remoteJid, participant } = message

    // Chama a função getAdminUsers para obter os JID's dos administradores.
    const adminUsers = getAdminUsers(groupMetadata[remoteJid].participants)

    // Verifica qual é o valor do parâmetro Type.
    switch (Type) {

    // Se for "isAdmin", retorna true se o JID do participante estiver na lista de JID's de administradores.
    case 'isAdmin':
        return adminUsers.includes(participant)

    // Se for "isBotAdmin", retorna true se o JID do bot estiver na lista de JID's de administradores.
    case 'isBotAdmin':
        return adminUsers.includes(`${Config.parameters.bot[0].id}@s.whatsapp.net`)

    // Se não for nenhum dos valores acima, retorna false.
    default:
        return false
    }
}

//
/**
 * Função para gerenciar os comandos "unsafe" disponíveis para uso pelo bot
 * @param {Object} options - um objeto contendo as seguintes propriedades:
 * @param {string} options.Modo - O modo da operação a ser realizada, 'provide' para adicionar um comando unsafe e 'unprovide' para remover um comando unsafe
 * @param {string} options.Parametro - O comando unsafe a ser adicionado ou removido
 * @returns {void} - não retorna nenhum valor, mas altera o arquivo de configuração do bot.
 * @throws {Error} Se o modo especificado não for 'provide' ou 'unprovide'.
 * @throws {Error} Se a operação de gravação do arquivo de configuração falhar.
 */
export const Provided = ({ Modo, Parametro}) =>{

    // Lê o arquivo de configurações do bot
    var Config = JSON.parse(readFileSync("./root/configurations.json"))

    // Obtém a lista de comandos unsafe disponíveis a partir das configurações do bot
    const provided = Config.parameters.commands[0].execution[1].unsafe

    // Obtém o caminho do arquivo de configurações do bot a partir das configurações do bot
    const path = Config.parameters.commands[1].paths.config_file

    switch(Modo){

    // Adiciona um comando unsafe à lista de comandos disponíveis
    case 'provide':
        provided.push(Parametro)
        writeFileSync(path, JSON.stringify(Config))
    break

    // Remove um comando unsafe da lista de comandos disponíveis
    case 'unprovide':
        const index = provided.findIndex((el) => el === Parametro)
        if (index !== -1) {
            provided.splice(index, 1);
            writeFileSync(path, JSON.stringify(Config));
        }
    break

    // Se o modo especificado não for 'provide' ou 'unprovide', lança um erro.
    default:
        throw new Error("Modo inválido especificado.");
    }
}

/**
 * A função Restricted é responsável por restringir ou desrestringir um comando para um determinado grupo.
 * @param {Object} options - um objeto contendo as seguintes propriedades:
 * @param {string} options.Modo - a ação a ser executada, 'restrict' ou 'unrestrict'.
 * @param {string} options.Parametro - o identificador do grupo a ser restringido ou desrestringido.
 * @returns {void} - não retorna nenhum valor, mas altera o arquivo de configuração do bot.
 * @throws {Error} Se o modo especificado não for 'restrict' ou 'unrestrict'.
 * @throws {Error} Se a operação de gravação do arquivo de configuração falhar.
*/
export const Restricted = ({ Modo, Parametro}) =>{

    // Lê as configurações do bot do arquivo configurations.json
    var Config = JSON.parse(readFileSync("./root/configurations.json"))

    // Acessa o array de grupos restritos e o caminho do arquivo de configuração
    const restricted = Config.parameters.commands[0].execution[2].local
    const path = Config.parameters.commands[1].paths.config_file

    // Verifica o modo a ser executado
    switch(Modo){

    // Adiciona o grupo ao array de grupos restritos e escreve as alterações no arquivo de configuração
    case 'restrict':
        restricted.push(Parametro)
        writeFileSync(path, JSON.stringify(Config))
    break

    // Remove o grupo do array de grupos restritos e escreve as alterações no arquivo de configuração
    case 'unrestrict':
        const index = restricted.findIndex((el) => el === Parametro)
        if (index !== -1) {
            restricted.splice(index, 1);
            writeFileSync(path, JSON.stringify(Config));
        }
    break
    // Se o modo especificado não for 'restrict' ou 'unrestrict', lança um erro.
    default:
        throw new Error("Modo inválido especificado.");
    }

}

/**
 * Função para adicionar ou remover um usuário da lista de proprietários do bot.
 * @param {Object} options - As opções para a função.
 * @param {string} options.Modo - O modo de operação da função ('addowner' ou 'removeowner').
 * @param {string} options.Parametro - O parâmetro a ser adicionado ou removido da lista de proprietários.
 * @returns {void} - não retorna nenhum valor, mas altera o arquivo de configuração do bot.
 * @throws {Error} Se o modo especificado não for 'addowner' ou 'removeowner'.
 * @throws {Error} Se a operação de gravação do arquivo de configuração falhar.
 */
export const Owned = ({ Modo, Parametro}) => {
    // Lê a configuração do arquivo de configuração.
    var Config = JSON.parse(readFileSync("./root/configurations.json"));

    // Obtém a lista de proprietários e o caminho do arquivo de configuração.
    const owned = Config.parameters.bot[0].owners;
    const path = Config.parameters.commands[1].paths.config_file;

    switch(Modo){

    // Adiciona um novo proprietário à lista de proprietários.
    case 'addowner':
        owned.push(Parametro);
        writeFileSync(path, JSON.stringify(Config));
    break;

    // Remove um proprietário existente da lista de proprietários.
    case 'removeowner':
        const index = owned.findIndex((el) => el === Parametro);
        if (index !== -1) {
            owned.splice(index, 1);
            writeFileSync(path, JSON.stringify(Config));
        }
    break;

    // Se o modo especificado não for 'addowner' ou 'removeowner', lança um erro.
    default:
        throw new Error("Modo inválido especificado.");
    }
}

/**
 * Retorna o texto de uma mensagem, baseado no tipo de mensagem recebida.
 * @param {object} options - As opções para obter o texto da mensagem.
 * @param {string} options.MessageType - O tipo de mensagem recebida.
 * @param {object} options.Message - A mensagem recebida.
 * @returns {string} O texto da mensagem recebida.
*/
export const getMessageText = ({ MessageType, Message }) => {
    //Funções para captarem um objeto especifico com base no tipo da mensagem recebida.
    const getConversationText = (MessageType, Message) => { return Message[MessageType] }
    const getExtendedTextMessageText = (MessageType, Message) => { return Message[MessageType]?.text }
    const getImageMessageCaption = (MessageType, Message) => { return Message[MessageType]?.caption ?? Message[MessageType]?.message?.imageMessage?.caption }
    const getVideoMessageCaption = (MessageType, Message) => { return Message[MessageType]?.caption ?? Message[MessageType]?.message?.videoMessage?.caption }
    const getDocumentWithCaptionMessageCaption = (MessageType, Message) => { return Message[MessageType]?.message?.documentMessage?.caption }
    const getListResponseMessageSelectedRowId = (MessageType, Message) => { return Message[MessageType]?.singleSelectReply?.selectedRowId }
    const getButtonsResponseMessageSelectedButtonId = (MessageType, Message) => { return Message[MessageType]?.selectedButtonId }
    const getTemplateButtonReplyMessageSelectedId = (MessageType, Message) => { return Message[MessageType]?.selectedId }
    const getMessageContextInfoSelectedButtonOrRowIdOrText = (MessageType, Message) => { return Message[MessageType]?.selectedButtonId || Message[MessageType]?.singleSelectReply.selectedRowId || Message.text }
    const getDefault = (MessageType) => { return JSON.stringify(MessageType) }

    //Método para definir qual é o tipo de mensagem.
    switch (MessageType) {
        case 'conversation':
        return getConversationText(MessageType, Message);
        case 'extendedTextMessage':
        return getExtendedTextMessageText(MessageType, Message);
        case 'imageMessage':
        return getImageMessageCaption(MessageType, Message);
        case 'videoMessage':
        return getVideoMessageCaption(MessageType, Message);
        case 'documentWithCaptionMessage':
        return getDocumentWithCaptionMessageCaption(MessageType, Message);
        case 'listResponseMessage':
        return getListResponseMessageSelectedRowId(MessageType, Message);
        case 'buttonsResponseMessage':
        return getButtonsResponseMessageSelectedButtonId(MessageType, Message);
        case 'templateButtonReplyMessage':
        return getTemplateButtonReplyMessageSelectedId(MessageType, Message);
        case 'messageContextInfo':
        return getMessageContextInfoSelectedButtonOrRowIdOrText(MessageType, Message);
        default:
        return getDefault(MessageType);
    }
}

/**
 * Detecta o status da mensagem com base no objeto de mensagem e no tipo de mensagem.
 * @param {object} param - O objeto de parâmetros contendo a mensagem e o tipo de mensagem.
 * @param {object} param.Message - O objeto de mensagem.
 * @param {string} param.MessageType - O tipo de mensagem.
 * @returns {string} Uma string que indica o status da mensagem detectada.
*/
export const detectMessageStatus = ({ Message, MessageType }) => {
    //Verifica se recebeu uma mensagem do tipo status.
    if (Message?.[MessageType]?.groupId === 'status@broadcast') return 'Publicação de status detectada.'

    //Verifica se é uma mensagem conhecida (Não nula).
    const detectedStatus = Message == null || Message[MessageType]?.groupId == null
    ? null
    : 'Mensagem indefinida.' || 'Mensagem desconhecida.'

    return detectedStatus
}