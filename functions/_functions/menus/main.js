//
import { readFileSync } from "fs"

//
import { date, hour } from '../_dlay.js'

//
export const Menu = () => {

    var set_me = JSON.parse(readFileSync("./root/config.json"))
    
    return `
        ‥…━━━☆𝐌𝐀𝐈𝐍 𝐌𝐄𝐍𝐔☆━━━…‥
        ☆ ${set_me.bot.user_name} ☆ ${set_me.bot.name} 
        ☆ ${date()} ‥…☆…‥ ${hour()}
        »»————-　🄾🄿🅃🄸🄾🄽🅂 1　————-««
    ☆
    ☆
    ☆

        »»————-　🄾🄿🅃🄸🄾🄽🅂 2　————-««
    ☆
    ☆
    ☆

        »»————-　🄾🄿🅃🄸🄾🄽🅂 3　————-««
    ☆
    ☆
    ☆

        »»————-　🄾🄿🅃🄸🄾🄽🅂 4　————-««
    ☆
    ☆
    ☆

        »»————-　🄾🄿🅃🄸🄾🄽🅂 5　————-««
    ☆
    ☆
    ☆

        »»————-　🄾🄿🅃🄸🄾🄽🅂 6　————-««
    ☆
    ☆
    ☆

        …‥——☆𝓔𝓝𝓓 𝓜𝓐𝓘𝓝 𝓜𝓔𝓝𝓤☆——…‥
    `
} 