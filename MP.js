import {
    makeWASocket,
    makeInMemoryStore,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    DisconnectReason,
    readFileSync,
    readdirSync,
    unlink,
    Browsers,
    writeFileSync,
    chalk,
    P,
    GetQR,
    render,
    Typed,
    Read,
    ora,
    Named,
    Config
} from './exports.js'

//
process.on('uncaughtException', function (err) {
    console.error(err.stack)
})

console.warn = () => {}
const msgRetryCounterMap = {}

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
        browser: Browsers.macOS('Desktop'),
        defaultQueryTimeoutMs: undefined,
        syncFullHistory: true,
        markOnlineOnConnect: true,
        auth: state,
        version
    })

    history?.bind(MP.ev)

    MP.ev.on('connection.update', async update => {

        //console.log(update)

        //console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse(Config.parameters.commands[2].messages.startup.onupdate))

        const { connection, lastDisconnect, receivedPendingNotifications, isOnline, qr = false } = update || {}

        if(qr){
            await GetQR(qr)
            console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse(`${Config.parameters.commands[2].messages.startup.onqrscan} ::: \n${qr || ''}`))
        }
        //if(isOnline) console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse(Config.parameters.commands[2].messages.startup.onstaging))
        //if(receivedPendingNotifications) console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse(Config.parameters.commands[2].messages.startup.onnotify))

        switch(connection){
            case 'close':
                console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse(Config.parameters.commands[2].messages.startup.ondownconnection))

                if((lastDisconnect.error)?.output?.statusCode === DisconnectReason.loggedOut) console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse('Ultima sessão desconectada.'))

                switch((lastDisconnect.error)?.output?.statusCode !== DisconnectReason.loggedOut){
                    case true:
                        if(Config.parameters.bot[0].trusted !== 'trusted') Named({MP:MP})
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
    })

    MP.ev.on('events.call', async e_call => {})
    MP.ev.on('creds.update', async cr_update => {
        await saveCreds()
    })
    MP.ev.on('contacts.upsert', async c_upsert => {
        console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse('Contatos Salvos.'))
    })
    MP.ev.on('messages.update', async m_update => {})
    MP.ev.on('message-receipt.update', async mr_update => {})
    MP.ev.on('messages.reaction', async m_reaction => {})
    MP.ev.on('messaging-history.set', async mh_set => {
        const { chats, contacts, messages, isLatest } = mh_set
        console.log(chalk.rgb(123, 45, 67).bgCyanBright.bold.inverse(`Recebidos:\nQuantidade de conversas ::: ${chats.length},\nQuantidade de contatos ::: ${contacts.length},\nQuantidade de mensagens ::: ${messages.length}`))
    })
    MP.ev.on('presence.update', async p_update => {})
    MP.ev.on('chats.update', async ch_update => {})
    MP.ev.on('chats.delete', async ch_delete => {})
    MP.ev.on('chats.upsert', async ch_upsert => {})
    MP.ev.on('group-participants.update', async gp_update => {
        const { remoteJid } = Config?.parameters?.metadata?.store[0] || {}
        remoteJid.splice([Object.keys(remoteJid).map(chat => Object.keys(remoteJid[chat])[0])].indexOf(gp_update.id), 1)
        writeFileSync(Config?.parameters?.commands[1]?.paths?.config_file || {}, JSON.stringify(Config))
    })
    MP.ev.on('messages.upsert', async msg_upsert => {
        try {
            await MP.sendPresenceUpdate('available', msg_upsert.messages[0].key.remoteJid)
            await MP.readMessages([msg_upsert.messages[0].key])
        } catch {}
        Read({MP: MP, typed: await Typed({events: msg_upsert, client: MP})})
        setTimeout(async () => await MP.sendPresenceUpdate('unavailable'), 10000);
    })

    //try { await MP.sendMessage('5516997437587@s.whatsapp.net', { text: 'oi', fromMe: false },) } catch (error){ console.log(error) }

}

//ora({ text: '...', spinner: 'dots12', color: 'red'}).start();
M_P()