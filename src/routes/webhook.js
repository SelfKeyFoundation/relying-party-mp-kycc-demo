var express = require('express');
var router = express.Router();
const sk = require('@selfkey/node-lib');
const token = 'test';
const KYCC_API_URL = 'http://ingress:8080';

router.post('/', async (req, res) => {
	console.log('XXX', req.body);
	const client = sk.kycc.createKYCCIntegrationsClient({apiKey: token, instanceUrl: KYCC_API_URL});
	try {
		const application = await client.applications.get(req.body.applicationId);

		console.log('XXX application', JSON.stringify(application, null, 2));
		res.json({status: 'ok'});
	} catch (error) {
		console.log('XXX', error);
		res.status(500).json({status: 'error'});
	}
});

module.exports = router;
