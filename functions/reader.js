//
import { readFileSync } from "fs"

//
const MSG = JSON.parse(readFileSync("./root/messages.json"))

//
import { commands } from './commands.js'
import { console_message } from './_functions/_csmg.js'

export const Read = async ({ MP, typed }) => {

    const Options = typed ?? false
    const Text = Options?.msg?.key?.parameters?.details[1]?.sender?.messageText ?? ''
    const Sender = Options?.msg?.key?.parameters?.details[1]?.sender?.messageNumber ?? ''

    if(!Options || !Text || !Sender) return
    if(Text === '""') return

    var set_me = JSON.parse(readFileSync("./root/config.json"))

    switch(Text.startsWith(set_me.prefix)){
        case true:
            await commands({
                MP: MP,
                typed: Options,
            })
            console_message({
                message_param: MSG.entry.usercommand,
                user: Sender,
                entry: Text
            })
        break
        case false:
            console_message({
                message_param: MSG.entry.usermessage,
                user: Sender,
                entry: Text
            })
        break
    }
    return
}
