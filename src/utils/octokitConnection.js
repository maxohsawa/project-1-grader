import { Octokit } from 'octokit';
import dotenv from 'dotenv';
dotenv.config();

export default new Octokit({
  auth: process.env.GITHUB_PAT,
});
