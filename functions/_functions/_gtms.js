import { obj } from './_objc.js'

export const get_message = ({msg}) => {

    let is_msg =
    obj(msg[obj(msg)[0]][0])[0] === 'messageStubParameters'? obj(msg[obj(msg)[0]][0][obj(msg[obj(msg)[0]][0])[6]])[0]?.toString() :
    obj(msg[obj(msg)[0]][0])[0] === 'key'? obj(msg[obj(msg)[0]][0][obj(msg[obj(msg)[0]][0])[3]])[0]?.toString() :
    ""

    let Type = obj(msg[obj(msg)[0]][0])[0] === 'key'? 3 : 6

    let typed =
    is_msg === 'low'?
    msg[obj(msg)[0]][0][obj(msg[obj(msg)[0]][0])[8]] !== undefined?
    msg[obj(msg)[0]][0][obj(msg[obj(msg)[0]][0])[8]]?.toString() :
    msg[obj(msg)[0]][0][obj(msg[obj(msg)[0]][0])[7]]?.toString() :

    is_msg === 'extendedTextMessage'?
    msg[obj(msg)[0]][0][obj(msg[obj(msg)[0]][0])[Type]][is_msg][obj(msg[obj(msg)[0]][0][obj(msg[obj(msg)[0]][0])[Type]][is_msg])[0]].toString() :

    is_msg === 'conversation'?
    msg[obj(msg)[0]][0][obj(msg[obj(msg)[0]][0])[Type]][is_msg].toString() :

    is_msg === 'imageMessage'?
    msg[obj(msg)[0]][0][obj(msg[obj(msg)[0]][0])[Type]][is_msg][obj(msg[obj(msg)[0]][0][obj(msg[obj(msg)[0]][0])[Type]][is_msg])[4]].toString().length > 1?
    msg[obj(msg)[0]][0][obj(msg[obj(msg)[0]][0])[Type]][is_msg][obj(msg[obj(msg)[0]][0][obj(msg[obj(msg)[0]][0])[Type]][is_msg])[4]].toString() :
    '*Imagem*' :

    is_msg === 'videoMessage'?
    msg[obj(msg)[0]][0][obj(msg[obj(msg)[0]][0])[Type]][is_msg][obj(msg[obj(msg)[0]][0][obj(msg[obj(msg)[0]][0])[Type]][is_msg])[4]].toString().length > 1?
    msg[obj(msg)[0]][0][obj(msg[obj(msg)[0]][0])[Type]][is_msg][obj(msg[obj(msg)[0]][0][obj(msg[obj(msg)[0]][0])[Type]][is_msg])[4]].toString() :
    '*Video*' :

    is_msg === 'audioMessage'? '*Audio*' :
    is_msg === 'documentMessage'? '*Documento*' :
    is_msg === 'locationMessage'? '*Local*' :
    is_msg === 'protocolMessage'? '*Protocolo*' :
    is_msg === 'liveLocationMessage'? '*LocalizacaoAoVivo*' :
    is_msg === 'contactMessage'? '*Contato*' :
    is_msg === 'stickerMessage'? '*Figurinha*' :
    is_msg === 'productMessage'? '*Produto*' :
    is_msg === 'reactionMessage'? '*Reagir*' :
    is_msg === 'viewOnceMessage'? '*VerOculto*' :
    is_msg === 'listResponseMessage'? '*Respondeu_Lista*' :
    is_msg === 'buttonsResponseMessage'? '*Respondeu_Botao*' :
    is_msg === 'documentWithCaptionMessage'? '*Documento_Texto*' :
    is_msg === 'pollUpdateMessage'? '*Respondeu_Enquete*' :
    is_msg === 'senderKeyDistributionMessage'?

    msg[obj(msg)[0]][0][obj(msg[obj(msg)[0]][0])[Type]][obj(msg[obj(msg)[0]][0][obj(msg[obj(msg)[0]][0])[Type]])[2]][obj(msg[obj(msg)[0]][0][obj(msg[obj(msg)[0]][0])[Type]][obj(msg[obj(msg)[0]][0][obj(msg[obj(msg)[0]][0])[Type]])[2]])[0]].toString().length <= 1?
    msg[obj(msg)[0]][0][obj(msg[obj(msg)[0]][0])[Type]][obj(msg[obj(msg)[0]][0][obj(msg[obj(msg)[0]][0])[Type]])[2]].toString() :
    msg[obj(msg)[0]][0][obj(msg[obj(msg)[0]][0])[Type]][obj(msg[obj(msg)[0]][0][obj(msg[obj(msg)[0]][0])[Type]])[2]][obj(msg[obj(msg)[0]][0][obj(msg[obj(msg)[0]][0])[Type]][obj(msg[obj(msg)[0]][0][obj(msg[obj(msg)[0]][0])[Type]])[2]])[0]].toString() :

    is_msg === 'messageContextInfo'? obj(msg[obj(msg)[0]][0][obj(msg[obj(msg)[0]][0])[Type]]).includes('pollCreationMessage')? '*Enquete*' :

    'undefined' :

    'undefined'

    return typed
}
