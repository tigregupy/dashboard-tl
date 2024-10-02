import React from "react";
import styled from 'styled-components';
import { Cell, Row } from '@atlaskit/table-tree';

const StyledCellTeam = styled(Cell)`
  padding: 5px !important;
  line-height: 15px !important;
  min-height: 30px !important;
`;

const StyledCellData = styled(Cell)`
  text-align: center;
  display: grid !important;
  padding: 5px !important;
  line-height: 15px !important;
  min-height: 30px !important;
`;

const mergeColumnsConfig = (columnsConfig, columnsVisibility) => {
  const result = { ...columnsConfig };

  for (const key in columnsConfig) {
    result[key] = { ...result[key], ...columnsVisibility[key] };
  }

  return result;
};

const Data = ({ showLink = true, link, count, isRate = false }) => {
  let data = count || '0';
  data = isRate ? `${data}%` : data;

  if (showLink) {
    return (<a target="_blank" href={`${link}`}>{data}</a>);
  }

  return (data);
};

const DataRow = ({ data, showAverageBugs, showLink, columnsVisibility }) => {
  let columnsConfig = {
    totalInitiativesDone: {key: 'totalInitiativesDone', count: data.countInitiativesDone, showLink, link: data.totalInitiativesDoneLink },
    totalEpicsDone: { key: 'totalEpicsDone', count: data.countEpicsDone, showLink, link: data.epicsDoneLink },
    totalStoriesDone: { key: 'totalStoriesDone', count: data.countTasksDone, showLink, link: data.storiesDoneLink },
    totalSubtasksDone: { key: 'totalSubtasksDone', count: data.countSubTasksDone, showLink, link: data.subTasksDoneLink },
    totalTechTasksDone: { key: 'totalTechTasksDone', count: data.countTechTasksDone, showLink, link: data.techTasksDoneLink },
    totalTP: { key: 'totalTP', count: data.totalTP, showLink, link: data.totalTPLink },
    totalStrategicTasksDone: { key: 'totalStrategicTasksDone', count: data.countStrategicTasksDone, showLink, link: data.strategicTasksDoneLink },
    totalNotStrategicTasksDone: { key: 'totalNotStrategicTasksDone', count: data.countNotStrategicTasksDone, showLink, link: data.notStrategicTasksDoneLink },
    strategicAlignment: { key: 'strategicAlignment', count: data.strategicAlignment, showLink: false, link: '', isRate: true },
    totalBugsCreated: { key: 'totalBugsCreated', count: data.countBugsCreated, showLink, link: data.bugsCreatedLink },
    totalBugsNewImplementationCreated: { key: 'totalBugsNewImplementationCreated', count: data.countBugsNewImplementationCreated, showLink, link: data.bugsCreatedNewImplementationLink },
    totalBugsDone: { key: 'totalBugsDone', count: data.countBugsDone, showLink, link: data.bugsDoneLink },
    bugRate: { key: 'bugRate', count: data.bugRate, showLink: false, link: '', isRate: true },
    averageBugs: { key: 'averageBugs', count: data.averageBugs, showLink: false, link: '', visible: showAverageBugs },
    totalActionItensN3Created: { key: 'totalActionItensN3Created', count: data.totalActionItensN3Created, showLink, link: data.totalActionItensN3CreatedLink },
    totalBugsN3Created: { key: 'totalBugsN3Created', count: data.countTotalBugsN3Created, showLink, link: data.totalBugsN3CreatedLink },
    n3TicketsCreated: { key: 'n3TicketsCreated', count: data.n3TicketsCreated, showLink, link: data.n3TicketsCreatedLink }
  };
  columnsConfig = mergeColumnsConfig(columnsConfig, columnsVisibility);
  const columns = Object.values(columnsConfig).filter(c => c.visible);

  const cells = columns
    .map(c => (<StyledCellData key={`${data.name}-${c.key}`}><Data showLink={c.showLink} link={c.link} count={c.count} isRate={c.isRate} /></StyledCellData>));

  cells.unshift((<StyledCellTeam key={`${data.name}-team`}>{data.name}</StyledCellTeam>));


  return (
    <Row>
      {cells.map(c => c)}
    </Row>
  );
}

export default DataRow;