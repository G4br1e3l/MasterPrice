//import :p
import {
    console_message,
    Config,
    commands
  } from '../exports.js'

export const Read = async ({ MP, typed }) => {

    const {
        onusercommand: cmdUser = undefined,
        onusermessage: msgUser = undefined,
    } = Config.parameters.commands[2].messages.console || {}

    const { key: Options = undefined } = typed?.msg || {}

    if (!Options) {
        return console.log('Undefined message was sented. Message: ', typed)
    }

    if (Options?.boolean?.isBot) return console.log('The bot sended a message.')

    const { isGroup: grupo = undefined } = Options?.boolean || {}

    switch(Options.boolean?.isCommand){
        case true:
            await commands({
                MP: MP,
                typed: Options,
            })
            console_message({
                message_param: grupo? `${cmdUser} no grupo [@group]` : cmdUser,
                config: Options
            })
        break
        case false:
            console_message({
                message_param: grupo? `${msgUser} no grupo [@group]` : msgUser,
                config: Options
            })
        break
    }
    return
}
