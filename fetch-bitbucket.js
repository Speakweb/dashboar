const {Bitbucket} = require("bitbucket");
const fs = require('fs');
const clientOptions = {
	auth: {
		username: process.env.EMAIL,
		password: process.env.PASSWORD,
	},
}

const repositories = [
	'arcteryx-checkout',
	'account-pages',
	'catalog-pages',
	'arcteryx-js-helpers'
]

const bitbucket = new Bitbucket(clientOptions);

/*
bitbucket.repositories.list({workspace: 'arcteryx'})
	.then(repositories => fs.writeFileSync('repositories.json', JSON.stringify(repositories, '', '  ')))
*/

bitbucket.pullrequests.list({repo_slug: 'arcteryx-checkout', workspace: 'arcteryx'})
	.then(result => fs.writeFileSync('arcteryx-checkout.json', JSON.stringify(result, '', '  ')))

