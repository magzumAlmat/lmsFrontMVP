"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Button,
  TextField,
} from "@mui/material";
import { useRouter } from "next/navigation";
import TopMenu from "../../components/topmenu";
import { logoutAction, getAllCoursesAction } from "../../store/slices/authSlice";
import Link from "next/link";
import jwtDecode from "jwt-decode";

export default function UserProgressPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [progressData, setProgressData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { courses } = useSelector((state) => state.auth);
  const host = process.env.NEXT_PUBLIC_HOST;

  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    console.log("Stored token:", storedToken);

    if (!storedToken) {
      console.error("Token not available");
      router.push("/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(storedToken);
      console.log("Decoded token:", decodedToken);
      setToken(storedToken);
    } catch (error) {
      console.error("Invalid token:", error.message);
      localStorage.removeItem("token");
      router.push("/login");
    }
  }, [router]);

  // Загрузка пользователей и курсов
  useEffect(() => {
    const fetchInitialData = async () => {
      if (!token) return; // Ждем, пока токен будет установлен
      try {
        const usersResponse = await axios.get(`${host}/api/getallusers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(usersResponse.data.users);
        const initialFilteredUsers = usersResponse.data.users.filter(
          (user) => user.roleId !== 1 && user.roleId !== 2
        );
        setFilteredUsers(initialFilteredUsers);

        dispatch(getAllCoursesAction());
      } catch (err) {
        console.error("Ошибка при загрузке данных:", err);
        setError("Не удалось загрузить пользователей или курсы");
      }
    };

    fetchInitialData();
  }, [dispatch, token]);

  // Итеративная загрузка прогресса
  useEffect(() => {
    if (users.length && courses.length && token) {
      const fetchAllProgress = async () => {
        setLoading(true);
        setError(null);
        const progressMap = {};

        try {
          const progressPromises = users.flatMap((user) =>
            courses.map((course) =>
              axios
                .get(`${host}/api/course/progress/${user.id}/${course.id}`, {
                  headers: { Authorization: `Bearer ${token}` },
                })
                .then((response) => ({
                  userId: user.id,
                  courseId: course.id,
                  data: response.data,
                }))
                .catch((err) => ({
                  userId: user.id,
                  courseId: course.id,
                  data: { lessons: [], course_progress: 0 },
                }))
            )
          );

          const results = await Promise.all(progressPromises);
          results.forEach(({ userId, courseId, data }) => {
            if (!progressMap[userId]) {
              progressMap[userId] = {};
            }
            progressMap[userId][courseId] = data.course_progress;
          });

          setProgressData(progressMap);
        } catch (err) {
          console.error("Ошибка при загрузке прогресса:", err);
          setError("Ошибка при загрузке данных прогресса");
        } finally {
          setLoading(false);
        }
      };

      fetchAllProgress();
      fetchUserInfo();
    }
  }, [users, courses, token]);

  const fetchUserInfo = async () => {
    if (!token) return;
    try {
      const response = await axios.get(`${host}/api/auth/getAuthentificatedUserInfo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке данных пользователя:", error);
      if (error.response && error.response.status === 401) {
        router.push("/login");
      }
    }
  };

  // Функция для скачивания Excel-файла с отзывами
  const handleDownloadReviews = async () => {
    try {
      const response = await axios({
        url: `${process.env.NEXT_PUBLIC_HOST}/api/export-reviews`, // Указанный URL
        method: 'GET',
        responseType: 'blob', // Ожидаем бинарные данные
        headers: {
          Authorization: `Bearer ${token}`, // Передаем токен для авторизации
        },
      });

      // Создаем Blob и инициируем скачивание
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'User_Reviews.xlsx';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Ошибка при скачивании файла:', error);
      setError('Не удалось скачать файл с отзывами');
    }
  };

  // Обработчик изменения поискового запроса
  const handleSearchChange = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    const filtered = users
      .filter((user) => user.roleId !== 1 && user.roleId !== 2)
      .filter((user) => {
        const name = (user.name ?? "").toLowerCase();
        const lastname = (user.lastname ?? "").toLowerCase();
        const email = (user.email ?? "").toLowerCase();
        return name.includes(query) || lastname.includes(query) || email.includes(query);
      });

    setFilteredUsers(filtered);
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!users.length || !courses.length || loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
        <CircularProgress />
        <Typography>Loading data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <>
      <TopMenu handleLogout={handleLogout} userInfo={userInfo} />
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 4 }}>
          Анализ прогресса пользователей
        </Typography>

        {/* Кнопка для скачивания отзывов */}
        <Box sx={{ mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleDownloadReviews}
            sx={{ textTransform: "none", mr: 2 }}
          >
            Скачать отзывы в Excel
          </Button>
        </Box>

        {/* Поисковое поле */}
        <Box sx={{ mb: 3 }}>
          <TextField
            label="Поиск по имени, фамилии или email"
            value={searchQuery}
            onChange={handleSearchChange}
            fullWidth
            variant="outlined"
            sx={{ maxWidth: 400 }}
          />
        </Box>

        {/* Таблица прогресса */}
        <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>Пользователь</TableCell>
                  {courses.map((course) => (
                    <TableCell key={course.id} sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>
                      {course.title}
                    </TableCell>
                  ))}
                  <TableCell sx={{ fontWeight: "bold", bgcolor: "#f5f5f5" }}>Действия</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} sx={{ "&:hover": { bgcolor: "#f9f9f9" } }}>
                    <TableCell>
                      <Typography variant="body2">
                        {user.name ?? ""} {user.lastname ?? ""} <br />
                        <Typography component="span" color="textSecondary">
                          ({user.email})
                        </Typography>
                        <br />
                        <Typography component="span" color="textSecondary">
                          {user.areasofactivity || "Не указано"}
                        </Typography>
                      </Typography>
                    </TableCell>
                    {courses.map((course) => (
                      <TableCell key={course.id}>
                        {progressData[user.id]?.[course.id] ?? 0}%
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button
                        component={Link}
                        href={`/progressstatus/${user.id}`}
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ textTransform: "none" }}
                      >
                        Детально
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </Box>
    </>
  );
}