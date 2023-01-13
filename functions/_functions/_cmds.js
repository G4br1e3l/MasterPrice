//
import { readFileSync, writeFileSync } from "fs"
import chalk from "chalk"

import { Menu } from '../_functions/menus/main.js'

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

    var set_me = JSON.parse(readFileSync("./root/config.json"))

    console.log(chalk.rgb(123, 45, 67).bold(
        message_param
        .replaceAll('@botname', `${set_me.bot.name} ::: ${set_me.bot.user_name}`)
        .replaceAll('@user', user)
        .replaceAll('@entry', chalk.hex('#DEADED').bgGreen.bold(entry))
        .replaceAll('@hour', Hour())
        .replaceAll('@date', Date())
    ))
}

//
export const Named = ({ MP }) => {

    var set_me = JSON.parse(readFileSync("./root/config.json"))

    let MP_ID = MP.authState?.me?.id ?? MP.user.id
    let MP_VName = MP.authState?.me?.verifiedName ?? MP.user.verifiedName
    let MP_Name = MP.authState?.me?.name ?? MP.user.name

    let N_name = MP_VName === MP_Name? MP_VName : MP_Name
    let N_1ID = MP_ID.includes("@")? MP_ID.split("@")[0] : MP_ID
    let N_2ID = N_1ID.includes(":")? N_1ID.split(":")[0] : N_1ID

    set_me.bot.user_id = N_2ID
    set_me.bot.user_name = N_name
    set_me.bot.verified = 'DONE'

    writeFileSync("./root/config.json", JSON.stringify(set_me))
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

    var getConfigProperties = JSON.parse(readFileSync("./root/config.json"))

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
            if(us.includes(`${getConfigProperties.bot.user_id}@s.whatsapp.net`)) return true
        break
    }
}

//
export const Provided = ({ Modo, Parametro}) =>{

    var getGroupProperties = JSON.parse(readFileSync('./database/commands/distributed.json'))

    switch(Modo){
        case 'provide':
            getGroupProperties.off.secure.push(Parametro)
            writeFileSync("./database/commands/distributed.json", JSON.stringify(getGroupProperties))
        break
        case 'unprovide':
        for (let i = 0; i < getGroupProperties.off.secure.length; i++) {
            if (getGroupProperties.off.secure[i] === Parametro){
                getGroupProperties.off.secure.splice(i, 1)
                writeFileSync("./database/commands/distributed.json", JSON.stringify(getGroupProperties))
                break
            }
        }
        break
    }
}

//
export const Restricted = ({ Modo, Parametro}) =>{

    var getGroupProperties = JSON.parse(readFileSync('./database/commands/distributed.json'))

    switch(Modo){
        case 'restrict':
            getGroupProperties.commands.only.group.push(Parametro)
            writeFileSync("./database/commands/distributed.json", JSON.stringify(getGroupProperties))
        break
        case 'unrestrict':
        for (let i = 0; i < getGroupProperties.commands.only.group.length; i++) {
            if (getGroupProperties.commands.only.group[i] === Parametro){
                getGroupProperties.commands.only.group.splice(i, 1)
                writeFileSync("./database/commands/distributed.json", JSON.stringify(getGroupProperties))
                break
            }
        }
        break
    }
}

//
export const Owned = ({ Modo, Parametro}) =>{

    var getConfigProperties = JSON.parse(readFileSync("./root/config.json"))

    switch(Modo){
        case 'addowner':
            getConfigProperties.bot.owners.push(Parametro)
            writeFileSync("./root/config.json", JSON.stringify(getConfigProperties))
        break
        case 'removeowner':
        for (let i = 0; i < getConfigProperties.bot.owners.length; i++) {
            if (getConfigProperties.bot.owners[i] === Parametro){
                getConfigProperties.bot.owners.splice(i, 1)
                writeFileSync("./root/config.json", JSON.stringify(getConfigProperties))
                break
            }
        }
        break
    }
}

//
export const sendCaptionImageQuoted = async ({ client, param, answer, path_image }) => {
    return await client.sendMessage(
        param.details[0].messageJid, {
            image: readFileSync(path_image),
            caption: answer,
            contextInfo: {
                mentionedJid: [param.details[0].messageJid]
            }
        },
        {
            quoted: param.details[0].messageQuoted
        }
    )
}

