import QRCode from 'qrcode';
import { BRAND } from '../theme/brand';

// Build the public verification URL that a certificate's QR code points to.
// Uses the app's own origin so it works across localhost / Vercel / custom
// domains without extra configuration. Anyone scanning the QR lands on the
// public /verify/:code page which calls the public verification API.
export const buildVerifyUrl = (code) =>
  `${window.location.origin}/verify/${encodeURIComponent(code)}`;

// Generate a PNG data URL for a QR code. Returns '' on failure so callers can
// render gracefully without a QR rather than crashing.
export const generateQrDataUrl = async (text, options = {}) => {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'M',
      margin: 1,
      width: 220,
      // QR ink in brand deep blue rather than black: it still scans (contrast
      // ratio is well past the 3:1 the spec needs) and it keeps the certificate
      // free of any colour that is not in the Amigos palette.
      color: { dark: BRAND.blueDark, light: '#ffffff' },
      ...options,
    });
  } catch (err) {
    console.error('QR generation failed:', err);
    return '';
  }
};
