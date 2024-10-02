import api, { route } from '@forge/api';

import { mergeArrays } from './utils/array';
import { asyncMapLimit } from './utils/async';
import { mountJql } from './utils/jqlHelper';
import { getN3Team } from "./utils/teamUtils";

const IssueType = {
  Epic: "Epic",
  Story : "Story",
  TechTask: "Tech Task",
  Bug: "Bug",
  Vulnerability: "Vulnerability",
  Idea: "Idea",
  Spike: "Spike",
  ActionItem: "Action Item"
}

const SubtaskIssueType = {
  Subtask : "Sub-task",
}

const isBeforeH22023 = (endDate) => {
  if (new Date(endDate) <= new Date('2023/07/01')) {
    return true;
  }

  return false;
};

const mountQuarters = (startDate) => {
  const date = new Date(startDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const quarter = Math.ceil(month / 3);

  if (quarter === 1 || quarter === 2) {
    return [`Q1 ${year}`, `Q2 ${year}`];
  } else if (quarter === 3 || quarter === 4) {
    return [`Q3 ${year}`, `Q4 ${year}`];
  }
};

const getEpics = (issuesDone = []) => {
  const result = {};
  for (const issue of issuesDone) {
    if (!Array.isArray(result[issue.epic])) result[issue.epic] = [];
    result[issue.epic].push(issue.key);
  }

  return result;
};

const searchInJira = async ({ jql, maxResults = 0, startAt = 0 }) => {
  let body = `{ "jql": "${jql}", "maxResults": ${maxResults}, "fields": ["issuetype", "parent", "key", "customfield_10700", "customfield_11150", "customfield_11261"]}`;

  if (startAt) {
    body = `{ "jql": "${jql}", "maxResults": ${maxResults}, "startAt": ${startAt}, "fields": ["issuetype", "parent", "key", "customfield_10700", "customfield_11261", "customfield_11177", "customfield_11150"]}`;
  }

  try {
    const response = await api.asApp().requestJira(route`/rest/api/3/search`, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-type': 'application/json' },
      body,
    });
    const data = await response.json();
    const { total, issues } = data;

    if (maxResults > 0 && issues && startAt + issues.length < total) {
      const nextPageStartAt = startAt + issues.length;
      const nextPageData = await searchInJira({ jql, maxResults, startAt: nextPageStartAt });
      return {
        total: nextPageData.total,
        issues: [...issues, ...nextPageData.issues]
      };
    } else {
      return { total, issues };
    }
  } catch (error) {
    console.log(`Error: maxResults ${maxResults} startAt ${startAt} jql ${jql}`, error);
  }

  return { total: 0, issues: [] };
}

const getIssuesCount = async (jql) => {
  try {
    const data = await searchInJira({ jql, maxResults: 0 });
    return data.total;
  } catch (error) {
    console.log(error);
  }
};

const getStrategicTasksDone = async ({ issuesDone = [], startDate, endDate }) => {
  const issues = issuesDone.filter(i => i.epic !== '' && i.type !== 'Epic' && i.type !== 'Bug' && i.type !== 'Issue');
  const useOldStrategicBoard = isBeforeH22023(endDate);
  const quarters = mountQuarters(startDate);

  const issuesEpics = getEpics(issues);
  const epicsKeys = Object.keys(issuesEpics);

  let epicsLinkedToAnInitiative = [];
  await asyncMapLimit(epicsKeys, 50, async (epic) => {
    let jql = `issue in linkedIssues('${epic}') and project = 'INI' AND ('Roteiro[Dropdown]' = '${quarters[0]}' or 'Roteiro[Dropdown]' = '${quarters[1]}')`
    if (useOldStrategicBoard) {
      jql = `issue in linkedIssues('${epic}') and project = 'PI'`;
    }
    const total = await getIssuesCount(jql);
    if (total && total > 0) {
      epicsLinkedToAnInitiative.push(epic);
    }
  });

  let countStrategicTasksDoneByInitiative = 0;
  let countNotStrategicTasksDoneByInitiative = issuesDone.filter(i => i.epic === '' || i.type === 'Bug' || i.type === 'Issue').length;
  const strategicEpics = [];
  const notStrategicEpics = [];
  Object.keys(issuesEpics).forEach((key) => {
    if (epicsLinkedToAnInitiative.includes(key)) {
      countStrategicTasksDoneByInitiative += issuesEpics[key].length;
      strategicEpics.push(key);
      
    } else {
      countNotStrategicTasksDoneByInitiative += issuesEpics[key].length;
      notStrategicEpics.push(key);
    }
  });

  return { countStrategicTasksDone: countStrategicTasksDoneByInitiative, strategicEpics, countNotStrategicTasksDone: countNotStrategicTasksDoneByInitiative, notStrategicEpics };
};

