/**/
/*const Array_Base =  [*/
/*'extendedTextMessage',*/
/*'pollCreationMessage',*/
/*'conversation',*/
/*'imageMessage',*/
/*'videoMessage',*/
/*'audioMessage',*/
/*'documentMessage',*/
/*'locationMessage',*/
/*'protocolMessage',*/
/*'liveLocationMessage',*/
/*'contactMessage',*/
/*'stickerMessage',*/
/*'productMessage',*/
/*'reactionMessage',*/
/*'viewOnceMessage',
/*'listResponseMessage',*/
/*'buttonsResponseMessage',*/
/*'documentWithCaptionMessage',*/
/*'pollUpdateMessage',*/
/*'low',*/
/*'senderKeyDistributionMessage',*/
/*'messageContextInfo',*/
/*'messageStubParameters',*/
/*'key'*/
/*]*/

export const Typed = ({events}) => {

    var Typed = ``
    var MessageType = Object.keys(events['messages.upsert']?.messages[0]?.message)[0]

    if(MessageType === 'senderKeyDistributionMessage') {
        if(events['messages.upsert'].messages[0].message[MessageType].groupId === 'status@broadcast') return 'Publicação de status detectada.'
        MessageType = Object.keys(events['messages.upsert']?.messages[0]?.message)[2] ?? 
        Object.keys(events['messages.upsert']?.messages[0]?.message)[0]
    }
    if(MessageType === 'messageContextInfo') MessageType = Object.keys(events['messages.upsert']?.messages[0]?.message)[1] ?? Object.keys(events['messages.upsert']?.messages[0]?.message)[0]

    switch(MessageType){
        case 'extendedTextMessage':
            Typed = events['messages.upsert']?.messages[0]?.message[MessageType]?.text ?? MessageType
        break
        case 'conversation':
            Typed = events['messages.upsert']?.messages[0]?.message[MessageType] ?? MessageType
        break
        case 'imageMessage':
            Typed = events['messages.upsert']?.messages[0]?.message[MessageType]?.caption ?? MessageType
        break
        case 'videoMessage':
            Typed = events['messages.upsert']?.messages[0]?.message[MessageType]?.caption ?? MessageType
        break
        case 'documentWithCaptionMessage':
            Typed = events['messages.upsert']?.messages[0]?.message[MessageType]?.message?.documentMessage?.caption ?? MessageType
        break
        case 'pollCreationMessage':
            Typed = events['messages.upsert']?.messages[0]?.message[MessageType]?.name ?? MessageType
            //Typed = events['messages.upsert']?.messages[0]?.message[MessageType]?.options ?? MessageType
        break
        case 'viewOnceMessage':
            Typed = `viewOnceMessage: `, events['messages.upsert']?.messages[0]?.message ?? `viewOnceMessage: `, MessageType
        break
        case 'messageStubParameters':
            Typed = `messageStubParameters: `, events['messages.upsert']?.messages[0]?.message ?? `messageStubParameters: `, MessageType
        break
        case 'key':
            Typed = `key: `, events['messages.upsert']?.messages[0]?.message ?? `key: `, MessageType
        break
        case 'low':
            Typed = `low: `, events['messages.upsert']?.messages[0]?.message ?? `low: `, MessageType
        break
        case 'protocolMessage':
            Typed = `Protocolo: `, events['messages.upsert']?.messages[0]?.message ?? MessageType
        break
        default:
            Typed = `Tipo: ${MessageType} Menssagem:`, events['messages.upsert']?.messages[0]?.message ?? events['messages.upsert']?.messages[0] ?? events['messages.upsert']
        break
    }

    return Typed
}