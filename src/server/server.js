import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import socketIO from 'socket.io';

import series from 'async/series';
import Deezer from 'deezer-node-api';

import send from './send';

const dz = new Deezer();

let WAITING_FOR_SONG = false;

import routes from './routes';
import signature from './signature';

const app = express();
const port = process.env.PORT || '3000';
const server = http.createServer(app);
const io = socketIO(server);

app.set('port', port);

app.use(bodyParser.json({
    verify: signature.verifyRequestSignature
}));
app.use('/', routes);
app.use(express.static('./public'));

app.get('/*', (req, res) => {
    res.sendFile('index.html', {
        root: './public'
    });
});

io.on('connection', (socket) => {
    console.log('Client connected');
    socket.on('disconnect', () => console.log('Client disconnected'));
});

server.listen(port, () => console.log(`API running on localhost:${port}`));

export default {
    /*
     * Authorization Event
     *
     * The value for 'optin.ref' is defined in the entry point. For the "Send to
     * Messenger" plugin, it is the 'data-ref' field. Read more at
     * https://developers.facebook.com/docs/messenger-platform/webhook-reference/authentication
     *
     */
    receivedAuthentication({
        sender,
        recipient,
        timestamp,
        optin
    }) {
        const senderID = sender.id;
        const recipientID = recipient.id;
        const timeOfAuth = timestamp;

        // The 'ref' field is set in the 'Send to Messenger' plugin, in the 'data-ref'
        // The developer can set this to an arbitrary value to associate the
        // authentication callback with the 'Send to Messenger' click event. This is
        // a way to do account linking when the user clicks the 'Send to Messenger'
        // plugin.
        const passThroughParam = optin.ref;

        console.log("Received authentication for user %d and page %d with pass " +
            "through param '%s' at %d", senderID, recipientID, passThroughParam,
            timeOfAuth);

        // When an authentication is received, we'll send a message back to the sender
        // to let them know it was successful.
        send.sendTextMessage(senderID, "Authentication successful");
    },


    /*
     * Message Event
     *
     * This event is called when a message is sent to your page. The 'message'
     * object format can vary depending on the kind of message that was received.
     * Read more at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-received
     *
     * For this example, we're going to echo any text that we get. If we get some
     * special keywords ('button', 'generic', 'receipt'), then we'll send back
     * examples of those bubbles to illustrate the special message bubbles we've
     * created. If we receive a message with an attachment (image, video, audio),
     * then we'll simply confirm that we've received the attachment.
     *
     */
    receivedMessage(event) {
        const senderID = event.sender.id;
        const recipientID = event.recipient.id;
        const timeOfMessage = event.timestamp;
        const message = event.message;

        console.log("Received message for user %d and page %d at %d with message:",
            senderID, recipientID, timeOfMessage);
        console.log(JSON.stringify(message));

        const isEcho = message.is_echo;
        const messageId = message.mid;
        const appId = message.app_id;
        const metadata = message.metadata;

        // You may get a text or attachment but not both
        const messageText = message.text;
        const messageAttachments = message.attachments;
        const quickReply = message.quick_reply;

        if (isEcho) {
            // Just logging message echoes to console
            console.log("Received echo for message %s and app %d with metadata %s",
                messageId, appId, metadata);
            return;
        } else if (quickReply) {
            const quickReplyPayload = quickReply.payload;
            console.log("Quick reply for message %s with payload %s",
                messageId, quickReplyPayload);

            send.sendTextMessage(senderID, "Quick reply tapped");
            return;
        }

        if (WAITING_FOR_SONG && messageText) {
            dz.findTracks(messageText).then(function (result) {
                WAITING_FOR_SONG = false;
                result = result.data;
                var length = void 0;
                console.log('HAHAHA: ', result);
                if (Array.from(result).length > 8) {
                    console.log('MAIOR QUE 8');
                    length = 8;
                } else {
                    console.log('MENOR QUE 8');
                    length = Array.from(result).length;
                }
                var elements = [];
                for (var song = 1; song <= length; song++) {
                    var element = {
                        title: result[song].title || 'TESTESTESTESTE',
                        subtitle: result[song].artist.name,
                        image_url: result[song].album.cover_big,
                        buttons: [{
                            type: "postback",
                            title: "Escolher música",
                            payload: JSON.stringify({
                                songID: result[song].id
                            })
                        }]
                    };
                    elements.push(element);
                }
                var messageData = {
                    recipient: {
                        id: senderID
                    },
                    message: {
                        attachment: {
                            type: "template",
                            payload: {
                                template_type: "generic",
                                elements: elements
                            }
                        }
                    }
                };
                send.sendCarouselSongResponse(messageData);
            });
        } else if (messageText) {

            // If we receive a text message, check to see if it matches any special
            // keywords and send back the corresponding example. Otherwise, just echo
            // the text we received.
            switch (messageText) {
                case 'image':
                    send.sendImageMessage(senderID);
                    break;

                case 'gif':
                    send.sendGifMessage(senderID);
                    break;

                case 'audio':
                    send.sendAudioMessage(senderID);
                    break;

                case 'video':
                    send.sendVideoMessage(senderID);
                    break;

                case 'file':
                    send.sendFileMessage(senderID);
                    break;

                case 'button':
                    send.sendButtonMessage(senderID);
                    break;

                case 'generic':
                    send.sendGenericMessage(senderID);
                    break;

                case 'receipt':
                    send.sendReceiptMessage(senderID);
                    break;

                case 'quick reply':
                    send.sendQuickReply(senderID);
                    break;

                case 'read receipt':
                    send.sendReadReceipt(senderID);
                    break;

                case 'typing on':
                    send.sendTypingOn(senderID);
                    break;

                case 'typing off':
                    send.sendTypingOff(senderID);
                    break;

                case 'account linking':
                    send.sendAccountLinking(senderID);
                    break;
            }
        } else if (messageAttachments) {
            send.sendTextMessage(senderID, "Message with attachment received");
        }


    },

    /*
     * Delivery Confirmation Event
     *
     * This event is sent to confirm the delivery of a message. Read more about
     * these fields at https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-delivered
     *
     */
    receivedDeliveryConfirmation(event) {
        const senderID = event.sender.id;
        const recipientID = event.recipient.id;
        const delivery = event.delivery;
        const messageIDs = delivery.mids;
        const watermark = delivery.watermark;
        const sequenceNumber = delivery.seq;

        if (messageIDs) {
            messageIDs.forEach(messageID => {
                console.log("Received delivery confirmation for message ID: %s",
                    messageID);
            });
        }

        console.log("All message before %d were delivered.", watermark);
    },

    /*
     * Postback Event
     *
     * This event is called when a postback is tapped on a Structured Message.
     * https://developers.facebook.com/docs/messenger-platform/webhook-reference/postback-received
     *
     */
    receivedPostback({
        sender,
        recipient,
        timestamp,
        postback
    }) {
        const senderID = sender.id;
        const recipientID = recipient.id;
        const timeOfPostback = timestamp;

        // The 'payload' param is a developer-defined field which is set in a postback
        // button for Structured Messages.
        const payload = postback.payload;

        console.log("Received postback for user %d and page %d with payload '%s' " +
            "at %d", senderID, recipientID, payload, timeOfPostback);

        // When a postback is called, we'll send a message back to the sender to
        // let them know it was successful

        send.sendTextMessage(senderID, `Postback called: ${payload}`);

        if (payload) {
            switch (payload) {
                case 'GET_STARTED_PAYLOAD':
                    series([
                        function sendFirstMessage(callback) {
                            send.sendTextMessage(senderID, "Eai, tudo certo? Que legal poder falar com você por aqui! Meu nome é Bot deezer e eu amo música ❤");
                            callback();
                        },
                        function sendSecondMessage(callback) {
                            send.sendTextMessage(senderID, "Estou aqui pra te ajudar a bombar essa festa! Escolha as músicas que tocam na Boom Bike da Deezer aqui na #CPBR10.");
                            callback();
                        },
                        function sendThirdMessage(callback) {
                            send.sendTextMessage(senderID, "Olha só como é fácil 😉");
                            callback();
                        },
                        function sendForthMessage(callback) {
                            send.sendCarouselGetStarted(senderID);
                            callback();
                        }
                    ]);
                    break;
                case 'WAITING_FOR_SONG_PAYLOAD':
                    send.sendWaitForSong(senderID, "Legal! 👌\nFaz assim, digite o nome da 👇\n🎵 música\n🎶 álbum ou\n🎤 cantor\nque quer ouvir.");
                    WAITING_FOR_SONG = true;
                    break;
                case 'VIEW_QUEUE_PAYLOAD':
                    // TODO: Envia a lista de musicas
                    break;
                default:
                    JSON.parse(payload, function (key, value) {
                        if (key === 'songID') {
                            send.sendTextMessage(senderID, 'Pronto! Sua música está na fila do player.');
                            io.emit('songs', value);
                        }
                    });
            }
        }

    },

    /*
     * Message Read Event
     *
     * This event is called when a previously-sent message has been read.
     * https://developers.facebook.com/docs/messenger-platform/webhook-reference/message-read
     *
     */
    receivedMessageRead({
        sender,
        recipient,
        read
    }) {
        const senderID = sender.id;
        const recipientID = recipient.id;

        // All messages before watermark (a timestamp) or sequence have been seen.
        const watermark = read.watermark;
        const sequenceNumber = read.seq;

        console.log("Received message read event for watermark %d and sequence " +
            "number %d", watermark, sequenceNumber);
    }
};
