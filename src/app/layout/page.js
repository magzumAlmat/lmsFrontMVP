"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCoursesAction, logoutAction } from "../../store/slices/authSlice";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  createTheme,
  ThemeProvider,
  Divider,
} from "@mui/material";
import TopMenu from "../../components/topmenu";
import axios from "axios";
import { useRouter } from "next/navigation";

// Создаем тему
const theme = createTheme({
  palette: {
    primary: { main: "#009eb0", contrastText: "#fff" }, // Бирюзовый
    secondary: { main: "#1e3a8a", contrastText: "#fff" }, // Глубокий синий
    background: {
      default: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)", // Мягкий градиент фона
      paper: "#ffffff", // Белый для контента
    },
    text: { primary: "#1e293b", secondary: "#64748b" }, // Темный текст для контраста
  },
  typography: {
    fontFamily: "'Open Sans', sans-serif",
    h2: { fontWeight: 700, letterSpacing: "-0.5px" }, // Основной заголовок
    body1: { fontWeight: 400, lineHeight: 1.6 }, // Текст
  },
  components: {
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(0, 158, 176, 0.3)",
          margin: "16px 0",
        },
      },
    },
  },
});

export default function WelcomePage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { courses, loadingCourses, coursesError } = useSelector((state) => state.auth);
  const isAuth = useSelector((state) => state.auth.isAuth);
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(null);
  const host = process.env.NEXT_PUBLIC_HOST;

  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(storedToken);
    if (!storedToken) {
      router.push("/login");
    }
  }, [router]);

  useEffect(() => {
    if (token) {
      dispatch(getAllCoursesAction());
      fetchUserInfo();
    }
  }, [token, dispatch]);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${host}/api/auth/getAuthentificatedUserInfo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(response.data);
    } catch (err) {
      console.error("Ошибка при загрузке информации о пользователе:", err);
      if (err.response && err.response.status === 401) {
        router.push("/login");
      }
    }
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!token || loadingCourses) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            bgcolor: theme.palette.background.default,
          }}
        >
          <CircularProgress sx={{ color: theme.palette.primary.main }} />
        </Box>
      </ThemeProvider>
    );
  }

  if (coursesError) {
    return (
      <ThemeProvider theme={theme}>
        <Container sx={{ py: 4, bgcolor: theme.palette.background.default }}>
          <Typography variant="h6" color="error" align="center">
            Ошибка: {coursesError}
          </Typography>
        </Container>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: theme.palette.background.default,
          minHeight: "100vh",
          backgroundImage: `url(/background.jpg)`, // Исправлено "backgound" на "background"
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        
          position: "relative",
          overflow: "hidden",
          backgroundImage: `url(/background.jpg)`,
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
        <TopMenu userInfo={userInfo} handleLogout={handleLogout} />
        <Divider />
        <Container maxWidth="md" sx={{ zIndex: 1, py: 6 }}>
          <Box
            sx={{
              bgcolor: "background.paper",
              p: 4,
              borderRadius: "16px",
              boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
              border: "1px solid rgba(0, 158, 176, 0.2)",
              textAlign: "center",
            }}
          >
            <Typography
              variant="h2"
              color="text.primary"
              sx={{ mb: 3, fontSize: { xs: "2rem", md: "3rem" } }}
            >
              Добро пожаловать на платформу buildingSmart Kazakhstan
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                maxWidth: "800px",
                mx: "auto",
                textAlign: "justify",
              }}
            >
              Добро пожаловать на образовательную платформу по информационному моделированию buildingSmart Kazakhstan для
              специалистов строительной отрасли! <br />
              Здесь вы найдете курсы, разработанные с учетом практических задач и требований современного строительства.{" "}
              <br />
              Осваивайте инструменты BIM, повышайте квалификацию и внедряйте цифровые технологии на всех этапах
              жизненного цикла объекта — от проектирования до эксплуатации. <br />
              Платформа создана для тех, кто хочет работать эффективно, точно и в соответствии с актуальными стандартами
              и технологиями.
            </Typography>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}