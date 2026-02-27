export const roundTossUrlAmount = (url) => {
  if (!url || (!url.includes('supertoss://') && !url.includes('toss://'))) {
    return url;
  }

  try {
    const amountPattern = /amount=([\d.]+)/;
    const match = url.match(amountPattern);

    if (!match) {
      return url;
    }

    const originalAmount = parseFloat(match[1]);
    
    if (!Number.isFinite(originalAmount) || originalAmount <= 0) {
      return url;
    }

    const roundedAmount = Math.round(originalAmount);

    if (roundedAmount === originalAmount) {
      return url;
    }

    const newUrl = url.replace(amountPattern, `amount=${roundedAmount}`);
    
    return newUrl;
  } catch (error) {
    console.error('토스 URL 금액 반올림 실패:', error, url);
    return url;
  }
};

export const roundKakaoPayUrlAmount = (url, originalAmount) => {
  if (!url || !url.includes('qr.kakaopay.com')) {
    return url;
  }

  try {
    const roundedAmount = Math.round(originalAmount);
    const baseUrl = 'https://qr.kakaopay.com/';
    const pathPart = url.replace(baseUrl, '');

    const shifted = roundedAmount << 19;
    const newHexValue = shifted.toString(16);
    
    if (Math.round(originalAmount) === roundedAmount) {
      return url;
    }

    const originalShifted = originalAmount << 19;
    const originalHexValue = originalShifted.toString(16);
    
    if (pathPart.endsWith(originalHexValue)) {
      const kakaoPayId = pathPart.slice(0, -originalHexValue.length);
      return `${baseUrl}${kakaoPayId}${newHexValue}`;
    }
    
    return url;
  } catch (error) {
    console.error('카카오페이 URL 금액 반올림 실패:', error);
    return url;
  }
};

export const roundPaymentUrlAmount = (url, originalAmount = null) => {
  if (!url) {
    return url;
  }

  if (url.includes('supertoss://') || url.includes('toss://')) {
    return roundTossUrlAmount(url);
  }

  if (url.includes('qr.kakaopay.com')) {
    return roundKakaoPayUrlAmount(url, originalAmount);
  }

  return url;
};
