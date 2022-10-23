const studentSelect = document.getElementById('student-select');
const groupSelect = document.getElementById('group-select');
const datasetSelect = document.getElementById('dataset-select');
const reloadButton = document.getElementById('reload-button');

let studentSelection = [];
let groupSelection = [];
let datasetSelection = [];

// generate options
for (const name in students) {
  const option = document.createElement('option');
  option.textContent = name;
  option.setAttribute('value', name);
  studentSelect.appendChild(option);
}

// generate group options
for (let i = 1; i <= 5; i++) {
  const option = document.createElement('option');
  option.textContent = `group${i}`;
  option.setAttribute('value', `group${i}`);
  groupSelect.appendChild(option);
}

// generate datasets
// keys that correspond to primitives
const datasets = Object.keys(Object.values(students)[0]).filter(
  (property) =>
    ![
      'shas',
      'adjustedStats',
      'peerGrades',
      'peerLearn',
      'peerMentor',
    ].includes(property)
);

for (const set of datasets) {
  const option = document.createElement('option');
  option.textContent = set;
  option.setAttribute('value', set);
  datasetSelect.appendChild(option);
}

reloadButton.addEventListener('click', () => {
  studentSelection = getSelected(studentSelect);
  groupSelection = getSelected(groupSelect);
  datasetSelection = getSelected(datasetSelect);
  render(datasetSelection);
});

function getSelected(select) {
  const selected = [];
  for (const option of select.options) {
    if (option.selected) selected.push(option.value);
  }
  return selected;
}

function render() {}
