import {
    readFileSync,
    Date,
    Hour,
    Config
} from '../../../exports.js'

//
export const Menu = () => {
    
    return `
        ‥…━━━☆𝐌𝐀𝐈𝐍 𝐌𝐄𝐍𝐔☆━━━…‥
        ☆ ${Config.parameters.bot[0].name} ☆ ${Config.parameters.bot[0].username}
        ☆ ${Date()} ‥…☆…‥ ${Hour()}
        »»————-　🄾🄿🅃🄸🄾🄽🅂 1　————-««
    ☆ DONO

        »»————-　🄾🄿🅃🄸🄾🄽🅂 2　————-««
    ☆ ADM

        »»————-　🄾🄿🅃🄸🄾🄽🅂 3　————-««
    ☆ MEMBRO COMUM

        »»————-　🄾🄿🅃🄸🄾🄽🅂 4　————-««
    ☆ MEME

        »»————-　🄾🄿🅃🄸🄾🄽🅂 5　————-««
    ☆ ZOEIRA

        »»————-　🄾🄿🅃🄸🄾🄽🅂 6　————-««
    ☆ +18

        …‥——☆𝓔𝓝𝓓 𝓜𝓐𝓘𝓝 𝓜𝓔𝓝𝓤☆——…‥
    `
}

