import { readFileSync, /*writeFileSync*/ } from "fs"
import pkg from 'moment-timezone'
const { tz } = pkg;
var set_me = JSON.parse(readFileSync("./root/config.json"))
import { main_menu } from './_functions/menus/main.js'

//functions response
import { sendReaction } from './_functions/_rect.js'

import { sendMessage } from './_functions/_smss.js'
import { sendMessageQuoted } from './_functions/_smsq.js'
import { sendMessageTyping } from './_functions/_smst.js'
import { sendMessageTypingQuoted } from './_functions/_smtq.js'

import { sendCaptionImage } from './_functions/_sqnd.js'
import { sendCaptionImageQuoted } from './_functions/_send.js'
import { sendCaptionImageTyping } from './_functions/_senk.js'
import { sendCaptionImageTypingQuoted } from './_functions/_senp.js'

//const save = ({file_path, filename}) =>  writeFileSync(file_path, JSON.stringify(filename))

export const commands = async ({MP, typed, group_data, message}) => {

    var args = (typed.split(set_me.prefix)[1]).trim().split(/ +/)
    const _args = []
    args.forEach(word => {
        _args.push(word.toLowerCase())
    })

    async function run ({_args}){

        var hour = tz("America/Sao_Paulo").format("HH:mm:ss")
        var date = tz("America/Sao_Paulo").format("DD/MM/YY")

        switch(_args[0]){
            case 'menu':
                await sendCaptionImageQuoted({
                    client: MP,
                    param: message,
                    answer: main_menu({ data: date, hora: hour, nome: set_me.bot.user_name, bot_nome: set_me.bot.name }),
                    path_image: './database/images/main_menu.webp'
                })
                .finally( async () => {
                    await sendReaction({
                        client: MP,
                        param: message,
                        answer: '🔥'
                    })
                })
            break
            case 'teste1':
                await sendMessageTypingQuoted({
                    client: MP,
                    param: message,
                    answer: 'Por favor.'
                })
            break
            case 'teste2':
                await sendMessageTyping({
                    client: MP,
                    param: message,
                    answer: 'Por favor.'
                })
            break
            case 'teste3':
                await sendMessageQuoted({
                    client: MP,
                    param: message,
                    answer: 'Por favor.'
                })
            break
            case 'teste4':
                await sendMessage({
                    client: MP,
                    param: message,
                    answer: 'Por favor.'
                })
            break
            case 'teste5':
                await sendCaptionImage({
                    client: MP,
                    param: message,
                    answer: main_menu({ data: date, hora: hour, nome: set_me.bot.user_name, bot_nome: set_me.bot.name }),
                    path_image: './database/images/main_menu.webp'
                })
            break
            case 'teste6':
                await sendCaptionImageTyping({
                    client: MP,
                    param: message,
                    answer: main_menu({ data: date, hora: hour, nome: set_me.bot.user_name, bot_nome: set_me.bot.name }),
                    path_image: './database/images/main_menu.webp'
                })
            break
            case 'teste7':
                await sendCaptionImageTypingQuoted({
                    client: MP,
                    param: message,
                    answer: main_menu({ data: date, hora: hour, nome: set_me.bot.user_name, bot_nome: set_me.bot.name }),
                    path_image: './database/images/main_menu.webp'
                })
            break
            default: return
        }
    }
    await Promise.resolve().then( async () => await run({_args: _args}).finally(() => { return }))
}
