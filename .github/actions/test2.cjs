const API_CHANGE = "API change has been detected. Please review the PR before merging it."
const API_CHANGE_RESOLVE = "API change has been reverted and there is no need for API review."

const auth = process.env.GITHUB_TOKEN;
const owner = process.env.GITHUB_REPOSITORY_OWNER;
const repo = process.env.GITHUB_REPOSITORY.split('/')[1];
const issue_number = process.env.GITHUB_PR_NUMBER;

(async () => {
	const { Octokit } = await import('@octokit/rest'); // Use dynamic import
	const fs = require("fs");

	// Initialize Octokit with the GitHub token
	const octokit = new Octokit({ auth });
	const main = fs.readFileSync("flat-manifest-main.json", "utf-8");
	const pr = fs.readFileSync("flat-manifest-pr.json", "utf-8");

	try {
		const { data: comments } = await octokit.issues.listComments({
			owner,  // Ensure this is set correctly
			repo,  // Extract the repo name dynamically
			issue_number,
		});

		const pendingAPIreview = comments.find(comment => comment.body === API_CHANGE && comment.author_association === "OWNER");
		const noPendingAPIreview = comments.find(comment => comment.body === API_CHANGE_RESOLVE && comment.author_association === "OWNER");

		if (pendingAPIreview) {
			if (main === pr) {
				await octokit.issues.updateComment({
					owner,  // Ensure this is set correctly
					repo,  // Extract the repo name dynamically
					comment_id: pendingAPIreview.id,  // Comment ID to update
					body: API_CHANGE_RESOLVE,    // New comment body
				});
			}
		} else if (noPendingAPIreview) {
			if (main !== pr) {
				await octokit.issues.updateComment({
					owner,  // Ensure this is set correctly
					repo,  // Extract the repo name dynamically
					comment_id: noPendingAPIreview.id,  // Comment ID to update
					body: API_CHANGE,    // New comment body
				});
			}
		} else {
			if (main !== pr) {
				await octokit.rest.issues.createComment({
					owner,  // Ensure this is set correctly
					repo,  // Extract the repo name dynamically
					issue_number,
					body: API_CHANGE
				});
			}
		}
	} catch (error) {
		console.error('Error creating issue: ', error);
		process.exit(1);
	}
})();