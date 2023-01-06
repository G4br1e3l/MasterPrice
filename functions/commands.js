//import :p
import { readFileSync } from 'fs'

//constant imports
const MSG = JSON.parse(readFileSync('./root/messages.json', 'utf8'))

//commands functions
import {
    Spam, 
    isSpam, 
    Cooldown, 
    isColling, 
    DownColling, 
    sizeCooldown, 
    sendReaction, 
    sendMessageQuoted,
    sectionMenu
} from './_functions/_cmds.js'

//classes functions
import { Provide } from './_commands/_provide.js'
import { Restrict } from './_commands/_restrict.js'
import { Owner } from './_commands/_owner.js'

//
export const commands = async ({ MP, typed }) => {

    var getConfigProperties = JSON.parse(readFileSync(`./root/config.json`))
    var getGroupProperties = JSON.parse(readFileSync(`./database/commands/distributed.json`))

    const Options = typed ?? ''
    const remoteJid = Options.msg.key.parameters.details[0].messageJid ?? ''
    const Sender = Options.msg.key.parameters.details[1].sender ?? ''
    const Message = Sender.messageText ?? ''
    const message = Options.msg.key.parameters ?? ''
    const Boolean = Options.msg.key.boolean

    const isAdmin = async () => {
        if(!Boolean.isAdmin) {
            await sendMessageQuoted({
                client: MP,
                param: message,
                answer: MSG.commands.noprivilege
            })
            .then( async () => {
                await sendReaction({
                    client: MP,
                    param: message,
                    answer: getConfigProperties.reaction.error
                })
            })
            .finally(() => { return true })
        }
        return false
    }

    const isBotAdmin = async () => {
        if(!Boolean.isAdmin) {
            await sendMessageQuoted({
                client: MP,
                param: message,
                answer: MSG.commands.nopermission
            })
            .then( async () => {
                await sendReaction({
                    client: MP,
                    param: message,
                    answer: getConfigProperties.reaction.error
                })
            })
            .finally(() => { return true })
        }
        return false
    }

    const isOwner = async () => {
        if(!getConfigProperties.bot.owners.includes(Sender.messageNumber)) {
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

    if(isSpam(remoteJid)) {
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
    var args = (Message.split(getConfigProperties.prefix)[1]).trim().split(/ +/)
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

        if(isColling(remoteJid)) {
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

        if(getGroupProperties.commands.only.group.includes(_args[0]) && !Boolean.isGroup) {
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
            if(await isAdmin() || await isBotAdmin()) return
        }

        switch(_args[0]){
            case '':
                await sectionMenu({ client: MP, param: remoteJid})
            break
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
                    answer: MSG.commands.notfound
                })
                .then( async () => {
                    await sendReaction({
                        client: MP,
                        param: message,
                        answer: getConfigProperties.reaction.error
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