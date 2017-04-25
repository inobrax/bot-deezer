export default {

    /*
     * This path is used for account linking. The account linking call-to-action
     * (sendAccountLinking) is pointed to this URL.
     *
     */
    linking({
        query
    }, res) {
        const accountLinkingToken = query.account_linking_token;
        const redirectURI = query.redirect_uri;

        // Authorization Code should be generated per user by the developer. This will
        // be passed to the Account Linking callback.
        const authCode = "1234567890";

        // Redirect users to this URI on successful login
        const redirectURISuccess = `${redirectURI}&authorization_code=${authCode}`;

        res.render('authorize', {
            accountLinkingToken,
            redirectURI,
            redirectURISuccess
        });
    }

};
