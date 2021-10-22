module.exports = {
  commands: [
	`cd /Users/marvinirwin/WebstormProjects/arcteryx/account-pages && echo "account-pages $(git branch --show-current)"`,
	`cd /Users/marvinirwin/WebstormProjects/forgerock/arcteryx-checkout && echo "checkout $(git branch --show-current)"`,
	`cd /Users/marvinirwin/WebstormProjects/forgerock/catalog-pages && echo "catalog-pages $(git branch --show-current)"`,
	`cd /Users/marvinirwin/WebstormProjects/arcteryx/arcteryx-js-helpers && echo "js-helpers $(git branch --show-current)"`,
  ],
	pullRequestConfigs: [
		{
			workspace: "arcteryx",
			repo: 'arcteryx-checkout'
		},
		{
			workspace: "arcteryx",
			repo: 'arcteryx-js-helpers'
		}
	]
}
