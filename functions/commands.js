import { readFileSync, writeFileSync } from "fs"

var set_me = JSON.parse(readFileSync("./root/config.json"))

import { say } from './_functions/_sayd.js'
import { react } from './_functions/_rect.js'
import { send } from './_functions/_send.js'

/*
send({
    client: MP,
    param: message,
    answer: 'Hello!',
    path_image: './database/images/download.webp'
})
say({
    client: MP,
    param: message,
    answer: 'Por favor.'
}).finally(() =>
react({
    client: MP,
    param: message,
    answer: '🙂'
}))
*/

const save = ({file_path, filename}) =>  writeFileSync(file_path, JSON.stringify(filename))

export const commands = async ({MP, typed, group_data, message}) => {

    var args = (typed.split(set_me.prefix)[1]).trim().split(/ +/)
    const argumentas = []
    args.forEach(word => {
        argumentas.push(word.toLowerCase())
    })

    async function run ({argumentas}){
        switch(argumentas[0]){
            case '':
            break
            default: return
        }
    }
    await Promise.resolve().then( async () => await run({arguments: argumentas}))
}
