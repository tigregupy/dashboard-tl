import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { invoke } from '@forge/bridge';
import Tabs, { Tab, TabList } from '@atlaskit/tabs';
import Button from '@atlaskit/button/standard-button';
import InfoIcon from '@atlaskit/icon/glyph/question-circle';
import Tooltip from '@atlaskit/tooltip';

import IssuesCountTab from "./components/IssuesCountTab";
import ChartTab from './components/ChartTab';
import InfoModal from './components/InfoModal';

const labels = {
  h1: 'H1',
  h2: 'H2',
  q1: 'Q1',
  q2: 'Q2',
  q3: 'Q3',
  q4: 'Q4',
  jan: 'Jan',
  feb: 'Fev',
  mar: 'Mar',
  apr: 'Abr',
  may: 'Mai',
  jun: 'Jun',
  jul: 'Jul',
  aug: 'Ago',
  sep: 'Set',
  oct: 'Out',
  nov: 'Nov',
  dec: 'Dez',
};

const StyledContent = styled.section`
  min-height: 500px;
`;

const StyledHeaderWrapper = styled.section`
  margin: 0 49%;
`;

const StyledButtonWrapper = styled.section`
  float: right;
`;

const getColumnsVisibility = (indexesVisibility) => ({
  totalInitiativesDone: { visible: indexesVisibility.totalInitiativesDone },
  totalEpicsDone: { visible: indexesVisibility.totalEpicsDone },
  totalTasksDone: { visible: indexesVisibility.totalTasksDone },
  totalSubtasksDone: { visible: indexesVisibility.totalSubTasksDone },
  totalTechTasksDone: { visible: indexesVisibility.totalTechTasksDone },
  totalTP: { visible: indexesVisibility.totalTP },
  totalTasksStoriesDone: { visible: indexesVisibility.totalTasksStoriesDone },
  totalStoriesDone: { visible: indexesVisibility.totalStoriesDone },
  totalStrategicTasksDone: { visible: indexesVisibility.totalStrategicTasksDone },
  totalNotStrategicTasksDone: { visible: indexesVisibility.totalNotStrategicTasksDone },
  strategicAlignment: { visible: indexesVisibility.strategicAlignment },
  totalBugsCreated: { visible: indexesVisibility.totalBugsCreated },
  totalBugsDone: { visible: indexesVisibility.totalBugsDone },
  totalBugsNewImplementationCreated: { visible: indexesVisibility.totalBugsNewImplementationCreated },
  totalBugsN3Created: { visible: indexesVisibility.totalBugsN3Created },
  bugRate: { visible: indexesVisibility.bugRate },
  n3TicketsCreated: { visible: indexesVisibility.n3TicketsCreated },
  totalActionItensN3Created: { visible: indexesVisibility.totalActionItensN3Created },
});

const View = ({ configData }) => {
  const [data, setData] = useState(null);
  const [periods, setPeriods] = useState([]);

  const [isOpen, setIsOpen] = useState(false);
  const openModal = useCallback(() => setIsOpen(true), []);
  const closeModal = useCallback(() => setIsOpen(false), []);
  const columnsVisibility = getColumnsVisibility(configData.indexesVisibility);

  useEffect(() => {
    const getPeriodsList = async () => {
      const periods = await Promise.resolve(invoke('getPeriodsList', { ...configData }));
      setPeriods(periods);
    };

    getPeriodsList();
  }, []);

  useEffect(() => {
    const getData = async () => {
      const res = await Promise.resolve(invoke('getMonthsIssuesCount', { ...configData }));
      setData(res);
    };

    getData();
  }, []);

  if (!data || !periods || periods.length === 0) {
    return (<p>Buscando dados...</p>);
  }

  const tabs = periods.map((period) => (
    <Tab key={`label-${period}`}>{labels[period]}</Tab>
  ));

  const issuesTabs = periods.map((period) => {
    const longPeriods = ['h1', 'h2', 'q1', 'q2', 'q3', 'q4'];
    let isLongPeriod = false;
    if (longPeriods.includes(period)) {
      isLongPeriod = true;
    }

    return (<IssuesCountTab key={period} period={period} data={data[period]} year={configData.year} productName={configData.productName} isLongPeriod={isLongPeriod} columnsVisibility={columnsVisibility} />);
  });

  return (
    <StyledContent>
      <StyledHeaderWrapper>
        <h3><b>{configData.year}</b></h3>
      </StyledHeaderWrapper>
      <StyledButtonWrapper>
        <Tooltip position="left" content="Como as informações são obtidas e/ou calculadas?">
          {(tooltipProps) => (
            <Button
              type="button"
              appearance="subtle"
              spacing="compact"
              iconBefore={<InfoIcon label="" size="small" primaryColor="#0052cc" />}
              {...tooltipProps}
              onClick={openModal}
            />
          )}
        </Tooltip>
      </StyledButtonWrapper>
      <Tabs >
        <TabList>
          {tabs.map(t => t)}
          <Tab>N3 % de bugs</Tab>
          {configData.showCountTasksDone && (<Tab>Issues done</Tab>)}
          {configData.showCountBugsCreated && (<Tab>Bugs criados</Tab>)}
          {configData.showBugRate && (<Tab>Taxa % de bugs</Tab>)}
          <Tab>Contábil - Custo</Tab>
          <Tab>Contábil - Investimentos</Tab>

        </TabList>
        {issuesTabs.map(i => i)}
        <ChartTab data={data} variable="n3BugsPercentage" />
        {configData.showCountTasksDone && (<ChartTab data={data} variable="countTasksDone" />)}
        {configData.showCountBugsCreated && (<ChartTab data={data} variable="countBugsCreated" />)}
        {configData.showBugRate && (<ChartTab data={data} variable="bugRate" />)}
        
        <ChartTab data={data} variable="financialRate" />
        <ChartTab data={data} variable="investmentsRate" />


      </Tabs>
      <InfoModal closeModal={closeModal} isOpen={isOpen} />
    </StyledContent>
  );
};

export default View;