import { BANK_CODE_MAP } from '../components/trip/expense/constants.js';

/**
 * 토스 송금 URL 생성
 * @param {Object} params
 * @param {string} params.accountNumber
 * @param {string} params.bankCode
 * @param {string} params.amount
 * @param {string} params.message
 * @returns {string}
 */
export const generateTossPaymentUrl = ({
  accountNumber,
  bankCode,
  amount,
  message = '',
}) => {
  // 토스 앱  형식: toss://send?accountNo={계좌번호}&bankCode={은행코드}&amount={금액}&message={메시지}
  const baseUrl = 'toss://send';
  const params = new URLSearchParams();

  if (accountNumber) {
    params.append('accountNo', accountNumber);
  }
  if (bankCode) {
    params.append('bankCode', bankCode);
  }
  if (amount) {
    params.append('amount', amount.toString());
  }
  if (message) {
    params.append('message', message);
  }

  return `${baseUrl}?${params.toString()}`;
};

/**
 * 은행명을 토스 은행 코드로 변환
 * @param {string} bankName - 은행명 (한글)
 * @returns {string} 토스 은행 코드
 */
export const getTossBankCode = (bankName) => {
  return BANK_CODE_MAP[bankName] || '';
};
