import React, { useState, useEffect } from 'react';
import { invoke } from '@forge/bridge';
import { TabPanel } from '@atlaskit/tabs';
import { Tableau20 } from 'chartjs-plugin-colorschemes-v3/src/colorschemes/colorschemes.tableau';
import styled from 'styled-components';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors,
);

const showDataSetHandler = (e, legendItem, legend) => {
  const ci = legend.chart;

  const allOthersHidden = (legend.legendItems.filter(item => item.hidden === false).length === 1);
  const alreadyVisible = ci.isDatasetVisible(legendItem.datasetIndex);

  legend.legendItems.forEach((_, index) => {
    if (alreadyVisible && allOthersHidden) {
      ci.show(index);
      legendItem.hidden = true;
    } else {
      if (index === legendItem.datasetIndex) {
        ci.show(index);
        legendItem.hidden = true;
      } else {
        ci.hide(index);
        legend.legendItems[index].hidden = true;
      }
    }
  });
};

export const chartOptions = {
  interaction: {
    mode: 'index',
  },
  responsive: true,
  plugins: {
    colorschemes: {
      scheme: Tableau20,
    },
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
      },
      onClick: showDataSetHandler,
    },
    title: {
      display: false,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: 'Mês'
        }
      },
      y: {
        display: true,
        title: {
          display: true,
          text: 'Quantidade'
        }
      }
    }
  },
};

const StyledWrapper = styled.section`
  width: 800px;
  margin: 30px auto 0px auto;
  height: 400px;
`;

const ChartTab = ({ data, variable }) => {
  const [chartData, setChartData] = useState({ labels: [], datasets: []});

  useEffect(() => {
    if (!data) return;

    const getChartData = async () => {
      const res = await Promise.resolve(invoke('getChartData', { data, variable }));
      setChartData(res);
    };
    getChartData();
  }, [data]);

  if (chartData.datasets && chartData.datasets.length === 0) {
    return (<p>Carregando...</p>);
  }

  return (
    <TabPanel>
      <StyledWrapper>
        <Line options={chartOptions} data={chartData} />
      </StyledWrapper>
    </TabPanel>
  );
};

export default ChartTab;