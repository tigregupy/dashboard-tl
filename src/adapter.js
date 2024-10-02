import { mountJql } from './utils/jqlHelper';

const countTotalTeamIssuesByType = (teams, countType) => teams.reduce((total, team) => {
  if (typeof team[countType] === 'number' && !isNaN(team[countType])) {
    total = total + team[countType];
  }

  return total;
}, 0);

const countTotalTeamIssuesPercentageByType = (teams, countType) => {
  const total = countTotalTeamIssuesByType(teams, countType);
  return total > 0 ? total/teams.length : 0
};

const calcBugRate = (totalBugs, total) => (total ? ((totalBugs / total) * 100).toFixed(2) : 0);

const calcAverageBugs = (totalBugs, period, periodType, year) => {
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getYear() + 1900;
  let totalMonths;

  if (year < currentYear) {
    if (periodType === 'semester') {
      totalMonths = 6;
    } else if (periodType === 'quarter') {
      totalMonths = 3;
    }
  } else {
    if (period === 'h1') {
      if (currentMonth > 6) {
        totalMonths = 6;
      } else {
        totalMonths = currentMonth;
      }
    }

    if (period === 'h2') {
      if (currentMonth === 12) {
        totalMonths = 6;
      } else {
        totalMonths = currentMonth - 6;
      }
    }

    if (period === 'q1') {
      if (currentMonth > 3) {
        totalMonths = 3;
      } else {
        totalMonths = currentMonth;
      }
    }

    if (period === 'q2') {
      if (currentMonth > 6) {
        totalMonths = 3;
      } else {
        totalMonths = currentMonth - 3;
      }
    }

    if (period === 'q3') {
      if (currentMonth > 9) {
        totalMonths = 3;
      } else {
        totalMonths = currentMonth - 6;
      }
    }

    if (period === 'q4') {
      if (currentMonth === 12) {
        totalMonths = 3;
      } else {
        totalMonths = currentMonth - 9;
      }
    }
  }

  if (totalMonths <= 0) {
    return 0;
  }

  return (totalBugs / totalMonths).toFixed(2);
};

const calcPeriodAverageBugs = (period, periodName, periodType, year) => {
  period.teams = period.teams.map(t => ({ ...t, averageBugs: calcAverageBugs(t.countBugsCreated, periodName, periodType, year ) }));
  period.product.averageBugs = calcAverageBugs(period.product.countBugsCreated, periodName, periodType, year );
  period.tribes = period.tribes.map((tribe) => ({ ...tribe, averageBugs: calcAverageBugs(tribe.countBugsCreated, periodName, periodType, year) }));

  return period;
}

const calcStrategicAlignment = (countStrategicTasksDone, countTasksDone) => {
  const strategicAlignment = countStrategicTasksDone ? ((countStrategicTasksDone / countTasksDone) * 100).toFixed(1) : 0;
  return `${strategicAlignment}`;
}

const mountIssuesFilterLink = (teams) => (
  teams.map((team) => {
    const { project, startDate, endDate, strategicEpics, notStrategicEpics } = team;
    const types = ['bugsCreated', 'bugsDone', 'issuesDone', 'strategicTasksDone', 'notStrategicTasksDone', 'subTasksDone', 'techTasksDone', 'epicsDone', 'storiesDone', 'tasksAndStoriesDone', 'bugsCreatedNewImplementation', 'totalBugsN3Created', 'n3TicketsCreated', 'totalTP', 'totalInitiativesDone', 'totalActionItensN3Created'];
    types.forEach((type) => {
      const jql = mountJql({ type, project, strategicEpics, notStrategicEpics, startDate, endDate });
      const baseUrl = 'https://gupy-io.atlassian.net/jira/software/c/projects';
      const issuesLink = `${baseUrl}/${project}/issues?jql=${encodeURIComponent(jql)}`;
      team[`${type}Link`] = issuesLink;
    });
    return team;
  })
);

