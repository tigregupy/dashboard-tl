import { adaptPeriodsData, adaptChartData } from '../adapter';
import {
  periodsWithResponsesMock,
  expectedData,
  expectedData2022H2,
  expectedChartCountTasksDoneData,
  expectedChartCountBugsCreatedData,
  expectedChartCountBugRateData,
} from './fake-data'

jest.useFakeTimers('modern').setSystemTime(new Date('2023-04-10'));

test('should adapt semester data', () => {
  const received = adaptPeriodsData({ periods: periodsWithResponsesMock, year: '2023', productName: 'R&S' });

  Object.keys(received).forEach((period) => {
    expect(received[period].teams).toEqual(expectedData[period].teams);
    expect(received[period].product).toEqual(expectedData[period].product);
    expect(received[period].tribes[0]).toEqual(expectedData[period].tribes[0]);
    expect(received[period].tribes[1]).toEqual(expectedData[period].tribes[1]);
  });
});

test('should adapt 2022 H2 semester data', () => {
  const periods = { h2: periodsWithResponsesMock.h1 };
  const received = adaptPeriodsData({ periods, year: '2022', productName: 'R&S' });

  expect(received).toEqual(expectedData2022H2);
});

test('should adapt semester chart data when variable is countTasksDone', () => {
  const variable = 'countTasksDone';
  const semesterData = adaptPeriodsData({ periods: periodsWithResponsesMock, year: '2023', productName: 'R&S' });
  const received = adaptChartData(semesterData, variable);

  expect(received).toEqual(expectedChartCountTasksDoneData);
});

test('should adapt semester chart data when variable is countBugsCreated', () => {
  const variable = 'countBugsCreated';
  const semesterData = adaptPeriodsData({ periods: periodsWithResponsesMock, year: '2023', productName: 'R&S' });
  const received = adaptChartData(semesterData, variable);

  expect(received).toEqual(expectedChartCountBugsCreatedData);
});

test('should adapt semester chart data when variable is bugRate', () => {
  const variable = 'bugRate';
  const semesterData = adaptPeriodsData({ periods: periodsWithResponsesMock, year: '2023', productName: 'R&S' });
  const received = adaptChartData(semesterData, variable);

  expect(received).toEqual(expectedChartCountBugRateData);
});
