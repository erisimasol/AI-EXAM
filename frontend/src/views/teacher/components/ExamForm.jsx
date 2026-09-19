import React from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import CustomTextField from '../../../components/forms/theme-elements/CustomTextField';
import CodingQuestionForm from './CodingQuestionForm';
import { BRANCHES, DEPARTMENTS, EXAM_TYPES, DIFFICULTY_LEVELS } from '../../../data/orgData';

const CreateExam = ({ formik, title, subtitle, subtext }) => {
  const { values, errors, touched, handleBlur, handleChange, handleSubmit } = formik;

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}

      <Box component="form">
        <Stack mb={3}>
          <CustomTextField
            id="examName"
            name="examName"
            label="Exam Name"
            variant="outlined"
            fullWidth
            value={values.examName}
            onChange={handleChange}
            error={touched.examName && Boolean(errors.examName)}
            helperText={touched.examName && errors.examName}
          />
        </Stack>

        <Stack mb={3}>
          <CustomTextField
            id="description"
            name="description"
            label="Description (shown to candidates before they start)"
            variant="outlined"
            fullWidth
            multiline
            minRows={3}
            value={values.description}
            onChange={handleChange}
            error={touched.description && Boolean(errors.description)}
            helperText={touched.description && errors.description}
          />
        </Stack>

        <Stack mb={3}>
          <CustomTextField
            id="totalQuestions"
            name="totalQuestions"
            label="Total Number of Questions"
            variant="outlined"
            fullWidth
            value={values.totalQuestions}
            onChange={handleChange}
            error={touched.totalQuestions && Boolean(errors.totalQuestions)}
            helperText={touched.totalQuestions && errors.totalQuestions}
          />
        </Stack>

        <Stack mb={3}>
          <CustomTextField
            id="duration"
            name="duration"
            label="Exam Duration (minutes)"
            variant="outlined"
            fullWidth
            value={values.duration}
            onChange={handleChange}
            error={touched.duration && Boolean(errors.duration)}
            helperText={touched.duration && errors.duration}
          />
        </Stack>

        <Stack mb={3}>
          <CustomTextField
            id="liveDate"
            name="liveDate"
            label="Live Date and Time"
            type="datetime-local"
            variant="outlined"
            fullWidth
            value={values.liveDate}
            onChange={handleChange}
            error={touched.liveDate && Boolean(errors.liveDate)}
            helperText={touched.liveDate && errors.liveDate}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Stack>

        <Stack mb={3}>
          <CustomTextField
            id="deadDate"
            name="deadDate"
            label="Dead Date and Time"
            type="datetime-local"
            variant="outlined"
            fullWidth
            value={values.deadDate}
            onChange={handleChange}
            error={touched.deadDate && Boolean(errors.deadDate)}
            helperText={touched.deadDate && errors.deadDate}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </Stack>

        <Stack mb={3}>
          <FormControl fullWidth error={touched.department && Boolean(errors.department)}>
            <InputLabel id="department-label">Department</InputLabel>
            <Select
              labelId="department-label"
              id="department"
              name="department"
              label="Department"
              value={values.department}
              onChange={handleChange}
              onBlur={handleBlur}
            >
              {DEPARTMENTS.map((d) => (
                <MenuItem key={d} value={d}>
                  {d}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Stack mb={3}>
          <FormControl fullWidth>
            <InputLabel id="branches-label">Branch(es) — leave empty for all branches</InputLabel>
            <Select
              labelId="branches-label"
              id="branches"
              name="branches"
              label="Branch(es) — leave empty for all branches"
              multiple
              value={values.branches}
              onChange={handleChange}
              onBlur={handleBlur}
              renderValue={(selected) => selected.join(', ')}
            >
              {BRANCHES.map((b) => (
                <MenuItem key={b} value={b}>
                  {b}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Stack mb={3} direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <FormControl fullWidth>
            <InputLabel id="examType-label">Exam Format</InputLabel>
            <Select
              labelId="examType-label"
              id="examType"
              name="examType"
              label="Exam Format"
              value={values.examType}
              onChange={handleChange}
            >
              {EXAM_TYPES.map((t) => (
                <MenuItem key={t.value} value={t.value}>
                  {t.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="difficulty-label">Difficulty</InputLabel>
            <Select
              labelId="difficulty-label"
              id="difficultyLevel"
              name="difficultyLevel"
              label="Difficulty"
              value={values.difficultyLevel}
              onChange={handleChange}
            >
              {DIFFICULTY_LEVELS.map((d) => (
                <MenuItem key={d} value={d}>
                  {d.charAt(0).toUpperCase() + d.slice(1)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Stack mb={3}>
          <FormControlLabel
            control={
              <Checkbox
                id="randomizeQuestions"
                name="randomizeQuestions"
                checked={values.randomizeQuestions}
                onChange={handleChange}
              />
            }
            label="Randomize question selection from the question bank (reduces cheating)"
          />
        </Stack>

        <CodingQuestionForm formik={formik} />

        <Button
          color="primary"
          variant="contained"
          size="large"
          fullWidth
          type="submit"
          disabled={formik.isSubmitting}
          onClick={handleSubmit}
        >
          Create Exam
        </Button>
      </Box>

      {subtitle}
    </>
  );
};

export default CreateExam;
