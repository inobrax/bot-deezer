import crypto from 'crypto';

export default {

  /*
   * Verify that the callback came from Facebook. Using the App Secret from
   * the App Dashboard, we can verify the signature that is sent with each
   * callback in the x-hub-signature field, located in the header.
   *
   * https://developers.facebook.com/docs/graph-api/webhooks#setup
   *
   */
  verifyRequestSignature({headers}, res, buf) {
    const signature = headers["x-hub-signature"];

    if (!signature) {
      // For testing, let's log an error. In production, you should throw an
      // error.
      console.error("Couldn't validate the signature.");
    } else {
      const elements = signature.split('=');
      const method = elements[0];
      const signatureHash = elements[1];

      const expectedHash = crypto.createHmac('sha1', process.env.APP_SECRET).update(buf).digest('hex');

      if (signatureHash != expectedHash) {
        throw new Error("Couldn't validate the request signature.");
      }
    }
  }

};
