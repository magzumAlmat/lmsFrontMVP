"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

const ProgressPage = () => {
  const [progresses, setProgresses] = useState([]);
  const [userId, setUserId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [lessonId, setLessonId] = useState("");
  const [progressPercentage, setProgressPercentage] = useState(0);
  const [courseProgress, setCourseProgress] = useState(null);

  // Инициализация прогресса при монтировании компонента
  useEffect(() => {
    initializeProgress();
  }, []);

  // Функция для инициализации прогресса
  const initializeProgress = async () => {
    try {
      const response = await axios.post(`${host}/course/enroll`, {
        userId,
        courseId,
      });
      console.log("Initial progress created:", response.data);
      fetchAllProgresses(userId); // Обновляем список прогресса после инициализации
    } catch (error) {
      console.error("Error initializing progress:", error);
    }
  };

  // Получение всех записей о прогрессе пользователя
  const fetchAllProgresses = async (userId) => {
    try {
      const response = await axios.get(`${host}/progress/all/${userId}`);
      setProgresses(response.data);
    } catch (error) {
      console.error("Error fetching progresses:", error);
    }
  };

  // Создание новой записи о прогрессе
  const createProgress = async () => {
    try {
      const response = await axios.post(`${host}/progresses`, {
        status: "in_progress",
        completed_at: null,
        user_id: userId,
        lesson_id: lessonId,
      });
      console.log("Progress created:", response.data);
      fetchAllProgresses(userId); // Обновляем список прогресса
    } catch (error) {
      console.error("Error creating progress:", error);
    }
  };

  // Обновление прогресса урока
  const updateLessonProgress = async () => {
    try {
      const response = await axios.put(`${host}/progress/update`, {
        user_id: userId,
        lesson_id: lessonId,
        progress_percentage: progressPercentage,
      });
      console.log("Progress updated:", response.data);
      fetchAllProgresses(userId); // Обновляем список прогресса
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  // Удаление записи о прогрессе
  const deleteProgress = async (id) => {
    try {
      await axios.delete(`${host}/progresses/${id}`);
      console.log("Progress deleted");
      fetchAllProgresses(userId); // Обновляем список прогресса
    } catch (error) {
      console.error("Error deleting progress:", error);
    }
  };

  // Получение прогресса курса
  const fetchCourseProgress = async () => {
    try {
      const response = await axios.get(`${host}/course/progress/${userId}/${courseId}`);
      setCourseProgress(response.data);
      console.log("Course progress fetched:", response.data);
    } catch (error) {
      console.error("Error fetching course progress:", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Управление прогрессом
      </Typography>

      {/* Форма для инициализации прогресса */}
      <div>
        <Typography variant="h6">Инициализация прогресса</Typography>
        <TextField
          label="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Course ID"
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" onClick={initializeProgress}>
          Инициализировать прогресс
        </Button>
      </div>

      <Divider sx={{ my: 4 }} />

      {/* Форма для создания прогресса */}
      <div>
        <Typography variant="h6">Создать прогресс</Typography>
        <TextField
          label="Lesson ID"
          value={lessonId}
          onChange={(e) => setLessonId(e.target.value)}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" onClick={createProgress}>
          Создать прогресс
        </Button>
      </div>

      <Divider sx={{ my: 4 }} />

      {/* Форма для обновления прогресса */}
      <div>
        <Typography variant="h6">Обновить прогресс</Typography>
        <TextField
          label="Progress Percentage"
          type="number"
          value={progressPercentage}
          onChange={(e) => setProgressPercentage(Number(e.target.value))}
          fullWidth
          margin="normal"
        />
        <Button variant="contained" onClick={updateLessonProgress}>
          Обновить прогресс
        </Button>
      </div>

      <Divider sx={{ my: 4 }} />

      {/* Форма для получения прогресса курса */}
      <div>
        <Typography variant="h6">Получить прогресс курса</Typography>
        <Button variant="contained" onClick={fetchCourseProgress}>
          Получить прогресс курса
        </Button>
        {courseProgress && (
          <div>
            <Typography>Прогресс курса: {courseProgress.course_progress}%</Typography>
            <List>
              {courseProgress.lessons.map((lesson, index) => (
                <ListItem key={index}>
                  <ListItemText
                    primary={`Урок: ${lesson.title}`}
                    secondary={`Статус: ${lesson.status}`}
                  />
                </ListItem>
              ))}
            </List>
          </div>
        )}
      </div>

      <Divider sx={{ my: 4 }} />

      {/* Список всех записей о прогрессе */}
      <div>
        <Typography variant="h6">Все записи о прогрессе</Typography>
        <List>
          {progresses.map((progress, index) => (
            <ListItem key={index}>
              <ListItemText
                primary={`Урок ID: ${progress.lesson_id}`}
                secondary={`Статус: ${progress.status}`}
              />
              <Button
                variant="outlined"
                color="error"
                onClick={() => deleteProgress(progress.id)}
              >
                Удалить
              </Button>
            </ListItem>
          ))}
        </List>
      </div>
    </Container>
  );
};

export default ProgressPage;