'use client';
import React, { useState, useEffect } from 'react';
import { redirect, useRouter } from 'next/navigation'; // Используем next/navigation вместо next/router
import { Container, Typography, TextField, Button, Box, Link, Grid,Stack } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { authorize, loginAction } from '../../store/slices/authSlice';
import GoogleIcon from '@mui/icons-material/Google';
import GoogleButton from 'react-google-button'
import ButtonGroup from '@mui/material/ButtonGroup';
import axios from 'axios';
import SaveIcon from '@mui/icons-material/Save';
import ResetPassword from '../../components/resetpassword';
import ForgotPassword from '../../components/forgotpassword';

const ForgotPasswordPage= () => {
    return(<>
    <ForgotPassword/>
    </>)
}

export default ForgotPasswordPage;