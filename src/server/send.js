import request from 'request';

/*
 * Call the Send API. The message data goes in the body. If successful, we'll
 * get the message id in a response
 *
 */
function callSendAPI(messageData) {
    request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: {
            access_token: process.env.PAGE_ACCESS_TOKEN
        },
        method: 'POST',
        json: messageData

    }, (error, {
        statusCode,
        statusMessage
    }, body) => {
        if (!error && statusCode == 200) {
            const recipientId = body.recipient_id;
            const messageId = body.message_id;

            if (messageId) {
                console.log("Successfully sent message with id %s to recipient %s",
                    messageId, recipientId);
            } else {
                console.log("Successfully called Send API for recipient %s",
                    recipientId);
            }
        } else {
            console.error("Failed calling Send API", statusCode, statusMessage, body.error);
        }
    });
}

export default {

    /*
     * Send an image using the Send API.
     *
     */
    sendImageMessage(recipientId) {
        const messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "image",
                    payload: {
                        url: `${process.env.SERVER_URL}/assets/rift.png`
                    }
                }
            }
        };

        callSendAPI(messageData);
    },

    /*
     * Send a Gif using the Send API.
     *
     */
    sendGifMessage(recipientId) {
        const messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "image",
                    payload: {
                        url: `${process.env.SERVER_URL}/assets/instagram_logo.gif`
                    }
                }
            }
        };

        callSendAPI(messageData);
    },

    /*
     * Send audio using the Send API.
     *
     */
    sendAudioMessage(recipientId) {
        const messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "audio",
                    payload: {
                        url: `${process.env.SERVER_URL}/assets/sample.mp3`
                    }
                }
            }
        };

        callSendAPI(messageData);
    },

    /*
     * Send a video using the Send API.
     *
     */
    sendVideoMessage(recipientId) {
        const messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "video",
                    payload: {
                        url: `${process.env.SERVER_URL}/assets/allofus480.mov`
                    }
                }
            }
        };

        callSendAPI(messageData);
    },

    /*
     * Send a file using the Send API.
     *
     */
    sendFileMessage(recipientId) {
        const messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "file",
                    payload: {
                        url: `${process.env.SERVER_URL}/assets/test.txt`
                    }
                }
            }
        };

        callSendAPI(messageData);
    },

    /*
     * Send a text message using the Send API.
     *
     */
    sendTextMessage(recipientId, messageText) {
        const messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                text: messageText,
                metadata: "DEVELOPER_DEFINED_METADATA"
            }
        };

        callSendAPI(messageData);
    },

    /*
     * Send a text message with a 'waiting for song' payload using the Send API.
     *
     */
    sendWaitForSong(recipientId, messageText) {
        const messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                text: messageText,
                metadata: "WAITING_FOR_SONG_PAYLOAD"
            }
        };

        callSendAPI(messageData);
    },

    /* Second option to choose a song genre
     */
    sendSecondOptionGenres(recipientId) {
        const messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                text: "Você pode também apenas escolher o gênero",
                quick_replies: [{
                        "content_type": "text",
                        "title": "Rock",
                        "payload": JSON.stringify('Rock')
                    },
                    {
                        "content_type": "text",
                        "title": "Sertanejo",
                        "payload": JSON.stringify('Sertanejo')
                    },
                    {
                        "content_type": "text",
                        "title": "MPB",
                        "payload": JSON.stringify('MPB')
                    }
                ]
            }
        };

        callSendAPI(messageData);
    },

    /*
     * Send a button message using the Send API.
     *
     */
    sendButtonMessage(recipientId) {
        const messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: "This is test text",
                        buttons: [{
                            type: "web_url",
                            url: "https://www.oculus.com/en-us/rift/",
                            title: "Open Web URL"
                        }, {
                            type: "postback",
                            title: "Trigger Postback",
                            payload: "DEVELOPER_DEFINED_PAYLOAD"
                        }, {
                            type: "phone_number",
                            title: "Call Phone Number",
                            payload: "+16505551234"
                        }]
                    }
                }
            }
        };

        callSendAPI(messageData);
    },

    /*
     * Send a Structured Message with song queue from Deezer API (Generic Message type) using the Send API
     *
     *
     */

    sendCarouselSongQueue(recipientId) {
        const messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "generic",
                        elements: [{
                            title: "rift",
                            subtitle: "Next-generation virtual reality",
                            item_url: "https://www.oculus.com/en-us/rift/",
                            image_url: `${process.env.SERVER_URL}/assets/rift.png`,
                            buttons: [{
                                type: "web_url",
                                url: "https://www.oculus.com/en-us/rift/",
                                title: "Open Web URL"
                            }, {
                                type: "postback",
                                title: "Call Postback",
                                payload: "Payload for first bubble",
                            }],
                        }, {
                            title: "touch",
                            subtitle: "Your Hands, Now in VR",
                            item_url: "https://www.oculus.com/en-us/touch/",
                            image_url: `${process.env.SERVER_URL}/assets/touch.png`,
                            buttons: [{
                                type: "web_url",
                                url: "https://www.oculus.com/en-us/touch/",
                                title: "Open Web URL"
                            }, {
                                type: "postback",
                                title: "Call Postback",
                                payload: "Payload for second bubble",
                            }]
                        }]
                    }
                }
            }
        };

        callSendAPI(messageData);
    },

    /*
     * Send a Structured Message with song choosen reponse from Deezer API (Generic Message type) using the Send API
     *
     *
     */
    sendCarouselGetStarted(recipientId) {
        const messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "generic",
                        elements: [{
                                title: "Aqui você é o DJ!",
                                subtitle: "Escolha sua música favorita",
                                image_url: "https://goo.gl/FaOroG",
                                buttons: [{
                                    type: "postback",
                                    title: "Escolher música",
                                    payload: "WAITING_FOR_SONG_PAYLOAD"
                                }, {
                                    type: "element_share",
                                    "share_contents": {
                                        "attachment": {
                                            "type": "template",
                                            "payload": {
                                                "template_type": "generic",
                                                "elements": [{
                                                    "title": "Conheça o bot da Boom Bike da Deezer na #CPBR10",
                                                    "subtitle": "Chame seus amigos",
                                                    "image_url": "https://goo.gl/PB69rh",
                                                    "default_action": {
                                                        "type": "web_url",
                                                        "url": "https://m.me/1833996310183448?ref=invited_by_24601"
                                                    },
                                                    "buttons": [{
                                                        "type": "web_url",
                                                        "url": "https://m.me/1833996310183448?ref=invited_by_24601",
                                                        "title": "Inicie uma conversa"
                                                    }]
                                                }]
                                            }
                                        }
                                    }
                                }],
                            },
                            {
                                title: "A fila é democrática!",
                                subtitle: "O que a maioria quiser ouvir, tocará primeiro",
                                image_url: "https://goo.gl/nNnFzT",
                                buttons: [{
                                    type: "postback",
                                    title: "Ver como está a fila",
                                    payload: "VIEW_QUEUE_PAYLOAD"
                                }, {
                                    type: "element_share",
                                    "share_contents": {
                                        "attachment": {
                                            "type": "template",
                                            "payload": {
                                                "template_type": "generic",
                                                "elements": [{
                                                    "title": "Conheça o bot da Boom Bike da Deezer na #CPBR10",
                                                    "subtitle": "Chame seus amigos",
                                                    "image_url": "https://goo.gl/PB69rh",
                                                    "default_action": {
                                                        "type": "web_url",
                                                        "url": "https://m.me/1833996310183448?ref=invited_by_24601"
                                                    },
                                                    "buttons": [{
                                                        "type": "web_url",
                                                        "url": "https://m.me/1833996310183448?ref=invited_by_24601",
                                                        "title": "Inicie uma conversa"
                                                    }]
                                                }]
                                            }
                                        }
                                    }
                                }]
                            }
                        ]
                    }
                }
            }
        };

        callSendAPI(messageData);
    },

    sendCarouselSongResponse(messageData) {
        callSendAPI(messageData);
    },

    /*
     *  Send a Structured Message (Generic Message type) using the Send API.
     *
     */
    sendGenericMessage(recipientId) {
        const messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "generic",
                        elements: [{
                            title: "rift",
                            subtitle: "Next-generation virtual reality",
                            item_url: "https://www.oculus.com/en-us/rift/",
                            image_url: `${process.env.SERVER_URL}/assets/rift.png`,
                            buttons: [{
                                type: "web_url",
                                url: "https://www.oculus.com/en-us/rift/",
                                title: "Open Web URL"
                            }, {
                                type: "postback",
                                title: "Call Postback",
                                payload: "Payload for first bubble",
                            }],
                        }, {
                            title: "touch",
                            subtitle: "Your Hands, Now in VR",
                            item_url: "https://www.oculus.com/en-us/touch/",
                            image_url: `${process.env.SERVER_URL}/assets/touch.png`,
                            buttons: [{
                                type: "web_url",
                                url: "https://www.oculus.com/en-us/touch/",
                                title: "Open Web URL"
                            }, {
                                type: "postback",
                                title: "Call Postback",
                                payload: "Payload for second bubble",
                            }]
                        }]
                    }
                }
            }
        };

        callSendAPI(messageData);
    },

    /*
     * Send a receipt message using the Send API.
     *
     */
    sendReceiptMessage(recipientId) {
        // Generate a random receipt ID as the API requires a unique ID
        const receiptId = `order${Math.floor(Math.random() * 1000)}`;

        const messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "receipt",
                        recipient_name: "Peter Chang",
                        order_number: receiptId,
                        currency: "USD",
                        payment_method: "Visa 1234",
                        timestamp: "1428444852",
                        elements: [{
                            title: "Oculus Rift",
                            subtitle: "Includes: headset, sensor, remote",
                            quantity: 1,
                            price: 599.00,
                            currency: "USD",
                            image_url: `${process.env.SERVER_URL}/assets/riftsq.png`
                        }, {
                            title: "Samsung Gear VR",
                            subtitle: "Frost White",
                            quantity: 1,
                            price: 99.99,
                            currency: "USD",
                            image_url: `${process.env.SERVER_URL}/assets/gearvrsq.png`
                        }],
                        address: {
                            street_1: "1 Hacker Way",
                            street_2: "",
                            city: "Menlo Park",
                            postal_code: "94025",
                            state: "CA",
                            country: "US"
                        },
                        summary: {
                            subtotal: 698.99,
                            shipping_cost: 20.00,
                            total_tax: 57.67,
                            total_cost: 626.66
                        },
                        adjustments: [{
                            name: "New Customer Discount",
                            amount: -50
                        }, {
                            name: "$100 Off Coupon",
                            amount: -100
                        }]
                    }
                }
            }
        };

        callSendAPI(messageData);
    },

    /*
     * Send a message with Quick Reply buttons.
     *
     */
    sendQuickReply(recipientId) {
        const messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                text: "What's your favorite movie genre?",
                quick_replies: [{
                        "content_type": "text",
                        "title": "Action",
                        "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_ACTION"
                    },
                    {
                        "content_type": "text",
                        "title": "Comedy",
                        "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_COMEDY"
                    },
                    {
                        "content_type": "text",
                        "title": "Drama",
                        "payload": "DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_DRAMA"
                    }
                ]
            }
        };

        callSendAPI(messageData);
    },

    /*
     * Send a read receipt to indicate the message has been read
     *
     */
    sendReadReceipt(recipientId) {
        console.log("Sending a read receipt to mark message as seen");

        const messageData = {
            recipient: {
                id: recipientId
            },
            sender_action: "mark_seen"
        };

        callSendAPI(messageData);
    },

    /*
     * Turn typing indicator on
     *
     */
    sendTypingOn(recipientId) {
        console.log("Turning typing indicator on");

        const messageData = {
            recipient: {
                id: recipientId
            },
            sender_action: "typing_on"
        };

        callSendAPI(messageData);
    },

    /*
     * Turn typing indicator off
     *
     */
    sendTypingOff(recipientId) {
        console.log("Turning typing indicator off");

        const messageData = {
            recipient: {
                id: recipientId
            },
            sender_action: "typing_off"
        };

        callSendAPI(messageData);
    },

    /*
     * Send a message with the account linking call-to-action
     *
     */
    sendAccountLinking(recipientId) {
        const messageData = {
            recipient: {
                id: recipientId
            },
            message: {
                attachment: {
                    type: "template",
                    payload: {
                        template_type: "button",
                        text: "Welcome. Link your account.",
                        buttons: [{
                            type: "account_link",
                            url: `${process.env.SERVER_URL}/authorize`
                        }]
                    }
                }
            }
        };

        callSendAPI(messageData);
    }

};