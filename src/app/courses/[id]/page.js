"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import jwtDecode from "jwt-decode";
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
  Divider,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { getAllCoursesAction, logoutAction } from "../../../store/slices/authSlice";
import TopMenu from "../../../components/topmenu";
import DOMPurify from "dompurify";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Header from "@editorjs/header";
import List from "@editorjs/list";

const theme = createTheme({
  palette: {
    primary: { main: "#009eb0", contrastText: "#fff" },
    secondary: { main: "#009eb0" },
    background: { default: "#1f2937", paper: "#1c1c1b" },
    text: { primary: "#fff", secondary: "#d1d5db" },
  },
  typography: {
    fontFamily: "'Open Sans', sans-serif",
    h4: { fontWeight: 600 },
    h6: { fontWeight: 500 },
    body2: { fontWeight: 400 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", borderRadius: "8px", padding: "8px 16px", transition: "all 0.2s ease-in-out" },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
          transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          "&:hover": { transform: "translateY(-4px)", boxShadow: "0 6px 20px rgba(16, 185, 129, 0.3)" },
        },
      },
    },
  },
});

const VideoPlayer = ({ material }) => {
  console.log("Materials from player ", material);
  if (!material || !material.file_path) {
    return <Typography sx={{ color: theme.palette.text.secondary, fontSize: "1rem" }}>Видео недоступно.</Typography>;
  }
  const updatedFilePath = material.file_path.replace(":4000", "");
  return (
    <Box>
      <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontSize: { xs: "1.125rem", sm: "1.25rem" }, mb: 1 }}>
        {material.title}
      </Typography>
      <video controls style={{ width: "100%", maxHeight: "400px", borderRadius: "8px" }}>
        <source src={updatedFilePath} type="video/mp4" />
        Ваш браузер не поддерживает воспроизведение видео.
      </video>
    </Box>
  );
};

