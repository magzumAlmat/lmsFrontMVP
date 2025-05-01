"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { getAllCoursesAction, logoutAction } from "../../store/slices/authSlice";
import TopMenu from "../../components/topmenu";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Тема MUI
const theme = createTheme({
  palette: {
    primary: { main: "#009eb0", contrastText: "#fff" },
    secondary: { main: "#1e3a8a", contrastText: "#fff" },
    background: {
      default: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
      paper: "#ffffff",
    },
    text: { primary: "#1e293b", secondary: "#64748b" },
  },
  typography: {
    fontFamily: "'Open Sans', sans-serif",
    h4: { fontWeight: 700, letterSpacing: "-0.5px" },
    h6: {
      fontWeight: 600,
      fontSize: { xs: "1.125rem", sm: "1.25rem" },
      wordBreak: "break-word",
    },
    body1: {
      fontWeight: 400,
      lineHeight: 1.6,
      fontSize: { xs: "0.75rem", sm: "0.875rem" },
      wordBreak: "break-word",
    },
    body2: {
      fontWeight: 400,
      fontSize: { xs: "0.625rem", sm: "0.75rem" },
      wordBreak: "break-word",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
          padding: { xs: "6px 12px", sm: "8px 16px" },
          fontSize: { xs: "0.75rem", sm: "0.875rem" },
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0, 158, 176, 0.3)",
          },
          "&:disabled": {
            opacity: 0.6,
            boxShadow: "none",
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
          overflow: "hidden",
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          fontSize: { xs: "0.625rem", sm: "0.75rem" },
          padding: { xs: "8px", sm: "12px" },
        },
        head: {
          fontWeight: 600,
          backgroundColor: "rgba(0, 158, 176, 0.05)",
        },
      },
    },
  },
});

// Возможные статусы
const STATUS_OPTIONS = [
  { value: "not_checked", label: "Не проверено" },
  { value: "checked", label: "Проверено" },
  { value: "unsatisfactory", label: "Не удовлетворительно" },
  { value: "satisfactory", label: "Удовлетворительно" },
  { value: "good", label: "Хорошо" },
  { value: "excellent", label: "Отлично" },
];

