import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import api from '../../../utils/axiosInstance';
import { neumorphStyles } from '../../../utils/style';
import PaymentInfoModal from './paymentInfoModal';
import QRCodeDisplay from '../../common/qrCodeDisplay';
import { roundPaymentUrlAmount } from '../../../utils/paymentUrl';
// generateTossPaymentUrl, getTossBankCode import 제거: 백엔드에서 URL 생성 책임을 가짐

export const BANKS = [
  '경남',
  '광주',
  'IBK기업',
  'KB국민',
  'iM뱅크(대구)',
  '부산',
  'KDB산림',
  '새마을',
  'SC제일',
  '신한',
  '신협',
  '수협',
  '케이뱅크',
  '우리',
  '우체국',
  '저축은행',
  '전북',
  '제주',
  '카카오뱅크',
  '토스뱅크',
  '하나',
  'NH농협',
];

// 유틸 함수들
const formatAmount = (amount) => {
  return Math.round(amount).toLocaleString('ko-KR');
};

// generatePaymentUrl 함수 제거: 백엔드에서 URL 생성 책임을 가짐
// 백엔드 API 응답으로 전달받은 tossUrl과 kakaoPayUrl만 사용

const getAvatarColor = (index) => {
  const colors = [
    'bg-orange-400',
    'bg-green-400',
    'bg-blue-400',
    'bg-purple-400',
    'bg-pink-400',
    'bg-yellow-400',
  ];
  return colors[index % colors.length];
};

const Avatar = ({ imgUrl, name, index, size = 'w-12 h-12', textSize = 'text-lg' }) => {
  if (imgUrl) {
    return (
      <img
        src={imgUrl}
        alt={name}
        className={`${size} rounded-full object-cover`}
      />
    );
  }
  return (
    <div
      className={`${size} rounded-full ${getAvatarColor(index)} flex items-center justify-center text-white font-semibold ${textSize}`}
    >
      {name?.[0] || '?'}
    </div>
  );
};

