import React, { useEffect, useState } from 'react';
import ReactDataGrid from '@inovua/reactdatagrid-community';
import '@inovua/reactdatagrid-community/index.css'
import createLinksAndComputeStats from '@/lib/createLinksAndComputeStats';

const columns = [
  { name: 'cscBooking', header: 'PA', defaultFlex: 1 },
  { name: 'cscName', header: 'Nom', defaultFlex: 1 }
]

const gridStyle = { minHeight: 900 }


const CscDataGrid = ({ cscByCscKey }) => {
  const allCscs = Object.values(cscByCscKey);
  createLinksAndComputeStats(allCscs);
  const dataSource = allCscs;
  const firstCsc = dataSource[0];
  const columns = Object.keys(firstCsc)
    .filter((key) => typeof firstCsc[key] !== 'object')
    .map((key) => ({
      type: typeof firstCsc[key],
      name: key
    }));



  return (
    <ReactDataGrid
      columns={columns}
      dataSource={dataSource}
      gridStyle={gridStyle}
    />
  );
};

export default CscDataGrid;