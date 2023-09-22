import {
    sendReaction,
    tz,
    chalk,
    writeFileSync,
    Config
} from '../../exports.js'

export const getRandom = (v) => `${Math.floor(Math.random() * 10000)}${v}`;

export const Audition = ({ from, where }) => new RegExp(from).test(where)
export const Splitt = (value, where) => where.split(value)[0]
export const Delay = (x) => new Promise(resolve => setTimeout(resolve, x))
export const Date = () => tz("America/Sao_Paulo").format("DD/MM/YY")
export const Hour = () => tz("America/Sao_Paulo").format("HH:mm:ss")
export const Save = ({ file_path, filename }) => writeFileSync(file_path, JSON.stringify(filename))
export const Key = (a) => a[Object.keys(a).find((key) => !['messageTimestamp', 'pushName', 'message'].includes(key))]

const Protect = new Set()
export const Spam = (x) => { Protect.add(x); setTimeout(() => Protect.delete(x), 4000) }
export const isSpam = (x) => !!Protect.has(x)

const Await = new Set()
export const Cooldown = (x) => { Await.add(x); setTimeout(() => Await.delete(x), 10000) }
export const DownColling = (x) => Await.delete(x)
export const isColling = (x) => !!Await.has(x)
export const sizeCooldown = (x) => Await

const Ignore = new Set()
export const doIgnore = (x) => { Ignore.add(x); setTimeout(() => Ignore.delete(x), 8000) }
export const IsIgnoring = (x) => !!Ignore.has(x)

export const console_message = ({ message_param, config }) => {
    const {
        messageText: Text = undefined,
        messageNumber: Sender = undefined,
    } = config.parameters?.details[1]?.sender || {}
    const group = ({
        metadata,
        config
    }) => metadata.remoteJid[metadata?.remoteJid?.map(chat => Object.keys(chat)[0].split('@')[0])?.indexOf(config.parameters?.details[0]?.messageJid.split('@')[0])][config.parameters?.details[0]?.messageJid].subject
    console.log(
        chalk.rgb(123, 45, 67).bold(
            message_param
            .replace(/@botname/g, `${Config.parameters.bot[0].name} ::: ${Config.parameters.bot[0].username}`)
            .replace(/@user/g, Sender)
            .replace(/@entry/g, chalk.hex('#DEADED').bgGreen.bold(Text))
            .replace(/@hour/g, Hour())
            .replace(/@date/g, Date())
            .replace(/@group/g, config.boolean?.isGroup? group({ metadata: Config?.parameters?.metadata?.store[0], config: config }) : '')
        )
    );
}

export const createdData = async (Key, MP) => {
    
    const Path = Config.parameters.commands[1].paths.config_file
    const { remoteJid } = Config.parameters.metadata.store[0]
    var jsonData = async () => `{"${Key.remoteJid}": ${JSON.stringify(await MP.groupMetadata(Key.remoteJid))}}`
    var jsonObj = JSON.parse(await jsonData())
    remoteJid.push(jsonObj)
    writeFileSync(Path, JSON.stringify(Config))
}

export const Named = ({ MP }) => {
    
    const Path = Config.parameters.commands[1].paths.config_file;

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

        Config.id = extractBotId(id) || '00000000000'
        Config.username = name || 'BOT'
        Config.trusted = 'trusted'

        return config
    }

    writeFileSync(Path, JSON.stringify(updateBotConfig(Config, MP.authState)))
}

export const TenCount = async ({ MP, message, value }) => {
    (async function sendReactionLoop(x){
        if (x > value.length) return
        await sendReaction({
            client: MP,
            param: message,
            answer: value
        })
        await new Promise(resolve => setTimeout(resolve, 1000))
        sendReactionLoop( x + 1 )
    })(0)
    return
}

export const getGroupData = ({ Type, groupMetadata, message }) => {
    
    const getAdminUsers = participants => participants.filter(user => user.admin === 'admin').map(user => user.id)
    const { remoteJid, participant } = message
    const adminUsers = getAdminUsers(groupMetadata[remoteJid].participants)
    switch (Type) {
        case 'isAdmin':
            return adminUsers.includes(participant)
        case 'isBotAdmin':
            return adminUsers.includes(`${Config.parameters.bot[0].id}@s.whatsapp.net`)
        default:
            return false
    }
}

export const Provided = ({ Modo, Parametro}) => {
    
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
        default:
            throw new Error("Modo inválido especificado.");
    }
}

export const Restricted = ({ Modo, Parametro}) => {
    
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
        default:
            throw new Error("Modo inválido especificado.");
    }
}

export const Owned = ({ Modo, Parametro}) => {
    ;
    const owned = Config.parameters.bot[0].owners;
    const path = Config.parameters.commands[1].paths.config_file;
    switch(Modo){
        case 'addowner':
            owned.push(Parametro);
            writeFileSync(path, JSON.stringify(Config));
        break;
        case 'removeowner':
            const index = owned.findIndex((el) => el === Parametro);
            if (index !== -1) {
                owned.splice(index, 1);
                writeFileSync(path, JSON.stringify(Config));
            }
        break;
        default:
            throw new Error("Modo inválido especificado.");
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
    if (Message?.[MessageType]?.groupId === 'status@broadcast') return 'Publicação de status detectada.'
    const detectedStatus = Message == null || Message[MessageType]?.groupId == null
    ? null
    : 'Mensagem indefinida.' || 'Mensagem desconhecida.'
    return detectedStatus
}
