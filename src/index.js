import dotenv from 'dotenv';

import { getAndWriteGroupCommits } from './utils/group-commits.js';
import { getAndWriteAllCommits } from './utils/all-commits.js';
import { processFeedback } from './utils/process-feedback.js';
import { processCompileStudents } from './utils/compile-students.js';
import { writeFinalCSV } from './utils/final-csv.js';

dotenv.config();

if (process.argv[2] === 'fetch') {
  if (process.argv[3] === 'group-commits') {
    await getAndWriteGroupCommits();
  } else if (process.argv[3] === 'all-commits') {
    await getAndWriteAllCommits();
  }
} else if (process.argv[2] === 'process') {
  if (process.argv[3] === 'feedback') {
    await processFeedback();
  } else if (process.argv[3] === 'compile-students') {
    await processCompileStudents();
  } else if (process.argv[3] === 'final-csv') {
    await writeFinalCSV();
  }
}
