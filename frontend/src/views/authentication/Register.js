import React, { useEffect, useState } from 'react';
import { Grid, Box, Card, Typography, Stack } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import { GRADIENTS, BRAND, ORG } from 'src/theme/brand';
import AmigosLogo from 'src/components/brand/AmigosLogo';
import AuthRegister from './auth/AuthRegister';
import { useFormik } from 'formik';
import * as yup from 'yup';

import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useRegisterMutation } from './../../slices/usersApiSlice';
import { setCredentials } from './../../slices/authSlice';
import Loader from './Loader';

const userValidationSchema = yup.object({
  name: yup.string().min(2).max(25).required('Please enter your name'),
  email: yup.string('Enter your email').email('Enter a valid email').required('Email is required'),
  password: yup
    .string('Enter your password')
    .min(6, 'Password should be of minimum 6 characters length')
    .required('Password is required'),
  confirm_password: yup
    .string()
    .required('Confirm Password is required')
    .oneOf([yup.ref('password'), null], 'Password must match'),
  role: yup
    .string()
    .oneOf(['student', 'teacher', 'department_head', 'supervisor', 'admin'], 'Invalid role')
    .required('Role is required'),
  branch: yup.string().required('Branch is required'),
  department: yup.string().required('Department is required'),
});
const initialUserValues = {
  name: '',
  email: '',
  password: '',
  confirm_password: '',
  role: 'student',
  branch: '',
  department: '',
};

const Register = () => {
  const formik = useFormik({
    initialValues: initialUserValues,
    validationSchema: userValidationSchema,
    onSubmit: (values, action) => {
      handleSubmit(values);
    },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
  };

  const handleSubmit = async ({
    name,
    email,
    password,
    confirm_password,
    role,
    branch,
    department,
  }) => {
    if (password !== confirm_password) {
      toast.error('Passwords do not match');
    } else {
      try {
        const res = await register({ name, email, password, role, branch, department }).unwrap();
        dispatch(setCredentials({ ...res }));
        formik.resetForm();

        navigate('/auth/login');
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <PageContainer title="Register" description="this is Register page">
      <Box
        sx={{
          position: 'relative',
          '&:before': {
            content: '""',
            background: GRADIENTS.authWash,
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
            position: 'absolute',
            height: '100%',
            width: '100%',
            opacity: '0.55',
          },
        }}
      >
        <Grid container spacing={0} justifyContent="center" sx={{ height: '100vh' }}>
          <Grid
            item
            xs={12}
            sm={12}
            lg={6}
            xl={12}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card elevation={9} sx={{ p: 2, zIndex: 1, width: '100%', maxWidth: '500px' }}>
              <Box display="flex" flexDirection="column" alignItems="center" mb={1}>
                <AmigosLogo variant="lockup" height={52} />
                <Box
                  sx={{
                    width: 180,
                    height: 3,
                    borderRadius: 1,
                    background: GRADIENTS.brandBar,
                    my: 1.5,
                  }}
                />
                <Typography
                  variant="overline"
                  sx={{ color: BRAND.inkMuted, textAlign: 'center', lineHeight: 1.5 }}
                >
                  {ORG.systemName}
                </Typography>
              </Box>
              <AuthRegister
                formik={formik}
                onSubmit={handleSubmit}
                subtext={
                  <Typography variant="subtitle1" textAlign="center" color="textSecondary" mb={1}>
                    {ORG.tagline}
                  </Typography>
                }
                subtitle={
                  <Stack direction="row" justifyContent="center" spacing={1} mt={3}>
                    <Typography color="textSecondary" variant="h6" fontWeight="400">
                      Already have an Account?
                    </Typography>
                    <Typography
                      component={Link}
                      to="/auth/login"
                      fontWeight="500"
                      sx={{
                        textDecoration: 'none',
                        color: 'primary.main',
                      }}
                    >
                      Sign In
                    </Typography>
                    {isLoading && <Loader />}
                  </Stack>
                }
              />
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};
export default Register;
