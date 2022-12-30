//
import Baileys from '@adiwajshing/baileys'
const { default: makeWASocket, makeInMemoryStore, useMultiFileAuthState, makeCacheableSignalKeyStore, proto, Browsers, fetchLatestBaileysVersion, DisconnectReason } = Baileys
import { readFileSync, readdirSync, unlink, watchFile, unwatchFile } from "fs"
import P from 'pino'
import CFonts from 'cfonts'
const { render } = CFonts
import chalk from "chalk"

//
import { Read } from './functions/reader.js'
import { named } from './functions/_functions/_cfgd.js'
import { Typed } from './functions/_functions/_fmsg.js'
import { Key } from './functions/_functions/_dlay.js'
//
process.on('uncaughtException', function (err) {
    console.error(err.stack) 
})

console.warn = () => {};

//
const MSG = JSON.parse(readFileSync('./root/messages.json', 'utf8'))
const PACKAGE = JSON.parse(readFileSync('./package.json', 'utf8'))
const set_me = JSON.parse(readFileSync("./root/config.json"))

//
const MAIN_LOGGER = P({ timestamp: () => `,"time":"${new Date().toJSON()}"` })

const logger = MAIN_LOGGER.child({ })
logger.level = 'silent'
logger.stream = 'store'

const msgRetryCounterMap = {}

const history = !process.argv.includes('--no-store')? makeInMemoryStore({ logger: P({ level: 'silent', stream: "store", transport: { target: 'pino-pretty', options: { levelFirst: true, /*ignore: 'pid,hostname,node,browser,helloMsg,path',*/ colorize: true }}})}) : undefined

history?.readFromFile('./root/connections/history.json')

setInterval(() => { history?.writeToFile('./root/connections/history.json') }, 10_000)

async function M_P() {

    const { state, saveCreds } = await useMultiFileAuthState('./root/connections')
    const { version, isLatest } = await fetchLatestBaileysVersion()

    var CFG = JSON.parse(readFileSync('./root/config.json', 'utf8'))
    console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse(render((`${CFG.bot.name} Por ${PACKAGE.author.split(' ')[0]} v.${PACKAGE.version}`), { font: 'shade', align: 'left', colors: 'redBright', background: 'transparent', letterSpacing: 1, lineHeight: 0, space: true, maxLength: 0, gradient: true, independentGradient: false, transitionGradient: true, env: 'node' }).string))
    console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse(render((`${PACKAGE.name} - ${PACKAGE.description} |Versao Atual: ${version} Atualizado: ${isLatest}`), { font: 'console', align: 'left', colors: 'redBright', background: 'transparent', letterSpacing: 0, lineHeight: 0, space: true, maxLength: 0, gradient: true, independentGradient: true, transitionGradient: true, env: 'node' }).string))

    const MP = makeWASocket({
        logger: P({ level: 'silent', stream: "store", transport: { target: 'pino-pretty', options: { levelFirst: true, /*ignore: 'pid,hostname,node,browser,helloMsg,path',*/ colorize: true }}}),
        msgRetryCounterMap,
        generateHighQualityLinkPreview: true,
        printQRInTerminal: true,
        browser: ['MasterPrice', 'Safari', '1.0.0'], 
        defaultQueryTimeoutMs: undefined,
        syncFullHistory: true,
        markOnlineOnConnect: true,
        auth: { creds: state.creds },
        version: version
    })

    history?.bind(MP.ev)

    MP.ev.process(async(events) => {

        if(events['connection.update']) {

            console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse(MSG.connect.updating))
            
            const { connection, lastDisconnect, receivedPendingNotifications, isOnline, qr } = events['connection.update']
            
            if(qr) console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse(MSG.connect.qrscan))
            if(isOnline) console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse(MSG.connect.staging))
            if(receivedPendingNotifications) console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse(MSG.connect.notify))
            
            switch(connection){
                case 'close':
                    console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse(MSG.connect.downconnection))

                    if((lastDisconnect.error)?.output?.statusCode === DisconnectReason.loggedOut) console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse('Ultima sessão desconectada.'))

                    switch((lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut){
                        case true:
                            console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse(MSG.connect.reconecting))
                            await M_P()
                        break
                        case false:
                            console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse(MSG.connect.lostconnection))
                            let files = readdirSync('./root/connections')
                            files.forEach(file => { unlink(`./root/connections/${file}`, (() => { })) })
                            await M_P()
                        break
                    }
                break
                case 'open':
                    console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse(MSG.connect.connected.replaceAll('@botname', CFG.bot.name)))
                break
                case 'connecting':
                    console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse(MSG.connect.connecting))
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
            //console.log('group participants update ', events['group-participants.update'])
        }

        if(events['messages.upsert']) {
            if(!set_me.bot.verified.includes('DONE')) named({MP:MP})
            Read({MP: MP, typed: Typed({events: events}), message: events['messages.upsert']})
        }
    })

    return MP
}

M_P(), (err) => console.log(`[MASTERPRICE ERROR] `, err)
