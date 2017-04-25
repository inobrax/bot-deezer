import receive from './server';

export default {

    /*
     * Use your own validation token. Check that the token used in the Webhook
     * setup is the same token used here.
     *
     */
    validateWebhook({ query }, res) {
        if (query['hub.mode'] === 'subscribe' &&
            query['hub.verify_token'] === process.env.VALIDATION_TOKEN) {
            console.log("Validating webhook");
            res.status(200).send(query['hub.challenge']);
        } else {
            console.error("Failed validation. Make sure the validation tokens match.");
            res.sendStatus(403);
        }
    },

    /*
     * All callbacks for Messenger are POST-ed. They will be sent to the same
     * webhook. Be sure to subscribe your app to your page to receive callbacks
     * for your page.
     * https://developers.facebook.com/docs/messenger-platform/product-overview/setup#subscribe_app
     *
     */
    handleCallbacks({ body }, res) {
        const data = body;

        // Make sure this is a page subscription
        if (data.object == 'page') {
            // Iterate over each entry
            // There may be multiple if batched
            data.entry.forEach(({ id, time, messaging }) => {
                const pageID = id;
                const timeOfEvent = time;

                // Iterate over each messaging event
                messaging.forEach(messagingEvent => {
                    if (messagingEvent.optin) {
                        receive.receivedAuthentication(messagingEvent);
                    } else if (messagingEvent.message) {
                        receive.receivedMessage(messagingEvent);
                    } else if (messagingEvent.delivery) {
                        receive.receivedDeliveryConfirmation(messagingEvent);
                    } else if (messagingEvent.postback) {
                        receive.receivedPostback(messagingEvent);
                    } else if (messagingEvent.read) {
                        receive.receivedMessageRead(messagingEvent);
                    } else if (messagingEvent.account_linking) {
                        receive.receivedAccountLink(messagingEvent);
                    } else {
                        console.log("Webhook received unknown messagingEvent: ", messagingEvent);
                    }
                });
            });

            // Assume all went well.
            //
            // You must send back a 200, within 20 seconds, to let us know you've
            // successfully received the callback. Otherwise, the request will time out.
            res.sendStatus(200);
        }
    }

}