//
export const sendCaptionImageTyping = async ({ client, param, answer, path_image }) => {
    await client.presenceSubscribe(param.details[0].messageJid).then( async () => {
        await Delay(2000).then( async () =>{
            await client.sendPresenceUpdate('composing', param.details[0].messageJid).then( async () => {
                await Delay(500).then( async ()=> {
                    await client.sendPresenceUpdate('paused', param.details[0].messageJid).then( async () => {
                        return await client.sendMessage(
                            param.details[0].messageJid, {
                                image: readFileSync(path_image),
                                caption: answer,
                                contextInfo: {
                                    mentionedJid: [param.details[0].messageJid]
                                }
                            },
                        )
                    })
                })
            })
        })
    })
}

//
export const sendCaptionImageTypingQuoted = async ({ client, param, answer, path_image }) => {
    await client.presenceSubscribe(param.details[0].messageJid).then( async () => {
        await Delay(2000).then( async () =>{
            await client.sendPresenceUpdate('composing', param.details[0].messageJid).then( async () => {
                await Delay(500).then( async ()=> {
                    await client.sendPresenceUpdate('paused', param.details[0].messageJid).then( async () => {
                        return await client.sendMessage(
                            param.details[0].messageJid, {
                                image: readFileSync(path_image),
                                caption: answer,
                                contextInfo: {
                                    mentionedJid: [param.details[0].messageJid]
                                }
                            },
                            {
                                quoted: param.details[0].messageQuoted
                            }
                        )
                    })
                })
            })
        })
    })
}

//
export const sendMessageQuoted = async ({ client, param, answer }) => {
    return await client.sendMessage(
        param.details[0].messageJid, {
            text: answer,
            fromMe: false,
            contextInfo: {
                mentionedJid: [param.details[0].messageJid]
            }
        },
        {
            quoted: param.details[0].messageQuoted
        }
    )
}

//
export const sendMessage = async ({ client, param, answer }) => {
    return await client.sendMessage(
        param.details[0].messageJid, {
            text: answer,
            contextInfo: {
                mentionedJid: [param.details[0].messageJid]
            }
        },
    )
}

//
export const sendMessageTyping = async ({ client, param, answer }) => {
    await client.presenceSubscribe(param.details[0].messageJid).then( async () => {
        await Delay(2000).then( async () =>{
            await client.sendPresenceUpdate('composing', param.details[0].messageJid).then( async () => {
                await Delay(500).then( async ()=> {
                    await client.sendPresenceUpdate('paused', param.details[0].messageJid).then( async () => {
                        return await client.sendMessage(
                            param.details[0].messageJid, {
                                text: answer,
                                contextInfo: {
                                    mentionedJid: [param.details[0].messageJid]
                                }
                            },
                        )
                    })
                })
            })
        })
    })
}

//
export const sendMessageTypingQuoted = async ({ client, param, answer }) => {
    await client.presenceSubscribe(param.details[0].messageJid).then( async () => {
        await Delay(2000).then( async () =>{
            await client.sendPresenceUpdate('composing', param.details[0].messageJid).then( async () => {
                await Delay(500).then( async ()=> {
                    await client.sendPresenceUpdate('paused', param.details[0].messageJid).then( async () => {
                        return await client.sendMessage(
                            param.details[0].messageJid, {
                                text: answer,
                                contextInfo: {
                                    mentionedJid: [param.details[0].messageJid]
                                }
                            },
                            {
                                quoted: param.details[0].messageQuoted
                            }
                        )
                    })
                })
            })
        })
    })
}

//
export const sendCaptionImage = async ({ client, param, answer, path_image }) => {
    return await client.sendMessage(
        param.details[0].messageJid, {
            image: readFileSync(path_image),
            caption: answer,
            contextInfo: {
                mentionedJid: [param.details[0].messageJid]
            }
        },
    )
}

//
export const sendReaction = async ({ client, param, answer }) => {
    return await client.sendMessage(
        param.details[0].messageJid, {
            react: {
                key: {
                    remoteJid: param.details[0].messageJid,
                    fromMe: false,
                    id: param.details[0].messageId,
                    participant: [`${param.details[1].sender.messageNumber}@s.whatsapp.net`]
                },
                text: answer,
            }
        }
    )
}

