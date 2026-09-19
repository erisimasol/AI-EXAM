import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Chip,
  Divider,
  Grid,
  Button,
} from '@mui/material';
import {
  IconDiscountCheck,
  IconCertificateOff,
  IconShieldX,
} from '@tabler/icons-react';
import axiosInstance from '../axios';
import CertificateBadge from '../components/certificate/CertificateBadge';
import { BRAND, GRADIENTS, ORG, STATUS } from '../theme/brand';

const ORANGE = BRAND.orange;
// (BLUE is available as BRAND.blue where needed.)

const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })
    : '';

const Row = ({ label, value }) => (
  <Grid container spacing={1} sx={{ py: 0.75 }}>
    <Grid item xs={5} sm={4}>
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
    </Grid>
    <Grid item xs={7} sm={8}>
      <Typography variant="body2" fontWeight={600}>
        {value || '—'}
      </Typography>
    </Grid>
  </Grid>
);

// Public page: verifies a certificate by its code (from the QR / serial).
// Deliberately does NOT require authentication — this is the trust surface an
// external verifier (employer, regulator) lands on.
const CertificateVerify = () => {
  const { code } = useParams();
  const [state, setState] = useState({ loading: true, data: null, error: null });

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await axiosInstance.get(
          `/api/certificates/verify/${encodeURIComponent(code)}`,
        );
        if (alive) setState({ loading: false, data, error: null });
      } catch (err) {
        if (alive)
          setState({
            loading: false,
            data: null,
            error: err.response?.data?.message || 'Verification service unavailable',
          });
      }
    })();
    return () => {
      alive = false;
    };
  }, [code]);

  const { loading, data, error } = state;

  const header = (title, subtitle, color) => (
    <Box sx={{ bgcolor: color, color: '#fff', p: 3, textAlign: 'center' }}>
      <Typography variant="h5" fontWeight={700}>
        {title}
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.9 }}>
        {subtitle}
      </Typography>
    </Box>
  );

  const renderBody = () => {
    if (loading) {
      return (
        <Box display="flex" flexDirection="column" alignItems="center" py={8} gap={2}>
          <CircularProgress />
          <Typography color="text.secondary">Verifying certificate…</Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <>
          {header('Verification unavailable', 'Please try again shortly', BRAND.inkMuted)}
          <CardContent>
            <Box textAlign="center" py={3}>
              <IconShieldX size={56} color={BRAND.inkMuted} />
              <Typography mt={1}>{error}</Typography>
            </Box>
          </CardContent>
        </>
      );
    }

    if (!data.valid && !data.certificate) {
      return (
        <>
          {header('Not Verified', 'This code does not match any certificate', STATUS.error)}
          <CardContent>
            <Box textAlign="center" py={3}>
              <IconCertificateOff size={56} color={STATUS.error} />
              <Typography mt={1}>{data.message}</Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Code checked: <strong>{code}</strong>
              </Typography>
            </Box>
          </CardContent>
        </>
      );
    }

    const c = data.certificate;
    const revoked = data.revoked;

    return (
      <>
        {revoked
          ? header('Certificate Revoked', 'This credential is no longer valid', STATUS.error)
          : header('Authentic Certificate', 'Verified by ' + (c.org?.shortName || 'the issuer'), ORANGE)}
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            {revoked ? (
              <IconCertificateOff size={48} color={STATUS.error} />
            ) : (
              <IconDiscountCheck size={48} color={STATUS.success} />
            )}
            <Chip
              sx={{ mt: 1 }}
              color={revoked ? 'error' : 'success'}
              label={revoked ? 'REVOKED' : 'VALID'}
            />
          </Box>

          <Box display="flex" justifyContent="center" mb={2}>
            <CertificateBadge tier={c.badgeTier} percentage={c.percentage} size={110} />
          </Box>

          <Divider sx={{ mb: 1 }} />
          <Row label="Recipient" value={c.recipientName} />
          <Row label="Assessment" value={c.examName} />
          <Row label="Result" value={`${Math.round(c.percentage)}%`} />
          <Row label="Distinction" value={c.badgeLabel} />
          {c.branch && <Row label="Branch" value={c.branch} />}
          {c.department && <Row label="Department" value={c.department} />}
          <Row label="Serial Number" value={c.serialNumber} />
          <Row label="Issued On" value={fmtDate(c.issuedAt)} />
          <Row label="Issuing Body" value={c.org?.name || ORG.name} />

          {revoked && (
            <Typography variant="body2" color="error" mt={2} textAlign="center">
              {data.message}
            </Typography>
          )}
        </CardContent>
      </>
    );
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: BRAND.surfaceSunken,
        py: { xs: 3, md: 6 },
        display: 'flex',
        alignItems: 'flex-start',
      }}
    >
      <Container maxWidth="sm">
        {/* Brand bar. This page is the trust surface an outside verifier lands
            on, so the identity is stated in full, not abbreviated. */}
        <Box display="flex" flexDirection="column" alignItems="center" mb={2.5}>
          <Box
            sx={{ width: 240, height: 3, borderRadius: 1, background: GRADIENTS.brandBar, my: 1.5 }}
          />
          <Typography variant="overline" sx={{ color: BRAND.inkMuted }}>
            Certificate Verification
          </Typography>
        </Box>

        <Card sx={{ overflow: 'hidden' }}>{renderBody()}</Card>

        <Box textAlign="center" mt={3}>
          <Button component={Link} to="/" size="small" variant="text">
            Go to portal
          </Button>
        </Box>
        <Typography variant="caption" color="text.secondary" display="block" textAlign="center" mt={1}>
          {`Verification powered by the ${ORG.shortName} ${ORG.systemName}.`}
        </Typography>
      </Container>
    </Box>
  );
};

export default CertificateVerify;
