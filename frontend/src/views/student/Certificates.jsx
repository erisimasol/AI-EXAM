import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  IconButton,
  Divider,
} from '@mui/material';
import { IconEye, IconCertificate, IconX } from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';
import axiosInstance from '../../axios';
import { toast } from 'react-toastify';
import CertificateBadge from '../../components/certificate/CertificateBadge';
import CertificateCard from '../../components/certificate/CertificateCard';
import ShareCertificate from '../../components/certificate/ShareCertificate';

const fmtDate = (d) => (d ? new Date(d).toLocaleDateString() : '');

const Certificates = () => {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  const fetchCerts = async () => {
    try {
      setLoading(true);
      const { data } = await axiosInstance.get('/api/certificates/my', {
        withCredentials: true,
      });
      setCerts(data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load certificates');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }

  const tierCounts = certs.reduce(
    (acc, c) => {
      acc[c.badgeTier] = (acc[c.badgeTier] || 0) + 1;
      return acc;
    },
    { distinction: 0, merit: 0, pass: 0 },
  );

  return (
    <PageContainer
      title="My Certificates & Badges"
      description="View, download, and share your earned credentials"
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Summary */}
      <Grid container spacing={3} mb={1}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Certificates Earned
              </Typography>
              <Typography variant="h3">{certs.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
        {['distinction', 'merit', 'pass'].map((tier) => (
          <Grid item xs={12} md={3} key={tier}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h6" gutterBottom sx={{ textTransform: 'capitalize' }}>
                      {tier === 'pass' ? 'Passes' : `${tier}s`}
                    </Typography>
                    <Typography variant="h3">{tierCounts[tier]}</Typography>
                  </Box>
                  <CertificateBadge tier={tier} size={56} showLabel={false} />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <DashboardCard title="Earned Credentials">
        {certs.length === 0 ? (
          <Box textAlign="center" py={6} color="text.secondary">
            <IconCertificate size={48} stroke={1.2} />
            <Typography mt={1}>
              No certificates yet. Pass an assessment and, once your result is released, your
              certificate and badge will appear here automatically.
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {certs.map((cert) => (
              <Grid item xs={12} sm={6} md={4} key={cert._id}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Box display="flex" justifyContent="center" mb={1}>
                      <CertificateBadge
                        tier={cert.badgeTier}
                        percentage={cert.percentage}
                        size={104}
                      />
                    </Box>
                    <Typography variant="subtitle1" fontWeight={700} align="center" noWrap>
                      {cert.examName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                      {Math.round(cert.percentage)}% · {fmtDate(cert.issuedAt)}
                    </Typography>
                    <Box display="flex" justifyContent="center" mt={1}>
                      <Chip
                        size="small"
                        label={cert.serialNumber}
                        variant="outlined"
                        color={cert.revoked ? 'error' : 'primary'}
                      />
                    </Box>
                    <Button
                      fullWidth
                      variant="contained"
                      sx={{ mt: 2 }}
                      startIcon={<IconEye size={18} />}
                      onClick={() => setSelected(cert)}
                    >
                      View & Share
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </DashboardCard>

      {/* Certificate detail dialog */}
      <Dialog open={!!selected} onClose={() => setSelected(null)} maxWidth="md" fullWidth>
        <DialogTitle
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
        >
          Certificate
          <IconButton onClick={() => setSelected(null)}>
            <IconX size={20} />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selected && (
            <>
              <CertificateCard certificate={selected} />
              <Divider sx={{ my: 3 }} />
              <Typography variant="subtitle1" fontWeight={700} gutterBottom>
                Share your achievement
              </Typography>
              <ShareCertificate certificate={selected} />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </PageContainer>
  );
};

export default Certificates;
