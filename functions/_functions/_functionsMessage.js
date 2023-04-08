//
import { readFileSync, writeFileSync } from "fs"
import chalk from "chalk"

import pkg from 'moment-timezone'
import { fail } from "assert"
const { tz } = pkg

//
export const Splitt = (value, where) => where.split(value)[0]
export const Delay = (x) => new Promise(resolve => setTimeout(resolve, x))
export const Date = () => tz("America/Sao_Paulo").format("DD/MM/YY")
export const Hour = () => tz("America/Sao_Paulo").format("HH:mm:ss")
export const Save = ({file_path, filename}) =>  writeFileSync(file_path, JSON.stringify(filename))
export const Key = (a) => a[Object.keys(a).find((key) => !['messageTimestamp', 'pushName', 'message'].includes(key))]
export const Audition = ({ from, where }) => new RegExp(from).test(where)

//
const Protect = new Set()
export const Spam = (x) => { Protect.add(x); setTimeout(() => Protect.delete(x), 8000) }
export const isSpam = (x) => !!Protect.has(x)

//
const Await = new Set()
export const Cooldown = (x) => { Await.add(x); setTimeout(() => Await.delete(x), 4000) }
export const DownColling = (x) => Await.delete(x)
export const isColling = (x) => !!Await.has(x)
export const sizeCooldown = (x) => Await

//
export const console_message = ({ message_param, config }) =>{

    var Config = JSON.parse(readFileSync("./root/configurations.json"))

    const Text = config?.msg?.key?.parameters?.details[1]?.sender?.messageText ?? ''; if(!Text) return
    const Sender = config?.msg?.key?.parameters?.details[1]?.sender?.messageNumber ?? ''; if(!Sender) return

    const isGroup = config?.msg?.key?.boolean?.isGroup

    const group = ({ metadata, config }) => {
        const groupJid = config?.msg?.key?.parameters?.details[0]?.messageKey?.remoteJid?.split('@')[0]
        const chatIndex = metadata?.remoteJid?.map(chat => Object.keys(chat)[0].split('@')[0])?.indexOf(groupJid)
        return metadata?.remoteJid?.[chatIndex]?.[groupJid]?.subject
    }

    console.log(chalk.rgb(123, 45, 67).bold(
        message_param
        .replace(/@botname/g, `${Config.parameters.bot[0].name} ::: ${Config.parameters.bot[0].username}`)
        .replace(/@user/g, Sender)
        .replace(/@entry/g, chalk.hex('#DEADED').bgGreen.bold(Text))
        .replace(/@hour/g, Hour())
        .replace(/@date/g, Date())
        .replace(/@group/g, isGroup? group({ metadata: Config?.parameters?.metadata?.store[0], config: config }) : '')
    ))
}

//
export const createdData = async (Key, MP) => {

    var Config = JSON.parse(readFileSync("./root/configurations.json"))
    const Path = Config.parameters.commands[1].paths.config_file
    const { remoteJid } = Config.parameters.metadata.store[0]

    var jsonData = async () => `{"${Key.remoteJid}": ${JSON.stringify(await MP.groupMetadata(Key.remoteJid))}}`
    var jsonObj = JSON.parse(await jsonData())

    remoteJid.push(jsonObj)
    writeFileSync(Path, JSON.stringify(Config))
}


//
export const Named = ({ MP }) => {

    var Config = JSON.parse(readFileSync("./root/configurations.json"))
    const Path = Config.parameters.commands[1].paths.config_file

    function extractBotId(id) {
        const [, N_1ID = ''] = id.match(/(\w+)(@\w+)?/) || []
        const [, N_2ID = ''] = N_1ID.match(/(\w+)(:\w+)?/) || []
        return N_2ID
    }

    function updateBotConfig(config, authState) {
        const Config = config.parameters.bot[0]

        if (!Config) {
            throw new Error('Não foi possível encontrar as propriedades do bot no arquivo de configuração.')
        }

        const { id, name } = authState?.creds?.me || {}

        Config.id = extractBotId(id)
        Config.username = name
        Config.trusted = 'trusted'

        return config
    }

    writeFileSync(Path, JSON.stringify(updateBotConfig(Config, MP.authState)))
}

//
export const TenCount = async ({ MP, message }) => {
    const reactions = ['0️⃣','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟','✅']
    (async function sendReactionLoop(x){
        if (x >= 12) return
        await sendReaction({
            client: MP,
            param: message,
            answer: reactions[x]
        })
        await new Promise(resolve => setTimeout(resolve, 1000))
        sendReactionLoop( x + 1 )
    })(0)
}

//
export const getGroupData = ({ Type, groupMetadata, message }) => {

    var Config = JSON.parse(readFileSync("./root/configurations.json"))

    const getAdminUsers = participants => participants.filter(user => user.isAdmin || user.isSuperAdmin).map(user => user.jid)

    const { remoteJid, participant } = message
    const adminUsers = getAdminUsers(groupMetadata[remoteJid].participants)

    switch (Type) {
        case 'isAdmin':
            return adminUsers.includes(participant) || false
        case 'isBotAdmin':
            return adminUsers.includes(`${Config.parameters.bot[0].id}@s.whatsapp.net`) || false
        default:
            return false
    }
}

//
export const Provided = ({ Modo, Parametro}) =>{

    var Config = JSON.parse(readFileSync("./root/configurations.json"))

    const provided = Config.parameters.commands[0].execution[1].unsafe
    const path = Config.parameters.commands[1].paths.config_file

    switch(Modo){
        case 'provide':
            provided.push(Parametro)
            writeFileSync(path, JSON.stringify(Config))
        break
        case 'unprovide':
            const index = provided.findIndex((el) => el === Parametro)
            if (index !== -1) {
                provided.splice(index, 1);
                writeFileSync(path, JSON.stringify(Config));
            }
        break
    }
}

//
export const Restricted = ({ Modo, Parametro}) =>{

    var Config = JSON.parse(readFileSync("./root/configurations.json"))

    const restricted = Config.parameters.commands[0].execution[2].local
    const path = Config.parameters.commands[1].paths.config_file

    switch(Modo){
        case 'restrict':
            restricted.push(Parametro)
            writeFileSync(path, JSON.stringify(Config))
        break
        case 'unrestrict':
            const index = restricted.findIndex((el) => el === Parametro)
            if (index !== -1) {
                restricted.splice(index, 1);
                writeFileSync(path, JSON.stringify(Config));
            }
        break
    }
}

//
export const Owned = ({ Modo, Parametro}) =>{

    var Config = JSON.parse(readFileSync("./root/configurations.json"))

    const owned = Config.parameters.bot[0].owners
    const path = Config.parameters.commands[1].paths.config_file

    switch(Modo){
        case 'addowner':
            owned.push(Parametro)
            writeFileSync(path, JSON.stringify(Config))
        break
        case 'removeowner':
            const index = owned.findIndex((el) => el === Parametro)
            if (index !== -1) {
                owned.splice(index, 1);
                writeFileSync(path, JSON.stringify(Config));
            }
        break
    }
}

export const getMessageText = ({ MessageType, Message }) => {
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

export const detectMessageStatus = ({ Message, MessageType }) => {
    if (Message?.[MessageType]?.groupId === 'status@broadcast') {
        return 'Publicação de status detectada.'
    }

    const detectedStatus = Message == null || Message[MessageType]?.groupId == null
    ? null
    : 'Mensagem indefinida.' || 'Mensagem desconhecida.'

    return detectedStatus
}