export default function Homeworks() {
  const host = process.env.NEXT_PUBLIC_HOST;
  const router = useRouter();
  const dispatch = useDispatch();
  const [token, setToken] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [homeworks, setHomeworks] = useState([]);
  const [users, setUsers] = useState([]); // Список студентов
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [courseFilter, setCourseFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [studentFilter, setStudentFilter] = useState("all"); // Фильтр по студенту
  const [searchQuery, setSearchQuery] = useState("");
  const [updateLoading, setUpdateLoading] = useState({});
  const [updateError, setUpdateError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(null);
  const { courses } = useSelector((state) => state.auth);

  // Проверка токена
  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(storedToken);
    if (!storedToken) router.push("/login");
  }, [router]);

  // Загрузка информации о пользователе, курсах и студентах
  useEffect(() => {
    if (token) {
      fetchUserInfo();
      fetchUsers(); // Загружаем список студентов
      dispatch(getAllCoursesAction());
    }
  }, [token, dispatch]);

  // Загрузка информации о пользователе
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${host}/api/auth/getAuthentificatedUserInfo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('User info fetched:', response.data);
      setUserInfo(response.data);
    } catch (err) {
      console.error("Ошибка при загрузке информации о пользователе:", err);
      if (err.response?.status === 401) router.push("/login");
      setError("Не удалось загрузить информацию о пользователе");
    }
  };

  // Загрузка списка студентов
  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${host}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Users fetched:', response.data);
      if (!Array.isArray(response.data)) {
        throw new Error("Ожидался массив пользователей");
      }
      setUsers(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке пользователей:", error);
      setError(error.response?.data?.message || "Не удалось загрузить список студентов");
    }
  };

  // Загрузка домашних заданий
  const fetchHomeworks = async () => {
    if (!userInfo) return; // Ждём userInfo
    setIsLoading(true);
    setError(null);
    try {
      const endpoint = `${host}/api/homeworks`;
      console.log('Fetching homeworks from:', endpoint);
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Homeworks response:', response.data);
      if (!Array.isArray(response.data)) {
        throw new Error("Ожидался массив домашних заданий");
      }
      setHomeworks(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке домашних заданий:", error);
      setError(error.response?.data?.message || "Не удалось загрузить домашние задания");
    } finally {
      setIsLoading(false);
    }
  };

  // Загрузка заданий при получении userInfo
  useEffect(() => {
    if (userInfo?.id) {
      fetchHomeworks();
    }
  }, [userInfo]);

  // Обновление статуса задания
  const handleStatusChange = async (homeworkId, newStatus) => {
    setUpdateLoading((prev) => ({ ...prev, [homeworkId]: true }));
    setUpdateError(null);
    setUpdateSuccess(null);

    try {
      const response = await axios.put(
        `${host}/api/homeworks/${homeworkId}`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log('Status update response:', response.data);
      if (response.status === 200) {
        setHomeworks((prev) =>
          prev.map((hw) =>
            hw.homework_id === homeworkId ? { ...hw, status: newStatus } : hw
          )
        );
        setUpdateSuccess("Статус успешно обновлён!");
      }
    } catch (error) {
      console.error("Ошибка при обновлении статуса:", error);
      setUpdateError(error.response?.data?.message || "Не удалось обновить статус");
    } finally {
      setUpdateLoading((prev) => ({ ...prev, [homeworkId]: false }));
    }
  };

  // Фильтрация и поиск
  const filteredHomeworks = useMemo(() => {
    return homeworks.filter((hw) => {
      const matchesCourse = courseFilter === "all" || (hw.lesson?.course?.id && hw.lesson.course.id === Number(courseFilter));
      const matchesStatus = statusFilter === "all" || hw.status === statusFilter;
      const matchesStudent = studentFilter === "all" || (hw.user_id && hw.user_id === Number(studentFilter));
      const matchesSearch =
        !searchQuery ||
        hw.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hw.lesson?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hw.lesson?.course?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        users.find((u) => u.id === hw.user_id)?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        users.find((u) => u.id === hw.user_id)?.email?.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCourse && matchesStatus && matchesStudent && matchesSearch;
    });
  }, [homeworks, courseFilter, statusFilter, studentFilter, searchQuery, users]);

  // Пагинация
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Выход
  const handleLogout = () => {
    dispatch(logoutAction());
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Рендеринг
  if (!token) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", bgcolor: theme.palette.background.default, px: 1.5 }}>
          <Typography sx={{ color: theme.palette.text.primary, fontSize: { xs: "0.875rem", sm: "1rem" } }}>Загрузка...</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ bgcolor: theme.palette.background.default, minHeight: "100vh", overflowX: "hidden", boxSizing: "border-box" }}>
        <TopMenu userInfo={userInfo} handleLogout={handleLogout} />
        <Box sx={{ p: { xs: 1.5, sm: 2 }, maxWidth: "1200px", mx: "auto" }}>
          <Typography variant="h4" sx={{ color: theme.palette.text.primary, mb: 3, fontSize: { xs: "1.5rem", sm: "2rem" } }}>
            Все домашние задания
          </Typography>

          {/* Фильтры и поиск */}
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, mb: 3 }}>
            <FormControl sx={{ minWidth: { xs: "100%", sm: 200 } }}>
              <InputLabel>Курс</InputLabel>
              <Select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                label="Курс"
              >
                <MenuItem value="all">Все курсы</MenuItem>
                {courses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>
                    {course.title}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: { xs: "100%", sm: 200 } }}>
              <InputLabel>Статус</InputLabel>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                label="Статус"
              >
                <MenuItem value="all">Все статусы</MenuItem>
                {STATUS_OPTIONS.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl sx={{ minWidth: { xs: "100%", sm: 200 } }}>
              <InputLabel>Студент</InputLabel>
              <Select
                value={studentFilter}
                onChange={(e) => setStudentFilter(e.target.value)}
                label="Студент"
              >
                <MenuItem value="all">Все студенты</MenuItem>
                {users.map((user) => (
                  <MenuItem key={user.id} value={user.id}>
                    {user.name || user.email || `Студент ${user.id}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Поиск по описанию, уроку или студенту"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flexGrow: 1 }}
            />
          </Box>

          {/* Сообщения об обновлении */}
          {updateError && (
            <Alert severity="error" sx={{ mb: 2, fontSize: { xs: "0.625rem", sm: "0.75rem" } }}>
              {updateError}
            </Alert>
          )}
          {updateSuccess && (
            <Alert severity="success" sx={{ mb: 2, fontSize: { xs: "0.625rem", sm: "0.75rem" } }}>
              {updateSuccess}
            </Alert>
          )}
          {error && (
            <Alert severity="error" sx={{ mb: 2, fontSize: { xs: "0.625rem", sm: "0.75rem" } }}>
              {error}
            </Alert>
          )}
          {isLoading && (
            <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
              <CircularProgress />
            </Box>
          )}

          {/* Таблица заданий */}
          {!isLoading && filteredHomeworks.length === 0 && (
            <Typography sx={{ color: theme.palette.text.secondary, fontSize: { xs: "0.75rem", sm: "0.875rem" }, textAlign: "center" }}>
              Нет домашних заданий, соответствующих фильтрам.
            </Typography>
          )}
          {!isLoading && filteredHomeworks.length > 0 && (
            <Paper elevation={3} sx={{ p: 0, overflow: "hidden" }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Студент</TableCell>
                      <TableCell>Курс</TableCell>
                      <TableCell>Урок</TableCell>
                      <TableCell>Описание</TableCell>
                      <TableCell>Статус</TableCell>
                      <TableCell>Дата отправки</TableCell>
                      <TableCell>Оценка</TableCell>
                      <TableCell>Файлы</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {filteredHomeworks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((hw) => (
                      <TableRow key={hw.homework_id}>
                        <TableCell>
                          {users.find((u) => u.id === hw.user_id)?.name ||
                           users.find((u) => u.id === hw.user_id)?.email ||
                           `Студент ${hw.user_id}`}
                        </TableCell>
                        <TableCell>{hw.lesson?.course?.title || "Неизвестный курс"}</TableCell>
                        <TableCell>{hw.lesson?.title || "Неизвестный урок"}</TableCell>
                        <TableCell sx={{ maxWidth: { xs: 150, sm: 300 }, overflow: "hidden", textOverflow: "ellipsis" }}>
                          {hw.description || "-"}
                        </TableCell>
                        <TableCell>
                          <FormControl sx={{ minWidth: 120 }} size="small">
                            <Select
                              value={hw.status || "not_checked"}
                              onChange={(e) => handleStatusChange(hw.homework_id, e.target.value)}
                              disabled={updateLoading[hw.homework_id]}
                              displayEmpty
                            >
                              {STATUS_OPTIONS.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                  {option.label}
                                </MenuItem>
                              ))}
                            </Select>
                            {updateLoading[hw.homework_id] && <CircularProgress size={16} sx={{ ml: 1 }} />}
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          {hw.created_at ? new Date(hw.created_at).toLocaleString() : "-"}
                        </TableCell>
                        <TableCell>{hw.grade ?? "-"}</TableCell>
                        <TableCell>
                          {hw.files?.length > 0 ? (
                            hw.files.map((file) => (
                              <a
                                key={file.id}
                                href={`${host}/uploads/${file.name}`}
                                download={file.name}
                                style={{ textDecoration: "none" }}
                              >
                                <Button
                                  variant="text"
                                  size="small"
                                  sx={{ fontSize: { xs: "0.625rem", sm: "0.75rem" }, display: "block" }}
                                >
                                  {file.name}
                                </Button>
                              </a>
                            ))
                          ) : (
                            "-"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredHomeworks.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                labelRowsPerPage="Заданий на странице:"
                labelDisplayedRows={({ from, to, count }) => `${from}–${to} из ${count}`}
              />
            </Paper>
          )}
        </Box>
      </Box>
    </ThemeProvider>
  );
}