"use client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import jwtDecode from "jwt-decode";

import TopMenu from "../../components/topmenu";
import { logoutAction } from "../../store/slices/authSlice";
import { useRouter } from "next/navigation";

export default function CoursesPage() {
  const [userInfo, setUserInfo] = useState(null);
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [editingCourse, setEditingCourse] = useState(null);
  const [token, setToken] = useState(null); // Инициализируем token как null
  const host = process.env.NEXT_PUBLIC_HOST;
  const dispatch = useDispatch();
  const router = useRouter();

  // Получаем token только на клиенте
  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(storedToken);

    if (!storedToken) {
      console.error("Token not available");
      router.push("/login");
      return;
    }

    try {
      const decodedToken = jwtDecode(storedToken);
      console.log("Decoded token:", decodedToken.username);
    } catch (error) {
      console.error("Invalid token:", error);
      router.push("/login");
    }
  }, [router]);

  // Загружаем данные после получения token
  useEffect(() => {
    if (token) {
      fetchCourses();
      fetchUserInfo();
    }
  }, [token]);

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

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${host}/api/courses`);
      setCourses(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке курсов:", error);
    }
  };

  const createCourse = async () => {
    try {
      const response = await axios.post(
        `${host}/api/courses`,
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setCourses([...courses, response.data]);
      setTitle("");
      setDescription("");
      alert("Курс успешно создан!");
    } catch (error) {
      console.error("Ошибка при создании курса:", error);
      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) alert("Ошибка: Необходимо авторизоваться.");
        else if (status === 403) alert("Ошибка: У вас нет прав для создания курса.");
        else if (status === 400) alert(`Ошибка: ${data.message || "Некорректные данные."}`);
        else alert("Произошла ошибка. Попробуйте позже.");
      } else {
        alert("Не удалось подключиться к серверу. Проверьте соединение.");
      }
    }
  };

  const updateCourse = async (id) => {
    try {
      const response = await axios.put(
        `${host}/api/courses/${id}`,
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setCourses(courses.map((course) => (course.id === id ? response.data : course)));
      setEditingCourse(null);
      setTitle("");
      setDescription("");
    } catch (error) {
      console.error("Ошибка при обновлении курса:", error);
    }
  };

  const deleteCourse = async (id) => {
    try {
      await axios.delete(`${host}/api/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCourses(courses.filter((course) => course.id !== id));
    } catch (error) {
      console.error("Ошибка при удалении курса:", error);
    }
  };

  const handleLogout = () => {
    console.log("HandleLogout called");
    dispatch(logoutAction());
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Пока token не загружен, можно показать загрузку или редирект
  if (!token) {
    return (
      <Typography variant="h6" sx={{ textAlign: "center", mt: 4 }}>
        Загрузка...
      </Typography>
    );
  }

  return (
    <>
      <TopMenu handleLogout={handleLogout} userInfo={userInfo} />
      <Container maxWidth="md">
        <Typography variant="h4" sx={{ mt: 4, mb: 2, textAlign: "center" }}>
          Управление курсами
        </Typography>

        {/* Форма добавления/редактирования */}
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6">
            {editingCourse ? "Редактировать курс" : "Создать новый курс"}
          </Typography>
          <TextField
            fullWidth
            label="Название курса"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Описание курса"
            multiline
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            sx={{ mt: 2 }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            onClick={editingCourse ? () => updateCourse(editingCourse) : createCourse}
          >
            {editingCourse ? "Обновить курс" : "Добавить курс"}
          </Button>
        </Paper>

        {/* Список курсов */}
        <List>
          {courses.map((course) => (
            <Paper key={course.id} elevation={3} sx={{ mb: 2 }}>
              <ListItem>
                <ListItemText primary={course.title} secondary={course.description} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    color="primary"
                    onClick={() => {
                      setEditingCourse(course.id);
                      setTitle(course.title);
                      setDescription(course.description);
                    }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    color="error"
                    onClick={() => deleteCourse(course.id)}
                  >
                    <Delete />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            </Paper>
          ))}
        </List>
      </Container>
    </>
  );
}