//
import { readFileSync } from "fs"

//
import { Date, Hour } from '../_functionsMessage.js'

//
export const Menu = () => {

    var Config = JSON.parse(readFileSync("./root/configurations.json"))

    return `
        ‥…━━━☆𝐌𝐀𝐈𝐍 𝐌𝐄𝐍𝐔☆━━━…‥
        ☆ ${Config.parameters.bot[0].name} ☆ ${Config.parameters.bot[0].username}
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

//
export const sectionMenu = async ({ client, param }) => {

var Config = JSON.parse(readFileSync("./root/configurations.json"))

return await client.sendMessage(param, {
    text: Menu(),
    footer: `_${Config.parameters.bot[0].name} ☆ https://github.com/G4br1e3l/MasterPrice_`,
    title: `_*☆ ${Config.parameters.bot[0].username} ☆*_`,
    buttonText: `🄾🄿🅃🄸🄾🄽🅂`,
    sections: [{
            title: `🄾🄿🅃🄸🄾🄽🅂 1 COMANDOS DE DONO`,
            rows: [{
                    title: `☆ Provide`,
                    rowId: `${Config.parameters.bot[1].prefix.set}provide`,
                    description: `☆ Comando para fazer com que comandos de administradores sejam utilizados por membros comuns.`
                },{
                    title: `☆ Unprovide`,
                    rowId: `${Config.parameters.bot[1].prefix.set}unprovide`,
                    description: `☆ Comando para remover os comandos adicionados para uso dos membros comuns.`
                },{
                    title: `☆ Restrict`,
                    rowId: `${Config.parameters.bot[1].prefix.set}restrict`,
                    description: `☆ Comando para disponibilizar um comando para uso exclusivo em grupos.`
                },{
                    title: `☆ Unrestrict`,
                    rowId: `${Config.parameters.bot[1].prefix.set}unrestrict`,
                    description: `☆ Comando para remover os comandos adicionados para uso exclusivo em grupos.`
                },{
                    title: `☆ Addowner`,
                    rowId: `${Config.parameters.bot[1].prefix.set}addowner`,
                    description: `☆ Comando para adicionar numeros para que também usem as funções de dono do bot.`
                },{
                    title: `☆ Removeowner`,
                    rowId: `${Config.parameters.bot[1].prefix.set}removeowner`,
                    description: `☆ Comando para remover os numeros adicionados para uso das funções de dono do bot.`
                }
            ]
        },{
            title: `🄾🄿🅃🄸🄾🄽🅂 2 COMANDOS DE ADMINISTRADOR`,
            rows: [{
                    title: `KKKKKKKKKKKKKKK`,
                    rowId: `3`,
                    description: `??????????????????`
                },{
                    title: `KKKKKKKKKKKKKKK`,
                    rowId: `4`,
                    description: `??????????????????`
                }
            ]
        },{
            title: `🄾🄿🅃🄸🄾🄽🅂 3 COMANDOS DE MEMBRO`,
            rows: [{
                    title: `KKKKKKKKKKKKKKK`,
                    rowId: `5`,
                    description: `??????????????????`
                },{
                    title: `KKKKKKKKKKKKKKK`,
                    rowId: `6`,
                    description: `??????????????????`
                }
            ]
        },{
            title: `🄾🄿🅃🄸🄾🄽🅂 4 BRINCADEIRAS`,
            rows: [{
                    title: `KKKKKKKKKKKKKKK`,
                    rowId: `7`,
                    description: `??????????????????`
                },{
                    title: `KKKKKKKKKKKKKKK`,
                    rowId: `8`,
                    description: `??????????????????`
                }
            ]
        },{
            title: `🄾🄿🅃🄸🄾🄽🅂 5 EFEITOS`,
            rows: [{
                    title: `KKKKKKKKKKKKKKK`,
                    rowId: `9`,
                    description: `??????????????????`
                },{
                    title: `KKKKKKKKKKKKKKK`,
                    rowId: `10`,
                    description: `??????????????????`
                }
            ]
        },{
            title: `🄾🄿🅃🄸🄾🄽🅂 6 ADULTO`,
            rows: [{
                    title: `KKKKKKKKKKKKKKK`,
                    rowId: `11`,
                    description: `??????????????????`
                },{
                    title: `KKKKKKKKKKKKKKK`,
                    rowId: `12`,
                    description: `??????????????????`
                }
            ]
        },
    ]
})
}

/*
await MP.sendMessage(remoteJid, {
    image: readFileSync(getConfigProperties.pathimage.menu),
    caption: Menu(),
    footer: getConfigProperties.bot.name,
    buttons: [
        {buttonId: `opts`, buttonText: {displayText: 'SLA'}, type: 1},
    ],
    headerType: 4
})*/

/*
await MP.sendMessage(remoteJid, {
    text: Menu(),
    footer: getConfigProperties.bot.name,
    buttons: [
        {buttonId: '0', buttonText: {displayText: 'Criador -<'}, type: 1},
        {buttonId: '1', buttonText: {displayText: 'Doar -<'}, type: 1},
        {buttonId: '2', buttonText: {displayText: 'Informações -<'}, type: 1},
        ],
    headerType: 1
})*/