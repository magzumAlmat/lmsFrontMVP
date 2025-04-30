"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import jwtDecode from "jwt-decode";
import dynamic from "next/dynamic";
import {
  Box,
  Button,
  Paper,
  Tabs,
  Tab,
  Typography,
  List as MuiList,
  ListItem,
  ListItemText,
  LinearProgress,
  useMediaQuery,
  CircularProgress,
  TextField,
  InputLabel,
  Alert,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { getAllCoursesAction, logoutAction } from "../../../store/slices/authSlice";
import TopMenu from "../../../components/topmenu";
import DOMPurify from "dompurify";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Divider from "@mui/material/Divider";

// Динамический импорт Editor.js и инструментов
const EditorJS = dynamic(() => import("@editorjs/editorjs").then((mod) => mod.default), { ssr: false });
const Header = dynamic(() => import("@editorjs/header").then((mod) => mod.default), { ssr: false });
const List = dynamic(() => import("@editorjs/list").then((mod) => mod.default), { ssr: false });

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
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          borderRadius: { xs: "12px", sm: "12px 0 0 12px" },
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          overflowX: "hidden",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
          fontSize: { xs: "0.625rem", sm: "0.75rem" },
          padding: { xs: "6px 8px", sm: "8px 12px" },
          minHeight: { xs: 40, sm: 48 },
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
          maxWidth: "100%",
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: "rgba(0, 158, 176, 0.1)",
          },
          "&.Mui-selected": {
            color: "#009eb0",
            backgroundColor: "rgba(0, 158, 176, 0.15)",
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 6,
          borderRadius: 4,
          backgroundColor: "#e2e8f0",
        },
        bar: {
          backgroundColor: "#009eb0",
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(0, 158, 176, 0.3)",
        },
      },
    },
  },
});

const VideoPlayer = ({ material }) => {
  if (!material || !material.file_path) {
    return <Typography sx={{ color: theme.palette.text.secondary, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Видео недоступно.</Typography>;
  }
  const updatedFilePath = material.file_path;

  return (
    <Box sx={{ width: "50%", maxWidth: "100%", overflow: "hidden" }}>
      <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontSize: { xs: "1rem", sm: "1.125rem" }, mb: 1 }}>
        {material.title}
      </Typography>
      <video controls style={{ width: "100%", maxWidth: "100%", maxHeight: { xs: "300px", sm: "400px" }, borderRadius: "8px" }}>
        <source src={updatedFilePath} type="video/mp4" />
        Ваш браузер не поддерживает воспроизведение видео.
      </video>
    </Box>
  );
};

const getUpdatedFilePath = (filePath) => {
  return filePath;
};

