import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { componentStyles } from '../../../utils/styles';

const SettlementRow = ({ total, numberOfPeople, onNumberOfPeopleChange }) => {
  return (
    <tr>
      <td colSpan="2" className={componentStyles.cell}>
        <div className="flex items-center gap-4">
          <span className={componentStyles.header}>정산하기</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              value={numberOfPeople}
              onChange={onNumberOfPeopleChange}
              className={clsx(componentStyles.input, 'w-16')}
              placeholder="N"
            />
            <span className="text-[#252422]">명</span>
          </div>
        </div>
      </td>
      <td className={componentStyles.cell}>
        <span className={componentStyles.header}>
          {Math.floor(total / parseFloat(numberOfPeople || 1)).toLocaleString()}{' '}
          원
        </span>
      </td>
      <td className={componentStyles.cell}></td>
    </tr>
  );
};

SettlementRow.propTypes = {
  total: PropTypes.number.isRequired,
  numberOfPeople: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  onNumberOfPeopleChange: PropTypes.func.isRequired,
};

export default SettlementRow;
