/* global $ */

const applicationAction = (id, action) => {
	return new Promise((resolve, reject) => {
		$.post(`/applications/${id}/${action}`)
			.fail(reject)
			.done(res => setTimeout(() => resolve(res), 1000));
	});
};

$(() => {
	var currentAction = null;
	$('.applicationAction').click(async function(evt) {
		const data = $(this).data();
		if (currentAction) return;
		currentAction = applicationAction(data.applicationId, data.applicationAction);
		await currentAction;
		currentAction = null;
		window.location.reload();
	});
});
