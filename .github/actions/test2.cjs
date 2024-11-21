(async () => {
	const { Octokit } = await import('@octokit/rest'); // Use dynamic import

	// Initialize Octokit with the GitHub token
	const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });

	try {
		// Create an issue in the current repository
		const response = await octokit.issues.create({
			owner: process.env.GITHUB_REPOSITORY_OWNER,  // Ensure this is set correctly
			repo: process.env.GITHUB_REPOSITORY.split('/')[1],  // Extract the repo name dynamically
			title: `test title`,
			body: `test body`,
		});

		console.log('Issue created: ', response.data.html_url);
	} catch (error) {
		console.error('Error creating issue: ', error);
		process.exit(1);
	}
})();