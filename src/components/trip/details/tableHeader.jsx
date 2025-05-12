import React from 'react';
import { componentStyles } from '../../../utils/styles';

const TableHeader = () => {
  return (
    <thead>
      <tr>
        <th className="w-1/4 p-2">
          <span className={componentStyles.header}>항목</span>
        </th>
        <th className="w-1/2 p-2">
          <span className={componentStyles.header}>세부사항</span>
        </th>
        <th className="w-1/4 p-2">
          <span className={componentStyles.header}>금액</span>
        </th>
        <th className="w-12 p-2"></th>
      </tr>
    </thead>
  );
};

export default TableHeader;
