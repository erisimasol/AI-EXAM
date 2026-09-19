import { useRef } from 'react';
import PropTypes from 'prop-types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { BRAND, FONTS, GRADIENTS, ORG } from '../theme/brand';

// Lightweight certificate used where the full credential record (serial, QR,
// badge tier) is not available — for example a local preview during exam
// authoring. The issued, verifiable credential is rendered by
// components/certificate/CertificateCard.jsx; this shares its identity so the
// two never look like they came from different organisations.
const Certificate = ({ studentName, examName, score, date }) => {
  const certRef = useRef();

  const downloadCertificate = async () => {
    const canvas = await html2canvas(certRef.current, { scale: 2, backgroundColor: '#ffffff' });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    pdf.addImage(imgData, 'PNG', 0, 0, 297, 210);
    pdf.save(`${ORG.serialPrefix}-preview-${studentName}.pdf`);
  };

  return (
    <div>
      <div
        ref={certRef}
        style={{
          position: 'relative',
          width: '800px',
          height: '560px',
          border: `2px solid ${BRAND.blue}`,
          padding: '0',
          textAlign: 'center',
          background: '#fff',
          fontFamily: FONTS.document,
        }}
      >
        {/* 70/30 rule as the head band */}
        <div style={{ height: '8px', background: GRADIENTS.brandBar }} />

        <div style={{ padding: '28px 48px 40px' }}>
          <p style={{ fontSize: '13px', color: BRAND.inkMuted, margin: '0 0 22px' }}>{ORG.unit}</p>

          <h1
            style={{
              fontFamily: FONTS.display,
              color: BRAND.orange,
              letterSpacing: '3px',
              textTransform: 'uppercase',
              fontSize: '30px',
              margin: '0',
            }}
          >
            Certificate of Completion
          </h1>
          <p style={{ letterSpacing: '5px', fontSize: '12px', color: BRAND.inkMuted, margin: '4px 0 24px' }}>
            OF TRAINING
          </p>

          <p style={{ fontSize: '15px', color: BRAND.inkMuted, margin: 0 }}>This certifies that</p>
          <h2
            style={{
              fontFamily: FONTS.display,
              fontSize: '36px',
              color: BRAND.blue,
              borderBottom: `2px solid ${BRAND.orange}`,
              display: 'inline-block',
              padding: '0 24px 6px',
              margin: '10px 0 18px',
            }}
          >
            {studentName}
          </h2>
          <p style={{ fontSize: '15px', color: BRAND.ink, margin: '0 0 6px' }}>
            has successfully completed the training and assessment
          </p>
          <h3 style={{ color: BRAND.blue, fontSize: '20px', margin: '0 0 14px' }}>{examName}</h3>
          <p style={{ fontSize: '18px', color: BRAND.ink, margin: 0 }}>
            Score: <strong style={{ color: BRAND.orange }}>{score}%</strong>
          </p>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              marginTop: '46px',
            }}
          >
            <div style={{ textAlign: 'center', minWidth: '190px' }}>
              <div
                style={{
                  borderTop: `1px solid ${BRAND.blue}`,
                  paddingTop: '6px',
                  color: BRAND.blue,
                  fontWeight: 700,
                  fontSize: '13px',
                }}
              >
                Chief of PMERLF
              </div>
              <div style={{ fontSize: '10px', color: BRAND.inkMuted }}>{ORG.shortName}</div>
            </div>
            <div style={{ textAlign: 'right', fontSize: '12px', color: BRAND.inkMuted }}>
              Date: <strong style={{ color: BRAND.blue }}>{date}</strong>
              <div style={{ fontSize: '10px', marginTop: '4px' }}>Preview — not a verifiable credential</div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={downloadCertificate}
        style={{
          marginTop: '20px',
          padding: '10px 30px',
          background: GRADIENTS.cta,
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '15px',
          fontWeight: 600,
          fontFamily: FONTS.ui,
        }}
      >
        Download preview (PDF)
      </button>
    </div>
  );
};

Certificate.propTypes = {
  studentName: PropTypes.string,
  examName: PropTypes.string,
  score: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  date: PropTypes.string,
};

export default Certificate;
