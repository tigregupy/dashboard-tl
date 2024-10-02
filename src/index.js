import Resolver from '@forge/resolver';
import he from 'he';

import { getTeamsIssuesCount } from './service';
import { adaptPeriodsData, adaptChartData } from './adapter';
import { getTeamsProjects } from './teams-manager'
import { asyncMapLimit } from './utils/async';

const resolver = new Resolver();

const mountPeriod = (periodKey, year) => {
  const nextYear = parseInt(year) + 1;

  if (periodKey === 'h1') {
    return { type: 'semester', startDate: `${year}/01/01`, endDate: `${year}/07/01`, data: {} };
  }

  if (periodKey === 'h2') {
    return { type: 'semester', startDate: `${year}/07/01`, endDate: `${nextYear}/01/01`, data: {} };
  }

  if (periodKey === 'q1') {
    return { type: 'quarter', startDate: `${year}/01/01`, endDate: `${year}/04/01`, data: {} };
  }

  if (periodKey === 'q2') {
    return { type: 'quarter', startDate: `${year}/04/01`, endDate: `${year}/07/01`, data: {} };
  }

  if (periodKey === 'q3') {
    return { type: 'quarter', startDate: `${year}/07/01`, endDate: `${year}/10/01`, data: {} };
  }

  if (periodKey === 'q4') {
    return { type: 'quarter', startDate: `${year}/10/01`, endDate: `${nextYear}/01/01`, data: {} };
  }

  if (periodKey === 'jan') {
    return { type: 'month', startDate: `${year}/01/01`, endDate: `${year}/02/01`, data: {} };
  }

  if (periodKey === 'feb') {
    return { type: 'month', startDate: `${year}/02/01`, endDate: `${year}/03/01`, data: {} };
  }

  if (periodKey === 'mar') {
    return { type: 'month', startDate: `${year}/03/01`, endDate: `${year}/04/01`, data: {} };
  }

  if (periodKey === 'apr') {
    return { type: 'month', startDate: `${year}/04/01`, endDate: `${year}/05/01`, data: {} };
  }

  if (periodKey === 'may') {
    return { type: 'month', startDate: `${year}/05/01`, endDate: `${year}/06/01`, data: {} };
  }

  if (periodKey === 'jun') {
    return { type: 'month', startDate: `${year}/06/01`, endDate: `${year}/07/01`, data: {} };
  }

  if (periodKey === 'jul') {
    return { type: 'month', startDate: `${year}/07/01`, endDate: `${year}/08/01`, data: {} };
  }

  if (periodKey === 'aug') {
    return { type: 'month', startDate: `${year}/08/01`, endDate: `${year}/09/01`, data: {} };
  }

  if (periodKey === 'sep') {
    return { type: 'month', startDate: `${year}/09/01`, endDate: `${year}/10/01`, data: {} };
  }

  if (periodKey === 'oct') {
    return { type: 'month', startDate: `${year}/10/01`, endDate: `${year}/11/01`, data: {} };
  }

  if (periodKey === 'nov') {
    return { type: 'month', startDate: `${year}/11/01`, endDate: `${year}/12/01`, data: {} };
  }

  if (periodKey === 'dec') {
    return { type: 'month', startDate: `${year}/12/01`, endDate: `${nextYear}/01/01`, data: {} };
  }
};

const mountMonthsPeriods = (options) => {
  const { year } = options;
  const periods = {};

  if (options.h1Months) {
    periods.jan = mountPeriod('jan', year);
    periods.feb = mountPeriod('feb', year);
    periods.mar = mountPeriod('mar', year);
    periods.apr = mountPeriod('apr', year);
    periods.may = mountPeriod('may', year);
    periods.jun = mountPeriod('jun', year);
  }

  if (options.h2Months) {
    periods.jul = mountPeriod('jul', year);
    periods.aug = mountPeriod('aug', year);
    periods.sep = mountPeriod('sep', year);
    periods.oct = mountPeriod('oct', year);
    periods.nov = mountPeriod('nov', year);
    periods.dec = mountPeriod('dec', year);
  }

  return periods;
};

const getSelectedPeriods = (options) => {
  let selectedPeriods = [];

  if (options.h1) {
    selectedPeriods = [...selectedPeriods, 'h1'];
  }

  if (options.h2) {
    selectedPeriods = [...selectedPeriods, 'h2'];
  }

  if (options.q1) {
    selectedPeriods = [...selectedPeriods, 'q1'];
  }

  if (options.q2) {
    selectedPeriods = [...selectedPeriods, 'q2'];
  }

  if (options.q3) {
    selectedPeriods = [...selectedPeriods, 'q3'];
  }

  if (options.q4) {
    selectedPeriods = [...selectedPeriods, 'q4'];
  }

  if (options.h1Months) {
    selectedPeriods = [...selectedPeriods, 'jan', 'feb', 'mar', 'apr', 'may', 'jun'];
  }

  if (options.h2Months) {
    selectedPeriods = [...selectedPeriods, 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  }

  return selectedPeriods;
}

resolver.define('getMonthsIssuesCount', async ({ payload }) => {
  const periodOptions = { ...payload };
  const productName = he.decode(payload.productName);
  const periods = mountMonthsPeriods(periodOptions);

  const periodsList = Object.keys(periods);

  const response = await asyncMapLimit(periodsList, 50, async (period) => {
    const { startDate, endDate } = periods[period];
    const teamsProjects = getTeamsProjects({ productName, year: periodOptions.year, period, startDate, endDate });

    return getTeamsIssuesCount({ teamsProjects, startDate, endDate });
  });

  periodsList.forEach((period, index) => {
    periods[period].data = response[index];
  });

  return adaptPeriodsData({ periods, year: periodOptions.year, productName });
});

resolver.define('getPeriodIssuesCount', async ({ payload }) => {
  const { periodKey, year } = payload;
  const productName = he.decode(payload.productName);

  const periods = { [periodKey]: mountPeriod(periodKey, year) };

  const { startDate, endDate } = periods[periodKey];
  const teamsProjects = getTeamsProjects({ productName, year, period: periodKey, startDate, endDate });
  const response = await getTeamsIssuesCount({ teamsProjects, startDate, endDate });

  periods[periodKey].data = response;

  const data = adaptPeriodsData({ periods, year, productName });
  return data[periodKey];
});

resolver.define('getPeriodsList', async ({ payload }) => {
  const periodOptions = { ...payload };
  const periodsList = getSelectedPeriods(periodOptions);

  return periodsList;
});

resolver.define('getChartData', async (req) => {
  const { data, variable } = req.payload;
  const adaptedData = adaptChartData(data, variable);
  return adaptedData;
});

export const handler = resolver.getDefinitions();
