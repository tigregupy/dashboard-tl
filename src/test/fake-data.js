import { mountIssuesFilterLink } from '../adapter';

let teams = [
  { name: 'time 1', project: 'time1', startDate: '2023/01/01', endDate: '2023/02/01', tribe: 'Tribo Recrutamento',
    countTasksDone: 60,
    countStoriesDone: 20,
    countStrategicTasksDone: 50,
    countNotStrategicTasksDone: 10,
    countBugsCreated: 10,
    countBugsDone: 5,
    countBugsP0Created: 1,
    countEpicsDone: 2,
    countSubTasksDone: 4,
    countBugsNewImplementationCreated: 1,
    countBugsLegacyStructureCreated: 4,
    countBugsStableFeatureCreated: 5,
    countTasksAndStoriesDone: 20,
    strategicEpics: [],
    notStrategicEpics: [],
  },
  {
    name: 'time 2', project: 'time2', startDate: '2023/01/01', endDate: '2023/02/01', tribe: 'Tribo Recrutamento',
    countTasksDone: 50,
    countStoriesDone: 10,
    countStrategicTasksDone: 25,
    countNotStrategicTasksDone: 25,
    countBugsCreated: 5,
    countBugsDone: 7,
    countBugsP0Created: 0,
    countEpicsDone: 4,
    countSubTasksDone: 2,
    countBugsNewImplementationCreated: 1,
    countBugsLegacyStructureCreated: 4,
    countBugsStableFeatureCreated: 0,
    countTasksAndStoriesDone: 10,
    strategicEpics: [],
    notStrategicEpics: [],
  },
  {
    name: 'time 3', project: 'time3', startDate: '2023/01/01', endDate: '2023/02/01', tribe: 'Tribo Sel & Adm',
    countTasksDone: 65,
    countStoriesDone: 10,
    countStrategicTasksDone: 65,
    countNotStrategicTasksDone: 0,
    countBugsCreated: 5,
    countBugsDone: 7,
    countBugsP0Created: 0,
    countEpicsDone: 4,
    countSubTasksDone: 2,
    countBugsNewImplementationCreated: 1,
    countBugsLegacyStructureCreated: 4,
    countBugsStableFeatureCreated: 0,
    countTasksAndStoriesDone: 10,
    strategicEpics: [],
    notStrategicEpics: [],
  },
  {
    name: 'time 4', project: 'time4', startDate: '2023/01/01', endDate: '2023/02/01', tribe: 'Tribo Sel & Adm',
    countTasksDone: 55,
    countStoriesDone: 20,
    countStrategicTasksDone: 55,
    countNotStrategicTasksDone: 0,
    countBugsCreated: 10,
    countBugsDone: 5,
    countBugsP0Created: 1,
    countEpicsDone: 2,
    countSubTasksDone: 4,
    countBugsNewImplementationCreated: 1,
    countBugsLegacyStructureCreated: 4,
    countBugsStableFeatureCreated: 5,
    countTasksAndStoriesDone: 20,
    strategicEpics: [],
    notStrategicEpics: [],
  },
];

const periodsWithResponsesMock = {
  h1: { type: 'semester', startDate: '2023/01/01', endDate: '2023/02/01', data: teams },
  q1: { type: 'quarter', startDate: '2023/01/01', endDate: '2023/02/01', data: teams },
  q2: { type: 'quarter', startDate: '2023/01/01', endDate: '2023/02/01', data: teams },
  jan: { type: 'month', startDate: '2023/01/01', endDate: '2023/02/01', data: teams },
  feb: { type: 'month', startDate: '2023/01/01', endDate: '2023/02/01', data: teams },
  mar: { type: 'month', startDate: '2023/01/01', endDate: '2023/02/01', data: teams },
  apr: { type: 'month', startDate: '2023/01/01', endDate: '2023/02/01', data: teams },
  may: { type: 'month', startDate: '2023/01/01', endDate: '2023/02/01', data: teams },
  jun: { type: 'month', startDate: '2023/01/01', endDate: '2023/02/01', data: teams },
};

teams = [
  { ...teams[0], bugRate: '16.67', bugRateNI: '5.00', strategicAlignment: '83.3' },
  { ...teams[1], bugRate: '10.00', bugRateNI: '10.00', strategicAlignment: '50.0' },
  { ...teams[2], bugRate: '7.69', bugRateNI: '10.00', strategicAlignment: '100.0' },
  { ...teams[3], bugRate: '18.18', bugRateNI: '5.00', strategicAlignment: '100.0' },
];

teams = mountIssuesFilterLink(teams);

const product = { name: 'R&S', countTasksDone: 230, countStoriesDone: 60, countStrategicTasksDone: 195, countNotStrategicTasksDone: 35, strategicAlignment: '84.8', countBugsCreated: 30, countBugsDone: 24, countBugsP0Created: 2, countEpicsDone: 12, countSubTasksDone: 12, bugRate: '13.04', averageBugs: 0, countBugsNewImplementationCreated: 4, countBugsLegacyStructureCreated: 16, countBugsStableFeatureCreated: 10, countTasksAndStoriesDone: 60, bugRateNI: '6.67' };
const tribes = [
  { name: 'Tribo Recrutamento', countTasksDone: 110, countStoriesDone: 30, countStrategicTasksDone: 75, countNotStrategicTasksDone: 35, strategicAlignment: '68.2', countBugsCreated: 15, countBugsDone: 12, countBugsP0Created: 1, countEpicsDone: 6, countSubTasksDone: 6, bugRate: '13.64', averageBugs: 0, countBugsNewImplementationCreated: 2, countBugsLegacyStructureCreated: 8, countBugsStableFeatureCreated: 5, countTasksAndStoriesDone: 30, bugRateNI: '6.67' },
  { name: 'Tribo Sel & Adm', countTasksDone: 120, countStoriesDone: 30, countStrategicTasksDone: 120, countNotStrategicTasksDone: 0, strategicAlignment: '100.0', countBugsCreated: 15, countBugsDone: 12, countBugsP0Created: 1, countEpicsDone: 6, countSubTasksDone: 6, bugRate: '12.50', averageBugs: 0, countBugsNewImplementationCreated: 2, countBugsLegacyStructureCreated: 8, countBugsStableFeatureCreated: 5, countTasksAndStoriesDone: 30, bugRateNI: '6.67' },
];

