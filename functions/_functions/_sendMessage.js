//import :p
import { readFileSync } from "fs";

/**
 * Atrasa a execução de uma função por um determinado período de tempo.
 * @param {number} milliseconds - O número de milissegundos para atrasar a execução da função.
 * @returns {Promise} Uma promessa que resolve após o número de milissegundos especificado.
 */
import { Delay } from "./_functionsMessage.js";

/**
 * Assina a presença de um usuário para receber atualizações de presença dele.
 * @param {object} options - As opções para assinar a presença.
 * @param {import('whatsapp-web.js').Client} options.client - O cliente do WhatsApp.
 * @param {string} options.Jid - O JID do usuário cuja presença será assinada.
 * @returns {Promise<object>} Uma promessa que resolve em um objeto que representa a presença assinada.
 */
const presenceSubscribe = async ({ client, Jid }) =>
  client.presenceSubscribe(Jid);

/**
 * Envia uma atualização de "digitando" para um usuário.
 * @param {object} options - As opções para enviar a atualização de "digitando".
 * @param {import('whatsapp-web.js').Client} options.client - O cliente do WhatsApp.
 * @param {string} options.Jid - O JID do usuário para quem a atualização de "digitando" será enviada.
 * @returns {Promise<object>} Uma promessa que resolve em um objeto que representa a atualização enviada.
 */
const sendComposingUpdate = async ({ client, Jid }) =>
  client.sendPresenceUpdate("composing", Jid);

/**
 * Envia uma atualização de "pausado" para um usuário.
 * @param {object} options - As opções para enviar a atualização de "pausado".
 * @param {import('whatsapp-web.js').Client} options.client - O cliente do WhatsApp.
 * @param {string} options.Jid - O JID do usuário para quem a atualização de "pausado" será enviada.
 * @returns {Promise<object>} Uma promessa que resolve em um objeto que representa a atualização enviada.
 */
const sendPausedUpdate = async ({ client, Jid }) =>
  client.sendPresenceUpdate("paused", Jid);

/**
 * Realiza ações para simular a digitação de mensagens pelo usuário em um chat do WhatsApp.
 * @async
 * @function Type
 * @param {object} params - Objeto contendo os parâmetros de entrada da função.
 * @param {import('whatsapp-web.js').Client} params.client - Instância do cliente do WhatsApp Web.
 * @param {string} params.messageJid - Jid da mensagem que está sendo respondida.
 * @returns {Promise<void>}
 */
export async function Type({ client, messageJid }) {
  // Inscreve-se para receber atualizações de presença
  await presenceSubscribe({ client, Jid: messageJid });
  // Aguarda um breve intervalo de tempo
  await Delay(1000);

  // Envia um status de composição de mensagem para o destinatário
  await sendComposingUpdate({ client, Jid: messageJid });

  // Aguarda um breve intervalo de tempo
  await Delay(500);

  // Envia um status de pausa de digitação para o destinatário
  await sendPausedUpdate({ client, Jid: messageJid });

  // Retorna vazio
  return;
}

/**
 * Envia uma mensagem contendo uma imagem com legenda em resposta a uma mensagem citada.
 * @async
 * @function sendCaptionImageQuoted
 * @param {object} params - Objeto contendo os parâmetros de entrada da função.
 * @param {import('whatsapp-web.js').Client} params.client - Instância do cliente do WhatsApp Web.
 * @param {object} params.param - Objeto contendo detalhes sobre a mensagem citada e seu remetente.
 * @param {string} params.answer - Texto da legenda da imagem.
 * @param {string} params.path_image - Caminho do arquivo da imagem a ser enviada.
 * @returns {Promise<void>}
 */
export async function sendCaptionImageQuoted({
  client,
  param,
  answer,
  path_image
}) {
  // Extrai as informações da mensagem citada
  const {
    details: [{ messageJid, messageAll }]
  } = param;

  /**
   * Envia uma mensagem para um JID.
   * @param {object} options - As opções para enviar a mensagem.
   * @param {string} options.Jid - O JID do destinatário da mensagem.
   * @param {string} options.answer - A mensagem a ser enviada.
   * @param {object} options.client - O cliente do WhatsApp.
   * @param {object} options.quoted - A mensagem a ser marcada.
   * @param {string} options.path_image - O caminho para resolver a imagem.
   * @returns {Promise<object>} Uma promessa que resolve em um objeto que representa a mensagem enviada.
   */
  const sendMessage = async ({ Jid, answer, client, quoted, path_image }) =>
    await client.sendMessage(
      Jid,
      {
        image: readFileSync(path_image),
        caption: answer,
        contextInfo: {
          mentionedJid: [Jid]
        }
      },
      {
        quoted
      }
    );

  // Chama a função sendMessage com os parâmetros adequados
  return await sendMessage({
    Jid: messageJid,
    answer,
    client,
    quoted: messageAll,
    path_image
  });
}

