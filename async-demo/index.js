console.log('Before');

// Callback example
getUser(1, fetchRepositories);

console.log('After');

// Promises
// Async/Await

function fetchRepositories (user) {
    console.log('User', user);
    getRepositories(user.gitHubUsername, fetchCommits);
}

function fetchCommits (repoList) {
    console.log('Repos', repoList);
    getCommits(repoList[0], displayCommits);
}

function displayCommits (commits) {
    console.log('Commits', commits);
}

function getUser (id, callback) {
    // Simulated DB call that takes 2 seconds to complete
    setTimeout(() => {
        console.log('Reading user from a database...');
        callback({ id: id, gitHubUsername: 'markt5660'});
    }, 2000);
}

function getRepositories (gitHubUsername, callback) {
    // Simulated GitHub call that takes 2 seconds to complete
    setTimeout(() => {
        console.log('Fetching GitHub repos for user ', gitHubUsername, '...');
        callback(['repo1', 'repo2', 'repo3']);
    }, 2000);
}

function getCommits (repo, callback) {
    // Simulated GitHub call that takes 2 seconds to complete
    setTimeout(() => {
        console.log('Fetching GitHub commits for repo ', repo, '...');
        callback(['commit1', 'commit2']);
    }, 2000);
}