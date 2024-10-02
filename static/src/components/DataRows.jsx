import React from "react";
import styled from 'styled-components';
import { Rows } from '@atlaskit/table-tree';

import DataRow from "./DataRow";

const StyledWrapper = styled.section`
  font-size: 11px;
`;

const DataRows = ({ rows, showAverageBugs, showLink, columnsVisibility }) => (
  <StyledWrapper>
    <Rows
      items={rows}
      render={(data) => {
        return (
          <DataRow data={data} showAverageBugs={showAverageBugs} showLink={showLink} columnsVisibility={columnsVisibility} />
        );
      }}
    />
  </StyledWrapper>
);

export default DataRows;
