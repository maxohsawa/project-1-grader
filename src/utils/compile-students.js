import fs from 'fs';
import {
  aliases,
  names,
  approvedFilenames,
  disapprovedFilenames,
  disapprovedFileExtensions,
  investigate,
} from '../refs/keys.js';

export const processCompileStudents = () => {
  const students = {};

  const allCommitsData = JSON.parse(
    fs.readFileSync('raw-data/all-commits/all-commits.json')
  );

  // iterate through commits
  for (const sha in allCommitsData) {
    // references
    const commit = allCommitsData[sha];
    const authorName = commit.commit.author.name;
    const commitStats = commit.stats;
    // distill various handles down to simple name
    const endName = aliases[authorName];
    // if user not in students object yet, initialize
    if (!(endName in students)) {
      students[endName] = {};
      students[endName].shas = [];
      students[endName].numCommits = 0;
      students[endName].adjustedStats = {};
      students[endName].adjustedStats.total = 0;
      students[endName].adjustedStats.additions = 0;
      students[endName].adjustedStats.deletions = 0;
      students[endName].groupNo = names[endName].group;

      // setup for peer feedback to be populated later
      students[endName].selfGrade = 0;
      students[endName].selfLearn = 0;
      students[endName].selfMentor = 0;
      students[endName].peerGrades = [];
      students[endName].peerLearn = [];
      students[endName].peerMentor = [];
    }
    // handle commits
    // add sha and increment commits
    // students[endName].shas.push(sha);
    students[endName].numCommits += 1;
    // handle additions & deletions
    // iterate through files in each commit
    for (const file of commit.files) {
      // if the file is valid (user written)
      // not third party files and not images, fonts, etc.
      if (approvedFilenames.includes(file.filename)) {
        // then update student addition & deletions
        students[endName].adjustedStats.total +=
          file.additions + file.deletions;
        students[endName].adjustedStats.additions += file.additions;
        students[endName].adjustedStats.deletions += file.deletions;
      }
    }
  }

  // add netLines and avgLinesPerCommit metrics
  for (const student in students) {
    const stu = students[student];
    stu.netLines = stu.adjustedStats.additions - stu.adjustedStats.deletions;
    stu.avgLinesPerCommit = stu.netLines / stu.numCommits;
  }

  // import cleanedFeedback data
  const feedback = JSON.parse(
    fs.readFileSync('processed-data/cleanedFeedback.json')
  );

  // merge feedback data into student object
  for (const sourceName in feedback) {
    // console.log(feedback[sourceName]);
    const fb = feedback[sourceName];
    const student = students[sourceName];

    student.selfLearn = fb.selfLearnRate;
    student.selfMentor = fb.selfMentorRate;
    student.selfGrade = fb.selfGrade;

    // loop through team members and update OTHER students
    for (let i = 1; i <= 4; i++) {
      const { name, grade, learn, mentor } = fb[`teamMember${i}`];

      students[name].peerGrades.push({
        name: sourceName,
        grade: grade,
      });
      students[name].peerLearn.push({
        name: sourceName,
        grade: learn,
      });
      students[name].peerMentor.push({
        name: sourceName,
        grade: mentor,
      });
    }
  }

  // loop through each student and average their received peer grades
  for (const name in students) {
    const { peerGrades, peerLearn, peerMentor } = students[name];

    let sum = 0;
    for (const { grade } of peerGrades) {
      sum += parseInt(grade);
    }
    students[name].avgPeerGrade = sum / peerGrades.length;

    sum = 0;
    for (const { grade } of peerLearn) {
      sum += parseInt(grade);
    }
    students[name].avgPeerLearn = sum / peerLearn.length;

    sum = 0;
    for (const { grade } of peerMentor) {
      sum += parseInt(grade);
    }
    students[name].avgPeerMentor = sum / peerMentor.length;
  }

  fs.writeFileSync('final-data/final-data.json', JSON.stringify(students));

  // =======================================
};