const expectedData = {
  jan: { teams, product, tribes },
  feb: { teams, product, tribes },
  mar: { teams, product, tribes },
  apr: { teams, product, tribes },
  may: { teams, product, tribes },
  jun: { teams, product, tribes },
  h1: {
    product: { ...product, averageBugs: '7.50' },
    tribes: [
      { ...tribes[0], averageBugs: '3.75' },
      { ...tribes[1], averageBugs: '3.75' },
    ],
    teams: [
      { ...teams[0], averageBugs: '2.50' },
      { ...teams[1], averageBugs: '1.25' },
      { ...teams[2], averageBugs: '1.25' },
      { ...teams[3], averageBugs: '2.50' },
    ],
  },
  q1: {
    product: { ...product, averageBugs: '10.00' },
    tribes: [
      { ...tribes[0], averageBugs: '5.00' },
      { ...tribes[1], averageBugs: '5.00' },
    ],
    teams: [
      { ...teams[0], averageBugs: '3.33' },
      { ...teams[1], averageBugs: '1.67' },
      { ...teams[2], averageBugs: '1.67' },
      { ...teams[3], averageBugs: '3.33' },
    ],
  },
  q2: {
    product: { ...product, averageBugs: '30.00' },
    tribes: [
      { ...tribes[0], averageBugs: '15.00' },
      { ...tribes[1], averageBugs: '15.00' },
    ],
    teams: [
      { ...teams[0], averageBugs: '10.00' },
      { ...teams[1], averageBugs: '5.00' },
      { ...teams[2], averageBugs: '5.00' },
      { ...teams[3], averageBugs: '10.00' },
    ],
  },
}

const expectedData2022H2 = {
  h2: {
    product: { ...product, averageBugs: '5.00' },
    tribes: [
      { ...tribes[0], averageBugs: '2.50' },
      { ...tribes[1], averageBugs: '2.50' },
    ],
    teams: [
      { ...teams[0], averageBugs: '1.67' },
      { ...teams[1], averageBugs: '0.83' },
      { ...teams[2], averageBugs: '0.83' },
      { ...teams[3], averageBugs: '1.67' },
    ],
  },
};

const labels = ['Jan', 'Fev', 'Mar', 'Abr'];
const commonProps = { borderWidth: 1, fill: false }

const expectedChartCountTasksDoneData = {
  labels,
  datasets: [
    { label: 'R&S', data: [230, 230, 230, 230], ...commonProps },
    { label: 'Tribo Recrutamento', data: [110, 110, 110, 110], ...commonProps },
    { label: 'Tribo Sel & Adm', data: [120, 120, 120, 120], ...commonProps },
    { label: 'time 1', data: [60, 60, 60, 60], ...commonProps },
    { label: 'time 2', data: [50, 50, 50, 50], ...commonProps },
    { label: 'time 3', data: [65, 65, 65, 65], ...commonProps },
    { label: 'time 4', data: [55, 55, 55, 55], ...commonProps },
  ],
};

const expectedChartCountBugsCreatedData = {
  labels,
  datasets: [
    { label: 'R&S', data: [30, 30, 30, 30], ...commonProps },
    { label: 'Tribo Recrutamento', data: [15, 15, 15, 15], ...commonProps },
    { label: 'Tribo Sel & Adm', data: [15, 15, 15, 15], ...commonProps },
    { label: 'time 1', data: [10, 10, 10, 10], ...commonProps },
    { label: 'time 2', data: [5, 5, 5, 5], ...commonProps },
    { label: 'time 3', data: [5, 5, 5, 5], ...commonProps },
    { label: 'time 4', data: [10, 10, 10, 10], ...commonProps },
  ],
};

const expectedChartCountBugRateData = {
  labels,
  datasets: [
    { label: 'R&S', data: ['13.04', '13.04', '13.04', '13.04'], ...commonProps },
    { label: 'Tribo Recrutamento', data: ['13.64', '13.64', '13.64', '13.64'], ...commonProps },
    { label: 'Tribo Sel & Adm', data: ['12.50', '12.50', '12.50', '12.50'], ...commonProps },
    { label: 'time 1', data: ['16.67', '16.67', '16.67', '16.67'], ...commonProps },
    { label: 'time 2', data: ['10.00', '10.00', '10.00', '10.00'], ...commonProps },
    { label: 'time 3', data: ['7.69', '7.69', '7.69', '7.69'], ...commonProps },
    { label: 'time 4', data: ['18.18', '18.18', '18.18', '18.18'], ...commonProps },
  ],
};

export {
  periodsWithResponsesMock,
  expectedData,
  expectedData2022H2,
  expectedChartCountTasksDoneData,
  expectedChartCountBugsCreatedData,
  expectedChartCountBugRateData,
};
