import React from 'react';
import PropTypes from 'prop-types';
import { componentStyles } from '../../utils/style';

const TotalRow = ({ total, formatNumber }) => {
  return (
    <tr>
      <td colSpan="3" className="p-3">
        <span className={componentStyles.header}>합계</span>
      </td>
      <td className="p-3 text-right">
        <span className={componentStyles.header}>{formatNumber(total)} 원</span>
      </td>
      <td className="p-3"></td>
    </tr>
  );
};

TotalRow.propTypes = {
  total: PropTypes.number.isRequired,
  formatNumber: PropTypes.func.isRequired,
};

export default TotalRow;
