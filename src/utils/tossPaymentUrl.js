/**
 * 토스 송금 URL 생성
 * @param {Object} params - 송금 파라미터
 * @param {string} params.accountNumber - 계좌번호
 * @param {string} params.bankCode - 은행 코드
 * @param {string} params.amount - 송금 금액
 * @param {string} params.message - 송금 메시지 (선택)
 * @returns {string} 토스 송금 URL
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
  const bankCodeMap = {
    경남: 'KYONGNAMBANK',
    광주: 'GWANGJUBANK',
    IBK기업: 'IBK',
    KB국민: 'KB',
    'iM뱅크(대구)': 'DAEGUBANK',
    부산: 'BUSANBANK',
    KDB산림: 'KDB',
    새마을: 'SAEMAUL',
    SC제일: 'SC',
    신한: 'SHINHAN',
    신협: 'SHINHYUP',
    수협: 'SUHYUP',
    케이뱅크: 'KAKAOBANK',
    우리: 'WOORI',
    우체국: 'POST',
    저축은행: 'SAVINGBANK',
    전북: 'JEONBUKBANK',
    제주: 'JEJUBANK',
    카카오뱅크: 'KAKAOBANK',
    토스뱅크: 'TOSSBANK',
    하나: 'HANA',
    'NH농협': 'NONGHYUP',
  };

  return bankCodeMap[bankName] || '';
};
