/**
 * 은행명을 토스 은행 코드로 변환하는 맵
 */
export const BANK_CODE_MAP = {
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
  NH농협: 'NONGHYUP',
};

/**
 * 은행명 배열 (BANK_CODE_MAP의 키에서 생성)
 */
export const BANKS = Object.keys(BANK_CODE_MAP);