//
export const sectionMenu = async ({ client, param }) => {

var Config = JSON.parse(readFileSync("./root/configurations.json"))
const prefix = Config.parameters.bot[1].prefix.set

return await client.sendMessage(param, {
    text: Menu(),
    footer: `_${Config.parameters.bot[0].name} ☆ https://github.com/G4br1e3l/MasterPrice_`,
    title: `_*☆ ${Config.parameters.bot[0].username} ☆*_`,
    buttonText: `🄾🄿🅃🄸🄾🄽🅂`,
    sections: [{
            title: `🄾🄿🅃🄸🄾🄽🅂 1 COMANDOS DE DONO`,
            rows: [{
                    title: `☆ Provide`,
                    rowId: `${prefix}provide`,
                    description: `☆ Comando para fazer com que comandos de administradores sejam utilizados por membros comuns.`
                },{
                    title: `☆ Unprovide`,
                    rowId: `${prefix}unprovide`,
                    description: `☆ Comando para remover os comandos adicionados para uso dos membros comuns.`
                },{
                    title: `☆ Restrict`,
                    rowId: `${prefix}restrict`,
                    description: `☆ Comando para disponibilizar um comando para uso exclusivo em grupos.`
                },{
                    title: `☆ Unrestrict`,
                    rowId: `${prefix}unrestrict`,
                    description: `☆ Comando para remover os comandos adicionados para uso exclusivo em grupos.`
                },{
                    title: `☆ Addowner`,
                    rowId: `${prefix}addowner`,
                    description: `☆ Comando para adicionar numeros para que também usem as funções de dono do bot.`
                },{
                    title: `☆ Removeowner`,
                    rowId: `${prefix}removeowner`,
                    description: `☆ Comando para remover os numeros adicionados para uso das funções de dono do bot.`
                },{
                    title: `☆ Silence (Privates/Groups)`,
                    rowId: `${prefix}silence`,
                    description: `☆ Comando para bloquear formas de contato com o bot.`
                }
            ]
        },{
            title: `🄾🄿🅃🄸🄾🄽🅂 2 COMANDOS DE ADMINISTRADOR PARA MEMBROS [GRUPOS]`,
            rows: [{
                    title: `☆ Timeout (Quote/Mention/Number) [Time in seconds]`,
                    rowId: `${prefix}timeout`,
                    description: `☆ Comando para remover temporariamente um usuário. Tempo padrão de 1 minuto (60 segundos).`
                },{
                    title: `☆ Untimeout (Quote/Mention/Number)`,
                    rowId: `${prefix}untimeout`,
                    description: `☆ Comando para reverter o comando timeout.`
                },{
                    title: `☆ Add (Quote/Mention/Number)`,
                    rowId: `${prefix}add`,
                    description: `☆ Comando para adicionar um membro ao grupo.`
                },{
                    title: `☆ Remove (Quote/Mention/Number)`,
                    rowId: `${prefix}remove`,
                    description: `☆ Comando para remover membros do grupo.`
                },{
                    title: `☆ Ban (Quote/Mention/Number)`,
                    rowId: `${prefix}ban`,
                    description: `☆ Comando para banir permanentemente um usuário.`
                },{
                    title: `☆ Unban (Quote/Mention/Number)`,
                    rowId: `${prefix}unban`,
                    description: `☆ Comando para remover o banimento de um usuário.`
                },{
                    title: `☆ Mute (Quote/Mention/Number) ?[Time in seconds]`,
                    rowId: `${prefix}mute`,
                    description: `☆ Comando para mutar um usuário.`
                },{
                    title: `☆ Unmute (Quote/Mention/Number)`,
                    rowId: `${prefix}unmute`,
                    description: `☆ Comando para desmutar um usuário.`
                },{
                    title: `☆ Promote (Quote/Mention/Number)`,
                    rowId: `${prefix}promote`,
                    description: `☆ Comando para promover um usuário a administrador.`
                },{
                    title: `☆ Demote (Quote/Mention/Number)`,
                    rowId: `${prefix}demote`,
                    description: `☆ Comando para rebaixar um administrador a membro comum.`
                },{
                    title: `☆ Presence (ON/OFF)`,
                    rowId: `${prefix}presence`,
                    description: `☆ Comando para bloquear mudança de presença dos membros, banindo-os automaticamente permanentemente.`
                },{
                    title: `☆ Protect (Quote/Mention/Number)`,
                    rowId: `${prefix}protec`,
                    description: `☆ Comando para proteger um usuário, onde quando banido quem baniu será punido.`
                },
            ]
        },{
            title: `🄾🄿🅃🄸🄾🄽🅂 2 COMANDOS DE ADMINISTRADOR PARA GRUPOS [GRUPOS]`,
            rows: [{
                    title: `☆ Chat (Close/Open)`,
                    rowId: `${prefix}chat`,
                    description: `☆ Comando para fechar ou abrir o grupo.`
                },{
                    title: `☆ Block [Subcommand] (ON/OFF)`,
                    rowId: `${prefix}block`,
                    description: `☆ Comando para bloquear outros comandos para uso por membros comuns.`
                },{
                    title: `☆ Change [Subject/Description/Photo] (Quote/Comment)`,
                    rowId: `${prefix}change`,
                    description: `☆ Comando para altear foto, nome ou descrição do grupo.`
                },{
                    title: `☆ Info`,
                    rowId: `${prefix}iinfo`,
                    description: `☆ Comando para receber informações do grupo.`
                },{
                    title: `☆ Members`,
                    rowId: `${prefix}members`,
                    description: `☆ Comando para receber informações dos membros do grupo.`
                },{
                    title: `☆ Tag [All/Hide/WA] ?[Message]`,
                    rowId: `${prefix}tag`,
                    description: `☆ Comando para evidenciar os membros do grupo.`
                },{
                    title: `☆ Nuke [BR/All/Admins/Members/DDD]`,
                    rowId: `${prefix}nuke`,
                    description: `☆ Comando para remover em massa uma categoria de membros.`
                },{
                    title: `☆ Hard [Type] (ON/OFF)`,
                    rowId: `${prefix}hard`,
                    description: `☆ Comando para bloquear o envio de certos tipos de mensagens. Saiba mais em "!hard help"`
                },{
                    title: `☆ Run (ON/OFF)`,
                    rowId: `${prefix}run`,
                    description: `☆ Comando para evitar que usuários saiam do grupo, onde serão adicionados novamente.`
                },
            ]
        },{
            title: `🄾🄿🅃🄸🄾🄽🅂 3 COMANDOS DE MEMBRO [GRUPOS]`,
            rows: [{
                    title: `☆ GPT (Question)`,
                    rowId: `${prefix}gpt`,
                    description: `☆ IA (Assistente Virtual) que te ajuda em suas dúvidas.`
                },{
                    title: `☆ Google (Search)`,
                    rowId: `${prefix}google`,
                    description: `☆ Busca algo no Google.`
                },{
                    title: `☆ Youtube (Search)`,
                    rowId: `${prefix}youtube`,
                    description: `☆ Busca algo no Youtube.`
                },{
                    title: `☆ Tiktok (Search)`,
                    rowId: `${prefix}tiktok`,
                    description: `☆ Busca algo no Tiktok.`
                },{
                    title: `☆ Instagram (Username)`,
                    rowId: `${prefix}instagram`,
                    description: `☆ Pesquisa alguém no Instagram.`
                },{
                    title: `☆ Facebook (Username)`,
                    rowId: `${prefix}facebook`,
                    description: `☆ Pesquisa alguém no Facebook.`
                },{
                    title: `☆ Twitter (Username)`,
                    rowId: `${prefix}twitter`,
                    description: `☆ Pesquisa alguém no Twitter.`
                }
            ]
        },{
            title: `🄾🄿🅃🄸🄾🄽🅂 4 BRINCADEIRAS`,
            rows: [{
                    title: `KKKKKKKKKKKKKKK`,
                    rowId: `${prefix}aaaa`,
                    description: `??????????????????`
                },{
                    title: `KKKKKKKKKKKKKKK`,
                    rowId: `${prefix}aaaa`,
                    description: `??????????????????`
                }
            ]
        },{
            title: `🄾🄿🅃🄸🄾🄽🅂 5 EFEITOS`,
            rows: [{
                    title: `KKKKKKKKKKKKKKK`,
                    rowId: `${prefix}aaaa`,
                    description: `??????????????????`
                },{
                    title: `KKKKKKKKKKKKKKK`,
                    rowId: `${prefix}aaaa`,
                    description: `??????????????????`
                }
            ]
        },{
            title: `🄾🄿🅃🄸🄾🄽🅂 6 ADULTO`,
            rows: [{
                    title: `KKKKKKKKKKKKKKK`,
                    rowId: `${prefix}aaaa`,
                    description: `??????????????????`
                },{
                    title: `KKKKKKKKKKKKKKK`,
                    rowId: `${prefix}aaaa`,
                    description: `??????????????????`
                }
            ]
        },]
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