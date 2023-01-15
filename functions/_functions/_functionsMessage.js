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
export const console_message = ({ message_param, user, entry }) =>{

    var Config = JSON.parse(readFileSync("./root/configurations.json"))

    console.log(chalk.rgb(123, 45, 67).bold(
        message_param
        .replaceAll('@botname', `${Config.parameters.bot[0].name} ::: ${Config.parameters.bot[0].username}`)
        .replaceAll('@user', user)
        .replaceAll('@entry', chalk.hex('#DEADED').bgGreen.bold(entry))
        .replaceAll('@hour', Hour())
        .replaceAll('@date', Date())
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

    let MP_ID = MP.authState?.me?.id ?? MP.user.id
    let MP_VName = (MP.authState?.me?.verifiedName ?? MP.user.verifiedName) || (MP.authState?.me?.name ?? MP.user.name)

    let N_1ID = MP_ID.includes("@")? MP_ID.split("@")[0] : MP_ID
    let N_2ID = N_1ID.includes(":")? N_1ID.split(":")[0] : N_1ID

    Config.parameters.bot[0].id = N_2ID
    Config.parameters.bot[0].username = MP_VName
    Config.parameters.bot[0].trusted = 'trusted'

    writeFileSync(Config.parameters.commands[1].paths.config_file, JSON.stringify(Config))
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
            let u = []
            for (let i of groupMetadata.participants) {
                if(i.admin === 'admin' || i.admin === 'superadmin') u.push(i.id)
            }
            if(u.includes(message.participant)) return true
        break
        case 'isBotAdmin':
            let us = []
            for (let i of groupMetadata.participants) {
                if(i.admin === 'admin' || i.admin === 'superadmin') us.push(i.id)
            }
            if(us.includes(`${Config.parameters.bot[0].id}@s.whatsapp.net`)) return true
        break
    }
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