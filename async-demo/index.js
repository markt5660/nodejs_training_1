console.log('Before');

// Promises example
getUser(1)
    .then(user => getRepositories(user.gitHubUsername))
    .then(repoList => getCommits(repoList[0]))
    .then(commitList => console.log('Commits', commitList))
    .catch(err => console.log('Error', err.message));

console.log('After');

// Async/Await

function getUser (id) {
    return new Promise((resolve, reject) => {
        // Simulated DB call that takes 2 seconds to complete
        setTimeout(() => {
            console.log('Reading user from a database...');
            resolve({ id: id, gitHubUsername: 'markt5660'});
        }, 2000);
    });
}

function getRepositories (gitHubUsername) {
    return new Promise((resolve, reject) => {
        // Simulated GitHub call that takes 2 seconds to complete
        setTimeout(() => {
            console.log('Fetching GitHub repos for user', gitHubUsername, '...');
            resolve(['repo1', 'repo2', 'repo3']);
        }, 2000);
    });
}

function getCommits (repo) {
    return new Promise((resolve, reject) => {
        // Simulated GitHub call that takes 2 seconds to complete
        setTimeout(() => {
            console.log('Fetching GitHub commits for repo', repo, '...');
            resolve(['commit1', 'commit2']);
        }, 2000);
    });
}