//
import chalk from "chalk"
import { readFileSync } from "fs"
import { hour, date, set } from './_dlay.js'

//
const set_me = JSON.parse(readFileSync("./root/config.json"))

//
export const console_message = ({ message_param, user, entry }) =>{

    do {
        user = set('@', user)
        user = set(':', user)
    } while (user.includes('@') || user.includes(':'))

    console.log(chalk.rgb(123, 45, 67).bold(
        message_param
        .replaceAll('@botname', `${set_me.bot.name} ::: ${set_me.bot.user_name}`)
        .replaceAll('@user', user)
        .replaceAll('@entry', chalk.hex('#DEADED').bgGreen.bold(entry))
        .replaceAll('@hour', hour())
        .replaceAll('@date', date())
    ))
}
