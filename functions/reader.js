import { readFileSync } from "fs"
import chalk from "chalk"
import pkg from 'moment-timezone'
const { tz } = pkg;

var set_me = JSON.parse(readFileSync("./root/config.json"))
const messages_config = JSON.parse(readFileSync("./root/messages.json"))

import { commands } from './commands.js'
import { get_group_data } from './_functions/_gpdt.js'
import { console_message } from './_functions/_csmg.js'

export const Read = async ({MP, typed, message}) => {

    var hour = tz("America/Sao_Paulo").format("HH:mm:ss")
    var date = tz("America/Sao_Paulo").format("DD/MM/YY") 

    switch(typed[0] === set_me.prefix? 'Command' : 'Message'){
        case 'Command':
            switch(message?.messages[0]?.key?.participant? 'Group' : 'Private'){
                case 'Group':

                    await Promise.resolve().then( async () => commands({MP: MP, typed: typed, group_data: await get_group_data(MP, message), message: message})).finally( () =>
                        console_message({
                            message_param: messages_config.params.entry.usercommand,
                            name: `${set_me.bot.name} ::: ${set_me.bot.user_name}`,
                            user: message.messages[0].key.participant,
                            entry: chalk.hex('#DEADED').bgGreen.bold(typed),
                            hour: hour,
                            date: date
                        })
                    )
                break
                case 'Private':
                    await Promise.resolve().then( async () => commands({MP: MP, typed: typed, group_data: await get_group_data(MP, message), message: message})).finally( () =>
                        console_message({
                            message_param: messages_config.params.entry.usercommand,
                            name: `${set_me.bot.name} ::: ${set_me.bot.user_name}`,
                            user: message.messages[0].key.remoteJid,
                            entry: chalk.hex('#DEADED').bgGreen.bold(typed),
                            hour: hour,
                            date: date
                        })
                    )
                break
            }
        break
        case 'Message':
            switch(message?.messages[0]?.key?.participant? 'Group' : 'Private'){
                case 'Group':
                    console_message({
                        message_param: messages_config.params.entry.usermessage,
                        name: `${set_me.bot.name} ::: ${set_me.bot.user_name}`,
                        user: message.messages[0].key.participant,
                        entry: chalk.hex('#DEADED').bgRed.bold(typed),
                        hour: hour,
                        date: date
                    })
                break
                case 'Private':
                    console_message({
                        message_param: messages_config.params.entry.usermessage,
                        name: `${set_me.bot.name} ::: ${set_me.bot.user_name}`,
                        user: message.messages[0].key.remoteJid,
                        entry: chalk.hex('#DEADED').bgRed.bold(typed),
                        hour: hour,
                        date: date
                    })
                break
            }
        break
    }
}
