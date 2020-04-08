var express = require('express');
var router = express.Router();
const kyccClient = require('../kycc-client');
const Applications = require('../models/applications');
const Files = require('../models/files');

/* GET home page. */
router.get('/', function(req, res, next) {
	let applications = Applications.findAll();
	applications.sort((a1, a2) => a2.createdAt - a1.createdAt);
	res.render('index', {title: 'KYC Applications', applications});
});

router.get('/applications/:id', function(req, res, next) {
	let application = Applications.findById(req.params.id);
	if (!application) {
		return next({code: 404, message: 'Application Not found'});
	}
	res.render('application', {title: 'Application', application});
});

router.get('/files/:id', function(req, res, next) {
	let file = Files.findById(req.params.id);
	if (!file) {
		return next({code: 404, message: 'File Not found'});
	}
	res.setHeader('Content-Type', file.mimeType || 'application/octet-stream');
	res.send(file.content);
});

router.post('/applications/:id/approve', async function(req, res, next) {
	try {
		let application = Applications.findById(req.params.id);
		if (!application) {
			return next({code: 404, message: 'Application Not found'});
		}
		await kyccClient.applications.changeStatus(
			application.applicationId,
			kyccClient.statuses.APPROVED
		);
		return res.json({status: 'ok'});
	} catch (error) {
		return next(error);
	}
});

router.post('/applications/:id/reject', async function(req, res, next) {
	try {
		let application = Applications.findById(req.params.id);
		if (!application) {
			return next({code: 404, message: 'Application Not found'});
		}
		await kyccClient.applications.changeStatus(
			application.applicationId,
			kyccClient.statuses.REJECTED
		);
		return res.json({status: 'ok'});
	} catch (error) {
		return next(error);
	}
});

router.post('/applications/:id/cancel', async function(req, res, next) {
	try {
		let application = Applications.findById(req.params.id);
		if (!application) {
			return next({code: 404, message: 'Application Not found'});
		}
		await kyccClient.applications.changeStatus(
			application.applicationId,
			kyccClient.statuses.CANCELED
		);
		return res.json({status: 'ok'});
	} catch (error) {
		return next(error);
	}
});

router.post('/applications/:id/reopen', async function(req, res, next) {
	try {
		let application = Applications.findById(req.params.id);
		if (!application) {
			return next({code: 404, message: 'Application Not found'});
		}
		await kyccClient.applications.changeStatus(
			application.applicationId,
			kyccClient.statuses.REOPENED
		);
		return res.json({status: 'ok'});
	} catch (error) {
		return next(error);
	}
});

module.exports = router;