const mountCountData = (teams) => {
  const countTasksDone = countTotalTeamIssuesByType(teams, 'countTasksDone');
  const countBugsCreated = countTotalTeamIssuesByType(teams, 'countBugsCreated');
  const countBugsNewImplementationCreated = countTotalTeamIssuesByType(teams, 'countBugsNewImplementationCreated');
  const countStrategicTasksDone = countTotalTeamIssuesByType(teams, 'countStrategicTasksDone');
  const totalTP = countTotalTeamIssuesByType(teams, 'totalTP');

  return {
    countTasksDone,
    countBugsCreated,
    countBugsNewImplementationCreated,
    countStrategicTasksDone,
    totalTP,
    countStoriesDone: countTotalTeamIssuesByType(teams, 'countStoriesDone'),
    countNotStrategicTasksDone: countTotalTeamIssuesByType(teams, 'countNotStrategicTasksDone'),
    countSubTasksDone: countTotalTeamIssuesByType(teams, 'countSubTasksDone'),
    countTechTasksDone: countTotalTeamIssuesByType(teams, 'countTechTasksDone'),
    countEpicsDone: countTotalTeamIssuesByType(teams, 'countEpicsDone'),
    countBugsDone: countTotalTeamIssuesByType(teams, 'countBugsDone'),
    countTotalBugsN3Created: countTotalTeamIssuesByType(teams, 'countTotalBugsN3Created'),
    bugRate: calcBugRate(countBugsCreated, totalTP),
    strategicAlignment: calcStrategicAlignment(countStrategicTasksDone, countTasksDone),
    countInitiativesDone: countTotalTeamIssuesByType(teams, 'countInitiativesDone'),
    n3TicketsCreated: countTotalTeamIssuesByType(teams, 'n3TicketsCreated'),
    totalActionItensN3Created: countTotalTeamIssuesByType(teams, 'totalActionItensN3Created'),
    n3BugsPercentage: countTotalTeamIssuesPercentageByType(teams, 'n3BugsPercentage'),
  };
};

const mountPeriod = (teams, productName) => {
  const data = {
    teams,
    product: {
      name: productName,
      averageBugs: 0,
    },
  };

  data.teams = mountIssuesFilterLink(data.teams);
  data.teams = data.teams.map(t => ({
    ...t,
    bugRate: calcBugRate(t.countBugsCreated, t.totalTP),
    strategicAlignment: calcStrategicAlignment(t.countStrategicTasksDone, t.countTasksDone),
  }));

  data.product = { ...data.product, ...mountCountData(teams) };
  data.tribes = [];

  const tribeNames = Array.from(new Set(teams.map(t => t.tribe)));
  if (tribeNames && Array.isArray(tribeNames) && tribeNames.length > 1) {
    tribeNames.forEach((tribeName) => {
      const tribeTeams = teams.filter(t => t.tribe === tribeName);
      data.tribes.push({
        ...mountCountData(tribeTeams),
        name: tribeName,
        averageBugs: 0,
      });
    });
  }

  return data;
};

const adaptPeriodsData = ({ periods, year, productName }) => {
  const periodsList = Object.keys(periods);
  const data = {};
  periodsList.forEach((period) => {
    data[period] = mountPeriod(periods[period].data, productName);
  });

  periodsList.forEach((period) => {
    const periodType = periods[period].type;
    if (periodType === 'semester' || periodType === 'quarter') {
      data[period] = calcPeriodAverageBugs(data[period], period, periodType, year);
    }
  });

  return data;
};

const mapToTeam = (variable, teams, dataSet = {}) => {
  teams.forEach((team) => {
    if (!dataSet[team.name]) dataSet[team.name] = [];
    dataSet[team.name].push(team[variable]);
  });

  return dataSet;
};

const mapTeamsValues = (variable, months) => {
  const series = ['product', 'tribes', 'teams'];

  return series.reduce((dataSet, serie) => {
    Object.keys(months).forEach((month) => {
      const data = Array.isArray(months[month][serie]) ? months[month][serie] : [months[month][serie]];
      dataSet = mapToTeam(variable, data, dataSet);
    });

    return dataSet;
  }, {});
};

const adaptChartData = (data, variable) => {
  const months = [
    { key: 'jan', label: 'Jan' },
    { key: 'feb', label: 'Fev' },
    { key: 'mar', label: 'Mar' },
    { key: 'apr', label: 'Abr' },
    { key: 'may', label: 'Mai' },
    { key: 'jun', label: 'Jun' },
    { key: 'jul', label: 'Jul' },
    { key: 'aug', label: 'Ago' },
    { key: 'sep', label: 'Set' },
    { key: 'oct', label: 'Out' },
    { key: 'nov', label: 'Nov' },
    { key: 'dec', label: 'Dez' },
  ];
  const currentMonth = new Date().getMonth();
  const monthsData = {};
  const labels = [];

  months.splice(currentMonth + 1, months.length);
  Object.keys(data).forEach((period) => {
    if (period === 'h1' || period === 'h2' || period === 'q1' || period === 'q2' || period === 'q3' || period === 'q4') return;

    const currentMonthIndex = months.findIndex(month => month.key === period);
    if (data[period] && currentMonthIndex <= currentMonth && currentMonthIndex !== -1) {
      monthsData[period] = data[period];
      labels.push(months[currentMonthIndex].label);
    }
  });

  const dataSet = mapTeamsValues(variable, monthsData);

  const datasets = Object.keys(dataSet).map((team) => ({
    label: team,
    data: dataSet[team],
    fill: false,
    borderWidth: 1,
  }));

  return { datasets, labels };
};

export {
  adaptPeriodsData,
  adaptChartData,
  mountIssuesFilterLink,
};