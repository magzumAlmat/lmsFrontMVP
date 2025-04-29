"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Alert,
  CircularProgress,
} from "@mui/material";
import jwtDecode from "jwt-decode";
import TopMenu from "../../components/topmenu";
import { useDispatch } from "react-redux";
import { logoutAction } from "../../store/slices/authSlice";
import { useRouter } from "next/navigation";

export default function UpdateUserRolePage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [userId, setUserId] = useState("");
  const [roleId, setRoleId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true); // Добавляем состояние загрузки
  const host = process.env.NEXT_PUBLIC_HOST;

  // Инициализация токена и проверка его валидности
  useEffect(() => {
    // Во время сборки используем заглушки
    if (process.env.NODE_ENV === "production" && typeof window === "undefined") {
      setUsers([{ id: 1, email: "mock@example.com", name: "Mock User" }]);
      setFilteredUsers([{ id: 1, email: "mock@example.com", name: "Mock User" }]);
      setUserInfo({ id: 1, username: "Mock Admin" });
      setToken("mock-token");
      setLoading(false);
      return;
    }

    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    console.log("Stored token:", storedToken);

    if (!storedToken) {
      console.error("Token not available");
      router.push("/login");
      setLoading(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(storedToken);
      console.log("Decoded token:", decodedToken);
      setToken(storedToken);
    } catch (err) {
      console.error("Invalid token:", err.message);
      localStorage.removeItem("token");
      router.push("/login");
      setLoading(false);
    }
  }, [router]);

  // Загрузка пользователей и данных пользователя
  useEffect(() => {
    if (!token) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        // Загрузка списка пользователей
        const usersResponse = await axios.get(`${host}/api/getallusers`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000, // Добавляем тайм-аут
        });
        const usersData = usersResponse.data.users || [];
        console.log("Data from API:", usersData);
        setUsers(usersData);
        setFilteredUsers(usersData);

        // Загрузка информации о текущем пользователе
        const userInfoResponse = await axios.get(`${host}/api/auth/getAuthentificatedUserInfo`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000, // Добавляем тайм-аут
        });
        setUserInfo(userInfoResponse.data);
      } catch (err) {
        console.error("Ошибка при загрузке данных:", err);
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
        } else {
          setError("Не удалось загрузить данные");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, router]);

  // Фильтрация пользователей по почте
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    if (!Array.isArray(users)) {
      console.error("Users is not an array");
      return;
    }

    const filtered = users.filter((user) =>
      (user.email || "").toLowerCase().includes(query)
    );
    console.log("Filtered users:", filtered);
    setFilteredUsers(filtered);
  };

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Выбрана роль:", roleId);
    if (!userId || !roleId) {
      setError("Выберите пользователя и роль");
      return;
    }

    try {
      const response = await axios.put(
        `${host}/api/users/${userId}/role`,
        { roleId: Number(roleId) },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          timeout: 5000, // Добавляем тайм-аут
        }
      );
      setMessage(response.data.message || "Роль успешно обновлена");
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Произошла ошибка");
      setMessage("");
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
      }
    }
  };

  const handleLogout = () => {
    console.log("HandleLogout called");
    dispatch(logoutAction());
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <TopMenu handleLogout={handleLogout} userInfo={userInfo} />
      <Container maxWidth="sm" sx={{ mt: 8 }}>
        <Typography variant="h4" gutterBottom>
          Обновление роли пользователя
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Поле поиска пользователей */}
          <TextField
            label="Поиск по почте"
            value={searchQuery}
            onChange={handleSearch}
            fullWidth
            placeholder="Введите почту пользователя"
          />
          {/* Выбор пользователя */}
          <FormControl fullWidth>
            <InputLabel>Пользователь</InputLabel>
            <Select
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              label="Пользователь"
              required
            >
              <MenuItem value="">
                <em>Выберите пользователя</em>
              </MenuItem>
              {Array.isArray(filteredUsers) &&
                filteredUsers.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.email} ({user.name || "Без имени"})
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          {/* Выбор роли */}
          <FormControl fullWidth>
            <InputLabel>Роль</InputLabel>
            <Select
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
              label="Роль"
              required
            >
              <MenuItem value="">
                <em>Выберите роль</em>
              </MenuItem>
              <MenuItem value={1}>Администратор</MenuItem>
              <MenuItem value={2}>Преподаватель</MenuItem>
              <MenuItem value={3}>Студент</MenuItem>
            </Select>
          </FormControl>
          {/* Кнопка отправки */}
          <Button type="submit" variant="contained" color="primary">
            Обновить роль
          </Button>
        </Box>
        {/* Сообщение об успехе */}
        {message && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {message}
          </Alert>
        )}
        {/* Сообщение об ошибке */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Container>
    </>
  );
}

export const dynamic = "force-dynamic";