const getUpdatedFilePath = (filePath) => {
  console.log("getUpdatedFilePath started", filePath);
  return filePath.replace(":4000", "");
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
  const { courses } = useSelector((state) => state.auth);
  const [userInfo, setUserInfo] = useState(null);
  const isMobile = useMediaQuery("(max-width: 600px)");

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

  const fetchLessons = async () => {
    try {
      const response = await axios.get(`${host}/api/lessons`, { headers: { Authorization: `Bearer ${token}` } });
      const sortedLessons = response.data.sort((a, b) => a.id - b.id);
      setLessons(sortedLessons);
    } catch (error) {
      console.error("Ошибка при загрузке уроков:", error);
      setLessons([]);
    }
  };

  const fetchMaterials = async () => {
    try {
      const response = await axios.get(`https://lms.kazniisa.kz/api/materials`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMaterials(response.data);
      console.log("Вывод= ", response.data);
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

  const filteredLessons = lessons.filter((lesson) => lesson.course_id === Number(id));

  const renderLessonContent = () => {
    if (!filteredLessons.length || !filteredLessons[activeTab]?.content) {
      return <Typography sx={{ color: theme.palette.text.secondary, fontSize: "1rem" }}>Нет содержимого для отображения.</Typography>;
    }
    try {
      const rawContent = JSON.parse(filteredLessons[activeTab].content);
      console.log(rawContent);
      const blocks = rawContent.blocks;
      if (!blocks || !Array.isArray(blocks)) {
        throw new Error("Некорректный формат данных: отсутствует массив blocks");
      }
      return (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {blocks.map((block, index) => {
            switch (block.type) {
              case "header":
                return (
                  <Typography
                    key={block.id || index}
                    variant={`h${block.data.level || 2}`}
                    sx={{ color: theme.palette.text.primary, fontWeight: 600, fontSize: { xs: "1.25rem", sm: "1.5rem" }, lineHeight: 1.3 }}
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
                    sx={{ color: theme.palette.text.secondary, lineHeight: 1.8, fontSize: { xs: "0.875rem", sm: "1rem" } }}
                    dangerouslySetInnerHTML={{ __html: sanitizedText }}
                  />
                );
              case "list":
                return (
                  <MuiList
                    key={block.id || index}
                    sx={{
                      color: theme.palette.text.secondary,
                      pl: 4,
                      listStyleType: block.data.style === "ordered" ? "decimal" : "disc",
                      "& li": { display: "list-item" },
                    }}
                  >
                    {block.data.items.map((item, i) => (
                      <ListItem key={i} sx={{ p: 0, mb: 0.5 }}>
                        <Typography variant="body1" sx={{ color: theme.palette.text.secondary, fontSize: { xs: "0.875rem", sm: "1rem" } }}>
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
                    sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, my: 2 }}
                  >
                    <Box
                      component="img"
                      src={block.data.file.url}
                      alt={block.data.caption || "Lesson image"}
                      onError={(e) => (e.target.src = "/fallback-image.jpg")}
                      sx={{
                        width: "100%",
                        maxWidth: "600px",
                        height: "auto",
                        borderRadius: "8px",
                        border: block.data.withBorder ? "2px solid #fff" : "none",
                        backgroundColor: block.data.withBackground ? "#2d3748" : "transparent",
                        objectFit: "cover",
                        ...(block.data.stretched && { width: "100%", maxWidth: "none" }),
                      }}
                    />
                    {block.data.caption && (
                      <Typography
                        variant="caption"
                        sx={{ color: theme.palette.text.secondary, fontSize: { xs: "0.75rem", sm: "0.875rem" }, textAlign: "center" }}
                      >
                        {DOMPurify.sanitize(block.data.caption)}
                      </Typography>
                    )}
                  </Box>
                );
              default:
                return (
                  <Typography key={block.id || index} color="warning" sx={{ fontSize: "1rem" }}>
                    Неизвестный тип блока: {block.type}
                  </Typography>
                );
            }
          })}
        </Box>
      );
    } catch (error) {
      console.error("Ошибка при рендеринге содержимого:", error);
      return <Typography color="error" sx={{ fontSize: "1rem" }}>Ошибка: {error.message}</Typography>;
    }
  };

  const handleChangeTab = (event, newValue) => setActiveTab(newValue);

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

  if (!token) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", bgcolor: theme.palette.background.default }}>
          <Typography sx={{ color: theme.palette.text.primary, fontSize: "1.25rem" }}>Loading...</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  const filteredMaterials = materials.filter((material) => material.lesson_id === filteredLessons[activeTab]?.id);
  const videoMaterials = filteredMaterials.filter((material) => material.type === "video");

  const getCompletedLessonsCount = () => progresses.filter((p) => p.status === "completed").length;

  if (!filteredLessons || filteredLessons.length === 0) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ p: 3, textAlign: "center", bgcolor: theme.palette.background.default, minHeight: "100vh" }}>
          <TopMenu userInfo={userInfo} handleLogout={handleLogout} />
          <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontSize: "1.5rem" }}>Нет доступных уроков.</Typography>
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
          backgroundImage: `url(/background.jpg)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <TopMenu userInfo={userInfo} handleLogout={handleLogout} />
        <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, minHeight: "calc(100vh - 64px)", p: { xs: 2, sm: 3 } }}>
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
              width: { xs: "100%", sm: "280px" },
              bgcolor: theme.palette.background.paper,
              maxHeight: { xs: "auto", sm: "calc(100vh - 64px)" },
              overflowY: "auto",
              flexShrink: 0,
            }}
          >
            {filteredLessons.map((lesson, index) => (
              <Tab
                key={lesson.id}
                label={lesson.title}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  fontSize: { xs: "0.875rem", sm: "1rem" },
                  color: theme.palette.text.secondary,
                  "&.Mui-selected": { color: theme.palette.primary.main, bgcolor: "rgba(16, 185, 129, 0.1)" },
                  minHeight: { xs: 48, sm: 60 },
                  px: 3,
                  py: 1.5,
                }}
              />
            ))}
          </Tabs>

          <Box sx={{ flexGrow: 1, p: {} }} style={{ padding: "0 1px" }}>
            <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, bgcolor: theme.palette.background.paper, width: "auto" }}>
              <LinearProgress
                variant="determinate"
                value={(getCompletedLessonsCount() / filteredLessons.length) * 100 || 0}
                sx={{ mb: 2, height: 8, borderRadius: 4, bgcolor: "#4b5563", "& .MuiLinearProgress-bar": { bgcolor: theme.palette.primary.main } }}
              />
              <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary, fontSize: { xs: "0.875rem", sm: "1rem" }, mb: 3 }}>
                Пройдено {getCompletedLessonsCount()} из {filteredLessons.length} уроков
              </Typography>

              <Typography variant="h6" sx={{ color: theme.palette.text.primary, fontSize: { xs: "1.5rem", sm: "1.75rem" }, mb: 3 }}>
                {filteredLessons[activeTab].title}
              </Typography>

              {filteredLessons[activeTab].image && (
                <Box
                  component="img"
                  src={filteredLessons[activeTab].image}
                  alt={`Lesson ${activeTab + 1}`}
                  sx={{ width: "100%", height: { xs: "200px", sm: "350px" }, objectFit: "cover", borderRadius: "8px", mb: 3 }}
                />
              )}

              <Box
                sx={{
                  minHeight: "250px",
                  border: `1px solid ${theme.palette.divider}`,
                  p: 2,
                  borderRadius: "8px",
                  bgcolor: "#2d3748",
                  mb: 3,
                }}
              >
                {renderLessonContent()}
              </Box>
              <Divider sx={{ my: 3, bgcolor: theme.palette.divider }} />

              <Typography variant="h5" sx={{ color: theme.palette.text.primary, fontSize: { xs: "1.25rem", sm: "1.5rem" }, mb: 2 }}>
                Видео-материалы:
              </Typography>
              {videoMaterials.length > 0 ? (
                videoMaterials.map((material) => (
                  <Box key={material.material_id} sx={{ mb: 3 }}>
                    <VideoPlayer material={material} />
                  </Box>
                ))
              ) : (
                <Typography sx={{ color: theme.palette.text.secondary, fontSize: "1rem" }}>Нет доступных видео.</Typography>
              )}

              <Typography variant="h5" sx={{ color: theme.palette.text.primary, fontSize: { xs: "1.25rem", sm: "1.5rem" }, mt: 4, mb: 2 }}>
                Дополнительные материалы:
              </Typography>

              {filteredMaterials.length > 0 ? (
                <MuiList>
                  {filteredMaterials.map((material) => {
                    const updatedFilePath = material.file_path ? getUpdatedFilePath(material.file_path) : null;
                    console.log('updatedFilePath for material', material.material_id, ':', updatedFilePath);

                    return (
                      <ListItem
                        key={material.material_id}
                        sx={{
                          flexDirection: { xs: "column", sm: "row" },
                          alignItems: { xs: "flex-start", sm: "center" },
                          py: 1.5,
                        }}
                      >
                        <ListItemText
                          primary={material.title}
                          secondary={`Тип: ${material.type}`}
                          primaryTypographyProps={{
                            color: theme.palette.text.primary,
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                          }}
                          secondaryTypographyProps={{
                            color: theme.palette.text.secondary,
                            fontSize: { xs: "0.75rem", sm: "0.875rem" },
                          }}
                        />
                        {material.type === "test" ? (
                          updatedFilePath ? (
                            <a
                              href={updatedFilePath}
                              target="_blank"
                              rel="noopener noreferrer"
                              style={{ textDecoration: "none", marginTop: { xs: 1, sm: 0 } }}
                            >
                              <Button
                                variant="outlined"
                                color="secondary"
                                size="small"
                                sx={{ ml: { xs: 0, sm: 2 }, fontSize: "0.875rem", borderRadius: "8px" }}
                              >
                                Перейти к тесту
                              </Button>
                            </a>
                          ) : (
                            <Typography sx={{ color: theme.palette.text.secondary, ml: { xs: 0, sm: 2 }, mt: { xs: 1, sm: 0 } }}>
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
                              sx={{ ml: { xs: 0, sm: 2 }, mt: { xs: 1, sm: 0 }, fontSize: "0.875rem", borderRadius: "8px" }}
                            >
                              Скачать
                            </Button>
                          ) : (
                            <Typography sx={{ color: theme.palette.text.secondary, ml: { xs: 0, sm: 2 }, mt: { xs: 1, sm: 0 } }}>
                              Файл недоступен
                            </Typography>
                          )
                        )}
                      </ListItem>
                    );
                  })}
                </MuiList>
              ) : (
                <Typography sx={{ color: theme.palette.text.secondary, fontSize: "1rem" }}>Нет доступных материалов.</Typography>
              )}

              <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, justifyContent: "flex-end", gap: 2, mt: 4 }}>
                <Button
                  variant="contained"
                  color={isLessonCompleted(filteredLessons[activeTab]?.id) ? "success" : "primary"}
                  onClick={() => handleCompleteLesson(filteredLessons[activeTab]?.id)}
                  disabled={isLessonCompleted(filteredLessons[activeTab]?.id)}
                  sx={{ width: { xs: "100%", sm: "200px" }, py: 1.5, fontSize: "1rem", "&:hover": { transform: "scale(1.02)" } }}
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