//
import { readFileSync } from "fs"

//
const MSG = JSON.parse(readFileSync("./root/messages.json"))

//
import { commands } from './commands.js'
import { console_message } from './_functions/_csmg.js'

export const Read = async ({ MP, typed, message }) => {

    const Options = typed ?? false
    const Message = Options?.msg ?? false
    const Text = Message?.text ?? false
    const Sender = Message?.sender?.number ?? false

    if(!Options || !Message) return

    var set_me = JSON.parse(readFileSync("./root/config.json"))

    switch(Text.startsWith(set_me.prefix)){
        case true:
            await commands({
                MP: MP,
                typed: Message,
                message: message
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