export default function CourseDetail() {
  const host = process.env.NEXT_PUBLIC_HOST;
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [lessons, setLessons] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [activeTab, setActiveTab] = useState(0);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [progresses, setProgresses] = useState([]);
  const [token, setToken] = useState(null);
  const { courses, reduxPriorityConfig } = useSelector((state) => state.auth);
  const [userInfo, setUserInfo] = useState(null);
  const [reviewContent, setReviewContent] = useState({ blocks: [] });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [priorityConfig, setPriorityConfig] = useState(
    reduxPriorityConfig || { EditorJS: 1, Video: 2, AdditionalMaterials: 3 }
  );
  const editorInstance = useRef(null);
  const isMobile = useMediaQuery("(max-width: 600px)");
  // Состояния для домашнего задания
  const [homeworkText, setHomeworkText] = useState("");
  const [homeworkFiles, setHomeworkFiles] = useState([]);
  const [isSubmittingHomework, setIsSubmittingHomework] = useState(false);
  const [homeworkError, setHomeworkError] = useState(null);
  const [homeworkSuccess, setHomeworkSuccess] = useState(false);
  const [existingHomeworks, setExistingHomeworks] = useState([]);

  // Определяем filteredLessons до useEffect
  const filteredLessons = useMemo(() => {
    return lessons.filter((lesson) => lesson.course_id === Number(id));
  }, [lessons, id]);

  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(storedToken);
    if (!storedToken) router.push("/login");
  }, [router]);

  useEffect(() => {
    if (token) {
      fetchLessons();
      fetchMaterials();
      fetchUserInfo();
      dispatch(getAllCoursesAction());
    }
  }, [token, dispatch]);

  const fetchHomeworks = async (userId, lessonId) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/homeworks/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const lessonHomeworks = response.data.filter((hw) => hw.lesson_id === lessonId);
      setExistingHomeworks(lessonHomeworks);
    } catch (error) {
      console.error("Ошибка при загрузке домашних заданий:", error);
      setHomeworkError("Не удалось загрузить существующие домашние задания");
    }
  };

  useEffect(() => {
    if (userInfo && filteredLessons[activeTab]?.id) {
      fetchHomeworks(userInfo.id, filteredLessons[activeTab].id);
    }
  }, [userInfo, activeTab, filteredLessons]);

  const fetchPriorityConfig = async () => {
    try {
      const response = await axios.get(`${host}/api/lessons/${id}/priority`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPriorityConfig(response.data.priority_config);
    } catch (error) {
      console.error("Ошибка при загрузке приоритетов:", error);
      setPriorityConfig(reduxPriorityConfig || { EditorJS: 1, Video: 2, AdditionalMaterials: 3 });
    }
  };

  useEffect(() => {
    if (!token || !lessons.length) return;

    const currentLesson = filteredLessons[activeTab];
    if (!currentLesson?.isReviewLesson) return;

    const initEditor = async () => {
      try {
        const [EditorJS, Header, List] = await Promise.all([
          import("@editorjs/editorjs").then((mod) => mod.default),
          import("@editorjs/header").then((mod) => mod.default),
          import("@editorjs/list").then((mod) => mod.default),
        ]);

        if (editorInstance.current?.destroy) {
          await editorInstance.current.destroy();
        }

        const editor = new EditorJS({
          holder: "review-editor-container",
          tools: {
            header: {
              class: Header,
              config: { levels: [2, 3], defaultLevel: 2, placeholder: "Заголовок отзыва" },
              inlineToolbar: false,
            },
            list: { class: List, inlineToolbar: false },
          },
          placeholder: "Напишите ваш отзыв здесь...",
          data: reviewContent,
          onChange: async () => {
            const savedData = await editor.save();
            setReviewContent(savedData);
          },
          logLevel: "ERROR",
        });

        editorInstance.current = editor;
      } catch (error) {
        console.error("Ошибка инициализации Editor.js для отзыва:", error);
      }
    };

    initEditor();

    return () => {
      if (editorInstance.current?.destroy) {
        editorInstance.current.destroy();
      }
    };
  }, [token, activeTab, filteredLessons, reviewContent]);

  const fetchLessons = async () => {
    try {
      const response = await axios.get(`${host}/api/lessons`, { headers: { Authorization: `Bearer ${token}` } });
      const sortedLessons = response.data.sort((a, b) => a.id - b.id);
      setLessons(sortedLessons);
      await fetchPriorityConfig();
    } catch (error) {
      console.error("Ошибка при загрузке уроков:", error);
      setLessons([]);
    }
  };

  const fetchMaterials = async () => {
    try {
      const response = await axios.get(`${host}/api/materials`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMaterials(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке материалов:", error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${host}/api/auth/getAuthentificatedUserInfo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(response.data);
    } catch (err) {
      console.error("Ошибка при загрузке информации о пользователе:", err);
      if (err.response && err.response.status === 401) router.push("/login");
    }
  };

  const fetchAllProgresses = async (userId, courseId) => {
    try {
      const response = await axios.get(`${host}/api/course/progress/${userId}/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProgresses(response.data.lessons || []);
    } catch (error) {
      console.error("Ошибка при получении прогресса:", error);
    }
  };

  useEffect(() => {
    if (userInfo && token) fetchAllProgresses(userInfo.id, id);
  }, [userInfo, id, token]);

  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => material.lesson_id === filteredLessons[activeTab]?.id);
  }, [materials, filteredLessons, activeTab]);

  const videoMaterials = useMemo(() => {
    return filteredMaterials.filter((material) => material.type === "video");
  }, [filteredMaterials]);

  const renderLessonContent = () => {
    const currentLesson = filteredLessons[activeTab];
    if (!currentLesson) {
      return <Typography sx={{ color: theme.palette.text.secondary, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Нет содержимого для отображения.</Typography>;
    }

    if (currentLesson.isReviewLesson) {
      return (
        <Box sx={{ mt: 2, width: "100%", maxWidth: "100%", overflow: "hidden" }}>
          <Typography variant="h6" sx={{ color: theme.palette.text.primary, mb: 1.5 }}>
            Оставьте ваш отзыв о курсе
          </Typography>
          {userInfo?.review ? (
            <Typography sx={{ color: theme.palette.text.secondary, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
              Ваш отзыв: {JSON.parse(userInfo.review)?.blocks?.map((block) => block.data.text).join(" ") || userInfo.review}
              <br />
              <Typography sx={{ color: theme.palette.primary.main, mt: 1, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                Спасибо за ваш отзыв!
              </Typography>
            </Typography>
          ) : (
            <>
              <div
                id="review-editor-container"
                style={{
                  width: "100%",
                  maxWidth: "100%",
                  minHeight: "150px",
                  border: `1px solid ${theme.palette.divider}`,
                  borderRadius: "4px",
                  padding: { xs: "6px", sm: "8px" },
                  boxSizing: "border-box",
                  overflowX: "hidden",
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleReviewSubmit}
                disabled={isSubmittingReview}
                sx={{ mt: 1.5, width: { xs: "100%", sm: "auto" } }}
                startIcon={isSubmittingReview && <CircularProgress size={16} />}
              >
                Отправить отзыв
              </Button>
            </>
          )}
        </Box>
      );
    }

    if (!filteredLessons.length || !currentLesson.content) {
      return <Typography sx={{ color: theme.palette.text.secondary, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Нет содержимого для отображения.</Typography>;
    }
    try {
      const rawContent = JSON.parse(currentLesson.content);
      const blocks = rawContent.blocks;
      if (!blocks || !Array.isArray(blocks)) {
        throw new Error("Некорректный формат данных: отсутствует массив blocks");
      }
      return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, width: "100%", maxWidth: "100%", overflow: "hidden" }}>
          {blocks.map((block, index) => {
            switch (block.type) {
              case "header":
                return (
                  <Typography
                    key={block.id || index}
                    variant={`h${block.data.level || 2}`}
                    sx={{ color: theme.palette.text.primary, fontWeight: 600, fontSize: { xs: "1rem", sm: "1.25rem" }, lineHeight: 1.3 }}
                  >
                    {DOMPurify.sanitize(block.data.text)}
                  </Typography>
                );
              case "paragraph":
                const sanitizedText = DOMPurify.sanitize(block.data.text);
                return (
                  <Typography
                    key={block.id || index}
                    variant="body1"
                    sx={{ color: theme.palette.text.secondary, lineHeight: 1.6, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                    dangerouslySetInnerHTML={{ __html: sanitizedText }}
                  />
                );
              case "list":
                return (
                  <MuiList
                    key={block.id || index}
                    sx={{
                      color: theme.palette.text.secondary,
                      pl: 3,
                      listStyleType: block.data.style === "ordered" ? "decimal" : "disc",
                      "& li": { display: "list-item" },
                    }}
                  >
                    {block.data.items.map((item, i) => (
                      <ListItem key={i} sx={{ p: 0, mb: 0.3 }}>
                        <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                          {DOMPurify.sanitize(item.content || item)}
                        </Typography>
                      </ListItem>
                    ))}
                  </MuiList>
                );
              case "image":
                return (
                  <Box
                    key={block.id || index}
                    sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 0.5, my: 1.5, width: "100%" }}
                  >
                    <Box
                      component="img"
                      src={block.data.file.url}
                      alt={block.data.caption || "Lesson image"}
                      onError={(e) => (e.target.src = "/fallback-image.jpg")}
                      sx={{
                        width: "100%",
                        maxWidth: { xs: "100%", sm: "600px" },
                        height: "auto",
                        borderRadius: "8px",
                        border: block.data.withBorder ? "2px solid #fff" : "none",
                        backgroundColor: block.data.withBackground ? "#f1f5f9" : "transparent",
                        objectFit: "cover",
                        ...(block.data.stretched && { width: "100%", maxWidth: "none" }),
                      }}
                    />
                    {block.data.caption && (
                      <Typography
                        variant="caption"
                        sx={{ color: theme.palette.text.secondary, fontSize: { xs: "0.625rem", sm: "0.75rem" }, textAlign: "center" }}
                      >
                        {DOMPurify.sanitize(block.data.caption)}
                      </Typography>
                    )}
                  </Box>
                );
              default:
                return (
                  <Typography key={block.id || index} color="warning" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                    Неизвестный тип блока: {block.type}
                  </Typography>
                );
            }
          })}
        </Box>
      );
    } catch (error) {
      console.error("Ошибка при рендеринге содержимого:", error);
      return <Typography color="error" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>Ошибка: {error.message}</Typography>;
    }
  };

  const handleReviewSubmit = async () => {
    if (!editorInstance.current) return;

    try {
      setIsSubmittingReview(true);
      const savedReview = await editorInstance.current.save();
      if (!savedReview.blocks.length) {
        throw new Error("Отзыв не может быть пустым");
      }
      const reviewText = JSON.stringify(savedReview);

      const decoded = jwtDecode(token);
      const response = await axios.post(
        `${host}/api/lessons/review`,
        {
          userId: decoded.id,
          lessonId: filteredLessons[activeTab].id,
          review: reviewText,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        setUserInfo((prev) => ({ ...prev, review: reviewText }));
        alert("Отзыв успешно отправлен!");
      }
    } catch (error) {
      console.error("Ошибка при отправке отзыва:", error);
      alert(error.response?.data?.error || "Ошибка при отправке отзыва");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
    setHomeworkText("");
    setHomeworkFiles([]);
    setHomeworkError(null);
    setHomeworkSuccess(false);
  };

  const isLessonCompleted = (lessonId) => {
    const progress = progresses.find((p) => p.lesson_id === lessonId);
    return progress?.status === "completed";
  };

  const handleCompleteLesson = async (lessonId) => {
    const decoded = jwtDecode(token);
    if (!completedLessons.includes(lessonId)) setCompletedLessons([...completedLessons, lessonId]);
    try {
      await axios.put(
        `${host}/api/progress/update`,
        { user_id: decoded.id, lesson_id: lessonId, progress_percentage: 100 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedProgresses = progresses.map((p) => (p.lesson_id === lessonId ? { ...p, status: "completed" } : p));
      setProgresses(updatedProgresses);
      alert("Урок завершен");
      router.push(`/courses/${id}`);
      window.location.reload();
    } catch (error) {
      console.error("Ошибка при завершении урока:", error);
    }
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    localStorage.removeItem("token");
    router.push("/login");
  };

  const getCompletedLessonsCount = () => progresses.filter((p) => p.status === "completed").length;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => file.type === "application/pdf" && file.size <= 10 * 1024 * 1024);
    if (validFiles.length < files.length) {
      setHomeworkError("Выберите только PDF-файлы размером до 10MB");
    }
    setHomeworkFiles(validFiles);
  };

  const handleHomeworkSubmit = async (e) => {
    e.preventDefault();
    if (!homeworkText.trim()) {
      setHomeworkError("Текст домашнего задания обязателен");
      return;
    }

    setIsSubmittingHomework(true);
    setHomeworkError(null);
    setHomeworkSuccess(false);

    try {
      const decoded = jwtDecode(token);

      const homeworkResponse = await axios.post(
        "http://localhost:4000/api/homeworks",
        {
          user_id: decoded.id,
          lesson_id: filteredLessons[activeTab].id,
          description: homeworkText,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (homeworkResponse.status !== 201) {
        throw new Error("Ошибка при создании домашнего задания");
      }

      const homeworkId = homeworkResponse.data.homework_id;

      if (homeworkFiles.length > 0) {
        const formData = new FormData();
        homeworkFiles.forEach((file) => formData.append("files", file));

        const fileResponse = await axios.post(
          `http://localhost:4000/api/homeworks/${homeworkId}/files`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (fileResponse.status !== 201) {
          throw new Error("Ошибка при загрузке файлов");
        }
      }

      setHomeworkSuccess(true);
      setHomeworkText("");
      setHomeworkFiles([]);
      fetchHomeworks(decoded.id, filteredLessons[activeTab].id);
      alert("Домашнее задание успешно отправлено!");
    } catch (error) {
      console.error("Ошибка при отправке домашнего задания:", error);
      setHomeworkError(error.response?.data?.message || "Ошибка при отправке домашнего задания");
    } finally {
      setIsSubmittingHomework(false);
    }
  };

  const renderHomeworkForm = () => {
    if (filteredLessons[activeTab]?.isReviewLesson || isLessonCompleted(filteredLessons[activeTab]?.id)) {
      return null;
    }

    const currentLessonHomeworks = existingHomeworks.filter((hw) => hw.status !== "graded");

    return (
      <Box sx={{ mt: 3, width: "100%", maxWidth: "100%", overflow: "hidden" }}>
        <Typography variant="h6" sx={{ color: theme.palette.text.primary, mb: 1.5 }}>
          Домашнее задание
        </Typography>

        {currentLessonHomeworks.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle1" sx={{ color: theme.palette.text.primary, mb: 1 }}>
              Отправленные задания:
            </Typography>
            <MuiList>
              {currentLessonHomeworks.map((hw) => (
                <ListItem key={hw.homework_id} sx={{ flexDirection: "column", alignItems: "flex-start", py: 1 }}>
                  <ListItemText
                    primary={`Описание: ${hw.description}`}
                    secondary={`Статус: ${hw.status}${hw.submitted_at ? `, Отправлено: ${new Date(hw.submitted_at).toLocaleString()}` : ""}`}
                    primaryTypographyProps={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                    secondaryTypographyProps={{ fontSize: { xs: "0.625rem", sm: "0.75rem" } }}
                  />
                  {hw.files?.length > 0 && (
                    <Box sx={{ mt: 1 }}>
                      <Typography sx={{ fontSize: { xs: "0.625rem", sm: "0.75rem" }, color: theme.palette.text.secondary }}>
                        Файлы:
                      </Typography>
                      {hw.files.map((file) => (
                        <Button
                          key={file.id}
                          href={file.path}
                          download={file.name}
                          variant="text"
                          size="small"
                          sx={{ fontSize: { xs: "0.625rem", sm: "0.75rem" }, ml: 1 }}
                        >
                          {file.name}
                        </Button>
                      ))}
                    </Box>
                  )}
                </ListItem>
              ))}
            </MuiList>
          </Box>
        )}

        <form onSubmit={handleHomeworkSubmit}>
          <TextField
            label="Текст домашнего задания"
            multiline
            rows={4}
            value={homeworkText}
            onChange={(e) => setHomeworkText(e.target.value)}
            fullWidth
            required
            sx={{ mb: 2 }}
            disabled={isSubmittingHomework}
          />
          <InputLabel sx={{ mb: 1, color: theme.palette.text.primary, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
            Прикрепить PDF-файлы (до 10MB каждый, опционально)
          </InputLabel>
          <input
            type="file"
            accept="application/pdf"
            multiple
            onChange={handleFileChange}
            disabled={isSubmittingHomework}
            style={{ marginBottom: "16px" }}
          />
          {homeworkFiles.length > 0 && (
            <Box sx={{ mb: 1 }}>
              <Typography sx={{ color: theme.palette.text.secondary, fontSize: { xs: "0.625rem", sm: "0.75rem" } }}>
                Выбрано файлов: {homeworkFiles.length}
              </Typography>
              <MuiList dense>
                {homeworkFiles.map((file, index) => (
                  <ListItem key={index}>
                    <ListItemText
                      primary={file.name}
                      secondary={`${(file.size / 1024 / 1024).toFixed(2)} MB`}
                      primaryTypographyProps={{ fontSize: { xs: "0.625rem", sm: "0.875rem" } }}
                      secondaryTypographyProps={{ fontSize: { xs: "0.5rem", sm: "0.625rem" } }}
                    />
                  </ListItem>
                ))}
              </MuiList>
            </Box>
          )}
          {homeworkError && (
            <Alert severity="error" sx={{ mb: 1, fontSize: { xs: "0.625rem", sm: "0.75rem" } }}>
              {homeworkError}
            </Alert>
          )}
          {homeworkSuccess && (
            <Alert severity="success" sx={{ mb: 1, fontSize: { xs: "0.625rem", sm: "0.75rem" } }}>
              Домашнее задание успешно отправлено!
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmittingHomework}
            sx={{ width: { xs: "100%", sm: "180px" }, py: 1 }}
            startIcon={isSubmittingHomework && <CircularProgress size={16} />}
          >
            Отправить домашнее задание
          </Button>
        </form>
      </Box>
    );
  };

  const contentBlocks = useMemo(() => {
    const blocks = [
      {
        priority: priorityConfig.EditorJS,
        component: (
          <Box sx={{ mb: 2, width: "100%", maxWidth: "100%", overflow: "hidden" }} key="editorjs">
            {renderLessonContent()}
          </Box>
        ),
      },
    ];

    if (!filteredLessons[activeTab]?.isReviewLesson) {
      blocks.push({
        priority: priorityConfig.Video,
        component: (
          <Box key="video" sx={{ width: "100%", maxWidth: "100%", overflow: "hidden" }}>
            <Typography variant="h5" sx={{ color: theme.palette.text.primary, fontSize: { xs: "1rem", sm: "1.25rem" }, mb: 1.5 }}>
              Видео-материалы:
            </Typography>
            {videoMaterials.length > 0 ? (
              videoMaterials.map((material) => (
                <Box key={material.material_id} sx={{ mb: 2 }}>
                  <VideoPlayer material={material} />
                </Box>
              ))
            ) : (
              <Typography sx={{ color: theme.palette.text.secondary, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                Нет доступных видео.
              </Typography>
            )}
          </Box>
        ),
      });
      blocks.push({
        priority: priorityConfig.AdditionalMaterials,
        component: (
          <Box key="materials" sx={{ width: "100%", maxWidth: "100%", overflow: "hidden" }}>
            <Typography variant="h5" sx={{ color: theme.palette.text.primary, fontSize: { xs: "1rem", sm: "1.25rem" }, mt: 3, mb: 1.5 }}>
              Дополнительные материалы:
            </Typography>
            {filteredMaterials.length > 0 ? (
              <MuiList sx={{ p: 0 }}>
                {filteredMaterials.map((material) => {
                  const updatedFilePath = material.file_path ? getUpdatedFilePath(material.file_path) : null;
                  return (
                    <ListItem
                      key={material.material_id}
                      sx={{
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: { xs: "flex-start", sm: "center" },
                        py: 1,
                        px: 0,
                      }}
                    >
                      <ListItemText
                        primary={material.title}
                        primaryTypographyProps={{
                          color: theme.palette.text.primary,
                          fontSize: { xs: "0.75rem", sm: "0.875rem" },
                        }}
                        secondaryTypographyProps={{
                          color: theme.palette.text.secondary,
                          fontSize: { xs: "0.625rem", sm: "0.75rem" },
                        }}
                      />
                      {material.type === "test" ? (
                        updatedFilePath ? (
                          <a
                            href={updatedFilePath}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none", marginTop: { xs: 0.5, sm: 0 }, width: { xs: "100%", sm: "auto" } }}
                          >
                            <Button
                              variant="outlined"
                              color="secondary"
                              size="small"
                              sx={{ ml: { xs: 0, sm: 1.5 }, fontSize: { xs: "0.625rem", sm: "0.75rem" }, width: { xs: "100%", sm: "auto" } }}
                            >
                              Перейти к тесту
                            </Button>
                          </a>
                        ) : (
                          <Typography
                            sx={{ color: theme.palette.text.secondary, ml: { xs: 0, sm: 1.5 }, mt: { xs: 0.5, sm: 0 }, fontSize: { xs: "0.625rem", sm: "0.75rem" } }}
                          >
                            Ссылка недоступна
                          </Typography>
                        )
                      ) : (
                        updatedFilePath ? (
                          <Button
                            href={updatedFilePath}
                            download={material.title || "file"}
                            variant="outlined"
                            color="secondary"
                            size="small"
                            sx={{ ml: { xs: 0, sm: 1.5 }, mt: { xs: 0.5, sm: 0 }, fontSize: { xs: "0.625rem", sm: "0.75rem" }, width: { xs: "100%", sm: "auto" } }}
                          >
                            Скачать
                          </Button>
                        ) : (
                          <Typography
                            sx={{ color: theme.palette.text.secondary, ml: { xs: 0, sm: 1.5 }, mt: { xs: 0.5, sm: 0 }, fontSize: { xs: "0.625rem", sm: "0.75rem" } }}
                          >
                            Файл недоступен
                          </Typography>
                        )
                      )}
                    </ListItem>
                  );
                })}
              </MuiList>
            ) : (
              <Typography sx={{ color: theme.palette.text.secondary, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
                Нет доступных материалов.
              </Typography>
            )}
          </Box>
        ),
      });
      blocks.push({
        priority: priorityConfig.AdditionalMaterials + 1,
        component: renderHomeworkForm(),
      });
    }

    return blocks.sort((a, b) => a.priority - b.priority).filter((block) => block.component);
  }, [priorityConfig, filteredLessons, activeTab, renderLessonContent, videoMaterials, filteredMaterials, theme, userInfo, isSubmittingReview, existingHomeworks, homeworkText, homeworkFiles, homeworkError, homeworkSuccess, isSubmittingHomework]);

  if (!token) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", bgcolor: theme.palette.background.default, px: 1.5 }}>
          <Typography sx={{ color: theme.palette.text.primary, fontSize: { xs: "0.875rem", sm: "1rem" } }}>Loading...</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  if (!filteredLessons || filteredLessons.length === 0) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ p: { xs: 1.5, sm: 2 }, textAlign: "center", bgcolor: theme.palette.background.default, minHeight: "100vh" }}>
          <TopMenu userInfo={userInfo} handleLogout={handleLogout} />
          <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontSize: { xs: "1rem", sm: "1.25rem" } }}>
            Нет доступных уроков.
          </Typography>
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          bgcolor: theme.palette.background.default,
          minHeight: "100vh",
          overflowX: "hidden",
          boxSizing: "border-box",
        }}
      >
        <TopMenu userInfo={userInfo} handleLogout={handleLogout} />
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, minHeight: "calc(100vh - 64px)", p: { xs: 1.5, sm: 2 } }}>
          <Tabs
            orientation={isMobile ? "horizontal" : "vertical"}
            variant="scrollable"
            value={activeTab}
            onChange={handleChangeTab}
            aria-label="Уроки курса"
            sx={{
              borderBottom: isMobile ? 1 : 0,
              borderRight: isMobile ? 0 : 1,
              borderColor: "divider",
              width: { xs: "100%", sm: "240px" },
              bgcolor: theme.palette.background.paper,
              maxHeight: { xs: "auto", sm: "calc(100vh - 64px)" },
              overflowY: "auto",
              overflowX: "hidden",
              flexShrink: 0,
              mb: { xs: 1.5, sm: 0 },
              boxSizing: "border-box",
            }}
          >
            {filteredLessons.map((lesson, index) => (
              <Tab
                key={lesson.id}
                label={lesson.title}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: { xs: "0.625rem", sm: "0.75rem" },
                  color: theme.palette.text.secondary,
                  "&.Mui-selected": { color: theme.palette.primary.main, bgcolor: "rgba(0, 158, 176, 0.15)" },
                  minHeight: { xs: 40, sm: 48 },
                  px: { xs: 1.5, sm: 2 },
                  py: 1,
                }}
              />
            ))}
          </Tabs>

          <Box sx={{ flexGrow: 5, width: "100%", maxWidth: "100%", boxSizing: "border-box", mr: { xs: 0, sm: 3 } }}>
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 5.5 }, bgcolor: theme.palette.background.paper, width: "90%", maxWidth: "100%", overflow: "hidden" }}>
              <LinearProgress
                variant="determinate"
                value={(getCompletedLessonsCount() / filteredLessons.length) * 100 || 0}
                sx={{ mb: 1.5 }}
              />
              <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary, fontSize: { xs: "0.625rem", sm: "0.75rem" }, mb: 1.5 }}>
                Пройдено {getCompletedLessonsCount()} из {filteredLessons.length} уроков
              </Typography>

              <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontSize: { xs: "1rem", sm: "1.25rem" }, mb: 1.5 }}>
                {filteredLessons[activeTab].title}
              </Typography>

              {filteredLessons[activeTab].image && (
                <Box
                  component="img"
                  src={filteredLessons[activeTab].image}
                  alt={`Lesson ${activeTab + 1}`}
                  sx={{ width: "100%", maxWidth: "100%", height: "auto", maxHeight: { xs: "200px", sm: "300px" }, objectFit: "cover", borderRadius: "8px", mb: 1.5 }}
                />
              )}

              {contentBlocks.map((block) => block.component)}

              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "flex-end", gap: 1.5, mt: 2 }}>
                <Button
                  variant="contained"
                  color={isLessonCompleted(filteredLessons[activeTab]?.id) ? "success" : "primary"}
                  onClick={() => handleCompleteLesson(filteredLessons[activeTab]?.id)}
                  disabled={isLessonCompleted(filteredLessons[activeTab]?.id)}
                  sx={{ width: { xs: "100%", sm: "180px" }, py: 1, fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
                >
                  {isLessonCompleted(filteredLessons[activeTab]?.id) ? "Урок завершен" : "Завершить урок"}
                </Button>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}