import express from 'express';
import webhook from './webhook';
import account from './account';

const router = express.Router();

router.get('/webhook', webhook.validateWebhook);
router.post('/webhook', webhook.handleCallbacks);
router.get('/authorize', account.linking);

export default router;
