import { getN3Team } from "./teamUtils";
import { getIniTeam } from "./teamUtils";

const mountCreatedDateFilter = ({ startDate, endDate }) => `created >= '${startDate}' AND created < '${endDate}'`;
const mountResolvedDateFilter = ({ startDate, endDate }) => `(('End date[Date]' >= '${startDate}' AND 'End date[Date]' < '${endDate}') OR (resolutiondate >= '${startDate}' AND resolutiondate < '${endDate}'))`;

const mountJql = ({ type, project, strategicEpics, notStrategicEpics, startDate, endDate }) => {
  let jql = `project = '${project}'`;
  const cancelledFilter = `status != 'Cancelado'`;
  const resolvedDateFilter = mountResolvedDateFilter({ startDate, endDate });
  const createdDateFilter = mountCreatedDateFilter({ startDate, endDate });

  // --- Dashboard Columns ---

  if (type === 'totalInitiativesDone') {
    jql = `(project = INI) AND (status = 'Concluído' OR status = '8. Concluído') AND 'Squad[Dropdown]' = '${getIniTeam(project)}' AND resolutiondate >= '${startDate}' AND resolutiondate < '${endDate}'`;
  }

  if (type === 'epicsDone') {
    jql += ` AND type = 'Epic' AND (status = 'Done' OR status = 'Concluído' OR status = '8. Concluído') AND ${resolvedDateFilter}`;
  }

  if (type === 'storiesDone') {
    jql += ` AND type = 'Story' AND (status = 'Done' OR status = 'Concluido' OR status = 'Concluído') AND ${resolvedDateFilter}`;
  }
  
  if (type === 'subTasksDone') {
    jql += ` AND type in (Sub-bug, Sub-task) AND (status = 'Concluído' OR status = 'Done') AND ${resolvedDateFilter}`;
  }

  if (type === 'techTasksDone') {
    jql += ` AND type in ('Tech Task') AND (status = 'Concluído' OR status = 'Done') AND ${resolvedDateFilter}`;
  }

  if (type === 'totalTP') {
    jql = `((project = '${project}') OR (project = 'NE' AND 'Produto Gupy[Select List (multiple choices)]' = 'Edu Corp' AND 'Time[Dropdown]' = ${getN3Team(project)})) AND type in (Sub-task, 'Tech Task', Spike, Bug) AND (status = 'Concluído' OR status = 'Done') AND ${resolvedDateFilter}`;
  }
  
  if (type === 'strategicTasksDone') {
    jql += ` AND 'Epic Link' in (${strategicEpics.toString()}) AND type in ('Story') AND (status = 'Concluído' OR status = 'Done') AND ${cancelledFilter} AND ${resolvedDateFilter}`;
  }

  if (type === 'notStrategicTasksDone') {
    const dateFilter = mountResolvedDateFilter({ startDate, endDate });
    let epicFilter = '';
    if (notStrategicEpics.length) {
      const linkedIssuesEpics = notStrategicEpics.join(',');
      epicFilter = `parentEpic in (${linkedIssuesEpics}) OR `;
    }
    jql += ` AND (${epicFilter} 'Epic Link' is EMPTY) AND type = Story AND type not in subTaskIssueTypes() AND ${cancelledFilter} AND ${resolvedDateFilter}`;
  }

  if (type === 'bugsCreated') {
    jql = `(project = '${project}' OR (project = 'NE' AND 'Produto Gupy[Select List (multiple choices)]' = 'Edu Corp' AND 'Time[Dropdown]' = '${getN3Team(project)}')) AND type = 'Bug' AND ${createdDateFilter} AND ${cancelledFilter}`;
  }

  if (type === 'bugsCreatedNewImplementation') {
    jql = `(project = '${project}' OR (project = 'NE' AND 'Produto Gupy[Select List (multiple choices)]' = 'Edu Corp' AND 'Time[Dropdown]' = '${getN3Team(project)}')) AND type = 'Bug' AND ${createdDateFilter} AND 'Bug Origin[Dropdown]' = 'New Implementation' AND ${cancelledFilter}`;
  }

  // TODO create new column
  if (type === 'bugsCreatedLegacyStructure') {
    jql = `(project = '${project}' OR (project = 'NE' AND 'Produto Gupy[Select List (multiple choices)]' = 'Edu Corp' AND 'Time[Dropdown]' = '${getN3Team(project)}')) AND type = 'Bug' AND ${createdDateFilter} AND 'Bug Origin[Dropdown]' = 'Legacy Structure' AND ${cancelledFilter}`;
  }

  // TODO create new column
  if (type === 'bugsCreatedStableFeature') {
    jql = `(project = '${project}' OR (project = 'NE' AND 'Produto Gupy[Select List (multiple choices)]' = 'Edu Corp' AND 'Time[Dropdown]' = '${getN3Team(project)}')) AND type = 'Bug' AND ${createdDateFilter} AND 'Bug Origin[Dropdown]' = 'Stable Feature' AND ${cancelledFilter}`;
  }

  if (type === 'bugsDone') {
    jql = `(project = '${project}' OR (project = 'NE' AND 'Produto Gupy[Select List (multiple choices)]' = 'Edu Corp' AND 'Time[Dropdown]' = '${getN3Team(project)}')) AND type = 'Bug' AND (status = 'Done' OR status = 'Concluido' OR status = 'Concluído') AND ${resolvedDateFilter}`;
  }

  if (type === 'totalBugsN3Created') {
    jql = `project = 'NE' AND 'Produto Gupy[Select List (multiple choices)]' = 'Edu Corp' AND 'Time[Dropdown]' = ${getN3Team(project)} AND type = 'Bug' AND ${createdDateFilter} AND ${cancelledFilter}`;
  }

  if (type === 'n3TicketsCreated') {
    jql = `project = 'NE' AND 'Produto Gupy[Select List (multiple choices)]' = 'Edu Corp' AND 'Time[Dropdown]' = ${getN3Team(project)} AND type in ('Bug', 'Action Item') AND ${createdDateFilter} AND ${cancelledFilter}`;
  }
  
  if (type === 'totalActionItensN3Created') {
    jql = `project = 'NE' AND 'Produto Gupy[Select List (multiple choices)]' = 'Edu Corp' AND 'Time[Dropdown]' = ${getN3Team(project)} AND type = 'Action Item' AND ${createdDateFilter} AND ${cancelledFilter}`;
  }
  // --- Graphics --- 
  if (type === 'allIssuesDone') {
    jql = `((project = '${project}') OR (project = 'INI' AND 'Squad[Dropdown]' = '${getIniTeam(project)}') OR (project = 'NE' AND 'Produto Gupy[Select List (multiple choices)]' = 'Edu Corp' AND 'Time[Dropdown]' = ${getN3Team(project)})) AND (status = 'Concluído' OR status = 'Done' OR status = '8. Concluído') AND ${resolvedDateFilter}`;
  }
  
  if (type === 'issuesDone') {
    jql = `(project = '${project}' OR project = INI) AND (issuetype = 'Story' OR issuetype = 'Idea') AND (status = 'Concluído' OR status = 'Done' OR status = '8. Concluído') AND ${resolvedDateFilter}`;
  }

  if (type === 'tasksAndStoriesDone') {
    jql += ` AND (type = 'Tarefa' OR type = 'Task' OR type = 'Story' OR type = 'Story - Feature' OR type = 'Story - Improvement' OR type = 'Story - Maintenance') AND (status = 'Done' OR status = 'Concluido' OR status = 'Concluído') AND ${resolvedDateFilter}`;
  }
  
  if (type === 'financialRate') {
    jql = `((project = '${project}') OR (project = 'NE' AND 'Produto Gupy[Select List (multiple choices)]' = 'Edu Corp' AND 'Time[Dropdown]' = ${getN3Team(project)})) AND type in (Bug, Vulnerability, 'Tech Task') AND (status = 'Concluído' OR status = 'Done' OR status = '8. Concluído') AND ${resolvedDateFilter}`;
  }

  if (type === 'investmentsRate') {
    jql = `project = '${project}' AND type in (Story, Sub-task) AND (status = 'Concluído' OR status = 'Done' OR status = '8. Concluído') AND ${resolvedDateFilter}`;
  }

  return jql;
};

export {
  mountJql,
};