import fs from 'fs';
import csvWriterPackage from 'csv-writer';

export const writeFinalCSV = () => {
  const students = JSON.parse(fs.readFileSync('final-data/final-data.json'));

  const data = [];
  for (const name in students) {
    const student = students[name];
    student.name = name;
    delete student.shas;
    delete student.adjustedStats;
    delete student.peerGrades;
    delete student.peerLearn;
    delete student.peerMentor;

    data.push(student);
  }

  const createCsvWriter = csvWriterPackage.createObjectCsvWriter;

  const csvWriter = createCsvWriter({
    path: 'final-data/final-data.csv',
    header: [
      { id: 'name', title: 'Name' },
      { id: 'numCommits', title: 'Commits' },
      { id: 'groupNo', title: 'Group' },
      { id: 'netLines', title: 'Net Additions' },
      { id: 'avgLinesPerCommit', title: 'Avg Additions/Commit' },
      { id: 'selfGrade', title: 'Self Grade' },
      { id: 'avgPeerGrade', title: 'Avg Peer Grade' },
      { id: 'selfLearn', title: 'Self Learn' },
      { id: 'avgPeerLearn', title: 'Avg Peer Learn' },
      { id: 'selfMentor', title: 'Self Mentor' },
      { id: 'avgPeerMentor', title: 'Avg Peer Mentor' },
    ],
  });

  csvWriter
    .writeRecords(data)
    .then(() => console.log('The CSV file was written successfully'));
};
