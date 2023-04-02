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
} from './_functions/_functionsMessage.js'

import {
    sendReaction,
    sendMessageQuoted,
} from './_functions/_sendMessage.js'

import { sectionMenu } from './_functions/menus/_scriptMessage.js'
import { Configuration, OpenAIApi } from "openai"

//classes functions
import { Provide } from './_commands/_provide.js'
import { Restrict } from './_commands/_restrict.js'
import { Owner } from './_commands/_owner.js'

//
export const commands = async ({ MP, typed }) => {

    var Config = JSON.parse(readFileSync('./root/configurations.json', 'utf8'))

    const Options = typed ?? ''
    const remoteJid = Options.msg.key.parameters.details[0].messageJid ?? ''
    const Sender = Options.msg.key.parameters.details[1].sender ?? ''
    const Message = Sender.messageText ?? ''
    const message = Options.msg.key.parameters ?? ''
    const Boolean = Options.msg.key.boolean

    if(isSpam(remoteJid)) {
        return await sendMessageQuoted({
            client: MP,
            param: message,
            answer: Config.parameters.commands[2].messages.handler[0].onflood
        })
        .then( async () => {
            await sendReaction({
                client: MP,
                param: message,
                answer: Config.parameters.commands[0].execution[0].onerror
            })
        })
    }

    function extractArgs(message, prefix) {
        const regex = new RegExp(`^${prefix}(.+)$`, 'i')
        const match = message.match(regex)
        if (!match) return []
        const args = match[1].trim().split(/\s+/)
        return args.map(arg => arg.toLowerCase())
    }
      
    const _args = extractArgs(Message, Config.parameters.bot[1].prefix.set)

    async function run ({ _args }){

        const isOwner = async () => {
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

        if(sizeCooldown().size >= 2) {
            return await sendMessageQuoted({
                client: MP,
                param: message,
                answer: Config.parameters.commands[2].messages.handler[0].onawaitqueue
            })
            .then( async () => {
                await sendReaction({
                    client: MP,
                    param: message,
                    answer: Config.parameters.commands[0].execution[0].ongoing
                })
            })
        }

        if(isColling(remoteJid)) {
            return await sendMessageQuoted({
                client: MP,
                param: message,
                answer: Config.parameters.commands[2].messages.handler[0].oncooldown
            })
            .then( async () => {
                await sendReaction({
                    client: MP,
                    param: message,
                    answer: Config.parameters.commands[0].execution[0].ongoing
                })
            })
        }

        if(Config.parameters.commands[0].execution[2].local.includes(_args[0]) && !Boolean.isGroup) {
            return await sendMessageQuoted({
                client: MP,
                param: message,
                answer: Config.parameters.commands[2].messages.handler[0].ononlygroup
            })
            .finally( async () => {
                await sendReaction({
                    client: MP,
                    param: message,
                    answer: Config.parameters.commands[0].execution[0].onerror
                })
            })
        }

        if(!Config.parameters.commands[0].execution[1].unsafe.includes(_args[0])){
            if(!Boolean.isAdmin && !Boolean.isOwner) {
                return await sendMessageQuoted({
                    client: MP,
                    param: message,
                    answer: Config.parameters.commands[2].messages.handler[0].onstopp
                })
                .then( async () => {
                    await sendReaction({
                        client: MP,
                        param: message,
                        answer: Config.parameters.commands[0].execution[0].onerror
                    })
                })
            }
            if(Boolean.isAdmin && !Boolean.isOwner){
                return await sendMessageQuoted({
                    client: MP,
                    param: message,
                    answer: Config.parameters.commands[2].messages.handler[0].ontax
                })
                .then( async () => {
                    await sendReaction({
                        client: MP,
                        param: message,
                        answer: Config.parameters.commands[0].execution[0].onerror
                    })
                })
            }
        }

        switch(_args[0]){
            case '':
                await sectionMenu({ client: MP, param: remoteJid})
            break
            case 'gpt':
                if (!_args[1]) return await sendMessageQuoted({
                    client: MP,
                    param: message,
                    answer: 'Tente inserindo alguma pergunta...'
                })
                .then( async () => {
                    await sendReaction({
                        client: MP,
                        param: message,
                        answer: Config.parameters.commands[0].execution[0].onerror
                    })
                })
                .finally(() => Spam(remoteJid))

                const config = new Configuration({
                    organization: "",
                    apiKey: "",
                    username: '',
                    password: '',
                })

                const openai = new OpenAIApi(config)

                console.log(openai)

                const response = async (x) => await openai.createChatCompletion({
                    model: "gpt-3.5-turbo",
                    messages: [{role: "user", content: x}],
                })

                const resposta = await response(typed.msg.key.parameters.details[1].sender.messageText.slice(5))

                return await sendMessageQuoted({
                    client: MP,
                    param: message,
                    answer: resposta
                })
                .then( async () => {
                    await sendReaction({
                        client: MP,
                        param: message,
                        answer: Config.parameters.commands[0].execution[0].onsucess
                    })
                })
                .finally(() => Spam(remoteJid))
            break
            // 
            // 
            case 'provide':
            case 'unprovide':
                if(await isOwner()) return
                await Provide({ MP:MP, message: message, _args:_args })
            break
            case 'restrict':
            case 'unrestrict':
                if(await isOwner()) return
                await Restrict({ MP:MP, message: message, _args:_args })
            break
            case 'addowner':
            case 'removeowner':
                if(await isOwner()) return
                await Owner({ MP:MP, message: message, _args:_args })
            break
            default:
                await sendMessageQuoted({
                    client: MP,
                    param: message,
                    answer: Config.parameters.commands[2].messages.handler[0].onnotfound
                })
                .then( async () => {
                    await sendReaction({
                        client: MP,
                        param: message,
                        answer: Config.parameters.commands[0].execution[0].onerror
                    })
                })
                .finally(() => Spam(remoteJid))
            break
        }

        DownColling(remoteJid)
    }

    await run({ _args: _args })
    .then(() => Cooldown(remoteJid))
    .finally(() => { return })
}