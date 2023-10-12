//import :p
import {
  sectionMenu,
  Config,
  Spam,
  isSpam,
  Cooldown,
  isColling,
  DownColling,
  sizeCooldown,
  doIgnore,
  IsIgnoring,
  CreateSticker,
  GPT,
  Owner,
  Restrict,
  Provide,
  Delay,
  GetImage,
  sendReaction,
  sendMessageQuoted,
} from '../exports.js'

//
export const commands = async ({ MP, typed }) => {

    const { ...Boolean } = typed?.boolean || {}
    const { ...message } = typed?.parameters || {}
    const { messageText: Message = {}, ...Sender } = message?.details[1]?.sender || {}

    const {
      isGroup: ehGrupo = {},
      isOwner: ehDono = {},
      isAdmin: ehAdmin = {},
      message: [
        { isQuotedMessage: iQtdMss } = {}
      ] = []
    } = Boolean || {}

    const {
      messageNumber: ClienteNumero = {}
    } = Sender || {}

    const {
      details: [
        { messageJid: remoteJid = {}, messageId = {}, messageAll = {}, messageKey = {}, messageContent: { stickerMessage: sticker = {}, imageMessage: image = {}, videoMessage: video = {} } = {}, messageQuoted = {}, messageType = {}, messageContextinfo = {}, messageQuotedText = {}, text = {} } = {},
        { sender: { messageNumber: number = {}, messageText = {} } = {} } = {}
      ] = []
    } = message || {};

    const { quotedMessage: { stickerMessage: qsticker, imageMessage: Qimage, videoMessage: Qvideo } = {} } = messageQuoted || {};

    const {
      parameters: {
        bot: [
          {
            prefix:{
              set: Prefixo = '!'
            } = {},
            owners: Donos = []
          } = {}
        ],
        commands: [
          {
            execution: [
              {
                onerror: ComandoDeErro = {},
                ongoing: ComandoEmEspera = {},
                onsucess: ComandoDeOK = {}
              } = {},
              {
                unsafe: ehInseguro = {}
              } = {},
              {
                local: ehGrupoOUPV  ={}
              } = {}
            ] = []
          } = {},
          {} = {},
          {
            messages: {
              handler: [
                {
                  oncooldown: MensagemDeEmEspera = {},
                  onstopp: MensagemDeParada = {},
                  onflood: MensagemDeOcupado = {},
                  ononlygroup: MensagemDeGrupo = {},
                  onawaitqueue: MensagemDePendente = {},
                  onnoowner: MensagemNaoDono = {},
                  onnotfound: MensagemNaoEncontrado = {},
                  ontax: MensagemDeTaxa = {}
                } = {}
              ] = []
            } = {}
          } = {}
        ] = [],
      } = {}
    } = Config || {}

    const _args = ((Message?.replace(/\n/g, ' ')?.match(new RegExp(`^${Prefixo}(.+)$`, 'i')))[1]?.trim()?.split(/\s+/))?.map(arg => arg?.toLowerCase()) || [];

    let Checker = ''
    if(await (async () => {
      if (ehGrupoOUPV.includes(_args[0]) && !ehGrupo) return Checker = 'Cammon user using group only command on private chat.'
      if (!ehInseguro.includes(_args[0])) {
        if (!ehAdmin && !ehDono) return Checker = 'Cammon member using owner commands.'
        if (ehAdmin && !ehDono) return Checker = 'Administrator trying to use owner commands.'
      }
      if(IsIgnoring(remoteJid)) return Checker = 'Spamming!'
      if (isColling(remoteJid)) return Checker = 'Awaiting the queue!'
      if (isSpam(remoteJid)) return Checker = 'Spamming?'
      console.log(sizeCooldown())
      if (sizeCooldown().size >= 1) return Checker = 'Await other users queue!'
      Spam(remoteJid)
      return 'Clear.'
    })() !== 'Clear.') {
      console.log(`The user from ${remoteJid} was blocked. Code: "${Checker}"`)
      switch (Checker) {
        case 'Cammon user using group only command on private chat.':
          await sendMessageQuoted({ Cliente: MP, ClienteJid: remoteJid, ClienteTopo: messageAll, ClienteResposta: MensagemDeGrupo });
        break;
        case 'Cammon member using owner commands.':
          await sendMessageQuoted({ Cliente: MP, ClienteJid: remoteJid, ClienteTopo: messageAll, ClienteResposta: MensagemDeParada });
        break
        case 'Administrator trying to use owner commands.':
          await sendMessageQuoted({ Cliente: MP, ClienteJid: remoteJid, ClienteTopo: messageAll, ClienteResposta: MensagemDeTaxa });
        break
        case 'Spamming!':
          await sendMessageQuoted({ Cliente: MP, ClienteJid: remoteJid, ClienteTopo: messageAll, ClienteResposta: 'Sem spam!' });
        break
        case 'Awaiting the queue!':
          await sendMessageQuoted({ Cliente: MP, ClienteJid: remoteJid, ClienteTopo: messageAll, ClienteResposta: MensagemDeEmEspera });
          doIgnore(remoteJid)
        break
        case 'Spamming?':
          await sendMessageQuoted({ Cliente: MP, ClienteJid: remoteJid, ClienteTopo: messageAll, ClienteResposta: MensagemDeOcupado });
          doIgnore(remoteJid)
        break
        case 'Await other users queue!':
          await sendMessageQuoted({ Cliente: MP, ClienteJid: remoteJid, ClienteTopo: messageAll, ClienteResposta: MensagemDePendente });
          doIgnore(remoteJid)
        break
        default:
          await sendMessageQuoted({ Cliente: MP, ClienteJid: remoteJid, ClienteTopo: messageAll, ClienteResposta: 'Este comando não pôde ser executado.' });
        break;
      }
      return await sendReaction({ Cliente: MP, ClienteJid: remoteJid, ClienteId: messageId, ClienteNumero: ClienteNumero, ClienteResposta: ComandoDeErro })
    }

    const isOwner = async () => {
      if(!Donos.includes(ClienteNumero)) {
        await sendMessageQuoted({ client: MP, mJid: remoteJid, mAll: messageAll, answer: MensagemNaoDono });
        await sendReaction({ client: MP, mJid: remoteJid, mId: messageId, mAll: number, answer: ComandoDeErro })
        return 'Lascou'
      }
    }

    async function run ({ _args }){

      Cooldown(remoteJid)

      switch (_args[0]) {
        // case "menu":
        //   //await sectionMenu({ client: MP, param: remoteJid })
        //   break;
        case "gpt":
          await GPT({ client: MP, _args: _args, remoteJid: remoteJid, isQuotedMessage: iQtdMss, messageType: messageType, messageAll: messageAll, messageText: messageText, messageQuoted: messageQuoted, messageQuotedText: messageQuotedText, messageContextinfo: messageContextinfo, text: text });
          break;
        // case "provide":
        // case "unprovide":
        //   if (isOwner) break
        //   //await Provide({ MP: MP, message: message, _args: _args });
        //   break;
        // case "restrict":
        // case "unrestrict":
        //   if (isOwner) break
        //   //await Restrict({ MP: MP, message: message, _args: _args });
        //   break;
        // case "addowner":
        // case "removeowner":
        //   if (isOwner) break
        //   //await Owner({ MP: MP, message: message, _args: _args });
        //   break;
        case "figurinha":
        case "figurinh":
        case "figurin":
        case "figuri":
        case "figur":
        case "figu":
        case "fig":
        case "fi":
        case "f":
          await CreateSticker({ Cliente: MP, ClienteJid: remoteJid, ClienteTopo: messageAll, image: image, video: video, Qimage: Qimage, Qvideo: Qvideo });
          break;
        case "df":
          await GetImage({ client: MP, mStick: sticker, qStick: qsticker, mJid: remoteJid, mAll: messageAll })
        break
        default:
          await sendMessageQuoted({ Cliente: MP, ClienteJid: remoteJid, ClienteTopo: messageAll, ClienteResposta: MensagemNaoEncontrado });
          await sendReaction({ Cliente: MP, ClienteJid: remoteJid, ClienteId: messageId, ClienteNumero: ClienteNumero, ClienteResposta: ComandoDeErro })
        break
      }

      // await new Promise(resolve => setTimeout(resolve, 1000)).then( async () => await sendReaction({ Cliente: MP, ClienteJid: remoteJid, ClienteId: messageId, ClienteNumero: ClienteNumero, ClienteResposta: ComandoDeOK }))
    }

    await sendReaction({ Cliente: MP, ClienteJid: remoteJid, ClienteId: messageId, ClienteNumero: ClienteNumero, ClienteResposta: ComandoEmEspera })
    await run({ _args: _args })
    await sendReaction({ Cliente: MP, ClienteJid: remoteJid, ClienteId: messageId, ClienteNumero: ClienteNumero, ClienteResposta: ComandoDeOK })
    Spam(remoteJid);
    DownColling(remoteJid)

    return
}
