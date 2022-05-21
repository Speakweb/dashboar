module.exports = {
	healthCheck: [{
		configKey: "something something",
		url: "https://httptest.antonio32a.workers.dev/200",
		failureMessage: "Failed",
		successMessage: "Success"
	}, {
		configKey: "something something2",
		url: "https://httptest.antonio32a.workers.dev/404",
		failureMessage: "Failed2",
		successMessage: "Success2"
	}]
}
