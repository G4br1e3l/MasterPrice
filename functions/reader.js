//
import { readFileSync } from "fs"

//
import { commands } from './commands.js'
import { console_message } from './_functions/_functionsMessage.js'

export const Read = async ({ MP, typed }) => {

    var Config = JSON.parse(readFileSync("./root/configurations.json"))

    const Options = typed ?? false

    if(Options?.msg?.key?.boolean?.isBot) return
    if(!Options?.msg?.key) return
    if(!Options) return

    switch(Options?.msg?.key?.parameters?.details[1]?.sender?.messageText.startsWith(Config.parameters.bot[1].prefix.set)){
        case true:
            await commands({
                MP: MP,
                typed: Options,
            })
            console_message({
                message_param: Options.msg.key.boolean.isGroup? `${Config.parameters.commands[2].messages.console.onusercommand} no grupo [@group]` : Config.parameters.commands[2].messages.console.onusercommand,
                config: Options
            })
        break
        case false:
            console_message({
                message_param: Options.msg.key.boolean.isGroup? `${Config.parameters.commands[2].messages.console.onusermessage} no grupo [@group]` : Config.parameters.commands[2].messages.console.onusermessage,
                config: Options
            })
        break
    }
    return
}