//
export const sectionMenu = async ({ client, param }) => {

    var getConfigProperties = JSON.parse(readFileSync("./root/config.json"))

    return await client.sendMessage(param, {
        text: Menu(),
        footer: `_${getConfigProperties.bot.name} ☆ https://github.com/G4br1e3l/MasterPrice_`,
        title: `_*☆ ${getConfigProperties.bot.user_name} ☆*_`,
        buttonText: `🄾🄿🅃🄸🄾🄽🅂`,
        sections: [{
                title: `🄾🄿🅃🄸🄾🄽🅂 1 COMANDOS DE DONO`,
                rows: [{
                        title: `☆ Provide`,
                        rowId: `${getConfigProperties.prefix}provide`,
                        description: `☆ Comando para fazer com que comandos de administradores sejam utilizados por membros comuns.`
                    },{
                        title: `☆ Unprovide`,
                        rowId: `${getConfigProperties.prefix}unprovide`,
                        description: `☆ Comando para remover os comandos adicionados para uso dos membros comuns.`
                    },{
                        title: `☆ Restrict`,
                        rowId: `${getConfigProperties.prefix}restrict`,
                        description: `☆ Comando para disponibilizar um comando para uso exclusivo em grupos.`
                    },{
                        title: `☆ Unrestrict`,
                        rowId: `${getConfigProperties.prefix}unrestrict`,
                        description: `☆ Comando para remover os comandos adicionados para uso exclusivo em grupos.`
                    },{
                        title: `☆ Addowner`,
                        rowId: `${getConfigProperties.prefix}addowner`,
                        description: `☆ Comando para adicionar numeros para que também usem as funções de dono do bot.`
                    },{
                        title: `☆ Removeowner`,
                        rowId: `${getConfigProperties.prefix}removeowner`,
                        description: `☆ Comando para remover os numeros adicionados para uso das funções de dono do bot.`
                    }
                ]
            },{
                title: `🄾🄿🅃🄸🄾🄽🅂 2 COMANDOS DE ADMINISTRADOR`,
                rows: [{
                        title: `KKKKKKKKKKKKKKK`,
                        rowId: `3`,
                        description: `??????????????????`
                    },{
                        title: `KKKKKKKKKKKKKKK`,
                        rowId: `4`,
                        description: `??????????????????`
                    }
                ]
            },{
                title: `🄾🄿🅃🄸🄾🄽🅂 3 COMANDOS DE MEMBRO`,
                rows: [{
                        title: `KKKKKKKKKKKKKKK`,
                        rowId: `5`,
                        description: `??????????????????`
                    },{
                        title: `KKKKKKKKKKKKKKK`,
                        rowId: `6`,
                        description: `??????????????????`
                    }
                ]
            },{
                title: `🄾🄿🅃🄸🄾🄽🅂 4 BRINCADEIRAS`,
                rows: [{
                        title: `KKKKKKKKKKKKKKK`,
                        rowId: `7`,
                        description: `??????????????????`
                    },{
                        title: `KKKKKKKKKKKKKKK`,
                        rowId: `8`,
                        description: `??????????????????`
                    }
                ]
            },{
                title: `🄾🄿🅃🄸🄾🄽🅂 5 EFEITOS`,
                rows: [{
                        title: `KKKKKKKKKKKKKKK`,
                        rowId: `9`,
                        description: `??????????????????`
                    },{
                        title: `KKKKKKKKKKKKKKK`,
                        rowId: `10`,
                        description: `??????????????????`
                    }
                ]
            },{
                title: `🄾🄿🅃🄸🄾🄽🅂 6 ADULTO`,
                rows: [{
                        title: `KKKKKKKKKKKKKKK`,
                        rowId: `11`,
                        description: `??????????????????`
                    },{
                        title: `KKKKKKKKKKKKKKK`,
                        rowId: `12`,
                        description: `??????????????????`
                    }
                ]
            },
        ]
    })
}

/*
await MP.sendMessage(remoteJid, {
    image: readFileSync(getConfigProperties.pathimage.menu),
    caption: Menu(),
    footer: getConfigProperties.bot.name,
    buttons: [
        {buttonId: `opts`, buttonText: {displayText: 'SLA'}, type: 1},
    ],
    headerType: 4
})*/

/*
await MP.sendMessage(remoteJid, {
    text: Menu(),
    footer: getConfigProperties.bot.name,
    buttons: [
        {buttonId: '0', buttonText: {displayText: 'Criador -<'}, type: 1},
        {buttonId: '1', buttonText: {displayText: 'Doar -<'}, type: 1},
        {buttonId: '2', buttonText: {displayText: 'Informações -<'}, type: 1},
        ],
    headerType: 1
})*/