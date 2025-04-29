"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import {
  Box,
  Typography,
  List as MuiList,
  ListItem,
  ListItemText,
  CircularProgress,
  Checkbox,
  FormControlLabel,
  Button,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { getAllCoursesAction, logoutAction } from "../../../store/slices/authSlice";
import TopMenu from "../../../components/topmenu";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function ProgressDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const token = localStorage.getItem("token");
  const [userInfo, setUserInfo] = useState(null);
  const [user, setUser] = useState(null);
  const [progressData, setProgressData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTestPassed, setIsTestPassed] = useState(false);
  const [streams, setStreams] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [allTeachers, setAllTeachers] = useState([]);
  const { courses } = useSelector((state) => state.auth);
  const host = process.env.NEXT_PUBLIC_HOST;

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }

    const fetchInitialData = async () => {
      setLoading(true);
      try {
        const userResponse = await axios.get(`${host}/api/getallusers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const foundUser = userResponse.data.users.find((u) => u.id === Number(id));
        if (!foundUser) {
          throw new Error("Пользователь не найден");
        }
        setUser(foundUser);

        try{

        const streamsResponse = await axios.get(`${host}/api/streams`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStreams(streamsResponse.data.streams || []);

      } catch (streamErr) {
        console.warn("Предупреждение при загрузке потоков:", streamErr.message);
        // Если 404 или "Потоки не найдены", считаем это нормальным случаем
        if (streamErr.response && streamErr.response.status === 404) {
           setStreams([]);
        } else {
          throw streamErr; // Пробрасываем другие ошибки
        }
      }


        const coursesResponse = await axios.get(`${host}/api/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllCourses(coursesResponse.data.courses || []);

        const teachersResponse = await axios.get(`${host}/api/getallusers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllTeachers(teachersResponse.data.users.filter((u) => u.roleId === 2) || []);

        await dispatch(getAllCoursesAction());
        
      } catch (err) {
        console.error("Ошибка при загрузке данных:", err);
        setError("Не удалось загрузить данные пользователя или курсы");
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [dispatch, token, id, router]);

  useEffect(() => {
    if (user && courses.length) {
      const fetchProgress = async () => {
        setLoading(true);
        setError(null);
        const progressMap = {};

        try {
          const progressPromises = courses.map((course) =>
            axios
              .get(`${host}/api/course/progress/${user.id}/${course.id}`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .then((response) => ({
                courseId: course.id,
                data: response.data,
              }))
              .catch(() => ({
                courseId: course.id,
                data: { lessons: [], course_progress: 0 },
              }))
          );

          const results = await Promise.all(progressPromises);
          results.forEach(({ courseId, data }) => {
            progressMap[courseId] = data.course_progress;
          });

          setProgressData(progressMap);

          const hasFinished = results.some(({ data }) =>
            data.lessons.some((lesson) => lesson.isfinished === "yes")
          );
          setIsTestPassed(hasFinished);
        } catch (err) {
          console.error("Ошибка при загрузке прогресса:", err);
          setError("Ошибка при загрузке данных прогресса");
        } finally {
          setLoading(false);
        }
      };

      fetchProgress();
      fetchUserInfo();
    }
  }, [user, courses, token]);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${host}/api/auth/getAuthentificatedUserInfo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке информации о пользователе:", error);
      if (error.response && error.response.status === 401) {
        router.push("/login");
      }
    }
  };

  const handleCheckboxChange = async (event) => {
    const checked = event.target.checked;
    setIsTestPassed(checked);

    try {
      await axios.put(
        `${host}/api/course/progress/update-finished/${user.id}`,
        { isfinished: checked ? "yes" : "no" },
        {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Ошибка при обновлении isfinished:", error);
      setError("Не удалось обновить статус теста");
    }
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    localStorage.removeItem("token");
    router.push("/login");
  };

  const isProgressSufficient = () => {
    // Вычисляем средний прогресс по всем курсам
    const totalProgress = Object.values(progressData).reduce((acc, progress) => acc + progress, 0);
    const averageProgress = courses.length > 0 ? totalProgress / courses.length : 0;
    return averageProgress === 100; // Чекбокс активен только при 100% прогрессе
  };

  const handleGenerateReport = async () => {
    console.log("All Courses:", allCourses, "courses-", courses);
    try {
      setLoading(true);

      const allUsersResponse = await axios.get(`${host}/api/getallusers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const allUsers = allUsersResponse.data.users.filter((u) => u.roleId === 3);

      const reportData = await Promise.all(
        allUsers.map(async (u) => {
          const progressPromises = courses.map((course) =>
            axios
              .get(`${host}/api/course/progress/${u.id}/${course.id}`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .then((response) => ({
                courseId: course.id,
                data: response.data,
              }))
              .catch(() => ({
                courseId: course.id,
                data: { lessons: [], course_progress: 0 },
              }))
          );

          const progressResults = await Promise.all(progressPromises);
          const userProgress = progressResults.reduce((acc, { data }) => acc + data.course_progress, 0) / courses.length || 0;
          const isFinished = progressResults.some(({ data }) =>
            data.lessons.some((lesson) => lesson.isfinished === "yes")
          );

          let userStreamInfo = "Не состоит в потоке";
          for (const stream of streams) {
            try {
              const studentsResponse = await axios.get(`${host}/api/streams/getstudentsbystreamid/${stream.id}`, {
                headers: { Authorization: `Bearer ${token}` },
              });
              if (studentsResponse.data.students.some((student) => student.id === u.id)) {
                const course = courses.find((c) => c.id === stream.courseId);
                const teacher = allTeachers.find((t) => t.id === stream.teacherId);
                userStreamInfo = `${stream.name} | Начало: ${new Date(stream.startDate).toLocaleDateString()} | Конец: ${new Date(stream.endDate).toLocaleDateString()} | Стоимость: ${stream.cost} | Макс. студентов: ${stream.maxStudents} | Курс: ${course?.title || "Не указан"} | Учитель: ${teacher ? `${teacher.name ?? ""} ${teacher.lastname ?? ""}` : "Не указан"}`;
                break;
              }
            } catch (streamErr) {
              console.error(`Ошибка при загрузке студентов для потока ${stream.id}:`, streamErr);
            }
          }

          return {
            "User": `${u.name ?? ""} ${u.lastname ?? ""} (${u.email})`,
            "Progress": `${userProgress.toFixed(2)}%`,
            "Progress isfinished": isFinished ? "yes" : "no",
            "areasofactivity": u.areasofactivity || "Не указано",
            "Поток в котором он состоит": userStreamInfo,
          };
        })
      );

      const totalUsers = reportData.length;
      const finishedUsers = reportData.filter((data) => data["Progress isfinished"] === "yes").length;
      const finishedPercentage = totalUsers > 0 ? (finishedUsers / totalUsers * 100).toFixed(2) : 0;

      reportData.push({
        "User": "Итого",
        "Progress": "",
        "Progress isfinished": `${finishedPercentage}% студентов с isfinished = yes`,
        "areasofactivity": "",
        "Поток в котором он состоит": "",
      });

      const worksheet = XLSX.utils.json_to_sheet(reportData);
      worksheet["!cols"] = [
        { wch: 30 },
        { wch: 10 },
        { wch: 20 },
        { wch: 20 },
        { wch: 80 },
      ];
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(blob, `Student_Progress_Report_${new Date().toISOString().split("T")[0]}.xlsx`);
    } catch (err) {
      console.error("Ошибка при формировании отчета:", err);
      setError("Не удалось сформировать отчет");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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

  if (!user) {
    return (
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
        <Typography>Пользователь не найден</Typography>
      </Box>
    );
  }

  return (
    <>
      <TopMenu handleLogout={handleLogout} userInfo={userInfo} />
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Прогресс пользователя: {user.name} {user.lastname} ({user.email})
        </Typography>
        <MuiList>
          {courses.map((course) => (
            <ListItem key={course.id}>
              <ListItemText
                primary={course.title}
                secondary={`Прогресс: ${progressData[course.id] ?? 0}%`}
              />
            </ListItem>
          ))}
        </MuiList>
        <FormControlLabel
          control={
            <Checkbox
              checked={isTestPassed}
              onChange={handleCheckboxChange}
              color="primary"
              disabled={!isProgressSufficient()}
            />
          }
          label="Пройден ли тест на сайте Building Smart?"
        />
        <br />
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          onClick={handleGenerateReport}
          disabled={loading}
        >
          {loading ? "Формирование..." : "Сформировать отчет"}
        </Button>
      </Box>
    </>
  );
}