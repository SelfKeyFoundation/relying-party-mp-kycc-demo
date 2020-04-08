const express = require('express');
const router = express.Router();
const kyccClient = require('../kycc-client');
const sk = require('@selfkey/node-lib');
const Applications = require('../models/applications');
const Files = require('../models/files');

router.post('/', async (req, res) => {
	console.log('XXX webhook received');
	try {
		const {applicationId} = req.body;
		console.log('XXX', req.body);
		// get full application from kycc
		const application = await kyccClient.applications.get(applicationId);

		// get attributes object from application and transform it to array
		const attributes = Object.keys(application.attributes).map(id => ({
			...application.attributes[id],
			id
		}));

		const files = [];

		// Process incoming files (if stream is true will give a readable stream for the file)
		const kyccFileProcessor = sk.kycc.utils.createKyccFileProcessor(kyccClient, {
			stream: false,
			process: async (file, id, mimeType = 'application/octet-stream') => {
				const loadedFile = Buffer.from(await file, 'utf8');
				let localFile = Files.upsertFromKycc(loadedFile, id, mimeType);
				files.push(localFile.id);
				return localFile.id;
			}
		});

		// For all attributes which contain files, fetch them. Replace the remote id with local id
		const resolvedAttributes = await Promise.all(
			attributes.map(async attr => {
				const resolvedValue = await sk.identity.utils.resolveAttributeFiles(
					attr.value,
					kyccFileProcessor
				);
				return {...attr, data: resolvedValue};
			})
		);
		const update = {
			applicationId,
			status: application.currentStatus,
			statusName: application.statusName,
			template: application.template,
			attributes: resolvedAttributes,
			files
		};

		Applications.upsertFromKycc(update);

		res.json({status: 'ok'});
	} catch (error) {
		console.log('XXX', error);
		res.status(500).json({status: 'error'});
	}
});

module.exports = router;
