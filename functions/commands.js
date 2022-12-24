//
import { readFileSync } from "fs"

//
const MSG = JSON.parse(readFileSync('./root/messages.json', 'utf8'))

//
import { Menu } from './_functions/menus/main.js'
import { Spam, isSpam, Key, Cooldown, isColling, DownColling, sizeCooldown } from './_functions/_dlay.js'
import { TenCount, getGroupData } from './_functions/_cmds.js'
import { Dimiss } from './_commands/_make.js'

//functions response
import { sendReaction } from './_functions/_rect.js'

import { sendMessage } from './_functions/_smss.js'
import { sendMessageQuoted } from './_functions/_smsq.js'
import { sendMessageTyping } from './_functions/_smst.js'
import { sendMessageTypingQuoted } from './_functions/_smtq.js'

import { sendCaptionImage } from './_functions/_sqnd.js'
import { sendCaptionImageQuoted } from './_functions/_send.js'
import { sendCaptionImageTyping } from './_functions/_senk.js'
import { sendCaptionImageTypingQuoted } from './_functions/_senp.js'

//
export const commands = async ({ MP, typed, group_data, message }) => {

    var set_me = JSON.parse(readFileSync("./root/config.json"))
    var Distributed = JSON.parse(readFileSync("./database/commands/distributed.json"))

    const isAdmin = async () => {
        if(!getGroupData({ Type: 'isAdmin', groupMetadata: group_data, message: message})) {
            return await sendMessageQuoted({
                client: MP,
                param: message,
                answer: MSG.commands.noprivilege
            })
            .finally( async () => {
                await sendReaction({
                    client: MP,
                    param: message,
                    answer: set_me.reaction.error
                })
            })
        }
    }

    const isBotAdmin = async () => { 
        if(!getGroupData({ Type: 'isBotAdmin', groupMetadata: group_data, message: message})) {
            return await sendMessageQuoted({
                client: MP,
                param: message,
                answer: MSG.commands.nopermission
            })
            .finally( async () => {
                await sendReaction({
                    client: MP,
                    param: message,
                    answer: set_me.reaction.error
                })
            })
        }
    }

    if(isSpam(Key(message.messages[0]).remoteJid)) {
        return await sendMessageQuoted({
            client: MP,
            param: message,
            answer: MSG.commands.flood
        })
        .then( async () => {
            await sendReaction({
                client: MP,
                param: message,
                answer: set_me.reaction.error
            })
        })
    }

    var args = (typed.split(set_me.prefix)[1]).trim().split(/ +/)
    const _args = []
    args.forEach(word => {
        _args.push(word.toLowerCase())
    })

    async function run ({_args}){

        if(sizeCooldown().size >= 2) {
            return await sendMessageQuoted({
                client: MP,
                param: message,
                answer: MSG.commands.awaitqueue
            })
            .then( async () => {
                await sendReaction({
                    client: MP,
                    param: message,
                    answer: set_me.reaction.error
                })
            })
        }

        if(isColling(Key(message.messages[0]).remoteJid)) {
            return await sendMessageQuoted({
                client: MP,
                param: message,
                answer: MSG.commands.cooldown
            })
            .then( async () => {
                await sendReaction({
                    client: MP,
                    param: message,
                    answer: set_me.reaction.error
                })
            })
        }

        if(!Distributed.off.secure.includes(_args[0])){
            if(!group_data) {
                return await sendMessageQuoted({
                    client: MP,
                    param: message,
                    answer: 'Este comando pode apenas ser utilizado em grupos!'
                })
                .finally( async () => {
                    await sendReaction({
                        client: MP,
                        param: message,
                        answer: set_me.reaction.error
                    })
                })
            }

            if(await isBotAdmin() || await isAdmin()) return
        }

        switch(_args[0]){
            case 'make':
            case 'dimiss':
                await Dimiss({ MP:MP, message:message, _args:_args })
            break
            case 'funny':
                if(await isBotAdmin() || await isAdmin()) return
                TenCount({ MP: MP, message: message })
            break
            case 'menu':
                await sendCaptionImageQuoted({
                    client: MP,
                    param: message,
                    answer: Menu(),
                    path_image: set_me.pathimage.menu
                })
                .finally( async () => {
                    await sendReaction({
                        client: MP,
                        param: message,
                        answer: set_me.reaction.success
                    })
                })
            break
            case 'teste1':
                await sendMessageTypingQuoted({
                    client: MP,
                    param: message,
                    answer: 'Por favor.'
                })
            break
            case 'teste2':
                await sendMessageTyping({
                    client: MP,
                    param: message,
                    answer: 'Por favor.'
                })
            break
            case 'teste3':
                await sendMessageQuoted({
                    client: MP,
                    param: message,
                    answer: 'Por favor.'
                })
            break
            case 'teste4':
                await sendMessage({
                    client: MP,
                    param: message,
                    answer: 'Por favor.'
                })
            break
            case 'teste5':
                await sendCaptionImage({
                    client: MP,
                    param: message,
                    answer: Menu(),
                    path_image: set_me.pathimage.menu
                })
            break
            case 'teste6':
                await sendCaptionImageTyping({
                    client: MP,
                    param: message,
                    answer: Menu(),
                    path_image: set_me.pathimage.menu
                })
            break
            case 'teste7':
                await sendCaptionImageTypingQuoted({
                    client: MP,
                    param: message,
                    answer: Menu(),
                    path_image: set_me.pathimage.menu
                })
            break
            default:
                await sendMessageQuoted({
                    client: MP,
                    param: message,
                    answer: MSG.commands.notfound
                })
                .then( async () => {
                    await sendReaction({
                        client: MP,
                        param: message,
                        answer: set_me.reaction.error
                    })
                })
                .finally(() => Spam(Key(message.messages[0]).remoteJid))
            break
        }

        DownColling(Key(message.messages[0]).remoteJid)
    }
    await run({_args: _args})
    .then(() => Cooldown(Key(message.messages[0]).remoteJid))
    .finally(() => { return })

}