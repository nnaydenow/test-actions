const auth = process.env.GITHUB_TOKEN;
const owner = process.env.GITHUB_REPOSITORY_OWNER;
const repo = process.env.GITHUB_REPOSITORY.split('/')[1];

(async () => {
	const { Octokit } = await import('@octokit/rest'); // Use dynamic import

	// Initialize Octokit with the GitHub token
	const octokit = new Octokit({ auth });

	try {
		// Create an issue in the current repository
		const response = await octokit.issues.create({
			owner,  // Ensure this is set correctly
			repo,  // Extract the repo name dynamically
			title: `test`,
			body: "test",
			labels: [
				'need review'
			],
		});

		console.log('Issue created: ', response.data.html_url);
	} catch (error) {
		console.error('Error creating issue: ', error);
		process.exit(1);
	}
})();