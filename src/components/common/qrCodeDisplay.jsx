import React, { forwardRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';

const QRCodeDisplay = forwardRef(({ url, size = 200 }, ref) => {

  if (!url) {
    return null;
  }

  return (
    <div ref={ref} className="flex justify-center items-center">
      <QRCodeCanvas
        value={url}
        size={size}
        level="H"
        includeMargin={true}
      />
    </div>
  );
});
QRCodeDisplay.displayName = 'QRCodeDisplay';

export default QRCodeDisplay;
