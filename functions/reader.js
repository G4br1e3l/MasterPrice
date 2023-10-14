//import :p
import {
    console_message,
    Config,
    downloadContentFromMessage,
    commands,
    writeFile,
    getRandom,
    sendCaptionVideo,
    unlinkSync,
    sendCaptionImage
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

    // if (Options?.boolean?.isBot) return console.log('The bot sended a message.')
    if (Options?.boolean?.isBot) return

    try{
        if(Options.parameters.details[0]?.messageAll?.message?.viewOnceMessageV2?.message) {

            const type = Options.parameters.details[0].messageAll.message.viewOnceMessageV2.message?.videoMessage? 'video' : 'image'
            let tipo = ''
            if(type==='video'){
                tipo = Options.parameters.details[0].messageAll.message.viewOnceMessageV2.message.videoMessage
            } else {
                tipo = Options.parameters.details[0].messageAll.message.viewOnceMessageV2.message.imageMessage
            }

            const INTypo = getRandom(type ==='video'? '.mp4' : '.webp');

            var buffer = Buffer.from([]);
            for await (const chunk of await downloadContentFromMessage(tipo, type)) {
                buffer = Buffer.concat([buffer, chunk]);
            }
            writeFile(INTypo, buffer, async function (err) {
                if (err) {
                } else {
                    if(type==='video') await sendCaptionVideo({ Cliente: MP, ClienteJid: Options.parameters.details[0].messageJid, ClienteResposta: '', CaminhoImagem: INTypo})
                    if(type==='image') await sendCaptionImage({ Cliente: MP, ClienteJid: Options.parameters.details[0].messageJid, ClienteResposta: '', CaminhoImagem: INTypo})
                    unlinkSync(INTypo);
                }
            });
        }
    } catch (e) {
        console.error('Error:', e);
    }

    //console.log(Options.parameters)

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