/**
 * Envia uma mensagem contendo uma imagem com legenda, simulando a digitação do usuário.
 * @async
 * @function sendCaptionImageTyping
 * @param {object} params - Objeto contendo os parâmetros de entrada da função.
 * @param {import('whatsapp-web.js').Client} params.client - Instância do cliente do WhatsApp Web.
 * @param {object} params.param - Objeto contendo detalhes sobre a mensagem remetente.
 * @param {string} params.answer - Texto da legenda da imagem.
 * @param {string} params.path_image - Caminho do arquivo da imagem a ser enviada.
 * @returns {Promise<void>}
 */
export async function sendCaptionImageTyping({
  client,
  param,
  answer,
  path_image
}) {
  // Extrai as informações do remetente da mensagem
  const {
    details: [{ messageJid },]
  } = param;

  /**
   * Envia uma mensagem para um JID.
   * @param {object} options - As opções para enviar a mensagem.
   * @param {string} options.Jid - O JID do destinatário da mensagem.
   * @param {string} options.answer - A mensagem a ser enviada.
   * @param {object} options.client - O cliente do WhatsApp.
   * @param {string} options.path_image - O caminho para resolver a imagem.
   * @returns {Promise<object>} Uma promessa que resolve em um objeto que representa a mensagem enviada.
   */
  const sendMessage = async ({ Jid, answer, client, path_image }) =>
    await client.sendMessage(Jid, {
      image: readFileSync(path_image),
      caption: answer,
      contextInfo: {
        mentionedJid: [Jid]
      }
    });

  // Aguarda um breve intervalo para simular a digitação do usuário
  await Type({ client, messageJid });

  // Chama a função sendMessage com os parâmetros adequados
  return await sendMessage({ Jid: messageJid, answer, client, path_image });
}

/**
 * Envia uma mensagem contendo uma imagem com legenda, citando a mensagem anterior e simulando a digitação do usuário.
 * @async
 * @function sendCaptionImageTypingQuoted
 * @param {object} params - Objeto contendo os parâmetros de entrada da função.
 * @param {import('whatsapp-web.js').Client} params.client - Instância do cliente do WhatsApp Web.
 * @param {object} params.param - Objeto contendo detalhes sobre a mensagem remetente.
 * @param {string} params.answer - Texto da legenda da imagem.
 * @param {string} params.path_image - Caminho do arquivo da imagem a ser enviada.
 * @returns {Promise<void>}
 */
export async function sendCaptionImageTypingQuoted({
  client,
  param,
  answer,
  path_image
}) {
  // Extrai as informações do remetente e da mensagem citada
  const {
    details: [{ messageJid, messageAll }]
  } = param;

  /**
   * Envia uma mensagem para um JID.
   * @param {object} options - As opções para enviar a mensagem.
   * @param {string} options.Jid - O JID do destinatário da mensagem.
   * @param {string} options.answer - A mensagem a ser enviada.
   * @param {object} options.client - O cliente do WhatsApp.
   * @param {object} options.quoted - A mensagem a ser marcada.
   * @param {string} options.path_image - O caminho para resolver a imagem.
   * @returns {Promise<object>} Uma promessa que resolve em um objeto que representa a mensagem enviada.
   */
  const sendMessage = async ({ Jid, answer, client, quoted, path_image }) =>
    await client.sendMessage(
      Jid,
      {
        image: readFileSync(path_image),
        caption: answer,
        contextInfo: {
          mentionedJid: [Jid]
        }
      },
      {
        quoted
      }
    );

  // Aguarda um breve intervalo para simular a digitação do usuário
  await Type({ client, messageJid });

  // Chama a função sendMessage com os parâmetros adequados
  return await sendMessage({
    Jid: messageJid,
    answer,
    client,
    quoted: messageAll,
    path_image
  });
}

/**
 * Envia uma mensagem de texto citando a mensagem anterior.
 * @async
 * @function sendMessageQuoted
 * @param {object} params - Objeto contendo os parâmetros de entrada da função.
 * @param {import('whatsapp-web.js').Client} params.client - Instância do cliente do WhatsApp Web.
 * @param {object} params.param - Objeto contendo detalhes sobre a mensagem remetente.
 * @param {string} params.answer - Texto da mensagem a ser enviada.
 * @returns {Promise<void>}
 */
