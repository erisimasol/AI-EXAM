import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Stack, CircularProgress, Chip } from '@mui/material';
import { IconDownload, IconPhoto, IconDiscountCheck } from '@tabler/icons-react';
import CertificateBadge, { TIER_META } from './CertificateBadge';
import { buildVerifyUrl, generateQrDataUrl } from '../../utils/qrcode';
import AmigosLogo from '../brand/AmigosLogo';
import { BRAND, FONTS, GRADIENTS, ORG } from '../../theme/brand';

const ORANGE = BRAND.orange;
const BLUE = BRAND.blue;

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    : '';

// A print-ready, brand-styled certificate. The visual area (certRef) is
// rasterized with html2canvas and exported to PDF (A4 landscape) or PNG.
// The QR code encodes the public verification URL for the certificate.

// Signature block. Prints a scanned signature above the rule when one is
// configured, and a clear ruled line when one is not — never a blank gap that
// could be mistaken for a signature that failed to load.
const SignatureBlock = ({ name, title, image }) => (
  <Box sx={{ textAlign: 'center', minWidth: 150, maxWidth: 185 }}>
    <Box
      sx={{
        height: 34,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        pb: 0.25,
      }}
    >
      {image ? (
        <img src={image} alt={`${name} signature`} style={{ maxHeight: 32, maxWidth: 150 }} />
      ) : null}
    </Box>
    <Box
      sx={{
        borderTop: `1px solid ${BRAND.blue}`,
        pt: 0.5,
        fontSize: '0.75rem',
        color: BRAND.blue,
        fontWeight: 700,
      }}
    >
      {name}
    </Box>
    <Box sx={{ fontSize: '0.58rem', color: BRAND.inkMuted, lineHeight: 1.3 }}>{title}</Box>
  </Box>
);

