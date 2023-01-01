//import :p
import { readFileSync } from "fs"

//constant imports
const MSG = JSON.parse(readFileSync('./root/messages.json', 'utf8'))

//client functions
import { sendReaction } from './_functions/_rect.js'
import { sendMessageQuoted } from './_functions/_smsq.js'

//commands functions
import { Spam, isSpam, Key, Cooldown, isColling, DownColling, sizeCooldown } from './_functions/_dlay.js'
import { getGroupData } from './_functions/_cmds.js'

//classes functions
import { Provide } from './_commands/_provide.js'
import { Restrict } from './_commands/_restrict.js'
import { Owner } from './_commands/_owner.js'


/*
import { Menu } from './_functions/menus/main.js'

import { sendMessage } from './_functions/_smss.js'
import { sendMessageTyping } from './_functions/_smst.js'
import { sendMessageTypingQuoted } from './_functions/_smtq.js'
import { sendMessage } from './_functions/_smss.js'
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

    const Message = typed.msg.text

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
            (Key(Message).participant ??
            Key(Message).remoteJid).split('@')[0]
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

    if(isSpam(Key(Message).remoteJid)) {
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

    const _args = []
    var args = (typed.split(getConfigProperties.prefix)[1]).trim().split(/ +/)
    args.forEach(word => { _args.push(word.toLowerCase()) })

    async function run ({ _args }){

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

        if(isColling(Key(Message).remoteJid)) {
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
            case '':
                // send a buttons message!
                const buttons = [
                {buttonId: 'id1', buttonText: {displayText: 'Button 1'}, type: 1},
                {buttonId: 'id2', buttonText: {displayText: 'Button 2'}, type: 1},
                {buttonId: 'id3', buttonText: {displayText: 'Button 3'}, type: 1}
                ]

                var buttonMessage = {
                text: "Hi it's button message",
                footer: 'Hello World',
                buttons: buttons,
                headerType: 1
                }

                const aaa = message.messages[0]
                let Messagea = Key(aaa)

                await MP.sendMessage(Messagea.remoteJid, buttonMessage)
                const sections = [
                {
                title: "Section 1",
                rows: [
                {title: "Option 1", rowId: "option1"},
                {title: "Option 2", rowId: "option2", description: "This is a description"}
                ]
                },
                {
                title: "Section 2",
                rows: [
                {title: "Option 3", rowId: "option3"},
                {title: "Option 4", rowId: "option4", description: "This is a description V2"}
                ]
                },
                ]

                const listMessage = {
                text: "This is a list",
                footer: "nice footer, link: https://google.com",
                title: "Amazing boldfaced list title",
                buttonText: "Required, text on the button to view the list",
                sections
                }
                await MP.sendMessage(Messagea.remoteJid, listMessage)

                const needhelpmenu = `!!!!!!!!!!!!!!!!!!!!!!`
     
                let butRun = [
                {buttonId: `!!!!!!!!!!!!!!!!!!!!!!`, buttonText: {displayText: '!!!!!!!!!!!!!!!!!!!!!!'}, type: 1}
                ]
                var buttonMessage = {
                    image: readFileSync(getConfigProperties.pathimage.menu),
                    caption: needhelpmenu,
                    footer: `!!!!!!!!!!!!!!!!!!!!!!`,
                    buttons: butRun,
                    headerType: 4
                }
                await MP.sendMessage(Messagea.remoteJid, buttonMessage)

            break
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
                .finally(() => Spam(Key(Message).remoteJid))
            break
        }

        DownColling(Key(Message).remoteJid)
    }
    await run({ _args: _args })
    .then(() => Cooldown(Key(Message).remoteJid))
    .finally(() => { return })
}