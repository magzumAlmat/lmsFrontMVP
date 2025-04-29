'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { createUserAction } from '../../store/slices/authSlice';
import {
  Container, Typography, TextField, Button, Box, Link, Grid, Snackbar, Alert, createTheme, ThemeProvider
} from '@mui/material';
import { LockOutlined } from '@mui/icons-material';

// Определяем кастомную тему
const theme = createTheme({
  palette: {
    primary: { main: '#009eb0', contrastText: '#fff' }, // Бирюзовый
    secondary: { main: '#1e3a8a', contrastText: '#fff' }, // Глубокий синий
    background: {
      default: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)', // Мягкий градиент фона
      paper: '#ffffff', // Белый для формы
    },
    text: { primary: '#1e293b', secondary: '#64748b' }, // Темный текст для контраста
  },
  typography: {
    fontFamily: "'Open Sans', sans-serif",
    h4: { fontWeight: 700, letterSpacing: '-0.5px' }, // Жирный заголовок
    body1: { fontWeight: 400 },
    button: { fontWeight: 600, letterSpacing: '0.5px' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '12px',
          padding: '12px 24px',
          boxShadow: '0 4px 14px rgba(0, 158, 176, 0.3)',
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(0, 158, 176, 0.5)',
          },
          '&:disabled': {
            opacity: 0.6,
            boxShadow: 'none',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: '#f8fafc',
            transition: 'all 0.2s ease',
            '&:hover fieldset': { borderColor: '#009eb0' },
            '&.Mui-focused fieldset': { borderColor: '#009eb0' },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
          border: '1px solid rgba(0, 158, 176, 0.2)',
        },
      },
    },
  },
});

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');

    if (!email || !password || !confirmPassword) {
      setErrorMessage('Все поля обязательны для заполнения.');
      setOpenSnackbar(true);
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('Пароли не совпадают.');
      setOpenSnackbar(true);
      return;
    }

    try {
      await dispatch(createUserAction({ email, password }));
      setSuccessMessage('Регистрация прошла успешно! Проверьте почту.');
      setOpenSnackbar(true);
      setIsSubmitDisabled(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (error) {
      setErrorMessage('Ошибка: ' + (error.message || 'Попробуйте снова.'));
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => setOpenSnackbar(false);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: theme.palette.background.default,
          position: 'relative',
          overflow: 'hidden',
          '&:before': { // Добавляем декоративный элемент
            content: '""',
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(0, 158, 176, 0.1) 0%, transparent 70%)',
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="xs" sx={{ zIndex: 1 }}>
          <Box
            sx={{
              bgcolor: 'background.paper',
              p: 4,
              borderRadius: '16px',
              textAlign: 'center',
            }}
          >
            <LockOutlined sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" color="text.primary">
              Регистрация
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
              Создайте аккаунт за пару шагов
            </Typography>
            <Box component="form" onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email"
                    name="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Пароль"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Подтвердите пароль"
                    type="password"
                    id="confirmPassword"
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                disabled={isSubmitDisabled}
              >
                Зарегистрироваться
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link href="/login" variant="body2" sx={{ color: 'secondary.main' }}>
                    Уже есть аккаунт? Войдите
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert severity={successMessage ? 'success' : 'error'} sx={{ width: '100%' }}>
            {successMessage || errorMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default RegisterPage;