export async function sendMessageQuoted({ client, param, answer }) {
  // Extrai as informações do remetente e da mensagem citada
  const {
    details: [{ messageJid, messageAll, messageQuoted }]
  } = param;

  const replayQuoted = {
    key: {
      remoteJid: messageQuoted?.participant || {},
      fromMe: false,
      id: messageQuoted?.stanzaId || {}
    },
    message: {}
  };

  /**
   * Envia uma mensagem para um JID.
   * @param {object} options - As opções para enviar a mensagem.
   * @param {string} options.Jid - O JID do destinatário da mensagem.
   * @param {string} options.answer - A mensagem a ser enviada.
   * @param {object} options.client - O cliente do WhatsApp.
   * @param {object} options.quoted - A mensagem a ser marcada.
   * @returns {Promise<object>} Uma promessa que resolve em um objeto que representa a mensagem enviada.
   */
  const sendMessage = async ({ Jid, answer, client, quoted }) =>
    await client.sendMessage(
      Jid,
      {
        text: answer,
        fromMe: false,
        contextInfo: {
          mentionedJid: [Jid]
        }
      },
      {
        quoted
      }
    );

  // Chama a função sendMessage com os parâmetros adequados
  return await sendMessage({
    Jid: messageJid,
    answer,
    client,
    quoted: messageAll
  });
}

/**
 * Envia uma mensagem de texto para um JID.
 * @async
 * @function sendMessage
 * @param {object} params - Objeto contendo os parâmetros de entrada da função.
 * @param {import('whatsapp-web.js').Client} params.client - Instância do cliente do WhatsApp Web.
 * @param {object} params.param - Objeto contendo detalhes sobre a mensagem remetente.
 * @param {string} params.answer - Texto da mensagem a ser enviada.
 * @returns {Promise<void>}
 */
export async function sendMessage({ client, param, answer }) {
  // Extrai o Jid da mensagem remetente
  const {
    details: [{ messageJid }]
  } = param;

  /**
   * Envia uma mensagem para um JID.
   * @param {object} options - As opções para enviar a mensagem.
   * @param {string} options.Jid - O JID do destinatário da mensagem.
   * @param {string} options.answer - A mensagem a ser enviada.
   * @param {object} options.client - O cliente do WhatsApp.
   * @returns {Promise<object>} Uma promessa que resolve em um objeto que representa a mensagem enviada.
   */
  const sendMessage = async ({ Jid, answer, client }) =>
    await client.sendMessage(Jid, {
      text: answer,
      contextInfo: {
        mentionedJid: [Jid]
      }
    });

  // Chama a função sendMessage com os parâmetros adequados
  return await sendMessage({
    Jid: messageJid,
    answer,
    client
  });
}

/**
 * Envia uma mensagem de texto simulando a digitação do usuário.
 * @async
 * @function sendMessageTyping
 * @param {object} params - Objeto contendo os parâmetros de entrada da função.
 * @param {import('whatsapp-web.js').Client} params.client - Instância do cliente do WhatsApp Web.
 * @param {object} params.param - Objeto contendo detalhes sobre a mensagem remetente.
 * @param {string} params.answer - Texto da mensagem a ser enviada.
 * @returns {Promise<void>}
 */
export async function sendMessageTyping({ client, param, answer }) {
  // Extrai as informações do remetente da mensagem
  const {
    details: [{ messageJid }]
  } = param;

  /**
   * Envia uma mensagem para um JID.
   * @param {object} options - As opções para enviar a mensagem.
   * @param {string} options.Jid - O JID do destinatário da mensagem.
   * @param {string} options.answer - A mensagem a ser enviada.
   * @param {object} options.client - O cliente do WhatsApp.
   * @returns {Promise<object>} Uma promessa que resolve em um objeto que representa a mensagem enviada.
   */
  const sendMessage = async ({ Jid, answer, client }) =>
    await client.sendMessage(Jid, {
      text: answer,
      contextInfo: {
        mentionedJid: [Jid]
      }
    });

  // Aguarda um breve intervalo para simular a digitação do usuário
  await Type({ client, messageJid });

  // Chama a função sendMessage com os parâmetros adequados
  return await sendMessage({ Jid: messageJid, answer, client });
}

/**
 * Envia uma mensagem de texto simulando a digitação do usuário e citando a mensagem anterior.
 * @async
 * @function sendMessageTypingQuoted
 * @param {object} params - Objeto contendo os parâmetros de entrada da função.
 * @param {import('whatsapp-web.js').Client} params.client - Instância do cliente do WhatsApp Web.
 * @param {object} params.param - Objeto contendo detalhes sobre a mensagem remetente.
 * @param {string} params.answer - Texto da mensagem a ser enviada.
 * @returns {Promise<void>}
 */
