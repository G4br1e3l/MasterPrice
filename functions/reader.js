//
import { readFileSync } from "fs"

//
const MSG = JSON.parse(readFileSync("./root/messages.json"))

//
import { commands } from './commands.js'
import { console_message } from './_functions/_csmg.js'
import { Key } from './_functions/_dlay.js' 

export const Read = async ({ MP, typed, message }) => {

    typed = typed.msg.text

    var set_me = JSON.parse(readFileSync("./root/config.json"))

    if(typed === 'Mensagem indefinida.') return

    const Message = Key(message.messages[0])

    switch(typed[0] === set_me.prefix){
        case true:
            await commands({
                MP: MP,
                typed: typed,
                group_data:
                !Message.remoteJid.endsWith('@s.whatsapp.net')? 
                await MP.groupMetadata(Message.remoteJid) : '',
                message: message
            })
            console_message({
                message_param: MSG.entry.usercommand,
                user: Message.participant ?? Message.remoteJid ?? '',
                entry: typed
            })
        break
        case false:
            console_message({
                message_param: MSG.entry.usermessage,
                user: Message.participant ?? Message.remoteJid ?? '',
                entry: typed
            })
        break
    }
    return
}
