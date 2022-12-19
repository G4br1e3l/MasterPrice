import { readFileSync } from "fs"
import pkg from 'moment-timezone'
const { tz } = pkg;

var set_me = JSON.parse(readFileSync("./root/config.json"))
const messages_config = JSON.parse(readFileSync("./root/messages.json"))

import { commands } from './commands.js'
import { console_message } from './_functions/_csmg.js' 

export const Read = async ({MP, typed, message}) => {

    var hour = tz("America/Sao_Paulo").format("HH:mm:ss")
    var date = tz("America/Sao_Paulo").format("DD/MM/YY")

    const a = message.messages[0].key ?? message.messages[0]

    switch(typed[0] === set_me.prefix){
        case true:
            await commands({
                MP: MP,
                typed: typed,
                group_data: !a.remoteJid.endsWith('@s.whatsapp.net')? await MP.groupMetadata(a.remoteJid) : 'EHGRUPONADA',
                message: message
            }).finally(() => {
                console_message({
                    message_param: messages_config.params.entry.usercommand,
                    name: `${set_me.bot.name} ::: ${set_me.bot.user_name}`,
                    user: a.participant ?? a.remoteJid,
                    entry: typed,
                    hour: hour,
                    date: date
                })
            })
        break
        case false:
            console_message({
                message_param: messages_config.params.entry.usermessage,
                name: `${set_me.bot.name} ::: ${set_me.bot.user_name}`,
                user: a.participant ?? a.remoteJid,
                entry: typed,
                hour: hour,
                date: date
            })
        break
    }

    return
}
