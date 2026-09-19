import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  List,
  ListItem,
  ListItemText,
  Radio,
  Stack,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import { uniqueId } from 'lodash';
import * as React from 'react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetExamByIdQuery, useGetQuestionsQuery } from 'src/slices/examApiSlice';
import { BRAND, GRADIENTS, ORG } from 'src/theme/brand';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const DescriptionAndInstructions = () => {
  const navigate = useNavigate();

  const { examId } = useParams();
  const { data: exam } = useGetExamByIdQuery(examId); // Fetch exam metadata using examId
  const { data: questions, isLoading } = useGetQuestionsQuery(examId); // Fetch questions using examId
  const totalQuestions = questions?.length ?? exam?.totalQuestions;

  // fech exam data from backend
  // pass testUnique id on start button
  const testId = uniqueId();
  // accetp
  const [certify, setCertify] = useState(false);
  const handleCertifyChange = () => {
    setCertify(!certify);
  };
  const handleTest = () => {
    // Check if the test date is valid here
    const isValid = true; // Replace with your date validation logic
    console.log('Test link');
    if (isValid) {
      // Replace 'examid' and 'TestId' with the actual values
      navigate(`/exam/${examId}/${testId}`);
    } else {
      // Display an error message or handle invalid date
      toast.error('Test date is not valid.');
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h2" mb={1}>
          {exam?.examName || 'Exam'}
        </Typography>
        {(exam?.department || exam?.difficultyLevel) && (
          <Typography variant="overline" sx={{ color: BRAND.inkMuted }}>
            {[exam?.department, exam?.difficultyLevel].filter(Boolean).join(' • ')}
          </Typography>
        )}
        <Typography mt={2}>
          {exam?.description || 'No description has been provided for this exam.'}
        </Typography>

        <>
          <Typography variant="h3" mb={3} mt={3}>
            Test Instructions
          </Typography>
          <List>
            <ol>
              <li>
                <ListItemText>
                  <Typography variant="body1">
                    This Practice Test consists of only <strong>MCQ questions.</strong>
                  </Typography>
                </ListItemText>
              </li>
              <li>
                <ListItemText>
                  <Typography variant="body1">
                    There are a total of <strong>{totalQuestions ?? '—'} questions.</strong> Test
                    Duration is <strong>{exam?.duration ?? '—'} minutes.</strong>
                  </Typography>
                </ListItemText>
              </li>
              <li>
                <ListItemText>
                  <Typography variant="body1">
                    There is <strong>Negative Marking</strong> for wrong answers.
                  </Typography>
                </ListItemText>
              </li>
              <li>
                <ListItemText>
                  <Typography variant="body1">
                    <strong>Do Not switch tabs </strong> while taking the test.
                    <strong> Switching Tabs will Block / End the test automatically.</strong>
                  </Typography>
                </ListItemText>
              </li>
              <li>
                <ListItemText>
                  <Typography variant="body1">
                    The test will only run in <strong>full screen mode.</strong> Do not switch back
                    to tab mode. Test will end automatically.
                  </Typography>
                </ListItemText>
              </li>
              <li>
                <ListItemText>
                  <Typography variant="body1">
                    You may need to use blank sheets for rough work. Please arrange for blank sheets
                    before starting.
                  </Typography>
                </ListItemText>
              </li>
              <li>
                <ListItemText>
                  <Typography variant="body1">
                    Clicking on Back or Next will save the answer.
                  </Typography>
                </ListItemText>
              </li>
              <li>
                <ListItemText>
                  <Typography variant="body1">
                    Questions can be reattempted till the time test is running.
                  </Typography>
                </ListItemText>
              </li>
              <li>
                <ListItemText>
                  <Typography variant="body1">
                    Click on the finish test once you are done with the test.
                  </Typography>
                </ListItemText>
              </li>
              <li>
                <ListItemText>
                  <Typography variant="body1">
                    You will be able to view the scores once your test is complete.
                  </Typography>
                </ListItemText>
              </li>
            </ol>
          </List>
        </>
        <Typography variant="h3" mb={3} mt={3}>
          Confirmation
        </Typography>
        <Typography mb={3}>
          Your actions shall be proctored and any signs of wrongdoing may lead to suspension or
          cancellation of your test.
        </Typography>
        <Stack direction="column" alignItems="center" spacing={3}>
          <FormControlLabel
            control={<Checkbox checked={certify} onChange={handleCertifyChange} color="primary" />}
            label="I certify that I have carefully read and agree to all of the instructions mentioned above"
          />
          <div style={{ display: 'flex', padding: '2px', margin: '10px' }}>
            <Button variant="contained" color="primary" disabled={!certify} onClick={handleTest}>
              Start Test
            </Button>
          </div>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default function ExamDetails() {
  return (
    <>
      <Grid container sx={{ height: '100vh' }}>
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            background: GRADIENTS.panel,
            display: { xs: 'none', sm: 'flex' },
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            px: 6,
          }}
        >
          <Typography variant="h3" sx={{ color: '#fff', mb: 1.5 }}>
            {ORG.shortName}
          </Typography>
          <Box sx={{ width: 120, height: 3, borderRadius: 1, background: GRADIENTS.brandBar, mb: 2 }} />
          <Typography variant="subtitle1" sx={{ color: BRAND.blueTint }}>
            {ORG.tagline}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <DescriptionAndInstructions />
        </Grid>
      </Grid>
    </>
  );
}