const getIssuesDoneCounts = async({ project, startDate, endDate }) => {

  const jql = mountJql({ type: 'allIssuesDone', project, startDate, endDate });
  const data = await searchInJira({ jql, maxResults: 100 });

  const issues = data.issues
    ?.filter(i => !!i && !!i.fields && !!i.fields.issuetype)
    .map(i => ({ key: i.key, type: i.fields.issuetype.name, epic: !!i.fields.parent && !!i.fields.parent.key ? i.fields.parent.key : '' }));

  const countInitiativesDone = issues.filter(i => i.type === IssueType.Idea).length;  
  const totalTP = issues.filter(i => i.type === SubtaskIssueType.Subtask || i.type === IssueType.Bug || i.type === IssueType.TechTask || i.type === IssueType.Spike).length;
  const countEpicsDone = issues.filter(i => i.type === IssueType.Epic && !i.key.startsWith('NE')).length;
  const storiesDone = issues.filter(i => i.type === IssueType.Story || i.type === IssueType.Story);
  const countStoriesDone = storiesDone.length;
  const countTechTasksDone = issues.filter(i => i.type === IssueType['TechTask']).length;
  const countSubTasksDone = issues.filter(i => i.type === SubtaskIssueType.SubBug || i.type === SubtaskIssueType.Subtask).length;
  const countBugsDone = issues.filter(i => i.type === IssueType.Bug).length;

  const { countStrategicTasksDone, strategicEpics, countNotStrategicTasksDone: countNotStrategicTasksDone, notStrategicEpics } = await getStrategicTasksDone({ issuesDone: storiesDone, startDate, endDate });

  return { countBugsDone, countEpicsDone, countStoriesDone, countTasksDone: countStoriesDone, countTechTasksDone, countStrategicTasksDone, countSubTasksDone, strategicEpics, countNotStrategicTasksDone, notStrategicEpics, countInitiativesDone, totalTP };
};

const getBugsCreatedCounts = async({ project, startDate, endDate }) => {
  const jql = mountJql({ type: 'bugsCreated', project, startDate, endDate });
  const data = await searchInJira({ jql, maxResults: 100 });

  const bugs = data.issues
    ?.filter(i => !!i && !!i.fields && i.fields.issuetype)
    .map(i => ({
      type: i.fields.issuetype.name,
      pLevel: i.fields.customfield_10700 ? i.fields.customfield_10700.value : '',
      bugType: i.fields.customfield_11150 ? i.fields.customfield_11150.value : '',
      team: i.fields.customfield_11261 ? i.fields.customfield_11261.value : '',
    }));

  const countBugsCreated = bugs?.length;
  const countBugsNewImplementationCreated = bugs.filter(i => i.bugType === 'New Implementation').length;
  const countTotalBugsN3Created = bugs.filter(i => i.team === getN3Team(project)).length;

  return {
    countBugsCreated,
    countBugsNewImplementationCreated,
    countTotalBugsN3Created,
  };
};

const getTicketsCreatedCount = async({ project, startDate, endDate }) => {
  const jql = mountJql({ type: 'n3TicketsCreated', project, startDate, endDate });
  const data = await searchInJira({ jql, maxResults: 100 });

  const n3TicketsCreated = data.issues?.length;
    
  return {
    n3TicketsCreated
  };
};

const getActionItensCreatedCount = async({ project, startDate, endDate }) => {
  const jql = mountJql({ type: 'n3TicketsCreated', project, startDate, endDate });
  const data = await searchInJira({ jql, maxResults: 100 });

  const totalActionItensN3Created = data.issues?.filter(item => item.fields.issuetype.name === IssueType.ActionItem).length;
  const dataTickets = data.issues?.length;
  const n3BugsPercentage = dataTickets > 0 ? ((dataTickets - totalActionItensN3Created) / dataTickets) * 100 : 0;

  return {
    totalActionItensN3Created, n3BugsPercentage
  };
};

const getTotalFinancialItems = async ({ project, startDate, endDate }) => {
  const jql = mountJql({ type: 'financialRate', project, startDate, endDate });
  const data = await searchInJira({ jql, maxResults: 100 });

  const financialRate = data.issues?.length;
    
  return {
    financialRate
  };
};

const getTotalInvestmentsItems = async ({ project, startDate, endDate }) => {
  const jql = mountJql({ type: 'investmentsRate', project, startDate, endDate });
  const data = await searchInJira({ jql, maxResults: 100 });

  const investmentsRate = data.issues?.length;
    
  return {
    investmentsRate
  };
};

const getProjectIssuesCount = async ({ project, startDate, endDate }) => {
  const [ issuesDoneCounts, bugsCreatedCounts, n3TicketsCreated, totalActionItensN3Created, financialRate, investmentsRate ] = await Promise.all([
    getIssuesDoneCounts({ project, startDate, endDate }),
    getBugsCreatedCounts({ project, startDate, endDate }),
    getTicketsCreatedCount({ project, startDate, endDate }),
    getActionItensCreatedCount({ project, startDate, endDate }),
    getTotalFinancialItems({ project, startDate, endDate }),
    getTotalInvestmentsItems({project, startDate, endDate})
  ]);

  return {
    project,
    ...issuesDoneCounts,
    ...bugsCreatedCounts,
    ...n3TicketsCreated,
    ...totalActionItensN3Created,
    ...financialRate,
    ...investmentsRate
  };
}

const getTeamsIssuesCount = async ({ teamsProjects, startDate, endDate }) => {
  const promises = teamsProjects.map(t => getProjectIssuesCount({ project: t.project, startDate, endDate }));

  const result = await Promise.all(promises);
  const data = mergeArrays(teamsProjects, result);

  return data;
};

export {
  getTeamsIssuesCount,
};