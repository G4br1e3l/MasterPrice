//import :p
import { readFileSync } from 'fs'

//commands functions
import {
    Spam,
    isSpam,
    Cooldown,
    isColling,
    DownColling,
    sizeCooldown,
    doIgnore,
    IsIgnoring,
    TenCount
} from './_functions/_functionsMessage.js'

import {
    sendReaction,
    sendMessageQuoted,
    Type,
} from './_functions/_sendMessage.js'

import { sectionMenu } from './_functions/menus/_scriptMessage.js'

//classes functions
import { Provide } from './_commands/_provide.js'
import { Restrict } from './_commands/_restrict.js'
import { Owner } from './_commands/_owner.js'
import { GPT } from './_commands/_gpt.js'

const isOwner = async ({ MP, message, Config, Sender }) => {
    if(!Config.parameters.bot[0].owners.includes(Sender.messageNumber)) {
        return await sendMessageQuoted({
            client: MP,
            param: message,
            answer: Config.parameters.commands[2].messages.handler[0].onnoowner
        })
        .finally( async () => {
            await sendReaction({
                client: MP,
                param: message,
                answer: Config.parameters.commands[0].execution[0].onerror
            })
        })
    }
}

//
export const commands = async ({ MP, typed }) => {

    var Config = JSON.parse(readFileSync('./root/configurations.json', 'utf8'))

    const { ...Boolean } = typed.boolean || {}
    const { ...message } = typed.parameters || {}
    const { messageText: Message, ...Sender } = typed.parameters.details[1].sender || {}
    const { messageJid: remoteJid } = typed.parameters.details[0] || {}

    const Prefix = Config.parameters.bot[1].prefix.set

    const _args = (function extractArgs({ m, prefix }) {
        const regex = new RegExp(`^${prefix}(.+)$`, 'i')
        const match = m.match(regex)
        if (!match) return []
        const args = match[1].trim().split(/\s+/)
        return args.map(arg => arg.toLowerCase())
    })({ m: Message, prefix: Prefix })

    async function run ({ _args }){

        const NoBreak = (function sendMessageWithCooldownCheck ({ MP, message, remoteJid }) {
            if(IsIgnoring(remoteJid)) {
                return 'Spamming!'
            } else if (isColling(remoteJid)) {
                sendMessageQuoted({
                    client: MP,
                    param: message,
                    answer: Config.parameters.commands[2].messages.handler[0].oncooldown,
                }).then(async () => {
                    await sendReaction({
                        client: MP,
                        param: message,
                        answer: Config.parameters.commands[0].execution[0].ongoing,
                    });
                }).then( async () => doIgnore(remoteJid))

                return 'Awaiting the queue!'

            } else if (isSpam(remoteJid)) {
                sendMessageQuoted({
                    client: MP,
                    param: message,
                    answer: Config.parameters.commands[2].messages.handler[0].onflood
                }).then( async () => {
                    await sendReaction({
                        client: MP,
                        param: message,
                        answer: Config.parameters.commands[0].execution[0].onerror
                    })
                }).then( async () => doIgnore(remoteJid))

                return 'Spamming?'

            } else if (sizeCooldown().size >= 2) {
                sendMessageQuoted({
                    client: MP,
                    param: message,
                    answer: Config.parameters.commands[2].messages.handler[0].onawaitqueue,
                }).then(async () => {
                    await sendReaction({
                        client: MP,
                        param: message,
                        answer: Config.parameters.commands[0].execution[0].ongoing,
                    });
                }).then( async () => doIgnore(remoteJid))

                return 'More than 1 Jid Spamming!'

            } else {
                Type({ client: MP, messageJid: remoteJid })
                Spam(remoteJid)
                return 'Clear.'
            }
        })({ MP: MP, message: message, remoteJid: remoteJid })

        if(NoBreak !== 'Clear.') return console.log(`The user from ${remoteJid} was spamming! Blocking commands.`)

        const Permission = (function checkCommandPermissions ({ client, message, _args, Boolean, Config })  {
            if (Config.parameters.commands[0].execution[2].local.includes(_args[0]) && !Boolean.isGroup) {
                sendMessageQuoted({
                    client: client,
                    param: message,
                    answer: Config.parameters.commands[2].messages.handler[0].ononlygroup,
                }).then(async () => {
                    await sendReaction({
                        client: client,
                        param: message,
                        answer: Config.parameters.commands[0].execution[0].onerror,
                    })
                })

                return 'Cammon user using group only command on private chat.'

            } else if (!Config.parameters.commands[0].execution[1].unsafe.includes(_args[0])) {

                if (!Boolean.isAdmin && !Boolean.isOwner) {
                    sendMessageQuoted({
                        client: client,
                        param: message,
                        answer: Config.parameters.commands[2].messages.handler[0].onstopp,
                    }).then(async () => {
                        await sendReaction({
                            client: client,
                            param: message,
                            answer: Config.parameters.commands[0].execution[0].onerror,
                        })
                    })

                    return 'Cammon member using owner commands.'

                } else if (Boolean.isAdmin && !Boolean.isOwner) {
                    sendMessageQuoted({
                        client: client,
                        param: message,
                        answer: Config.parameters.commands[2].messages.handler[0].ontax,
                    }).then(async () => {
                        await sendReaction({
                            client: client,
                            param: message,
                            answer: Config.parameters.commands[0].execution[0].onerror,
                        })
                    })

                    return 'Administrator trying to use owner commands.'

                } else {
                    Type({ client: MP, messageJid: remoteJid })
                    return 'Clear.'
                }
            } else {
                Type({ client: MP, messageJid: remoteJid })
                return 'Clear.'
            }
        })({ client: MP, message: message, _args: _args, Boolean: Boolean, Config: Config})

        if(Permission !== 'Clear.') return console.log(`The user from ${remoteJid} was trying to use a command without permission. Code: "${Permission}"`)

        Cooldown(remoteJid)

        switch(_args[0]){
            case 'menu':
                await sectionMenu({ client: MP, param: remoteJid})
                .then( async () => {
                    await sendReaction({
                        client: MP,
                        param: message,
                        answer: Config.parameters.commands[0].execution[0].onsucess
                    })
                })
                .then(() => Spam(remoteJid))
            break
            case 'gpt':
                await sendMessageQuoted({
                    client: MP,
                    param: message,
                    answer: 'Aguarde. Resposta sendo pesquisada.'
                })

                await GPT({ client: MP, message: message, _args: _args, remoteJid: remoteJid, typed: typed })
            break
            case 'provide':
            case 'unprovide':
                if(await isOwner ({ MP: MP, message: message, Config: Config, Sender: Sender })) return
                await Provide({ MP:MP, message: message, _args:_args })
            break
            case 'restrict':
            case 'unrestrict':
                if(await isOwner ({ MP: MP, message: message, Config: Config, Sender: Sender })) return
                await Restrict({ MP:MP, message: message, _args:_args })
            break
            case 'addowner':
            case 'removeowner':
                if(await isOwner ({ MP: MP, message: message, Config: Config, Sender: Sender })) return
                await Owner({ MP:MP, message: message, _args:_args })
            break
            default:
                await sendMessageQuoted({
                    client: MP,
                    param: message,
                    answer: Config.parameters.commands[2].messages.handler[0].onnotfound
                }).then( async () => {
                    await sendReaction({
                        client: MP,
                        param: message,
                        answer: Config.parameters.commands[0].execution[0].onerror
                    })
                })
                .then(() => Spam(remoteJid))
            return
        }

        DownColling(remoteJid)
    }

    await run({ _args: _args })
    return
}