const CertificateCard = ({ certificate }) => {
  const certRef = useRef(null);
  const [qr, setQr] = useState('');
  const [busy, setBusy] = useState(false);

  const meta = TIER_META[certificate.badgeTier] || TIER_META.pass;
  const org = certificate.org || {};
  const verifyUrl = buildVerifyUrl(certificate.verificationCode || certificate.serialNumber);

  useEffect(() => {
    let alive = true;
    generateQrDataUrl(verifyUrl).then((data) => {
      if (alive) setQr(data);
    });
    return () => {
      alive = false;
    };
  }, [verifyUrl]);

  const rasterize = async () => {
    const html2canvas = (await import('html2canvas')).default;
    return html2canvas(certRef.current, { scale: 2, backgroundColor: '#ffffff', useCORS: true });
  };

  const downloadPdf = async () => {
    setBusy(true);
    try {
      const { jsPDF } = await import('jspdf');
      const canvas = await rasterize();
      const img = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const w = pdf.internal.pageSize.getWidth();
      const h = (canvas.height * w) / canvas.width;
      pdf.addImage(img, 'PNG', 0, (pdf.internal.pageSize.getHeight() - h) / 2, w, h);
      pdf.save(`${certificate.serialNumber}.pdf`);
    } finally {
      setBusy(false);
    }
  };

  const downloadPng = async () => {
    setBusy(true);
    try {
      const canvas = await rasterize();
      const link = document.createElement('a');
      link.download = `${certificate.serialNumber}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box>
      {/* ---- Printable certificate surface ---- */}
      <Box
        ref={certRef}
        sx={{
          position: 'relative',
          width: '100%',
          maxWidth: 900,
          mx: 'auto',
          aspectRatio: '1.414 / 1',
          bgcolor: '#fff',
          border: `2px solid ${BLUE}`,
          boxShadow: '0 8px 30px rgba(50,61,137,0.12)',
          overflow: 'hidden',
        }}
      >
        {/* Decorative frame */}
        <Box
          sx={{
            position: 'absolute',
            inset: 14,
            border: `1px solid ${ORANGE}`,
            pointerEvents: 'none',
          }}
        />
        {/* Corner accents */}
        {[
          { top: 0, left: 0 },
          { top: 0, right: 0 },
          { bottom: 0, left: 0 },
          { bottom: 0, right: 0 },
        ].map((pos, i) => (
          <Box
            key={i}
            sx={{ position: 'absolute', width: 70, height: 70, ...pos }}
          >
            <Box
              sx={{
                position: 'absolute',
                inset: 8,
                borderTop: pos.top !== undefined ? `4px solid ${ORANGE}` : 'none',
                borderBottom: pos.bottom !== undefined ? `4px solid ${ORANGE}` : 'none',
                borderLeft: pos.left !== undefined ? `4px solid ${BLUE}` : 'none',
                borderRight: pos.right !== undefined ? `4px solid ${BLUE}` : 'none',
              }}
            />
          </Box>
        ))}

        {/* Watermark — the rings mark, ghosted, as a security tint */}
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.06,
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        >
          <AmigosLogo variant="full" height={340} />
        </Box>

        {/* Content */}
        <Box
          sx={{
            position: 'relative',
            height: '100%',
            px: '7%',
            py: '5%',
            display: 'flex',
            flexDirection: 'column',
            textAlign: 'center',
          }}
        >
          {/* Issuing identity */}
          <Box display="flex" justifyContent="center" mb={0.75}>
            <AmigosLogo variant="full" height={86} />
          </Box>

          <Box sx={{ fontFamily: FONTS.document, color: BLUE, fontWeight: 700, fontSize: '1.05rem' }}>
            {org.name || ORG.name}
          </Box>
          <Box sx={{ color: BRAND.inkMuted, fontSize: '0.68rem', mb: 0.75 }}>{org.unit || ORG.unit}</Box>
          <Box
            sx={{
              width: 220,
              height: 3,
              mx: 'auto',
              mb: 1,
              borderRadius: 1,
              background: GRADIENTS.brandBar,
            }}
          />

          <Box
            sx={{
              fontFamily: FONTS.display,
              color: ORANGE,
              fontWeight: 700,
              letterSpacing: 3,
              fontSize: '1.6rem',
              textTransform: 'uppercase',
            }}
          >
            Certificate of Completion
          </Box>
          <Box sx={{ color: BRAND.inkMuted, letterSpacing: 4, fontSize: '0.7rem', mb: 1 }}>
            OF TRAINING
          </Box>

          <Box sx={{ color: BRAND.inkMuted, fontSize: '0.8rem' }}>This is to certify that</Box>
          <Box
            sx={{
              fontFamily: FONTS.display,
              color: BLUE,
              fontWeight: 700,
              fontSize: '2rem',
              borderBottom: `2px solid ${ORANGE}`,
              display: 'inline-block',
              alignSelf: 'center',
              px: 3,
              pb: 0.5,
              mt: 0.5,
              mb: 1,
            }}
          >
            {certificate.recipientName}
          </Box>

          <Box sx={{ color: BRAND.ink, fontSize: '0.85rem', maxWidth: 560, mx: 'auto' }}>
            {certificate.branch ? `of ${certificate.branch}, ` : ''}has successfully completed the
            training and passed the proctored assessment in{' '}
            <strong style={{ color: BLUE }}>{certificate.examName}</strong>, attaining a score of{' '}
            <strong>{Math.round(certificate.percentage)}%</strong> and earning a{' '}
            <strong style={{ color: meta.text }}>{certificate.badgeLabel}</strong> distinction.
          </Box>

          {/* Footer row: CEO signature | seal + badge + QR | PMERLF signature.
              Two signatories by design — the CEO attests for the Society, the
              Chief of PMERLF attests for the assessment process itself. */}
          <Box
            sx={{
              mt: 'auto',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: 1.5,
            }}
          >
            <SignatureBlock
              name={org.ceoName}
              title={org.ceoTitle || 'Chief Executive Officer'}
              image={org.ceoSignatureImage}
            />

            <Box display="flex" alignItems="flex-end" gap={1.25} sx={{ transform: 'translateY(6px)' }}>
              <AmigosLogo variant="seal" height={78} />
              <CertificateBadge
                tier={certificate.badgeTier}
                percentage={certificate.percentage}
                size={72}
                showLabel={false}
              />
              <Box sx={{ textAlign: 'center' }}>
                {qr ? (
                  <img src={qr} alt="Verification QR code" width={66} height={66} />
                ) : (
                  <Box sx={{ width: 66, height: 66, bgcolor: BRAND.surfaceSunken }} />
                )}
                <Box sx={{ fontSize: '0.52rem', color: BRAND.inkMuted, mt: 0.25 }}>Scan to verify</Box>
              </Box>
            </Box>

            <SignatureBlock
              name={org.signatoryName || 'Chief of PMERLF'}
              title={org.signatoryTitle}
              image={org.signatorySignatureImage}
            />
          </Box>

          {/* Serial + date strip */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mt: 1,
              fontSize: '0.6rem',
              color: BRAND.inkMuted,
            }}
          >
            <span>
              Serial No: <strong style={{ color: BLUE }}>{certificate.serialNumber}</strong>
            </span>
            <span>
              Issued at <strong style={{ color: BLUE }}>{org.placeOfIssue || 'Addis Ababa, Ethiopia'}</strong>
              {' on '}
              <strong>{fmtDate(certificate.issuedAt)}</strong>
            </span>
          </Box>
        </Box>

        {certificate.revoked && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(211,47,47,0.55)',
              fontSize: '6vw',
              fontWeight: 800,
              transform: 'rotate(-20deg)',
              border: '6px solid rgba(211,47,47,0.45)',
              borderRadius: 4,
              width: '70%',
              height: '30%',
              m: 'auto',
              pointerEvents: 'none',
            }}
          >
            REVOKED
          </Box>
        )}
      </Box>

      {/* ---- Actions (not captured in the export) ---- */}
      <Stack direction="row" spacing={1.5} justifyContent="center" flexWrap="wrap" mt={2}>
        <Chip
          icon={<IconDiscountCheck size={18} />}
          label={certificate.revoked ? 'Revoked' : 'Verified & authentic'}
          color={certificate.revoked ? 'error' : 'success'}
          variant="outlined"
        />
        <Button
          variant="contained"
          startIcon={busy ? <CircularProgress size={16} color="inherit" /> : <IconDownload size={18} />}
          onClick={downloadPdf}
          disabled={busy}
        >
          Download PDF
        </Button>
        <Button
          variant="outlined"
          startIcon={<IconPhoto size={18} />}
          onClick={downloadPng}
          disabled={busy}
        >
          Save as image
        </Button>
      </Stack>
    </Box>
  );
};

CertificateCard.propTypes = {
  certificate: PropTypes.object.isRequired,
};

export default CertificateCard;
