const fs = require("fs")
const chalk = require("chalk")

const moment = require("moment-timezone")

var set_me = JSON.parse(fs.readFileSync("./root/config.json"))
const messages_config = JSON.parse(fs.readFileSync("./root/messages.json"))

const { commands } = require('./commands.js')
const { named } = require('./_functions/_cfgd.js')
const { get_message } = require('./_functions/_gtms.js')
const { get_group_data } = require('./_functions/_gpdt.js')
const { console_message } = require('./_functions/_csmg.js')

const Read = async (MP, message) => {

    if(message.messages[0].key.fromMe === true) return
    if(!set_me?.bot?.verified?.includes('DONE')) named({MP:MP})

    var typed = get_message({msg: message})
    
    var hour = moment.tz("America/Sao_Paulo").format("HH:mm:ss")
    var date = moment.tz("America/Sao_Paulo").format("DD/MM/YY")

    switch(typed[0] === set_me.prefix? 'Command' : 'Message'){
        case 'Command':
            switch(message?.messages[0]?.key?.participant? 'Group' : 'Private'){
                case 'Group':
                    var group_data = await get_group_data(MP, message)

                    await Promise.resolve().then( async () => commands({MP: MP, typed: typed, group_data: group_data, message: message})).finally( () =>
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
                    await Promise.resolve().then( async () => commands({MP: MP, typed: typed, group_data: group_data, message: message})).finally( () =>
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
module.exports = { Read }