export async function sendMessageTypingQuoted({ client, param, answer }) {
  // Extrai as informações do remetente e da mensagem citada
  const {
    details: [{ messageJid, messageAll }]
  } = param;

  /**
   * Envia uma mensagem de texto com uma mensagem citada para um JID.
   * @param {object} options - As opções para enviar a mensagem.
   * @param {string} options.Jid - O JID do destinatário da mensagem.
   * @param {string} options.answer - A mensagem a ser enviada.
   * @param {object} options.client - O cliente do WhatsApp.
   * @param {object} options.quoted - A mensagem a ser marcada.
   * @returns {Promise<object>} Uma promessa que resolve em um objeto que representa a mensagem enviada.
   */
  const sendMessage = async ({ Jid, answer, client, quoted }) =>
    await client.sendMessage(
      Jid,
      {
        text: answer,
        contextInfo: {
          mentionedJid: [Jid]
        }
      },
      {
        quoted
      }
    );

  // Aguarda um breve intervalo para simular a digitação do usuário
  await Type({ client, messageJid });

  // Chama a função sendMessage com os parâmetros adequados
  return await sendMessage({
    Jid: messageJid,
    answer,
    client,
    quoted: messageAll
  });
}

/**
 * Envia uma mensagem contendo uma imagem com legenda.
 * @async
 * @function sendCaptionImage
 * @param {object} params - Objeto contendo os parâmetros de entrada da função.
 * @param {import('whatsapp-web.js').Client} params.client - Instância do cliente do WhatsApp Web.
 * @param {object} params.param - Objeto contendo detalhes sobre a mensagem remetente.
 * @param {string} params.answer - Texto da legenda da imagem.
 * @param {string} params.path_image - Caminho do arquivo da imagem a ser enviada.
 * @returns {Promise<void>}
 */
export async function sendCaptionImage({ client, param, answer, path_image }) {
  // Extrair o JID do remetente da mensagem original
  const {
    details: [{ messageJid }]
  } = param;

  /**
   * Envia uma mensagem para um JID.
   * @param {object} options - As opções para enviar a mensagem.
   * @param {string} options.Jid - O JID do destinatário da mensagem.
   * @param {string} options.answer - A mensagem a ser enviada.
   * @param {object} options.client - O cliente do WhatsApp.
   * @returns {Promise<object>} Uma promessa que resolve em um objeto que representa a mensagem enviada.
   */
  const sendMessage = async ({ Jid, answer, client }) =>
    await client.sendMessage(Jid, {
      image: readFileSync(path_image),
      caption: answer,
      contextInfo: {
        mentionedJid: [Jid]
      }
    });

  // Chamar a função sendMessage com os parâmetros apropriados
  return await sendMessage({
    Jid: messageJid,
    answer,
    client
  });
}

/**
 * Envia uma reação a uma mensagem.
 * @async
 * @function sendReaction
 * @param {object} params - Objeto contendo os parâmetros de entrada da função.
 * @param {import('whatsapp-web.js').Client} params.client - Instância do cliente do WhatsApp Web.
 * @param {object} params.param - Objeto contendo detalhes sobre a mensagem remetente.
 * @param {string} params.answer - Texto da reação.
 * @returns {Promise<void>}
 */
export async function sendReaction({ client, param, answer }) {
  // Extrai as informações do remetente e da mensagem citada
  const {
    details: [
      { messageJid, messageId },
      {
        sender: { messageNumber: number = `${number ?? 0}@s.whatsapp.net` }
      }
    ]
  } = param;

  /**
   * Envia uma mensagem para um JID.
   * @param {object} options - As opções para enviar a mensagem.
   * @param {string} options.Number - O número do remetente da mensagem citada.
   * @param {string} options.ID - O ID da mensagem citada.
   * @param {string} options.Jid - O JID do destinatário da mensagem.
   * @param {string} options.answer - A mensagem a ser enviada.
   * @param {object} options.client - O cliente do WhatsApp.
   * @returns {Promise<object>} Uma promessa que resolve em um objeto que representa a mensagem enviada.
   */
  const sendMessage = async ({ Number, ID, Jid, answer, client }) =>
    await client.sendMessage(Jid, {
      react: {
        key: {
          remoteJid: Jid,
          fromMe: false,
          id: ID,
          participant: [Number]
        },
        text: answer
      }
    });

  // Chama a função sendMessage com os parâmetros adequados
  return await sendMessage({
    Number: number,
    ID: messageId,
    Jid: messageJid,
    answer,
    client
  });
}
