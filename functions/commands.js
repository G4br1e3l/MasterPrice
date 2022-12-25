//
import { readFileSync } from "fs"

//
const MSG = JSON.parse(readFileSync('./root/messages.json', 'utf8'))

//
import { Spam, isSpam, Key, Cooldown, isColling, DownColling, sizeCooldown } from './_functions/_dlay.js'
import { getGroupData } from './_functions/_cmds.js'
import { Provide } from './_commands/_provide.js'
import { Restrict } from './_commands/_restrict.js'
import { Owner } from './_commands/_owner.js'

//functions response
import { sendReaction } from './_functions/_rect.js'
import { sendMessageQuoted } from './_functions/_smsq.js'

/*
import { Menu } from './_functions/menus/main.js'

import { sendMessage } from './_functions/_smss.js'
import { sendMessageTyping } from './_functions/_smst.js'
import { sendMessageTypingQuoted } from './_functions/_smtq.js'

import { sendCaptionImage } from './_functions/_sqnd.js'
import { sendCaptionImageQuoted } from './_functions/_send.js'
import { sendCaptionImageTyping } from './_functions/_senk.js'
import { sendCaptionImageTypingQuoted } from './_functions/_senp.js'
*/

//
export const commands = async ({ MP, typed, group_data, message }) => {

    var getConfigProperties = JSON.parse(readFileSync("./root/config.json"))
    var getGroupProperties = JSON.parse(readFileSync("./database/commands/distributed.json"))

    const isAdmin = async () => {
        if(group_data) {
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
                        answer: getConfigProperties.reaction.error
                    })
                })
            }
        }
        return false
    }

    const isBotAdmin = async () => {
        if(group_data) {
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
                        answer: getConfigProperties.reaction.error
                    })
                })
            }
        }
        return false
    }

    const isOwner = async () => {
        if(!getConfigProperties.bot.owners.includes(
            (Key(message.messages[0]).participant ?? 
            Key(message.messages[0]).remoteJid).split('@')[0]
            )) {
            return await sendMessageQuoted({
                client: MP,
                param: message,
                answer: MSG.commands.noowner
            })
            .finally( async () => {
                await sendReaction({
                    client: MP,
                    param: message,
                    answer: getConfigProperties.reaction.error
                })
            })
        }
        return false
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
                answer: getConfigProperties.reaction.error
            })
        })
    }

    var args = (typed.split(getConfigProperties.prefix)[1]).trim().split(/ +/)
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
                    answer: getConfigProperties.reaction.error
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
                    answer: getConfigProperties.reaction.error
                })
            })
        }

        if(getGroupProperties.commands.only.group.includes(_args[0])) {
            return await sendMessageQuoted({
                client: MP,
                param: message,
                answer: 'Este comando pode apenas ser utilizado em grupos!'
            })
            .finally( async () => {
                await sendReaction({
                    client: MP,
                    param: message,
                    answer: getConfigProperties.reaction.error
                })
            })
        }

        if(!getGroupProperties.off.secure.includes(_args[0])){
            if(await isBotAdmin() || await isAdmin()) return
        }

        switch(_args[0]){
            case 'provide':
            case 'unprovide':
                if(await isOwner()) return
                await Provide({ MP:MP, message:message, _args:_args })
            break
            case 'restrict':
            case 'unrestrict':
                if(await isOwner()) return
                await Restrict({ MP:MP, message:message, _args:_args })
            break
            case 'addowner':
            case 'removeowner':
                if(await isOwner()) return
                await Owner({ MP:MP, message:message, _args:_args })
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
                        answer: getConfigProperties.reaction.error
                    })
                })
                .finally(() => Spam(Key(message.messages[0]).remoteJid))
            break
        }

        DownColling(Key(message.messages[0]).remoteJid)
    }
    await run({ _args: _args })
    .then(() => Cooldown(Key(message.messages[0]).remoteJid))
    .finally(() => { return })
}