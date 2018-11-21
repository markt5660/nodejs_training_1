console.log('Before');

// Callback example
getUser(1, (user) => {
    console.log('User', user);
    getRepositories(user.gitHubUsername, (repoList) => {
        console.log('GitHub Repos', repoList);
    });
});

console.log('After');

// Promises
// Async/Await

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