const Settlement = ({ tripId, expenses, statistics, participants, currentUserId }) => {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [settlementData, setSettlementData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedQR, setExpandedQR] = useState(null);

  const participantsMap = useMemo(() => {
    return new Map(participants?.map((p) => [p.userId, p]) || []);
  }, [participants]);

  const participantIndexMap = useMemo(() => {
    return new Map(participants?.map((p, index) => [p.userId, index]) || []);
  }, [participants]);

  const fetchSettlementData = useCallback(async () => {
    try {
      const response = await api.get(`/trips/${tripId}/documents`);
      const data = response.data;

      if (data.settlement && data.settlement.personal && participants) {
        const settlementPersonal = data.settlement.personal;
        const sharedSettlement = data.settlement.shared || {};

        const participantsMapForFetch = new Map(participants.map((p) => [p.userId, p]));

        const userSettlementMap = {};
        settlementPersonal.forEach((settlement) => {
          const participant = participantsMapForFetch.get(settlement.userId);
          if (participant) {
            userSettlementMap[settlement.userId] = {
              userId: settlement.userId,
              name: participant.name || participant.nickname,
              imgUrl: participant.imgUrl,
              addedSharedBudget: settlement.addedSharedBudget || 0,
              paidAmount: settlement.paidAmount || 0,
              consumedAmount: settlement.consumedAmount || 0,
              distributedSharedBudget: settlement.distributedSharedBudget || 0,
              netAmount: settlement.netAmount || 0,
              settlements: settlement.settlements || [],
            };
          }
        });

        participants.forEach((participant) => {
          if (!userSettlementMap[participant.userId]) {
            userSettlementMap[participant.userId] = {
              userId: participant.userId,
              name: participant.name || participant.nickname,
              imgUrl: participant.imgUrl,
              addedSharedBudget: 0,
              paidAmount: 0,
              consumedAmount: 0,
              distributedSharedBudget: 0,
              netAmount: 0,
              settlements: [],
            };
          }
        });

        setSettlementData({
          shared: sharedSettlement,
          users: Object.values(userSettlementMap),
        });
      }
    } catch (error) {
      console.error('정산 데이터 조회 실패:', error);
    }
  }, [tripId, participants]);

  useEffect(() => {
    const checkUserPaymentInfo = async () => {
      try {
        setLoading(true);
        const response = await api.get('/users/me');
        const userData = response.data;

        if (
          !userData.kakaoPayId &&
          !userData.bankName &&
          !userData.accountNumber
        ) {
          setShowPaymentModal(true);
        } else {
          await fetchSettlementData();
        }
      } catch (error) {
        console.error('사용자 정보 조회 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    checkUserPaymentInfo();
  }, [tripId, fetchSettlementData]);

  useEffect(() => {
    if (expenses && expenses.length >= 0 && !loading && tripId) {
      const timer = setTimeout(() => {
        fetchSettlementData();
      }, 800);

      return () => clearTimeout(timer);
    }
  }, [expenses?.length, tripId, loading, fetchSettlementData]);

  const handlePaymentInfoRegistered = useCallback(async () => {
    setShowPaymentModal(false);
    await fetchSettlementData();
  }, [fetchSettlementData]);

  const handleQRClick = useCallback((userId, counterpartUserId) => {
    const key = `${userId}-${counterpartUserId}`;
    setExpandedQR((prev) => (prev === key ? null : key));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-400">로딩 중...</div>
      </div>
    );
  }

  if (showPaymentModal) {
    return (
      <PaymentInfoModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onComplete={handlePaymentInfoRegistered}
      />
    );
  }

  if (!settlementData) {
    return (
      <div className="text-center text-gray-400 py-8">
        정산 데이터를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="text-xs text-gray-500 mb-4">
        소수점 아래 금액은 1원 단위로 반올림됩니다.
      </div>

      {settlementData.shared && (
        <div className={`${neumorphStyles.small} rounded-xl p-6 mb-6`}>
          <h3 className="text-lg font-semibold text-gray-700 mb-4">공동경비</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">모은 금액</span>
              <span className="font-semibold text-gray-800">
                {formatAmount(settlementData.shared.totalBudget || 0)}원
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">결제한 금액</span>
              <span className="font-semibold text-gray-800">
                {formatAmount(settlementData.shared.totalSpentFromBudget || 0)}원
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">남은 금액</span>
              <span className="font-semibold text-gray-800">
                {formatAmount(settlementData.shared.remainingBudget || 0)}원
              </span>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto space-y-4">
        {settlementData.users.map((user, index) => (
          <motion.div
            key={user.userId}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`${neumorphStyles.small} rounded-xl p-6`}
          >
            <div className="flex items-center gap-3 mb-4">
              <Avatar imgUrl={user.imgUrl} name={user.name} index={index} />
              <div className="flex-1">
                <h4 className="font-semibold text-gray-800">{user.name}</h4>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">추가한 공동경비</span>
                <span className="font-medium text-gray-700">
                  {formatAmount(user.addedSharedBudget || 0)}원
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">결제한 금액</span>
                <span className="font-medium text-gray-700">
                  {formatAmount(user.paidAmount || 0)}원
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">소비한 금액</span>
                <span className="font-medium text-gray-700">
                  {formatAmount(user.consumedAmount || 0)}원
                </span>
              </div>
            </div>

            {user.netAmount !== 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center mb-3">
                  <span
                    className={`font-semibold ${
                      user.netAmount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {user.netAmount > 0 ? '받을 금액' : '보낼 금액'}
                  </span>
                  <span
                    className={`font-bold text-lg ${
                      user.netAmount > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {formatAmount(Math.abs(user.netAmount))}원
                  </span>
                </div>

                {user.settlements &&
                  user.settlements
                    .filter((s) => s.direction === 'SEND')
                    .map((settlement) => {
                      const counterpart = participantsMap.get(settlement.counterpartUserId);
                      if (!counterpart) return null;

                      const isCurrentUser = user.userId === currentUserId;
                      
                      if (!isCurrentUser) {
                        return (
                          <div key={settlement.counterpartUserId}>
                            <div className="flex items-center justify-between py-2">
                              <div className="flex items-center gap-2 flex-1">
                                <Avatar
                                  imgUrl={counterpart.imgUrl}
                                  name={counterpart.name}
                                  index={participantIndexMap.get(counterpart.userId) ?? 0}
                                  size="w-8 h-8"
                                  textSize="text-sm"
                                />
                                <span className="text-sm text-gray-600">
                                  {counterpart.name || '알 수 없음'}에게 보낼 금액
                                </span>
                              </div>
                              <span className="font-medium text-gray-800">
                                {formatAmount(settlement.amount)}원
                              </span>
                            </div>
                          </div>
                        );
                      }

                      const qrKey = `${user.userId}-${settlement.counterpartUserId}`;
                      const isQRExpanded = expandedQR === qrKey;
                      const backendTossUrl = settlement.tossUrl
                        ? roundPaymentUrlAmount(settlement.tossUrl, settlement.amount)
                        : null;
                      const backendKakaoPayUrl = settlement.kakaoPayUrl
                        ? roundPaymentUrlAmount(settlement.kakaoPayUrl, settlement.amount)
                        : null;
                      const paymentUrl = backendTossUrl || backendKakaoPayUrl;
                      const canReceivePayment = !!(backendTossUrl || backendKakaoPayUrl);
                      const canShowQR = isCurrentUser && canReceivePayment && paymentUrl;

                      return (
                        <div key={settlement.counterpartUserId}>
                          <div className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-2 flex-1">
                              <Avatar
                                imgUrl={counterpart.imgUrl}
                                name={counterpart.name}
                                index={participantIndexMap.get(counterpart.userId) ?? 0}
                                size="w-8 h-8"
                                textSize="text-sm"
                              />
                              <span className="text-sm text-gray-600">
                                {counterpart.name || '알 수 없음'}에게 보낼 금액
                              </span>
                            </div>
                            <div className="flex items-center gap-3">
                              <span className="font-medium text-gray-800">
                                {formatAmount(settlement.amount)}원
                              </span>
                              {canShowQR && (
                                <button
                                  onClick={() =>
                                    handleQRClick(
                                      user.userId,
                                      settlement.counterpartUserId,
                                    )
                                  }
                                  className="w-10 h-10 rounded border-2 border-orange-400 flex items-center justify-center hover:bg-orange-50 transition-all"
                                >
                                  <span className="text-orange-400 font-medium text-xs">
                                    QR
                                  </span>
                                </button>
                              )}
                            </div>
                          </div>
                          {canShowQR && isQRExpanded && paymentUrl && (
                            <div className="mt-3 p-4 bg-gray-50 rounded-lg flex flex-col items-center">
                              {/* 
                                백엔드에서 받은 토스 URL만 사용
                                백엔드에서 생성한 URL 형식: supertoss://send?amount=...&bank=...&accountNo=...
                              */}
                              {backendTossUrl && (
                                <div className="mb-4 flex flex-col items-center">
                                  <p className="text-sm font-medium text-gray-700 mb-2">
                                    토스 송금 ({formatAmount(settlement.amount)}원)
                                  </p>
                                  <div className="mb-2">
                                    <QRCodeDisplay
                                      url={backendTossUrl}
                                      size={160}
                                    />
                                  </div>
                                  <div className="flex gap-2 mt-2">
                                    {(backendTossUrl.startsWith('supertoss://') || 
                                      backendTossUrl.startsWith('toss://')) && (
                                      <a
                                        href={backendTossUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-3 py-1.5 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition-all"
                                      >
                                        토스 앱 열기
                                      </a>
                                    )}
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(backendTossUrl);
                                        alert('토스 링크가 복사되었습니다.');
                                      }}
                                      className="px-3 py-1.5 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition-all"
                                    >
                                      링크 복사
                                    </button>
                                  </div>
                                </div>
                              )}
                              
                              {backendKakaoPayUrl && (
                                <div className={backendTossUrl ? "mt-4 pt-4 border-t border-gray-300 flex flex-col items-center" : "flex flex-col items-center"}>
                                  <p className="text-sm font-medium text-gray-700 mb-2">
                                    카카오페이 송금 ({formatAmount(settlement.amount)}원)
                                  </p>
                                  <div className="mb-2">
                                    <QRCodeDisplay
                                      url={backendKakaoPayUrl}
                                      size={160}
                                    />
                                  </div>
                                  <div className="flex gap-2 mt-2">
                                    <a
                                      href={backendKakaoPayUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-3 py-1.5 bg-yellow-400 text-gray-800 rounded-lg text-sm hover:bg-yellow-500 transition-all"
                                    >
                                      카카오페이 열기
                                    </a>
                                    <button
                                      onClick={() => {
                                        navigator.clipboard.writeText(backendKakaoPayUrl);
                                        alert('카카오페이 링크가 복사되었습니다.');
                                      }}
                                      className="px-3 py-1.5 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600 transition-all"
                                    >
                                      링크 복사
                                    </button>
                                  </div>
                                </div>
                              )}
                              {!backendTossUrl && !backendKakaoPayUrl && (
                                <div className="text-sm text-gray-500">
                                  송금 URL을 받을 수 없습니다. 결제 정보를 확인해주세요.
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}

                {user.settlements &&
                  user.settlements
                    .filter((s) => s.direction === 'RECEIVE')
                    .map((settlement) => {
                      const counterpart = participantsMap.get(settlement.counterpartUserId);
                      if (!counterpart) return null;

                      return (
                        <div
                          key={settlement.counterpartUserId}
                          className="flex items-center justify-between py-2"
                        >
                          <div className="flex items-center gap-2 flex-1">
                            <Avatar
                              imgUrl={counterpart.imgUrl}
                              name={counterpart.name}
                              index={participants.findIndex(
                                (p) => p.userId === counterpart.userId,
                              )}
                              size="w-8 h-8"
                              textSize="text-sm"
                            />
                            <span className="text-sm text-gray-600">
                              {counterpart.name || '알 수 없음'}에게 받을 금액
                            </span>
                          </div>
                          <span className="font-medium text-gray-800">
                            {formatAmount(settlement.amount)}원
                          </span>
                        </div>
                      );
                    })}
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Settlement;
