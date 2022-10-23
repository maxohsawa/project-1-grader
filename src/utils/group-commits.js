import octokit from './octokitConnection.js';
import { groups } from '../refs/keys.js';

const getGroupCommits = async (group) => {
  // get raw commit data

  console.log(`=== Downloading ${group} commits..`);
  const accumulatedResponseData = [];
  let responseLength = 100;
  let page = 1;
  while (responseLength === 100) {
    // populate commits for each group
    const response = await octokit.request(
      'GET /repos/{owner}/{repo}/commits',
      {
        owner: groups[group].repo.owner,
        repo: groups[group].repo.name,
        per_page: 100,
        page: page++,
      }
    );
    console.log(`Page ${page - 1} status: ${response.status}`);
    console.log(`Records: ${response.data.length}`);
    console.log(
      `Rate limit remaining: ${response.headers['x-ratelimit-remaining']}`
    );
    console.log(
      `Rate limit reset in: ${Date(response.headers['x-ratelimit-reset'])}`
    );
    accumulatedResponseData.push(...response.data);
    responseLength = response.data.length;
  }

  console.log('data length', accumulatedResponseData.length);
};

export const getAndWriteGroupCommits = async () => {
  for (const group in groups) {
    const accumulatedResponseData = await getGroupCommits(group);
    fs.writeFileSync(
      `raw-data/group-commits/${group}-commits.json`,
      JSON.stringify(accumulatedResponseData)
    );
  }
};
