//
import { readFileSync } from "fs"

//
import { commands } from './commands.js'
import { console_message } from './_functions/_functionsMessage.js'

export const Read = async ({ MP, typed }) => {

    var Config = JSON.parse(readFileSync("./root/configurations.json"))

    const Options = typed ?? false
    const Text = Options?.msg?.key?.parameters?.details[1]?.sender?.messageText ?? ''
    const Sender = Options?.msg?.key?.parameters?.details[1]?.sender?.messageNumber ?? ''

    if(!Options || !Text || !Sender) return
    if(Text === '""') return

    switch(Text.startsWith(Config.parameters.bot[1].prefix.set)){
        case true:
            await commands({
                MP: MP,
                typed: Options,
            })
            console_message({
                message_param: Config.parameters.commands[2].messages.console.onusercommand,
                user: Sender,
                entry: Text
            })
        break
        case false:
            console_message({
                message_param: Config.parameters.commands[2].messages.console.onusermessage,
                user: Sender,
                entry: Text
            })
        break
    }
    return
}
