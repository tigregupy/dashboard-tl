import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { TabPanel } from '@atlaskit/tabs';
import TableTree, { Header, Headers } from '@atlaskit/table-tree';
import { invoke } from '@forge/bridge';

import DataRows from "./DataRows";

const StyledHeaderTeam = styled(Header)`
  font-size: 11px !important;
  color: #073763 !important;
  padding-left: 5px !important;
  padding-right: 5px !important;
`;

const StyledHeaderData = styled(Header)`
  text-align: center;
  font-size: 11px !important;
  color: #073763 !important;
  padding-left: 5px !important;
  padding-right: 5px !important;
`;

const mergeColumnsConfig = (columnsConfig, columnsVisibility) => {
  const result = { ...columnsConfig };

  for (const key in columnsConfig) {
    result[key] = { ...result[key], ...columnsVisibility[key] };
  }

  return result;
};

const IssuesCountTab = ({ data, period, year, productName, isLongPeriod = false, columnsVisibility }) => {
  const [periodData, setPeriodData] = useState(data);

  useEffect(() => {
    const getData = async () => {
      const res = await Promise.resolve(invoke('getPeriodIssuesCount', { periodKey: period, year, productName }));
      setPeriodData(res);
    };

    if (isLongPeriod) {
      getData();
    }
  }, []);

  let columnsConfig = {
    totalInitiativesDone: { key: 'totalInitiativesDone', name: 'Iniciativas done', size: '60px' },
    totalEpicsDone: { key: 'totalEpicsDone', name: 'Epics done', size: '45px' },
    totalTasksDone: { key: 'totalTasksDone', name: 'Stories done', size: '50px' },
    totalSubtasksDone: { key: 'totalSubtasksDone', name: 'Subtasks done', size: '67px' },
    totalTechTasksDone: { key: 'totalTechTasksDone', name: 'Tech Tasks done', size: '60px' },
    totalTP: { key: 'totalTP', name: 'Throughput', size: '65px' },
    totalStrategicTasksDone: { key: 'totalStrategicTasksDone', name: 'Stories done alinhadas à estratégia', size: '90px' },
    totalNotStrategicTasksDone: { key: 'totalNotStrategicTasksDone', name: 'Stories done NÃO alinhadas à estratégia', size: '102px' },
    strategicAlignment: { key: 'strategicAlignment', name: 'Alinhamento estratégico', size: '80px' },
    totalBugsCreated: { key: 'totalBugsCreated', name: 'Total de bugs criados', size: '55px' },
    totalBugsNewImplementationCreated: { key: 'totalBugsNewImplementationCreated', name: 'Bugs criados de novas implementações', size: '102px' },
    totalBugsDone: { key: 'totalBugsDone', name: 'Bugs done', size: '67px' },
    bugRate: { key: 'bugRate', name: 'Taxa de bugs criados / TP', size: '55px' },
    averageBugs: { key: 'averageBugs', name: 'Média bugs criados/mês', size: '78px', visible: isLongPeriod },
    totalActionItensN3Created: { key: 'totalActionItensN3Created', name: 'Action Itens criados em N3', size: '55px' },
    totalBugsN3Created: { key: 'totalBugsN3Created', name: 'Bugs criados em N3', size: '55px' },
    n3TicketsCreated: { key: 'n3TicketsCreated', name: 'Chamados criados em N3', size: '78px', visible: isLongPeriod },
  };
  columnsConfig = mergeColumnsConfig(columnsConfig, columnsVisibility);
  const columns = Object.values(columnsConfig).filter(c => c.visible);

  const columnWidths = columns.map(c => c.size);
  const headers = columns.map(c => (<StyledHeaderData key={c.key}>{c.name}</StyledHeaderData>));
  columnWidths.unshift('125px');
  headers.unshift(<StyledHeaderTeam key="team">Time</StyledHeaderTeam>);

  if (!periodData) {
    return (
      <p>
        {
          `Buscando dados do ${period.toUpperCase()}...`
        }
      </p>
      );
  }

  return (
    <TabPanel>
      <TableTree columnWidths={columnWidths}>
        <Headers>
          { headers.map(h => h) }
        </Headers>
        <DataRows rows={[periodData.product]} showAverageBugs={isLongPeriod} showLink={false} columnsVisibility={columnsVisibility} />
        {periodData.tribes.map(tribe => (<DataRows rows={[tribe]} showAverageBugs={isLongPeriod} showLink={false} columnsVisibility={columnsVisibility} />)) }
        <DataRows rows={periodData.teams} showAverageBugs={isLongPeriod} showLink={true} columnsVisibility={columnsVisibility} />
      </TableTree>
    </TabPanel>
  );
};

export default IssuesCountTab;
