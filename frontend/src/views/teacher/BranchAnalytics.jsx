import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from '@mui/material';
import Chart from 'react-apexcharts';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from 'src/components/shared/DashboardCard';
import axiosInstance from '../../axios';
import { BRAND } from 'src/theme/brand';

const BranchAnalytics = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await axiosInstance.get('/api/users/results/analytics', {
          withCredentials: true,
        });
        setData(res.data.data || []);
      } catch (err) {
        setError(err?.response?.data?.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  // Aggregate by branch for the top chart
  const byBranch = data.reduce((acc, row) => {
    if (!acc[row.branch]) acc[row.branch] = { totalCandidates: 0, passed: 0, flaggedIncidents: 0 };
    acc[row.branch].totalCandidates += row.totalCandidates;
    acc[row.branch].passed += Math.round((row.passRate / 100) * row.totalCandidates);
    acc[row.branch].flaggedIncidents += row.flaggedIncidents;
    return acc;
  }, {});

  const branchLabels = Object.keys(byBranch);
  const branchPassRates = branchLabels.map((b) =>
    byBranch[b].totalCandidates
      ? Number(((byBranch[b].passed / byBranch[b].totalCandidates) * 100).toFixed(1))
      : 0,
  );
  const branchIncidents = branchLabels.map((b) => byBranch[b].flaggedIncidents);

  const chartOptions = {
    chart: { toolbar: { show: false }, fontFamily: 'inherit' },
    xaxis: { categories: branchLabels },
    colors: [BRAND.orange, BRAND.blue],
    dataLabels: { enabled: false },
    legend: { position: 'top' },
    plotOptions: { bar: { columnWidth: '45%', borderRadius: 4 } },
  };

  const chartSeries = [
    { name: 'Pass Rate (%)', data: branchPassRates },
    { name: 'Flagged Incidents', data: branchIncidents },
  ];

  return (
    <PageContainer
      title="Branch & Department Analytics"
      description="Benchmark pass rates and flagged incidents across Amigos SACCO branches and departments"
    >
      <DashboardCard title="Branch & Department Analytics">
        {loading ? (
          <Box display="flex" justifyContent="center" p={4}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : data.length === 0 ? (
          <Alert severity="info">No exam results recorded yet.</Alert>
        ) : (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Chart options={chartOptions} series={chartSeries} type="bar" height={320} />
            </Grid>
            <Grid item xs={12}>
              <TableContainer component={Paper} variant="outlined">
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Branch</TableCell>
                      <TableCell>Department</TableCell>
                      <TableCell align="right">Candidates</TableCell>
                      <TableCell align="right">Pass Rate</TableCell>
                      <TableCell align="right">Flagged Incidents</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {data.map((row) => (
                      <TableRow key={`${row.branch}-${row.department}`}>
                        <TableCell>{row.branch}</TableCell>
                        <TableCell>{row.department}</TableCell>
                        <TableCell align="right">{row.totalCandidates}</TableCell>
                        <TableCell align="right">
                          <Chip
                            size="small"
                            label={`${row.passRate}%`}
                            color={row.passRate >= 50 ? 'success' : 'warning'}
                          />
                        </TableCell>
                        <TableCell align="right">
                          {row.flaggedIncidents > 0 ? (
                            <Chip size="small" color="error" label={row.flaggedIncidents} />
                          ) : (
                            0
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        )}
      </DashboardCard>
    </PageContainer>
  );
};

export default BranchAnalytics;
