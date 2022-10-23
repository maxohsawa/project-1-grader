# Project 1 Analysis

A data analysis of student participation in the group projects

## Usage

- `npm install` to install dependencies
- the command `node index` can be combined with some options to execute various steps in the pipeline
- `node index fetch group-commits` corresponds to [step 1](#1-repo-commits)
- `node index fetch all-commits` corresponds to [step 2](#2-every-commit)
- `node index process feedback` corresponds to [step 3](#3-student-feedback-data)
- `node index process compile-students` corresponds to [step 4](#4-compiling-student-data)

## Process

### 1. Repo Commits

Called endpoint for [List commits](https://docs.github.com/en/rest/commits/commits#list-commits) in GitHub API. This returned a json list of repo commits, but doesn't include finer details about commits. The json is written to file location `raw-data/group-commits/group#-commits.json` and the code for the process is in `src/utils/group-commits.js`. A manually created `groups` object in the `src/refs/keys.js` file provided the information necessary for the API calls' parameters.

### 2. Every Commit

Next there was a need to get finer details for each commit, so a series of calls to the endpoint for [Get a commit](https://docs.github.com/en/rest/commits/commits#get-a-commit), one for every commit listed in the `group#-commits.json` data. This large dataset is then written to file location `raw-data/all-commits/all-commits.json` and the for the process is in `src/utils/all-commits.js`. Once again the `groups` object is used along with the commit `sha` hash to provide information necessary for the API calls' parameters.

### 3. Student Feedback Data

A Google Form was used to collect data from each student. Of interest from this dataset are the quantitative self and peer evaluations. This data was extracted and merged with the other compiled student data.

- The form data was converted into a Google Sheet and then the data is exported as a csv and included in the project at `raw-data/feedback/feedback.csv`.
- `feedback.csv` is imported and parsed record by record, and the relevant data are exported as a json at `processed-data/feedback.json`.
- The `feedback.json` was duplicated and manually edited so that the names matched the `aliases` object. Letter grades were also modified to number grades where A => 5 and F => 1. The new file is located at `processed-data/cleanedFeedback.json`.

### 4. Compiling Student Data

Next was to go through each commit in `all-commits.json` to gather data on the number of commits each student made and the number of meaningful net additions they made. This data is compiled with the student feedback data from the previous step. The code for this is located in `src/utils/compile-students.js`.

- An `alias` object manually defined in `src/refs/keys.js` allowed variations of names to be accounted for.
- The `groups` object was used to give each student a `groupNo` property.
- Only `additions` and `deletions` for approved files were accounted for.
- The `approvedFilenames` list in `keys.js` was manually created via systematically filtering out filenames associated with third-party code.
- Each student object was also given additional properties of `netLines` which is the difference between `additions` and `deletions`, and `avgLinesPerCommit` which is the `netLines` divided by `numCommits`.
- The data from `cleanedFeedback.json` is imported into execution context and merged by name with the other data in `students`.
- `students` data is then written to `final-data/final-data.json` and `final-data/final-data.csv`.
