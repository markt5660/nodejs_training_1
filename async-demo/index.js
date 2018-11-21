console.log('Before');

// Promises example
/*
getUser(1)
    .then(user => getRepositories(user.gitHubUsername))
    .then(repoList => getCommits(repoList[0]))
    .then(commitList => console.log('Commits', commitList))
    .catch(err => console.log('Error', err.message));
*/

// Async/Await w/ Promises
async function displayCommits (userId) {
    try {
        const user = await getUser(userId);
        const repoList = await getRepositories(user.gitHubUsername);
        const commits = await getCommits(repoList[0]);
        console.log(commits);
    } catch (err) {
        console.log(err);
    }
}

displayCommits(1);

console.log('After');


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
            //resolve(['repo1', 'repo2', 'repo3']);
            reject(new Error('getRepositories failed...'));
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