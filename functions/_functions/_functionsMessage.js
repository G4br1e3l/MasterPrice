//
import { readFileSync, writeFileSync } from "fs"
import chalk from "chalk"

import pkg from 'moment-timezone'
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

    const group = ({ metadata }) => {

        const remoteJids = metadata?.remoteJid || []
        const chatKeys = remoteJids.map(chat => Object.keys(chat)[0])
        const chatIds = chatKeys.map(key => key.split('@')[0])
        const groupJid = config?.msg?.key?.parameters?.details[0]?.messageKey?.remoteJid
        const groupId = groupJid?.split('@')[0]
        const chatIndex = chatIds.indexOf(groupId)

        return remoteJids[chatIndex]?.[groupJid]?.subject
    }

    console.log(chalk.rgb(123, 45, 67).bold(
        message_param
        .replaceAll('@botname', `${Config.parameters.bot[0].name} ::: ${Config.parameters.bot[0].username}`)
        .replaceAll('@user', Sender)
        .replaceAll('@entry', chalk.hex('#DEADED').bgGreen.bold(Text))
        .replaceAll('@hour', Hour())
        .replaceAll('@date', Date())
        .replaceAll('@group', isGroup? group({ metadata: Config?.parameters?.metadata?.store[0] }) : '')
    ))
}

//
export const createdData = async (Key, MP) => {

    var Config = JSON.parse(readFileSync("./root/configurations.json"))

    var jsonData = async () => `{"${Key.remoteJid}": ${JSON.stringify(await MP.groupMetadata(Key.remoteJid))}}`
    var a = await jsonData()
    var jsonObj = JSON.parse(a)

    Config.parameters.metadata.store[0].remoteJid.push(jsonObj)
    writeFileSync(Config.parameters.commands[1].paths.config_file, JSON.stringify(Config))
}


//
export const Named = ({ MP }) => {

    var Config = JSON.parse(readFileSync("./root/configurations.json"))
    const Path = Config.parameters.commands[1].paths.config_file
      
    function extractBotId(id) {
        const [, N_1ID = ''] = id.match(/(\w+)(@\w+)?/) || [];
        const [, N_2ID = ''] = N_1ID.match(/(\w+)(:\w+)?/) || [];
        return N_2ID;
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
    (async function teste(x){
        const reactions = ['0️⃣','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟','✅']
        await sendReaction({
            client: MP,
            param: message,
            answer: reactions[x]
        })
        if( x <= 10 ) teste( x + 1 )
    })(0)
}

//
export const getGroupData = ({ Type, groupMetadata, message }) => {

    var Config = JSON.parse(readFileSync("./root/configurations.json"))

    switch(Type){
        case 'isAdmin':
            var _argas = []
            groupMetadata[message.remoteJid].participants.forEach(user => {
                if(user.admin === 'admin' || user.admin === 'superadmin') _argas.push(user.id)
            })
            if(_argas.includes(message.participant)) return true
        break
        case 'isBotAdmin':
            var _argas = []
            groupMetadata[message.remoteJid].participants.forEach(user => {
                if(user.admin === 'admin' || user.admin === 'superadmin') _argas.push(user.id)
            })
            if(_argas.includes(`${Config.parameters.bot[0].id}@s.whatsapp.net`)) return true
        break
    }
    return false
}

//
export const Provided = ({ Modo, Parametro}) =>{

    var Config = JSON.parse(readFileSync("./root/configurations.json"))

    switch(Modo){
        case 'provide':
            Config.parameters.commands[0].execution[1].unsafe.push(Parametro)
            writeFileSync(Config.parameters.commands[1].paths.config_file, JSON.stringify(Config))
        break
        case 'unprovide':
        for (let i = 0; i < Config.parameters.commands[0].execution[1].unsafe.length; i++) {
            if (Config.parameters.commands[0].execution[1].unsafe[i] === Parametro){
                Config.parameters.commands[0].execution[1].unsafe.splice(i, 1)
                writeFileSync(Config.parameters.commands[1].paths.config_file, JSON.stringify(Config))
                break
            }
        }
        break
    }
}

//
export const Restricted = ({ Modo, Parametro}) =>{

    var Config = JSON.parse(readFileSync("./root/configurations.json"))

    switch(Modo){
        case 'restrict':
            Config.parameters.commands[0].execution[2].local.push(Parametro)
            writeFileSync(Config.parameters.commands[1].paths.config_file, JSON.stringify(Config))
        break
        case 'unrestrict':
        for (let i = 0; i < Config.parameters.commands[0].execution[2].local.length; i++) {
            if (Config.parameters.commands[0].execution[2].local[i] === Parametro){
                Config.parameters.commands[0].execution[2].local.splice(i, 1)
                writeFileSync(Config.parameters.commands[1].paths.config_file, JSON.stringify(Config))
                break
            }
        }
        break
    }
}

//
export const Owned = ({ Modo, Parametro}) =>{

    var Config = JSON.parse(readFileSync("./root/configurations.json"))

    switch(Modo){
        case 'addowner':
            Config.parameters.bot[0].owners.push(Parametro)
            writeFileSync(Config.parameters.commands[1].paths.config_file, JSON.stringify(Config))
        break
        case 'removeowner':
        for (let i = 0; i < Config.parameters.bot[0].owners.length; i++) {
            if (Config.parameters.bot[0].owners[i] === Parametro){
                Config.parameters.bot[0].owners.splice(i, 1)
                writeFileSync(Config.parameters.commands[1].paths.config_file, JSON.stringify(Config))
                break
            }
        }
        break
    }
}