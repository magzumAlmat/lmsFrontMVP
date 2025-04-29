"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import TopMenu from "../../components/topmenu";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { logoutAction } from "../../store/slices/authSlice";
import {
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Snackbar,
  createTheme,
  ThemeProvider,
  CircularProgress,
} from "@mui/material";
import jwtDecode from "jwt-decode";

// Создаем тему
const theme = createTheme({
  palette: {
    primary: { main: "#009eb0", contrastText: "#fff" }, // Бирюзовый
    secondary: { main: "#1e3a8a", contrastText: "#fff" }, // Глубокий синий
    background: {
      default: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)", // Мягкий градиент фона
      paper: "#ffffff", // Белый для формы
    },
    text: { primary: "#1e293b", secondary: "#64748b" }, // Темный текст
  },
  typography: {
    fontFamily: "'Open Sans', sans-serif",
    h4: { fontWeight: 700, letterSpacing: "-0.5px" },
    h6: { fontWeight: 600 },
    body2: { fontWeight: 400 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
          padding: "10px 20px",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0, 158, 176, 0.3)",
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "8px",
            "&:hover fieldset": {
              borderColor: "#009eb0",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#009eb0",
            },
          },
          "& .MuiInputLabel-root": {
            color: "#64748b",
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#009eb0",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#009eb0",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(0, 158, 176, 0.2)",
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: "#009eb0",
        },
      },
    },
  },
});

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(null);
  const [profileData, setProfileData] = useState({
    name: "",
    lastname: "",
    phone: "",
    areasofactivity: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const router = useRouter();
  const host = process.env.NEXT_PUBLIC_HOST;

  const activityOptions = [
    "Управление строительными проектами",
    "Проектирование",
    "Экспертиза и оценка соответствия",
    "Производство строительных работ",
    "Контроль и надзор",
    "Девелопмент и недвижимость",
  ];

  useEffect(() => {
    if (process.env.NODE_ENV === "production" && typeof window === "undefined") {
      setUserInfo({ id: 1, username: "Mock User" });
      setToken("mock-token");
      setProfileData({
        name: "Mock Name",
        lastname: "Mock Lastname",
        phone: "123456789",
        areasofactivity: "Проектирование",
      });
      setLoading(false);
      return;
    }

    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!storedToken) {
      router.push("/login");
      setLoading(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(storedToken);
      setToken(storedToken);
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      router.push("/login");
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        await Promise.all([fetchProfile(), fetchUserInfo()]);
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
        if (error.response?.status === 401) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`${host}/api/profile`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000,
      });
      setProfileData({
        name: response.data.name ?? "",
        lastname: response.data.lastname ?? "",
        phone: response.data.phone ?? "",
        areasofactivity: response.data.areasofactivity ?? "",
      });
    } catch (error) {
      console.error("Ошибка при загрузке профиля:", error);
      if (error.response?.status === 401) {
        router.push("/login");
      }
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${host}/api/auth/getAuthentificatedUserInfo`, {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000,
      });
      setUserInfo(response.data);
    } catch (err) {
      console.error("Ошибка при загрузке информации о пользователе:", err);
      if (err.response?.status === 401) {
        router.push("/login");
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setOpenSnackbar(false);

    try {
      const response = await axios.put(
        `${host}/api/profile`,
        profileData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 5000,
        }
      );
      setSuccessMessage(response.data.message || "Профиль успешно обновлен");
      setOpenSnackbar(true);
    } catch (error) {
      console.error("Ошибка при обновлении профиля:", error);
      if (error.response) {
        if (error.response.status === 401) {
          router.push("/login");
        } else {
          const message = error.response.data?.message || "Произошла ошибка при обновлении профиля";
          setErrorMessage(message);
          setOpenSnackbar(true);
        }
      } else {
        setErrorMessage("Не удалось подключиться к серверу");
        setOpenSnackbar(true);
      }
    }
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    setErrorMessage("");
    setSuccessMessage("");
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            bgcolor: "background.default",
          }}
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "background.default",
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
        <TopMenu userInfo={userInfo} handleLogout={handleLogout} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "calc(100vh - 64px)",
            zIndex: 1,
          }}
        >
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              bgcolor: "background.paper",
              p: { xs: 3, sm: 4 },
              width: "100%",
              maxWidth: "400px",
            }}
          >
            <Typography variant="h4" gutterBottom sx={{ color: "text.primary", textAlign: "center" }}>
              Мой профиль
            </Typography>

            <Box sx={{ mb: 2 }}>
              <TextField
                label="Имя"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                placeholder="Введите имя"
                required
                fullWidth
                variant="outlined"
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                label="Фамилия"
                name="lastname"
                value={profileData.lastname}
                onChange={handleChange}
                placeholder="Введите фамилию"
                required
                fullWidth
                variant="outlined"
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                label="Телефон"
                name="phone"
                value={profileData.phone}
                onChange={handleChange}
                placeholder="Введите телефон"
                required
                fullWidth
                variant="outlined"
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Сфера деятельности</InputLabel>
                <Select
                  name="areasofactivity"
                  value={profileData.areasofactivity}
                  onChange={handleChange}
                  label="Сфера деятельности"
                  required
                >
                  <MenuItem value="">
                    <em>Выберите сферу</em>
                  </MenuItem>
                  {activityOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Button type="submit" variant="contained" color="primary" fullWidth>
              Сохранить
            </Button>
          </Box>
        </Box>

        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert onClose={handleCloseSnackbar} severity={errorMessage ? "error" : "success"} sx={{ width: "100%" }}>
            {errorMessage || successMessage}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
};

export default ProfilePage;
export const dynamic = "force-dynamic";