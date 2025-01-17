const core = require('@actions/core');
const github = require('@actions/github');
const accessToken = process.env['GITHUB_TOKEN'];

async function findFirstContributors(
    client, owner, repo,
    userNames,
    page = 1
) {
    const { status, data: contributors } = await client.repos.listContributors({
        owner: owner,
        repo: repo,
        per_page: 100,
        page: page,
        state: 'all'
    });

    if (status !== 200) {
        throw new Error(`Received unexpected API status code ${status}`);
    }

    if (contributors.length === 0) {
        return []
    }

    const firstTimeContributors = userNames.filter(username => {
        const contributor = contributors.find(contributor => contributor.login === username);
        core.info("===================")
        core.info(JSON.stringify(contributor))
        core.info("===================")
        if (!contributor) {
        return true;
        }
        return contributor.contributions === 1
    })

    if (contributors.length < 100) {
        return firstTimeContributors
    }

    return firstTimeContributors.concat(await findFirstContributors(
        client,
        owner,
        repo,
        userNames,
        page + 1
    ));
}

async function run() {
    try {
        const payload = github.context.payload;
        const githubClient = github.getOctokit(accessToken);
        core.info("Request received");
        const userNames = payload.commits.map(commit => commit.author.username);
        const owner = payload.repository.owner.login;
        const repoName = payload.repository.name;

        const firstContributors = await findFirstContributors(
            githubClient, owner, repoName,
            userNames
        );
        exec(`echo "FIRST_TIME_CONTRIBUTORS=${firstContributors.toJSON()}" >> $GITHUB_OUTPUT`);

    } catch (err) {
        core.setFailed(err.message);
    }
}

module.exports = {
    run,
    findFirstContributors
}
