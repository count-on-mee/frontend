import React, { useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useSocketDebounce } from '../../../utils/debounce';
import { componentStyles } from '../../../utils/style';

const SettlementRow = ({
  total,
  participantCount,
  onParticipantCountChange,
  socket,
}) => {
  // 소켓 이벤트를 debounce로 감싸기
  const debouncedSocketEmit = useSocketDebounce(socket, 800);

  // 소켓 이벤트 리스너 추가
  useEffect(() => {
    if (!socket) return;

    const handleParticipantCountUpdated = ({ participantFields }) => {
      onParticipantCountChange({ target: { value: participantFields.count } });
    };

    socket.on('participantCountUpdated', handleParticipantCountUpdated);

    return () => {
      socket.off('participantCountUpdated', handleParticipantCountUpdated);
    };
  }, [socket, onParticipantCountChange]);

  const handleParticipantCountChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    // 1보다 작은 값 1로 설정
    const validValue = Math.max(1, value);

    // 부모 컴포넌트의 상태 업데이트
    onParticipantCountChange(e);

    // 소켓을 통해 다른 브라우저에 업데이트
    debouncedSocketEmit('updateParticipantCount', {
      participantFields: { count: validValue },
    });
  };

  return (
    <tr>
      <td colSpan="3" className={componentStyles.cell}>
        <div className="flex items-center gap-4">
          <span className={componentStyles.header}>정산하기</span>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              value={participantCount}
              onChange={handleParticipantCountChange}
              className={clsx(componentStyles.input, 'w-16')}
              placeholder="N"
            />
            <span className="text-[#252422]">명</span>
          </div>
        </div>
      </td>
      <td className={componentStyles.cell}>
        <span className={componentStyles.header}>
          {Math.floor(
            total / parseFloat(participantCount || 1),
          ).toLocaleString()}{' '}
          원
        </span>
      </td>
      <td className={componentStyles.cell}></td>
    </tr>
  );
};

SettlementRow.propTypes = {
  total: PropTypes.number.isRequired,
  participantCount: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    .isRequired,
  onParticipantCountChange: PropTypes.func.isRequired,
  socket: PropTypes.object,
};

export default SettlementRow;
