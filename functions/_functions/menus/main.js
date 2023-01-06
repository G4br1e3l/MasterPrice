//
import { readFileSync } from "fs"

//
import { Date, Hour } from '../_cmds.js'

//
export const Menu = () => {

    var set_me = JSON.parse(readFileSync("./root/config.json"))
    
    return `
        ‥…━━━☆𝐌𝐀𝐈𝐍 𝐌𝐄𝐍𝐔☆━━━…‥
        ☆ ${set_me.bot.user_name} ☆ ${set_me.bot.name} 
        ☆ ${Date()} ‥…☆…‥ ${Hour()}
        »»————-　🄾🄿🅃🄸🄾🄽🅂 1　————-««
    ☆ BLA BLA COISA DE DONO

        »»————-　🄾🄿🅃🄸🄾🄽🅂 2　————-««
    ☆ BLA BLA COISA DE ADM

        »»————-　🄾🄿🅃🄸🄾🄽🅂 3　————-««
    ☆ BLA BLA COISA DE MEMBRO COMUM

        »»————-　🄾🄿🅃🄸🄾🄽🅂 4　————-««
    ☆ BLA BLA COISA DE BRINCAR

        »»————-　🄾🄿🅃🄸🄾🄽🅂 5　————-««
    ☆ BLA BLA COISA DE EFEITOS

        »»————-　🄾🄿🅃🄸🄾🄽🅂 6　————-««
    ☆ BLA BLA COISA DE ADULTO

        …‥——☆𝓔𝓝𝓓 𝓜𝓐𝓘𝓝 𝓜𝓔𝓝𝓤☆——…‥
    `
} 