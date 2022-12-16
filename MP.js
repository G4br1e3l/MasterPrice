import Baileys from '@adiwajshing/baileys'
const { default: makeWASocket, makeInMemoryStore, useMultiFileAuthState, makeCacheableSignalKeyStore, Browsers, fetchLatestBaileysVersion, DisconnectReason } = Baileys
import { readFileSync, readdirSync, unlink } from "fs"
import P from 'pino'
import CFonts from 'cfonts'
const { render } = CFonts
import chalk from "chalk"
import { Read } from './functions/reader.js'
import { named } from './functions/_functions/_cfgd.js'
import { Typed } from './functions/_functions/_fmsg.js'

process.on('uncaughtException', function (err) {
    //console.error(err.stack)
})

const MSG = JSON.parse(readFileSync('./root/messages.json', 'utf8'))
const PACKAGE = JSON.parse(readFileSync('./package.json', 'utf8'))
var set_me = JSON.parse(readFileSync("./root/config.json"))

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
        browser: Browsers.macOS('Desktop'),
        syncFullHistory: true,
        auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, logger) }
    })

    if(set_me.bot.verified !== ('DONE')) named({MP:MP})

    MP.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        try { if (update.receivedPendingNotifications === true){ console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse(`As notificações pendentes foram recebidas.`)) } else {}} catch {}
        switch(connection){
            case 'close':
                const PossoReconectar = (lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut
                console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse(MSG.params.index.downconnection))

                switch(PossoReconectar){
                    case true:
                        console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse(MSG.params.index.reconecting))
                        M_P()
                    break
                    case false:
                        console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse(MSG.params.index.lostconnection))
                        let files = readdirSync('./root/connections')
                        files.forEach(file => {
                            unlink(`./root/connections/${file}`, (() => {}))
                        })
                        M_P()
                    break
                }
            break
            case 'open':
                console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse(MSG.params.index.online.replaceAll('@botname', CFG.bot.name)))
            break
            case 'connecting':
                console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse('Conectando..'))
            break
        }
    })

    MP.ev.on("creds.update", saveCreds )

    history?.bind(MP.ev)

    MP.ev.process(async(events) => {
        if(events['messages.upsert']) {
            if(events['messages.upsert']?.messages[0]?.key?.fromMe === true) return
            Read({MP: MP, typed: Typed({events: events}), message: events['messages.upsert']})
        }
    })

    return MP
}

M_P()