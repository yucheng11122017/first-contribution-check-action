/**
 * Unit tests for the action's main functionality, src/main.js
 */
const main = require('../src/main');
const github = require('@actions/github');
const nock = require("nock")

const DEFAULT_REPO = "fakerepo";
const DEFAULT_OWNER = "fakeowner";
const githubAccessLink = 'https://api.github.com';
const contributorRequestLink = `/repos/${DEFAULT_OWNER}/${DEFAULT_REPO}/contributors?per_page=100&page=0&state=all`;
const NEW_CONTRIBUTOR_1 = { "login": "NewContributor1", "contributions": 1 };
const NEW_CONTRIBUTOR_2 = { "login": "NewContributor2", "contributions": 1 };
const OLD_CONTRIBUTOR_1 = { "login": "Contributor1", "contributions": 2 };
const OLD_CONTRIBUTOR_2 = { "login": "Contributor2", "contributions": 5 };

const accessToken = "123"
const githubClient = github.getOctokit(accessToken);

describe('test findFirstContributors ', () => {
  it('with 1 new contributor', async () => {
    nock(githubAccessLink)
    .get(contributorRequestLink)
    .reply(200, [NEW_CONTRIBUTOR_1, OLD_CONTRIBUTOR_1, OLD_CONTRIBUTOR_2]);
    const usernames = ["Contributor2", "NewContributor1"];
    const firstTimeContributors = await main.findFirstContributors(githubClient, DEFAULT_OWNER, DEFAULT_REPO, usernames, 0);
    expect(firstTimeContributors).toStrictEqual([NEW_CONTRIBUTOR_1.login])
  })

  it('with 2 new contributor', async () => {
    nock(githubAccessLink)
        .get(contributorRequestLink)
        .reply(200, [NEW_CONTRIBUTOR_1, NEW_CONTRIBUTOR_2, OLD_CONTRIBUTOR_1, OLD_CONTRIBUTOR_2]);
    const usernames = ["Contributor2", "NewContributor1"];
    const firstTimeContributors = await main.findFirstContributors(githubClient, DEFAULT_OWNER, DEFAULT_REPO, usernames, 0);
    expect(firstTimeContributors).toStrictEqual([NEW_CONTRIBUTOR_1.login])
  })
})
