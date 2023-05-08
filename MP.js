//
import Baileys from '@adiwajshing/baileys'

const {
    default: makeWASocket,
    makeInMemoryStore,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    DisconnectReason
} = Baileys

import { readFileSync, readdirSync, unlink, writeFileSync } from "fs"
import P from 'pino'
import chalk from "chalk"

import CFonts from 'cfonts'
const { render } = CFonts
//
import { Read } from './functions/reader.js'
import { Named } from './functions/_functions/_functionsMessage.js'
import { Typed } from './functions/_functions/_contentMessage.js'

//
process.on('uncaughtException', function (err) {
    console.error(err.stack)
})

console.warn = () => {}
const msgRetryCounterMap = {}

//
var Config = JSON.parse(readFileSync('./root/configurations.json', 'utf8'))
const PACKAGE = JSON.parse(readFileSync('./package.json', 'utf8'))

const history = !process.argv.includes('--no-store')? makeInMemoryStore({ logger: P({ level: 'silent', stream: "store", transport: { target: 'pino-pretty', options: { levelFirst: true, ignore: 'pid,hostname,node,browser,helloMsg,path', colorize: true }}})}) : undefined

history?.readFromFile('./root/connections/history.json')

setInterval(() => { history?.writeToFile('./root/connections/history.json') }, 10_000)

async function M_P() {

    const { state, saveCreds } = await useMultiFileAuthState('./root/connections')
    const { version, isLatest } = await fetchLatestBaileysVersion()

    console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse(render((`${Config.parameters.bot[0].name} Por ${PACKAGE.author.split(' ')[0]} v.${PACKAGE.version}`), { font: 'shade', align: 'left', colors: 'redBright', background: 'transparent', letterSpacing: 1, lineHeight: 0, space: true, maxLength: 0, gradient: true, independentGradient: false, transitionGradient: true, env: 'node' }).string))
    console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse(render((`${PACKAGE.name} - ${PACKAGE.description} |Versao Atual: ${version} Atualizado: ${isLatest}`), { font: 'console', align: 'left', colors: 'redBright', background: 'transparent', letterSpacing: 0, lineHeight: 0, space: true, maxLength: 0, gradient: true, independentGradient: true, transitionGradient: true, env: 'node' }).string))

    const MP = makeWASocket({
        logger: P({ level: 'silent', stream: "store", transport: { target: 'pino-pretty', options: { levelFirst: true, ignore: 'pid,hostname,node,browser,helloMsg,path', colorize: true }}}),
        msgRetryCounterMap,
        generateHighQualityLinkPreview: true,
        printQRInTerminal: true,
        browser: ['Chrome', 'Safari', '1.0.0'],
        defaultQueryTimeoutMs: undefined,
        syncFullHistory: true,
        markOnlineOnConnect: true,
        auth: state,
        version
    })

    history?.bind(MP.ev)

    MP.ev.process(async(events) => {

        var Config = JSON.parse(readFileSync('./root/configurations.json', 'utf8'))

        if(events['connection.update']) {

            console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse(Config.parameters.commands[2].messages.startup.onupdate))

            const { connection, lastDisconnect, receivedPendingNotifications, isOnline, qr } = events['connection.update']

            if(qr) console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse(Config.parameters.commands[2].messages.startup.onqrscan))
            if(isOnline) console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse(Config.parameters.commands[2].messages.startup.onstaging))
            if(receivedPendingNotifications) console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse(Config.parameters.commands[2].messages.startup.onnotify))

            switch(connection){
                case 'close':
                    console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse(Config.parameters.commands[2].messages.startup.ondownconnection))

                    if((lastDisconnect.error)?.output?.statusCode === DisconnectReason.loggedOut) console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse('Ultima sessão desconectada.'))

                    switch((lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut){
                        case true:
                            console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse(Config.parameters.commands[2].messages.startup.onreconect))
                            await M_P()
                        break
                        case false:
                            console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse(Config.parameters.commands[2].messages.startup.onlostconnection))
                            let files = readdirSync('./root/connections')
                            files.forEach(file => { unlink(`./root/connections/${file}`, (() => { })) })
                            await M_P()
                        break
                    }
                break
                case 'open':
                    console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse(Config.parameters.commands[2].messages.startup.onconnected.replaceAll('@botname', Config.parameters.bot[0].name)))
                break
                case 'connecting':
                    console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse(Config.parameters.commands[2].messages.startup.onconnect))
                break
            }
        }

        if(events.call) {
            //console.log('recv call event', events.call)
        }

        if(events['creds.update']) {
            await saveCreds()
        }

        if(events['contacts.upsert']) console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse('Contatos Salvos.'))

        if(events['messages.update']) {
            //console.log('chats update ', events['messages.update'])
        }
        if(events['message-receipt.update']) {
            //console.log('chats update ', events['message-receipt.update'])
        }
        if(events['messages.reaction']) {
            //console.log('chats update ', events['messages.reaction'])
        }
        if(events['messaging-history.set']) {
            const { chats, contacts, messages, isLatest } = events['messaging-history.set']
            console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse(
                `Recebidos:\nQuantidade de conversas ::: ${chats.length},\nQuantidade de contatos ::: ${contacts.length},\nQuantidade de mensagens ::: ${messages.length}`
            ))
        }

        if(events['presence.update']) {
            //console.log(events['presence.update'])
        }

        if(events['chats.update']) {
            //console.log('chats update ', events['chats.update'])
        }
        if(events['chats.delete']) {
            //console.log('chats deleted ', events['chats.delete'])
        }
        if(events['chats.upsert']) {
           //console.log('chats upsert ', events['chats.upsert'])
        }

        if(events['group-participants.update']){

            const { remoteJid } = Config.parameters.metadata.store[0]
            const Path = Config.parameters.commands[1].paths.config_file

            remoteJid.splice([Object.keys(remoteJid).map(chat => Object.keys(remoteJid[chat])[0])].indexOf(events['group-participants.update'].id), 1)
            writeFileSync(Path, JSON.stringify(Config))
        }

        if(events['messages.upsert'])
        {
            const Verified = Config.parameters.bot[0].trusted

            if(Verified !== 'trusted') Named({MP:MP})

            Read({MP: MP, typed: await Typed({events: events, client: MP})})
        }
    })
}

M_P(), (err) => console.log(`[MASTERPRICE ERROR] `, err)