"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Link,
  Grid,
  Stack,
  Alert,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { authorize, setError, logoutAction } from "../../store/slices/authSlice";
import jwtDecode from "jwt-decode";
import axios from "axios";

// Создаем тему
const theme = createTheme({
  palette: {
    primary: { main: "#009eb0", contrastText: "#fff" }, // Бирюзовый
    secondary: { main: "#1e3a8a", contrastText: "#fff" }, // Глубокий синий
    background: {
      default: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)", // Мягкий градиент фона
      paper: "#ffffff", // Белый для формы
    },
    text: { primary: "#1e293b", secondary: "#64748b" }, // Темный текст для контраста
  },
  typography: {
    fontFamily: "'Open Sans', sans-serif",
    h4: { fontWeight: 700, letterSpacing: "-0.5px" }, // Жирный заголовок
    body1: { fontWeight: 400 },
    body2: { fontWeight: 400 },
    button: { fontWeight: 600, letterSpacing: "0.5px" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "12px",
          padding: "12px 24px",
          boxShadow: "0 4px 14px rgba(0, 158, 176, 0.3)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 6px 20px rgba(0, 158, 176, 0.5)",
          },
          "&:disabled": {
            opacity: 0.6,
            boxShadow: "none",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            backgroundColor: "#f8fafc",
            transition: "all 0.2s ease",
            "&:hover fieldset": { borderColor: "#009eb0" },
            "&.Mui-focused fieldset": { borderColor: "#009eb0" },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "16px",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
          border: "1px solid rgba(0, 158, 176, 0.2)",
        },
      },
    },
  },
});

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [localError, setLocalError] = useState("");
  const isAuth = useSelector((state) => state.auth.isAuth);
  const reduxError = useSelector((state) => state.auth.error);
  const dispatch = useDispatch();
  const router = useRouter();
  const host = process.env.NEXT_PUBLIC_HOST;

  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp && decodedToken.exp < currentTime) {
          dispatch(logoutAction());
          localStorage.removeItem("token");
          router.push("/login");
        } else {
          dispatch(authorize({ isAuth: true, token: storedToken }));
          router.push("/layout");
        }
      } catch (error) {
        dispatch(logoutAction());
        localStorage.removeItem("token");
        router.push("/login");
      }
    }
  }, [dispatch, router]);

  useEffect(() => {
    if (isAuth) {
      router.push("/layout");
    }
  }, [isAuth, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    dispatch(setError(null));

    try {
      const response = await axios.post(`${host}/api/auth/login`, { email, password });
      const { token } = response.data;

      localStorage.setItem("token", token);
      dispatch(authorize({ isAuth: true, token }));
      router.push("/layout");
    } catch (error) {
      const errorMessage = error.response?.data?.message || "Неверный email или пароль";
      setLocalError(errorMessage);
      dispatch(setError(errorMessage));
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: theme.palette.background.default,
          position: "relative",
          overflow: "hidden",
          "&:before": {
            content: '""',
            position: "absolute",
            top: "-50%",
            left: "-50%",
            width: "200%",
            height: "200%",
            background: "radial-gradient(circle, rgba(0, 158, 176, 0.1) 0%, transparent 70%)",
            zIndex: 0,
          },
        }}
      >
        <Container maxWidth="xs" sx={{ zIndex: 1 }}>
          <Box
            sx={{
              bgcolor: "background.paper",
              p: 4,
              borderRadius: "16px",
              textAlign: "center",
            }}
          >
            <LockOutlined sx={{ fontSize: 48, color: "primary.main", mb: 2 }} />
            <Typography variant="h4" color="text.primary">
              Вход
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
              Войдите в свой аккаунт
            </Typography>

            {(localError || reduxError) && (
              <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
                {localError || reduxError}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              >
                Войти
              </Button>

              <Grid container justifyContent="space-between" sx={{ mt: 2 }}>
                <Grid item>
                  <Link href="/forgotpassword" variant="body2" sx={{ color: "secondary.main" }}>
                    Забыл пароль?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="/register" variant="body2" sx={{ color: "secondary.main" }}>
                    Нет аккаунта? Зарегистрируйтесь
                  </Link>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default LoginPage;