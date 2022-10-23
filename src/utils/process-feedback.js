import fs from 'fs';
import { parse } from 'csv-parse';

export const processFeedback = () => {
  const records = [];

  fs.createReadStream('raw-data/feedback/feedback.csv')
    .pipe(parse({ delimiter: ',', from_line: 2 }))
    .on('data', function (row) {
      records.push({
        name: row[2],
        selfLearnRate: row[6],
        selfMentorRate: row[7],
        selfGrade: row[8],
        teamMember1: {
          name: row[12],
          grade: row[14],
          learn: row[15],
          mentor: row[16],
        },
        teamMember2: {
          name: row[18],
          grade: row[20],
          learn: row[21],
          mentor: row[22],
        },
        teamMember3: {
          name: row[24],
          grade: row[26],
          learn: row[27],
          mentor: row[28],
        },
        teamMember4: {
          name: row[30],
          grade: row[32],
          learn: row[33],
          mentor: row[34],
        },
      });
    })
    .on('end', function () {
      fs.writeFileSync('processed-data/feedback.json', JSON.stringify(records));
    })
    .on('error', function (error) {
      console.log(error.message);
    });
};
