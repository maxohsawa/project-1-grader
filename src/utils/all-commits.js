import fs from 'fs';
import octokit from './octokitConnection.js';
import { groups } from '../refs/keys.js';

export const getAllCommits = async () => {
  const files = await fs.promises.readdir('raw-data/group-commits');
  if (files.length === 0) {
    console.log('Getting all commits depends on getting group commits first.');
    return;
  }

  const allCommitData = {};

  for (const file of files) {
    const groupCommits = JSON.parse(
      fs.readFileSync(`raw-data/group-commits/${file}`)
    );
    console.log(`${file} with ${groupCommits.length} commits`);

    for (const commit of groupCommits) {
      const group = file.split('-')[0];
      console.log(`getting data for commit ${commit.sha}`);
      const commitResponse = await octokit.request(
        'GET /repos/{owner}/{repo}/commits/{ref}',
        {
          owner: groups[group].repo.owner,
          repo: groups[group].repo.name,
          ref: commit.sha,
        }
      );

      console.log(
        `Rate limit remaining: ${commitResponse.headers['x-ratelimit-remaining']}`
      );

      allCommitData[commit.sha] = commitResponse.data;
    }

    //   const group = file.split('-')[0];
    //   const commitResponse = await octokit.request(
    //     'GET /repos/{owner}/{repo}/commits/{ref}',
    //     {
    //       owner: groups[group].repo.owner,
    //       repo: groups[group].repo.name,
    //       ref: groupCommits[0].sha,
    //     }
    //   );

    //   allCommitData[commitResponse.data.sha] = commitResponse.data;
  }

  return allCommitData;
};

export const getAndWriteAllCommits = async () => {
  const accumulatedCommitData = await getAllCommits();
  fs.writeFileSync(
    `raw-data/all-commits/all-commits.json`,
    JSON.stringify(accumulatedCommitData)
  );
};
