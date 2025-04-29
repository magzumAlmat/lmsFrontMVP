// // "use client";
// // import React, { useEffect, useState } from "react";
// // import { useParams, useRouter } from "next/navigation";
// // import axios from "axios";
// // import jwtDecode from "jwt-decode";
// // import {
// //   Box,
// //   Button,
// //   Paper,
// //   Tabs,
// //   Tab,
// //   Typography,
// //   List as MuiList,
// //   ListItem,
// //   ListItemText,
// //   LinearProgress,
// //   useMediaQuery,
// //   Divider,
// // } from "@mui/material";
// // import { useSelector, useDispatch } from "react-redux";
// // import { getAllCoursesAction, logoutAction } from "../../../store/slices/authSlice";
// // import TopMenu from "../../../components/topmenu";
// // import DOMPurify from "dompurify";
// // import { createTheme, ThemeProvider } from "@mui/material/styles";

// // // Создаем тему
// // const theme = createTheme({
// //   palette: {
// //     primary: { main: "#009eb0", contrastText: "#fff" }, // Бирюзовый
// //     secondary: { main: "#1e3a8a", contrastText: "#fff" }, // Глубокий синий
// //     background: {
// //       default: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)", // Мягкий градиент фона
// //       paper: "#ffffff", // Белый для контента
// //     },
// //     text: { primary: "#1e293b", secondary: "#64748b" }, // Темный текст
// //   },
// //   typography: {
// //     fontFamily: "'Open Sans', sans-serif",
// //     h4: { fontWeight: 700, letterSpacing: "-0.5px" },
// //     h6: { fontWeight: 600 },
// //     body1: { fontWeight: 400, lineHeight: 1.6 },
// //     body2: { fontWeight: 400 },
// //   },
// //   components: {
// //     MuiButton: {
// //       styleOverrides: {
// //         root: {
// //           textTransform: "none",
// //           borderRadius: "8px",
// //           padding: "10px 20px",
// //           transition: "all 0.3s ease",
// //           "&:hover": {
// //             transform: "translateY(-2px)",
// //             boxShadow: "0 4px 12px rgba(0, 158, 176, 0.3)",
// //           },
// //           "&:disabled": {
// //             opacity: 0.6,
// //             boxShadow: "none",
// //           },
// //         },
// //       },
// //     },
// //     MuiPaper: {
// //       styleOverrides: {
// //         root: {
// //           borderRadius: "12px",
// //           boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
// //           border: "1px solid rgba(0, 158, 176, 0.2)",
// //         },
// //       },
// //     },
// //     MuiTabs: {
// //       styleOverrides: {
// //         root: {
// //           backgroundColor: "#ffffff",
// //           borderRadius: "12px 0 0 12px",
// //           boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
// //         },
// //       },
// //     },
// //     MuiTab: {
// //       styleOverrides: {
// //         root: {
// //           transition: "all 0.3s ease",
// //           "&:hover": {
// //             backgroundColor: "rgba(0, 158, 176, 0.1)",
// //           },
// //         },
// //       },
// //     },
// //     MuiLinearProgress: {
// //       styleOverrides: {
// //         root: {
// //           height: 8,
// //           borderRadius: 4,
// //           backgroundColor: "#e2e8f0",
// //         },
// //         bar: {
// //           backgroundColor: "#009eb0",
// //         },
// //       },
// //     },
// //     MuiDivider: {
// //       styleOverrides: {
// //         root: {
// //           backgroundColor: "rgba(0, 158, 176, 0.3)",
// //         },
// //       },
// //     },
// //   },
// // });

// // const VideoPlayer = ({ material }) => {
// //   if (!material || !material.file_path) {
// //     return <Typography sx={{ color: "text.secondary" }}>Видео недоступно.</Typography>;
// //   }
// //   const updatedFilePath = material.file_path.replace(":4000", "");
// //   return (
// //     <Box sx={{ mb: 3 }}>
// //       <Typography variant="h6" sx={{ color: "text.primary", mb: 1 }}>
// //         {material.title}
// //       </Typography>
// //       <video controls style={{ width: "100%", maxHeight: "400px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
// //         <source src={updatedFilePath} type="video/mp4" />
// //         Ваш браузер не поддерживает воспроизведение видео.
// //       </video>
// //     </Box>
// //   );
// // };

// // const getUpdatedFilePath = (filePath) => filePath.replace(":4000", "");

// // export default function CourseDetail() {
// //   const host = process.env.NEXT_PUBLIC_HOST;
// //   const { id } = useParams();
// //   const router = useRouter();
// //   const dispatch = useDispatch();
// //   const [lessons, setLessons] = useState([]);
// //   const [materials, setMaterials] = useState([]);
// //   const [activeTab, setActiveTab] = useState(0);
// //   const [completedLessons, setCompletedLessons] = useState([]);
// //   const [progresses, setProgresses] = useState([]);
// //   const [token, setToken] = useState(null);
// //   const { courses } = useSelector((state) => state.auth);
// //   const [userInfo, setUserInfo] = useState(null);
// //   const isMobile = useMediaQuery("(max-width: 600px)");

// //   useEffect(() => {
// //     const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
// //     setToken(storedToken);
// //     if (!storedToken) router.push("/login");
// //   }, [router]);

// //   useEffect(() => {
// //     if (token) {
// //       fetchLessons();
// //       fetchMaterials();
// //       fetchUserInfo();
// //       dispatch(getAllCoursesAction());
// //     }
// //   }, [token, dispatch]);

// //   const fetchLessons = async () => {
// //     try {
// //       const response = await axios.get(`${host}/api/lessons`, { headers: { Authorization: `Bearer ${token}` } });
// //       const sortedLessons = response.data.sort((a, b) => a.id - b.id);
// //       setLessons(sortedLessons);
// //     } catch (error) {
// //       console.error("Ошибка при загрузке уроков:", error);
// //       setLessons([]);
// //     }
// //   };

// //   const fetchMaterials = async () => {
// //     try {
// //       const response = await axios.get(`https://lms.kazniisa.kz/api/materials`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       setMaterials(response.data);
// //     } catch (error) {
// //       console.error("Ошибка при загрузке материалов:", error);
// //     }
// //   };

// //   const fetchUserInfo = async () => {
// //     try {
// //       const response = await axios.get(`${host}/api/auth/getAuthentificatedUserInfo`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       setUserInfo(response.data);
// //     } catch (err) {
// //       console.error("Ошибка при загрузке информации о пользователе:", err);
// //       if (err.response && err.response.status === 401) router.push("/login");
// //     }
// //   };

// //   const fetchAllProgresses = async (userId, courseId) => {
// //     try {
// //       const response = await axios.get(`${host}/api/course/progress/${userId}/${courseId}`, {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       setProgresses(response.data.lessons || []);
// //     } catch (error) {
// //       console.error("Ошибка при получении прогресса:", error);
// //     }
// //   };

// //   useEffect(() => {
// //     if (userInfo && token) fetchAllProgresses(userInfo.id, id);
// //   }, [userInfo, id, token]);

// //   const filteredLessons = lessons.filter((lesson) => lesson.course_id === Number(id));

// //   const renderLessonContent = () => {
// //     if (!filteredLessons.length || !filteredLessons[activeTab]?.content) {
// //       return <Typography sx={{ color: "text.secondary" }}>Нет содержимого для отображения.</Typography>;
// //     }
// //     try {
// //       const rawContent = JSON.parse(filteredLessons[activeTab].content);
// //       const blocks = rawContent.blocks;
// //       if (!blocks || !Array.isArray(blocks)) {
// //         throw new Error("Некорректный формат данных: отсутствует массив blocks");
// //       }
// //       return (
// //         <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
// //           {blocks.map((block, index) => {
// //             switch (block.type) {
// //               case "header":
// //                 return (
// //                   <Typography
// //                     key={block.id || index}
// //                     variant={`h${block.data.level || 2}`}
// //                     sx={{ color: "text.primary", fontWeight: 600 ,fontSize:'1.2rem'}}
// //                   >
// //                     {DOMPurify.sanitize(block.data.text)}
// //                   </Typography>
// //                 );
// //               case "paragraph":
// //                 const sanitizedText = DOMPurify.sanitize(block.data.text);
// //                 return (
// //                   <Typography
// //                     key={block.id || index}
// //                     variant="body1"
// //                     sx={{ color: "text.secondary" }}
// //                     dangerouslySetInnerHTML={{ __html: sanitizedText }}
// //                   />
// //                 );
// //               case "list":
// //                 return (
// //                   <MuiList
// //                     key={block.id || index}
// //                     sx={{
// //                       color: "text.secondary",
// //                       pl: 4,
// //                       listStyleType: block.data.style === "ordered" ? "decimal" : "disc",
// //                       "& li": { display: "list-item" },
// //                     }}
// //                   >
// //                     {block.data.items.map((item, i) => (
// //                       <ListItem key={i} sx={{ p: 0, mb: 0.5 }}>
// //                         <Typography variant="body1" sx={{ color: "text.secondary" }}>
// //                           {DOMPurify.sanitize(item.content || item)}
// //                         </Typography>
// //                       </ListItem>
// //                     ))}
// //                   </MuiList>
// //                 );
// //               case "image":
// //                 return (
// //                   <Box key={block.id || index} sx={{ my: 2 }}>
// //                     <Box
// //                       component="img"
// //                       src={block.data.file.url}
// //                       alt={block.data.caption || "Lesson image"}
// //                       onError={(e) => (e.target.src = "/fallback-image.jpg")}
// //                       sx={{
// //                         width: "100%",
// //                         maxWidth: "600px",
// //                         height: "auto",
// //                         borderRadius: "8px",
// //                         boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
// //                       }}
// //                     />
// //                     {block.data.caption && (
// //                       <Typography variant="caption" sx={{ color: "text.secondary", mt: 1, display: "block", textAlign: "center" }}>
// //                         {DOMPurify.sanitize(block.data.caption)}
// //                       </Typography>
// //                     )}
// //                   </Box>
// //                 );
// //               default:
// //                 return <Typography key={block.id || index} color="warning">Неизвестный тип блока: {block.type}</Typography>;
// //             }
// //           })}
// //         </Box>
// //       );
// //     } catch (error) {
// //       console.error("Ошибка при рендеринге содержимого:", error);
// //       return <Typography color="error">Ошибка: {error.message}</Typography>;
// //     }
// //   };

// //   const handleChangeTab = (event, newValue) => setActiveTab(newValue);

// //   const isLessonCompleted = (lessonId) => {
// //     const progress = progresses.find((p) => p.lesson_id === lessonId);
// //     return progress?.status === "completed";
// //   };

// //   const handleCompleteLesson = async (lessonId) => {
// //     const decoded = jwtDecode(token);
// //     if (!completedLessons.includes(lessonId)) setCompletedLessons([...completedLessons, lessonId]);
// //     try {
// //       await axios.put(
// //         `${host}/api/progress/update`,
// //         { user_id: decoded.id, lesson_id: lessonId, progress_percentage: 100 },
// //         { headers: { Authorization: `Bearer ${token}` } }
// //       );
// //       const updatedProgresses = progresses.map((p) => (p.lesson_id === lessonId ? { ...p, status: "completed" } : p));
// //       setProgresses(updatedProgresses);
// //       alert("Урок завершен");
// //       router.push(`/courses/${id}`);
// //       window.location.reload();
// //     } catch (error) {
// //       console.error("Ошибка при завершении урока:", error);
// //     }
// //   };

// //   const handleLogout = () => {
// //     dispatch(logoutAction());
// //     localStorage.removeItem("token");
// //     router.push("/login");
// //   };

// //   if (!token) {
// //     return (
// //       <ThemeProvider theme={theme}>
// //         <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", bgcolor: "background.default" }}>
// //           <Typography sx={{ color: "text.primary" }}>Loading...</Typography>
// //         </Box>
// //       </ThemeProvider>
// //     );
// //   }

// //   const filteredMaterials = materials.filter((material) => material.lesson_id === filteredLessons[activeTab]?.id);
// //   const videoMaterials = filteredMaterials.filter((material) => material.type === "video");

// //   const getCompletedLessonsCount = () => progresses.filter((p) => p.status === "completed").length;

// //   if (!filteredLessons || filteredLessons.length === 0) {
// //     return (
// //       <ThemeProvider theme={theme}>
// //         <Box sx={{ p: 3, textAlign: "center", bgcolor: "background.default", minHeight: "100vh" }}>
// //           <TopMenu userInfo={userInfo} handleLogout={handleLogout} />
// //           <Typography variant="h6" sx={{ color: "text.primary" }}>Нет доступных уроков.</Typography>
// //         </Box>
// //       </ThemeProvider>
// //     );
// //   }

// //   return (
// //     <ThemeProvider theme={theme}>
// //       <Box
// //         sx={{
// //           minHeight: "100vh",
// //           bgcolor: "background.default",
// //           position: "relative",
// //           overflow: "hidden",
// //           "&:before": {
// //             content: '""',
// //             position: "absolute",
// //             top: "-50%",
// //             left: "-50%",
// //             width: "200%",
// //             height: "200%",
// //             background: "radial-gradient(circle, rgba(0, 158, 176, 0.1) 0%, transparent 70%)",
// //             zIndex: 0,
// //           },
// //         }}
// //       >
// //         <TopMenu userInfo={userInfo} handleLogout={handleLogout} />
// //         <Box
// //           sx={{
// //             display: "flex",
// //             flexDirection: { xs: "column", sm: "row" },
// //             minHeight: "calc(100vh - 64px)",
// //             p: { xs: 2, sm: 3 },
// //             zIndex: 1,
// //           }}
// //         >
// //           <Tabs
// //             orientation={isMobile ? "horizontal" : "vertical"}
// //             variant="scrollable"
// //             value={activeTab}
// //             onChange={handleChangeTab}
// //             sx={{
// //               width: { xs: "100%", sm: "280px" },
// //               maxHeight: { xs: "auto", sm: "calc(100vh - 64px)" },
// //               overflowY: "auto",
// //               flexShrink: 0,
// //               mr: { sm: 3 },
// //             }}
// //           >
// //             {filteredLessons.map((lesson, index) => (
// //               <Tab
// //                 key={lesson.id}
// //                 label={lesson.title}
// //                 sx={{
// //                   textTransform: "none",
// //                   fontWeight: 500,
// //                   color: "text.secondary",
// //                   "&.Mui-selected": { color: "primary.main" },
// //                   "&:hover": { color: "primary.main" },
// //                   py: 2,
// //                 }}
// //               />
// //             ))}
// //           </Tabs>

// //           <Box sx={{ flexGrow: 1 }}>
// //             <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
// //               <LinearProgress
// //                 variant="determinate"
// //                 value={(getCompletedLessonsCount() / filteredLessons.length) * 100 || 0}
// //                 sx={{ mb: 3 }}
// //               />
// //               <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
// //                 Пройдено {getCompletedLessonsCount()} из {filteredLessons.length} уроков
// //               </Typography>

// //               <Typography variant="h6" sx={{ color: "text.primary", mb: 3 }}>
// //                 {filteredLessons[activeTab].title}
// //               </Typography>

// //               {filteredLessons[activeTab].image && (
// //                 <Box
// //                   component="img"
// //                   src={filteredLessons[activeTab].image}
// //                   alt={`Lesson ${activeTab + 1}`}
// //                   sx={{ width: "100%", height: "auto", maxHeight: "350px", objectFit: "cover", borderRadius: "8px", mb: 3 }}
// //                 />
// //               )}

// //               <Box sx={{ mb: 3 }}>{renderLessonContent()}</Box>

// //               <Divider sx={{ my: 3 }} />

// //               <Typography variant="h6" sx={{ color: "text.primary", mb: 2 }}>
// //                 Видео-материалы:
// //               </Typography>
// //               {videoMaterials.length > 0 ? (
// //                 videoMaterials.map((material) => <VideoPlayer key={material.material_id} material={material} />)
// //               ) : (
// //                 <Typography sx={{ color: "text.secondary" }}>Нет доступных видео.</Typography>
// //               )}

// //               <Typography variant="h6" sx={{ color: "text.primary", mt: 4, mb: 2 }}>
// //                 Дополнительные материалы:
// //               </Typography>
// //               {filteredMaterials.length > 0 ? (
// //                 <MuiList>
// //                   {filteredMaterials.map((material) => {
// //                     const updatedFilePath = material.file_path ? getUpdatedFilePath(material.file_path) : null;
// //                     return (
// //                       <ListItem
// //                         key={material.material_id}
// //                         sx={{ flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, py: 1.5 }}
// //                       >
// //                         <ListItemText
// //                           primary={material.title}
// //                           secondary={`Тип: ${material.type}`}
// //                           primaryTypographyProps={{ color: "text.primary" }}
// //                           secondaryTypographyProps={{ color: "text.secondary" }}
// //                         />
// //                         {material.type === "test" ? (
// //                           updatedFilePath ? (
// //                             <a href={updatedFilePath} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
// //                               <Button variant="outlined" color="primary" size="small" sx={{ ml: { sm: 2 }, mt: { xs: 1, sm: 0 } }}>
// //                                 Перейти к тесту
// //                               </Button>
// //                             </a>
// //                           ) : (
// //                             <Typography sx={{ color: "text.secondary", ml: { sm: 2 }, mt: { xs: 1, sm: 0 } }}>Ссылка недоступна</Typography>
// //                           )
// //                         ) : (
// //                           updatedFilePath ? (
// //                             <Button
// //                               href={updatedFilePath}
// //                               download={material.title || "file"}
// //                               variant="outlined"
// //                               color="primary"
// //                               size="small"
// //                               sx={{ ml: { sm: 2 }, mt: { xs: 1, sm: 0 } }}
// //                             >
// //                               Скачать
// //                             </Button>
// //                           ) : (
// //                             <Typography sx={{ color: "text.secondary", ml: { sm: 2 }, mt: { xs: 1, sm: 0 } }}>Файл недоступен</Typography>
// //                           )
// //                         )}
// //                       </ListItem>
// //                     );
// //                   })}
// //                 </MuiList>
// //               ) : (
// //                 <Typography sx={{ color: "text.secondary" }}>Нет доступных материалов.</Typography>
// //               )}

// //               <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
// //                 <Button
// //                   variant="contained"
// //  Fla                  color={isLessonCompleted(filteredLessons[activeTab]?.id) ? "secondary" : "primary"}
// //                   onClick={() => handleCompleteLesson(filteredLessons[activeTab]?.id)}
// //                   disabled={isLessonCompleted(filteredLessons[activeTab]?.id)}
// //                   sx={{ width: { xs: "100%", sm: "200px" } }}
// //                 >
// //                   {isLessonCompleted(filteredLessons[activeTab]?.id) ? "Урок завершен" : "Завершить урок"}
// //                 </Button>
// //               </Box>
// //             </Paper>
// //           </Box>
// //         </Box>
// //       </Box>
// //     </ThemeProvider>
// //   );
// // }

// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import { useParams, useRouter } from "next/navigation";
// import axios from "axios";
// import jwtDecode from "jwt-decode";
// import dynamic from "next/dynamic";
// import {
//   Box,
//   Button,
//   Paper,
//   Tabs,
//   Tab,
//   Typography,
//   List as MuiList,
//   ListItem,
//   ListItemText,
//   LinearProgress,
//   useMediaQuery,
//   Divider,
//   CircularProgress,
// } from "@mui/material";
// import { useSelector, useDispatch } from "react-redux";
// import { getAllCoursesAction, logoutAction } from "../../../store/slices/authSlice";
// import TopMenu from "../../../components/topmenu";
// import DOMPurify from "dompurify";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// // import styles from '../../CourseDetail.module.css';
// // Динамический импорт Editor.js и инструментов
// const EditorJS = dynamic(() => import("@editorjs/editorjs").then((mod) => mod.default), { ssr: false });
// const Header = dynamic(() => import("@editorjs/header").then((mod) => mod.default), { ssr: false });
// const List = dynamic(() => import("@editorjs/list").then((mod) => mod.default), { ssr: false });

// // Тема остается прежней
// const theme = createTheme({
//   palette: {
//     primary: { main: "#009eb0", contrastText: "#fff" },
//     secondary: { main: "#1e3a8a", contrastText: "#fff" },
//     background: {
//       default: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
//       paper: "#ffffff",
//     },
//     text: { primary: "#1e293b", secondary: "#64748b" },
//   },
//   typography: {
//     fontFamily: "'Open Sans', sans-serif",
//     h4: { fontWeight: 700, letterSpacing: "-0.5px" },
//     h6: { fontWeight: 600 },
//     body1: { fontWeight: 400, lineHeight: 1.6 },
//     body2: { fontWeight: 400 },
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           textTransform: "none",
//           borderRadius: "8px",
//           padding: "10px 20px",
//           transition: "all 0.3s ease",
//           "&:hover": {
//             transform: "translateY(-2px)",
//             boxShadow: "0 4px 12px rgba(0, 158, 176, 0.3)",
//           },
//           "&:disabled": {
//             opacity: 0.6,
//             boxShadow: "none",
//           },
//         },
//       },
//     },
//     MuiPaper: {
//       styleOverrides: {
//         root: {
//           borderRadius: "12px",
//           boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//           border: "1px solid rgba(0, 158, 176, 0.2)",
//         },
//       },
//     },
//     MuiTabs: {
//       styleOverrides: {
//         root: {
//           backgroundColor: "#ffffff",
//           borderRadius: "12px 0 0 12px",
//           boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
//         },
//       },
//     },
//     MuiTab: {
//       styleOverrides: {
//         root: {
//           transition: "all 0.3s ease",
//           "&:hover": {
//             backgroundColor: "rgba(0, 158, 176, 0.1)",
//           },
//         },
//       },
//     },
//     MuiLinearProgress: {
//       styleOverrides: {
//         root: {
//           height: 8,
//           borderRadius: 4,
//           backgroundColor: "#e2e8f0",
//         },
//         bar: {
//           backgroundColor: "#009eb0",
//         },
//       },
//     },
//     MuiDivider: {
//       styleOverrides: {
//         root: {
//           backgroundColor: "rgba(0, 158, 176, 0.3)",
//         },
//       },
//     },
//   },
// });

// const VideoPlayer = ({ material }) => {
//   if (!material || !material.file_path) {
//     return <Typography sx={{ color: "text.secondary" }}>Видео недоступно.</Typography>;
//   }


//   const updatedFilePath = material.file_path.replace(":4000", "");
//   return (
//     <Box sx={{ mb: 3 }}>
//       <Typography variant="h6" sx={{ color: "text.primary", mb: 1 }}>
//         {material.title}
//       </Typography>
//       {/* <video controls style={{ width: "100%", maxHeight: "400px", borderRadius: "8px", boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)" }}>
//         <source src={updatedFilePath} type="video/mp4" />
//         Ваш браузер не поддерживает воспроизведение видео.
//       </video> */}
//       {console.log('video url before begin video tag===== ',updatedFilePath)}
//       <video
//         controls
//         playsInline
//         preload="metadata"
//         style={{ width: "100%", maxHeight: "400px", borderRadius: "8px" }}
//         onError={(e) => console.error('Video error:', e.target.error)}
//       >


//         {/* <source src='http://localhost:4000/uploads/Video.MP4' type="video/mp4" />
//         Ваш браузер не поддерживает воспроизведение видео. */}
      
//         {console.log('updatedFilePath= ',updatedFilePath)}
//         <source src={updatedFilePath} type="video/mp4" />
//         Ваш браузер не поддерживает воспроизведение видео.{' '}
//         <a href={updatedFilePath} download>
//           Скачать видео
//         </a>
//       </video>
//     </Box>
//   );
// };

// const getUpdatedFilePath = (filePath) => filePath.replace(":4000", "");

// export default function CourseDetail() {
//   const host = process.env.NEXT_PUBLIC_HOST;
//   const { id } = useParams();
//   const router = useRouter();
//   const dispatch = useDispatch();
//   const [lessons, setLessons] = useState([]);
//   const [materials, setMaterials] = useState([]);
//   const [activeTab, setActiveTab] = useState(0);
//   const [completedLessons, setCompletedLessons] = useState([]);
//   const [progresses, setProgresses] = useState([]);
//   const [token, setToken] = useState(null);
//   const { courses } = useSelector((state) => state.auth);
//   const [userInfo, setUserInfo] = useState(null);
//   const [reviewContent, setReviewContent] = useState({ blocks: [] });
//   const [isSubmittingReview, setIsSubmittingReview] = useState(false);
//   const editorInstance = useRef(null);
//   const isMobile = useMediaQuery("(max-width: 600px)");

//   useEffect(() => {
//     const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
//     setToken(storedToken);
//     if (!storedToken) router.push("/login");
//   }, [router]);

//   useEffect(() => {
//     if (token) {
//       fetchLessons();
//       fetchMaterials();
//       fetchUserInfo();
//       dispatch(getAllCoursesAction());
//     }
//   }, [token, dispatch]);

//   // Инициализация Editor.js для урока с отзывом
//   useEffect(() => {
//     if (!token || !lessons.length) return;

//     const currentLesson = lessons.filter((lesson) => lesson.course_id === Number(id))[activeTab];
//     if (!currentLesson?.isReviewLesson) return;

//     const initEditor = async () => {
//       try {
//         const [EditorJS, Header, List] = await Promise.all([
//           import("@editorjs/editorjs").then((mod) => mod.default),
//           import("@editorjs/header").then((mod) => mod.default),
//           import("@editorjs/list").then((mod) => mod.default),
//         ]);

//         if (editorInstance.current?.destroy) {
//           await editorInstance.current.destroy();
//         }

//         const editor = new EditorJS({
//           holder: "review-editor-container",
//           tools: {
//             header: {
//               class: Header,
//               config: { 
//                 levels: [2, 3], 
//                 defaultLevel: 2, 
//                 placeholder: "Заголовок отзыва" 
//               },
//               inlineToolbar: false, // Отключаем inline toolbar для header
//             },
//             list: {
//               class: List,
//               inlineToolbar: false, // Отключаем inline toolbar для list
//             },
//           },
//           placeholder: "Напишите ваш отзыв здесь...",
//           data: reviewContent,
//           onChange: async () => {
//             const savedData = await editor.save();
//             setReviewContent(savedData);
//           },
//           logLevel: "ERROR",
//         });

//         editorInstance.current = editor;
//       } catch (error) {
//         console.error("Ошибка инициализации Editor.js для отзыва:", error);
//       }
//     };

//     initEditor();

//     return () => {
//       if (editorInstance.current?.destroy) {
//         editorInstance.current.destroy();
//       }
//     };
//   }, [token, activeTab, lessons]);

//   const fetchLessons = async () => {
//     try {
//       const response = await axios.get(`${host}/api/lessons`, { headers: { Authorization: `Bearer ${token}` } });
//       const sortedLessons = response.data.sort((a, b) => a.id - b.id);
//       setLessons(sortedLessons);
//     } catch (error) {
//       console.error("Ошибка при загрузке уроков:", error);
//       setLessons([]);
//     }
//   };

//   const fetchMaterials = async () => {
//     try {
//       const response = await axios.get(`${host}/api/materials`, { // Обновил URL для консистентности
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setMaterials(response.data);
//     } catch (error) {
//       console.error("Ошибка при загрузке материалов:", error);
//     }
//   };

//   const fetchUserInfo = async () => {
//     try {
//       const response = await axios.get(`${host}/api/auth/getAuthentificatedUserInfo`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUserInfo(response.data);
//     } catch (err) {
//       console.error("Ошибка при загрузке информации о пользователе:", err);
//       if (err.response && err.response.status === 401) router.push("/login");
//     }
//   };

//   const fetchAllProgresses = async (userId, courseId) => {
//     try {
//       const response = await axios.get(`${host}/api/course/progress/${userId}/${courseId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setProgresses(response.data.lessons || []);
//     } catch (error) {
//       console.error("Ошибка при получении прогресса:", error);
//     }
//   };

//   useEffect(() => {
//     if (userInfo && token) fetchAllProgresses(userInfo.id, id);
//   }, [userInfo, id, token]);

//   const filteredLessons = lessons.filter((lesson) => lesson.course_id === Number(id));

//   const renderLessonContent = () => {
//     const currentLesson = filteredLessons[activeTab];
//     if (!currentLesson) {
//       return <Typography sx={{ color: "text.secondary" }}>Нет содержимого для отображения.</Typography>;
//     }

//     if (currentLesson.isReviewLesson) {
//       return (
//         <Box sx={{ mt: 3 }}>
//           <Typography variant="h6" sx={{ color: "text.primary", mb: 2 }}>
//             Оставьте ваш отзыв о курсе
//           </Typography>
//           {userInfo?.review ? (
//             <Typography sx={{ color: "text.secondary" }}>
//               Ваш отзыв: {JSON.parse(userInfo.review)?.blocks?.map((block) => block.data.text).join(" ") || userInfo.review}
//               <br />
//               <Typography sx={{ color: "primary.main", mt: 1 }}>Спасибо за ваш отзыв!</Typography>
//             </Typography>
//           ) : (
//             <>
//               <div
//                 id="review-editor-container" 
//                 // className={styles.reviewEditor}
//                 style={{ width:"auto",minHeight: "200px", border: "1px solid #ccc", borderRadius: "4px", padding: "10px" }}
//               />
//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleReviewSubmit}
//                 disabled={isSubmittingReview}
//                 sx={{ mt: 2 }}
//                 startIcon={isSubmittingReview && <CircularProgress size={20} />}
//               >
//                 Отправить отзыв
//               </Button>
//             </>
//           )}
//         </Box>
//       );
//     }

//     try {
//       const rawContent = JSON.parse(currentLesson.content || '{"blocks":[]}');
//       const blocks = rawContent.blocks;
//       if (!blocks || !Array.isArray(blocks)) {
//         throw new Error("Некорректный формат данных: отсутствует массив blocks");
//       }
//       return (
//         <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
//           {blocks.map((block, index) => {
//             switch (block.type) {
//               case "header":
//                 return (
//                   <Typography
//                     key={block.id || index}
//                     variant={`h${block.data.level || 2}`}
//                     sx={{ color: "text.primary", fontWeight: 600, fontSize: "1.2rem" }}
//                   >
//                     {DOMPurify.sanitize(block.data.text)}
//                   </Typography>
//                 );
//               case "paragraph":
//                 const sanitizedText = DOMPurify.sanitize(block.data.text);
//                 return (
//                   <Typography
//                     key={block.id || index}
//                     variant="body1"
//                     sx={{ color: "text.secondary" }}
//                     dangerouslySetInnerHTML={{ __html: sanitizedText }}
//                   />
//                 );
//               case "list":
//                 return (
//                   <MuiList
//                     key={block.id || index}
//                     sx={{
//                       color: "text.secondary",
//                       pl: 4,
//                       listStyleType: block.data.style === "ordered" ? "decimal" : "disc",
//                       "& li": { display: "list-item" },
//                     }}
//                   >
//                     {block.data.items.map((item, i) => (
//                       <ListItem key={i} sx={{ p: 0, mb: 0.5 }}>
//                         <Typography variant="body1" sx={{ color: "text.secondary" }}>
//                           {DOMPurify.sanitize(item.content || item)}
//                         </Typography>
//                       </ListItem>
//                     ))}
//                   </MuiList>
//                 );
//               case "image":
//                 return (
//                   <Box key={block.id || index} sx={{ my: 2 }}>
//                     <Box
//                       component="img"
//                       src={block.data.file.url}
//                       alt={block.data.caption || "Lesson image"}
//                       onError={(e) => (e.target.src = "/fallback-image.jpg")}
//                       sx={{
//                         width: "100%",
//                         maxWidth: "600px",
//                         height: "auto",
//                         borderRadius: "8px",
//                         boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
//                       }}
//                     />
//                     {block.data.caption && (
//                       <Typography variant="caption" sx={{ color: "text.secondary", mt: 1, display: "block", textAlign: "center" }}>
//                         {DOMPurify.sanitize(block.data.caption)}
//                       </Typography>
//                     )}
//                   </Box>
//                 );
//               default:
//                 return <Typography key={block.id || index} color="warning">Неизвестный тип блока: {block.type}</Typography>;
//             }
//           })}
//         </Box>
//       );
//     } catch (error) {
//       console.error("Ошибка при рендеринге содержимого:", error);
//       return <Typography color="error">Ошибка: {error.message}</Typography>;
//     }
//   };

//   const handleReviewSubmit = async () => {
//     if (!editorInstance.current) return;

//     try {
//       setIsSubmittingReview(true);
//       const savedReview = await editorInstance.current.save();
//       if (!savedReview.blocks.length) {
//         throw new Error("Отзыв не может быть пустым");
//       }
//       const reviewText = JSON.stringify(savedReview);

//       const decoded = jwtDecode(token);
//       const response = await axios.post(
//         `${host}/api/lessons/review`,
//         {
//           userId: decoded.id,
//           lessonId: filteredLessons[activeTab].id,
//           review: reviewText,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       if (response.status === 200) {
//         setUserInfo((prev) => ({ ...prev, review: reviewText }));
//         alert("Отзыв успешно отправлен!");
//       }
//     } catch (error) {
//       console.error("Ошибка при отправке отзыва:", error);
//       alert(error.response?.data?.error || "Ошибка при отправке отзыва");
//     } finally {
//       setIsSubmittingReview(false);
//     }
//   };

//   const handleChangeTab = (event, newValue) => setActiveTab(newValue);

//   const isLessonCompleted = (lessonId) => {
//     const progress = progresses.find((p) => p.lesson_id === lessonId);
//     return progress?.status === "completed";
//   };

//   const handleCompleteLesson = async (lessonId) => {
//     const decoded = jwtDecode(token);
//     if (!completedLessons.includes(lessonId)) setCompletedLessons([...completedLessons, lessonId]);
//     try {
//       await axios.put(
//         `${host}/api/progress/update`,
//         { user_id: decoded.id, lesson_id: lessonId, progress_percentage: 100 },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const updatedProgresses = progresses.map((p) => (p.lesson_id === lessonId ? { ...p, status: "completed" } : p));
//       setProgresses(updatedProgresses);
//       alert("Урок завершен");
//       router.push(`/courses/${id}`);
//       window.location.reload();
//     } catch (error) {
//       console.error("Ошибка при завершении урока:", error);
//     }
//   };

//   const handleLogout = () => {
//     dispatch(logoutAction());
//     localStorage.removeItem("token");
//     router.push("/login");
//   };

//   if (!token) {
//     return (
//       <ThemeProvider theme={theme}>
//         <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", bgcolor: "background.default" }}>
//           <Typography sx={{ color: "text.primary" }}>Loading...</Typography>
//         </Box>
//       </ThemeProvider>
//     );
//   }

//   const filteredMaterials = materials.filter((material) => material.lesson_id === filteredLessons[activeTab]?.id);
//   const videoMaterials = filteredMaterials.filter((material) => material.type === "video");

//   const getCompletedLessonsCount = () => progresses.filter((p) => p.status === "completed").length;

//   if (!filteredLessons || filteredLessons.length === 0) {
//     return (
//       <ThemeProvider theme={theme}>
//         <Box sx={{ p: 3, textAlign: "center", bgcolor: "background.default", minHeight: "100vh" }}>
//           <TopMenu userInfo={userInfo} handleLogout={handleLogout} />
//           <Typography variant="h6" sx={{ color: "text.primary" }}>Нет доступных уроков.</Typography>
//         </Box>
//       </ThemeProvider>
//     );
//   }

//   return (
//     <ThemeProvider theme={theme}>
//       <Box
//         sx={{
//           minHeight: "100vh",
//           bgcolor: "background.default",
//           position: "relative",
//           overflow: "hidden",
//           "&:before": {
//             content: '""',
//             position: "absolute",
//             top: "-50%",
//             left: "-50%",
//             width: "200%",
//             height: "200%",
//             background: "radial-gradient(circle, rgba(0, 158, 176, 0.1) 0%, transparent 70%)",
//             zIndex: 0,
//           },
//         }}
//       >
//         <style jsx>{`
//           .review-editor .ce-inline-toolbar__actions .ce-inline-tool--add {
//             right: 130%;
//           }
//         `}</style>
//         <TopMenu userInfo={userInfo} handleLogout={handleLogout} />
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: { xs: "column", sm: "row" },
//             minHeight: "calc(100vh - 64px)",
//             p: { xs: 2, sm: 3 },
//             zIndex: 1,
//           }}
//         >
//           <Tabs
//             orientation={isMobile ? "horizontal" : "vertical"}
//             variant="scrollable"
//             value={activeTab}
//             onChange={handleChangeTab}
//             sx={{
//               width: { xs: "100%", sm: "280px" },
//               maxHeight: { xs: "auto", sm: "calc(100vh - 64px)" },
//               overflowY: "auto",
//               flexShrink: 0,
//               mr: { sm: 3 },
//             }}
//           >
//             {filteredLessons.map((lesson, index) => (
//               <Tab
//                 key={lesson.id}
//                 label={lesson.title}
//                 sx={{
//                   textTransform: "none",
//                   fontWeight: 500,
//                   color: "text.secondary",
//                   "&.Mui-selected": { color: "primary.main" },
//                   "&:hover": { color: "primary.main" },
//                   py: 2,
//                 }}
//               />
//             ))}
//           </Tabs>

//           <Box sx={{ flexGrow: 1 }}>
//             <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
//               <LinearProgress
//                 variant="determinate"
//                 value={(getCompletedLessonsCount() / filteredLessons.length) * 100 || 0}
//                 sx={{ mb: 3 }}
//               />
//               <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
//                 Пройдено {getCompletedLessonsCount()} из {filteredLessons.length} уроков
//               </Typography>

//               <Typography variant="h6" sx={{ color: "text.primary", mb: 3 }}>
//                 {filteredLessons[activeTab].title}
//               </Typography>

//               {filteredLessons[activeTab].image && (
//                 <Box
//                   component="img"
//                   src={filteredLessons[activeTab].image}
//                   alt={`Lesson ${activeTab + 1}`}
//                   sx={{ width: "100%", height: "auto", maxHeight: "350px", objectFit: "cover", borderRadius: "8px", mb: 3 }}
//                 />
//               )}

//               <Box sx={{ mb: 3 }}>{renderLessonContent()}</Box>

//               {!filteredLessons[activeTab].isReviewLesson && (
//                 <>
//                   <Typography variant="h5" sx={{ color: theme.palette.text.primary, fontSize: { xs: "1.25rem", sm: "1.5rem" }, mb: 2 }}>
//                 Видео-материалы:
//               </Typography>
//               {videoMaterials.length > 0 ? (
//                 videoMaterials.map((material) => (
//                   <Box key={material.material_id} sx={{ mb: 3 }}>
//                     <VideoPlayer material={material} />
//                   </Box>
//                 ))
//               ) : (
//                 <Typography sx={{ color: theme.palette.text.secondary, fontSize: "1rem" }}>Нет доступных видео.</Typography>
//               )}

//                   <Typography variant="h6" sx={{ color: "text.primary", mt: 4, mb: 2 }}>
//                     Дополнительные материалы:
//                   </Typography>
//                   {filteredMaterials.length > 0 ? (
//                     <MuiList>
//                       {filteredMaterials.map((material) => {
//                         const updatedFilePath = material.file_path ? getUpdatedFilePath(material.file_path) : null;
//                         return (
//                           <ListItem
//                             key={material.material_id}
//                             sx={{ flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, py: 1.5 }}
//                           >
//                         <ListItemText
//                               primary={material.title}
//                               // secondary={`Тип: ${material.type}`}
//                               primaryTypographyProps={{ color: 'text.primary' }}
//                               secondaryTypographyProps={{ color: 'text.secondary' }}
//                             />
//                             {material.type === 'test' || material.type === 'opros' ? (
//                               updatedFilePath ? (
//                                 <a href={updatedFilePath} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
//                                   <Button
//                                     variant="outlined"
//                                     color="primary"
//                                     size="small"
//                                     sx={{ ml: { sm: 2 }, mt: { xs: 1, sm: 0 } }}
//                                   >
//                                     {material.type === 'test' ? 'Перейти к тесту' : 'Перейти к опросу'}
//                                   </Button>
//                                 </a>
//                               ) : (
//                                 <Typography sx={{ color: 'text.secondary', ml: { sm: 2 }, mt: { xs: 1, sm: 0 } }}>
//                                   Ссылка недоступна
//                                 </Typography>
//                               )
//                             ) : (
//                               updatedFilePath ? (
//                                 <Button
//                                   href={updatedFilePath}
//                                   download={material.title || 'file'}
//                                   variant="outlined"
//                                   color="primary"
//                                   size="small"
//                                   sx={{ ml: { sm: 2 }, mt: { xs: 1, sm: 0 } }}
//                                 >
//                                   Скачать
//                                 </Button>
//                               ) : (
//                                 <Typography sx={{ color: 'text.secondary', ml: { sm: 2 }, mt: { xs: 1, sm: 0 } }}>
//                                   Файл недоступен
//                                 </Typography>
//                               )
//                             )}
//                           </ListItem>
//                         );
//                       })}
//                     </MuiList>
//                   ) : (
//                     <Typography sx={{ color: "text.secondary" }}>Нет доступных материалов.</Typography>
//                   )}
//                 </>
//               )}

//               <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
//                 <Button
//                   variant="contained"
//                   color={isLessonCompleted(filteredLessons[activeTab]?.id) ? "secondary" : "primary"}
//                   onClick={() => handleCompleteLesson(filteredLessons[activeTab]?.id)}
//                   disabled={isLessonCompleted(filteredLessons[activeTab]?.id)}
//                   sx={{ width: { xs: "100%", sm: "200px" } }}
//                 >
//                   {isLessonCompleted(filteredLessons[activeTab]?.id) ? "Урок завершен" : "Завершить урок"}
//                 </Button>
//               </Box>
//             </Paper>
//           </Box>
//         </Box>
//       </Box>
//     </ThemeProvider>
//   );
// }



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
  Divider,
  CircularProgress,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { getAllCoursesAction, logoutAction } from "../../../store/slices/authSlice";
import TopMenu from "../../../components/topmenu";
import DOMPurify from "dompurify";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Динамический импорт Editor.js и инструментов
const EditorJS = dynamic(() => import("@editorjs/editorjs").then((mod) => mod.default), { ssr: false });
const Header = dynamic(() => import("@editorjs/header").then((mod) => mod.default), { ssr: false });
const List = dynamic(() => import("@editorjs/list").then((mod) => mod.default), { ssr: false });

// Создание темы
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
    h6: { fontWeight: 600 },
    body1: { fontWeight: 400, lineHeight: 1.6 },
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
        },
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          borderRadius: "12px 0 0 12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          transition: "all 0.3s ease",
          "&:hover": {
            backgroundColor: "rgba(0, 158, 176, 0.1)",
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 8,
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

// Компонент VideoPlayer
const VideoPlayer = ({ material }) => {
  if (!material || !material.file_path) {
    return <Typography sx={{ color: "text.secondary" }}>Видео недоступно.</Typography>;
  }
  const updatedFilePath = material.file_path.replace(":4000", "");
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h6" sx={{ color: "text.primary", mb: 1 }}>
        {material.title}
      </Typography>
      <video
        controls
        playsInline
        preload="metadata"
        style={{ width: "100%", maxHeight: "400px", borderRadius: "8px" }}
        onError={(e) => console.error("Video error:", e.target.error)}
      >
        <source src={updatedFilePath} type="video/mp4" />
        Ваш браузер не поддерживает воспроизведение видео.{' '}
        <a href={updatedFilePath} download>
          Скачать видео
        </a>
      </video>
    </Box>
  );
};

// Функция для обновления пути к файлу
const getUpdatedFilePath = (filePath) => filePath.replace(":4000", "");


// const fetchPriorityConfig = async () => {
//   console.log('fetchPriorityConfig started',host,id)
//   if (id || !token) return;
  
//   try {
//     const response = await axios.get(`${host}/api/lessons/${id}/priority`
                                              
//     //   , {
//     //   headers: { Authorization: `Bearer ${token}` },
//     // }
//   );
//     console.log('Ответ от сервака ', response.data)
//     setPriorityConfig(response.data.priority_config);
  
//   } catch (error) {
//     console.error('Ошибка при загрузке приоритетов:', error);
//     setPriorityConfig(reduxPriority || { EditorJS: 1, Video: 2, AdditionalMaterials: 3 });
//   }
// };
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
  const [reviewContent, setReviewContent] = useState({ blocks: [] });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const editorInstance = useRef(null);
  const isMobile = useMediaQuery("(max-width: 600px)");
  const { reduxPriority } = useSelector((state) => state.auth.reduxPriorityConfig);
  const [priorityConfig, setPriorityConfig] = useState(reduxPriority || { EditorJS: 1, Video: 2, AdditionalMaterials: 3 });
  console.log("ПРИОРИТЕТ= ",priorityConfig)
  // Конфигурация приоритетов блоков
  // let priorityConfig = {
  //   EditorJS: 3,
  //   Video: 1,
  //   AdditionalMaterials: 2,
  // };
// В CourseDetail.jsx
console.log('id= ',id,'token= ',token)


  // Проверка токена и редирект на логин, если токен отсутствует
  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(storedToken);
    if (!storedToken) router.push("/login");
  }, [router]);


 

  // Загрузка данных при наличии токена
  useEffect(() => {
    if (token) {
      fetchLessons();
      fetchMaterials();
      fetchUserInfo();
      dispatch(getAllCoursesAction());

    
      // fetchPriorityConfig();
    }
  }, [token, dispatch]);

  // Инициализация Editor.js для уроков с отзывами
  useEffect(() => {



   


    if (!token || !lessons.length) return;

    const currentLesson = lessons.filter((lesson) => lesson.course_id === Number(id))[activeTab];
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
  }, [token, activeTab, lessons, id, reviewContent]);

  // Загрузка уроков
  const fetchLessons = async () => {
    try {
      const response = await axios.get(`${host}/api/lessons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const sortedLessons = response.data.sort((a, b) => a.id - b.id);
      setLessons(sortedLessons);

      const response2 = await axios.get(`${host}/api/lessons/${id}/priority`
                                              
          
      );
        console.log('Ответ от сервака ', response.data)
        setPriorityConfig(response2.data.priority_config);

    } catch (error) {
      console.error("Ошибка при загрузке уроков:", error);
      setLessons([]);
    }
  };

  // Загрузка материалов
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

  // Загрузка информации о пользователе
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

  // Загрузка прогресса пользователя
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

  // Фильтрация уроков и материалов
  const filteredLessons = lessons.filter((lesson) => lesson.course_id === Number(id));
  const filteredMaterials = materials.filter((material) => material.lesson_id === filteredLessons[activeTab]?.id);
  const videoMaterials = filteredMaterials.filter((material) => material.type === "video");

  // Рендеринг содержимого урока
  const renderLessonContent = () => {
    const currentLesson = filteredLessons[activeTab];
    if (!currentLesson) {
      return <Typography sx={{ color: "text.secondary" }}>Нет содержимого для отображения.</Typography>;
    }

    if (currentLesson.isReviewLesson) {
      return (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ color: "text.primary", mb: 2 }}>
            Оставьте ваш отзыв о курсе
          </Typography>
          {userInfo?.review ? (
            <Typography sx={{ color: "text.secondary" }}>
              Ваш отзыв: {JSON.parse(userInfo.review)?.blocks?.map((block) => block.data.text).join(" ") || userInfo.review}
              <br />
              <Typography sx={{ color: "primary.main", mt: 1 }}>Спасибо за ваш отзыв!</Typography>
            </Typography>
          ) : (
            <>
              <div
                id="review-editor-container"
                style={{ width: "auto", minHeight: "200px", border: "1px solid #ccc", borderRadius: "4px", padding: "10px" }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={handleReviewSubmit}
                disabled={isSubmittingReview}
                sx={{ mt: 2 }}
                startIcon={isSubmittingReview && <CircularProgress size={20} />}
              >
                Отправить отзыв
              </Button>
            </>
          )}
        </Box>
      );
    }

    try {
      const rawContent = JSON.parse(currentLesson.content || '{"blocks":[]}');
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
                    sx={{ color: "text.primary", fontWeight: 600, fontSize: "1.2rem" }}
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
                    sx={{ color: "text.secondary" }}
                    dangerouslySetInnerHTML={{ __html: sanitizedText }}
                  />
                );
              case "list":
                return (
                  <MuiList
                    key={block.id || index}
                    sx={{
                      color: "text.secondary",
                      pl: 4,
                      listStyleType: block.data.style === "ordered" ? "decimal" : "disc",
                      "& li": { display: "list-item" },
                    }}
                  >
                    {block.data.items.map((item, i) => (
                      <ListItem key={i} sx={{ p: 0, mb: 0.5 }}>
                        <Typography variant="body1" sx={{ color: "text.secondary" }}>
                          {DOMPurify.sanitize(item.content || item)}
                        </Typography>
                      </ListItem>
                    ))}
                  </MuiList>
                );
              case "image":
                return (
                  <Box key={block.id || index} sx={{ my: 2 }}>
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
                        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    {block.data.caption && (
                      <Typography variant="caption" sx={{ color: "text.secondary", mt: 1, display: "block", textAlign: "center" }}>
                        {DOMPurify.sanitize(block.data.caption)}
                      </Typography>
                    )}
                  </Box>
                );
              default:
                return <Typography key={block.id || index} color="warning">Неизвестный тип блока: {block.type}</Typography>;
            }
          })}
        </Box>
      );
    } catch (error) {
      console.error("Ошибка при рендеринге содержимого:", error);
      return <Typography color="error">Ошибка: {error.message}</Typography>;
    }
  };

  // Обработчик отправки отзыва
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

  // Переключение вкладок
  const handleChangeTab = (event, newValue) => setActiveTab(newValue);

  // Проверка завершения урока
  const isLessonCompleted = (lessonId) => {
    const progress = progresses.find((p) => p.lesson_id === lessonId);
    return progress?.status === "completed";
  };

  // Завершение урока
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

  // Выход из системы
  const handleLogout = () => {
    dispatch(logoutAction());
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Подсчет завершенных уроков
  const getCompletedLessonsCount = () => progresses.filter((p) => p.status === "completed").length;

  // Формирование массива блоков с приоритетами
  const contentBlocks = useMemo(() => {
    const blocks = [];

    // Блок EditorJS (основной контент урока или отзыв)
    blocks.push({
      priority: priorityConfig.EditorJS,
      component: (
        <Box sx={{ mb: 3 }} key="editorjs">
          {renderLessonContent()}
        </Box>
      ),
    });

    // Блок видео-материалов (только для не-обзорных уроков)
    if (!filteredLessons[activeTab]?.isReviewLesson) {
      blocks.push({
        priority: priorityConfig.Video,
        component: (
          <Box key="video">
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
          </Box>
        ),
      });
    }

    // Блок дополнительных материалов (только для не-обзорных уроков)
    if (!filteredLessons[activeTab]?.isReviewLesson) {
      blocks.push({
        priority: priorityConfig.AdditionalMaterials,
        component: (
          <Box key="materials">
            <Typography variant="h6" sx={{ color: "text.primary", mt: 4, mb: 2 }}>
              Дополнительные материалы:
            </Typography>
            {filteredMaterials.length > 0 ? (
              <MuiList>
                {filteredMaterials.map((material) => {
                  const updatedFilePath = material.file_path ? getUpdatedFilePath(material.file_path) : null;
                  return (
                    <ListItem
                      key={material.material_id}
                      sx={{ flexDirection: { xs: "column", sm: "row" }, alignItems: { xs: "flex-start", sm: "center" }, py: 1.5 }}
                    >
                      <ListItemText
                        primary={material.title}
                        primaryTypographyProps={{ color: "text.primary" }}
                        secondaryTypographyProps={{ color: "text.secondary" }}
                      />
                      {material.type === "test" || material.type === "opros" ? (
                        updatedFilePath ? (
                          <a href={updatedFilePath} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                            <Button
                              variant="outlined"
                              color="primary"
                              size="small"
                              sx={{ ml: { sm: 2 }, mt: { xs: 1, sm: 0 } }}
                            >
                              {material.type === "test" ? "Перейти к тесту" : "Перейти к опросу"}
                            </Button>
                          </a>
                        ) : (
                          <Typography sx={{ color: "text.secondary", ml: { sm: 2 }, mt: { xs: 1, sm: 0 } }}>
                            Ссылка недоступна
                          </Typography>
                        )
                      ) : (
                        updatedFilePath ? (
                          <Button
                            href={updatedFilePath}
                            download={material.title || "file"}
                            variant="outlined"
                            color="primary"
                            size="small"
                            sx={{ ml: { sm: 2 }, mt: { xs: 1, sm: 0 } }}
                          >
                            Скачать
                          </Button>
                        ) : (
                          <Typography sx={{ color: "text.secondary", ml: { sm: 2 }, mt: { xs: 1, sm: 0 } }}>
                            Файл недоступен
                          </Typography>
                        )
                      )}
                    </ListItem>
                  );
                })}
              </MuiList>
            ) : (
              <Typography sx={{ color: "text.secondary" }}>Нет доступных материалов.</Typography>
            )}
          </Box>
        ),
      });
    }

    // Сортировка блоков по приоритету
    return blocks.sort((a, b) => a.priority - b.priority);
  }, [
    priorityConfig,
    filteredLessons,
    activeTab,
    renderLessonContent,
    videoMaterials,
    filteredMaterials,
    theme,
    userInfo,
    isSubmittingReview,
  ]);

  // Обработка случая отсутствия токена
  if (!token) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", bgcolor: "background.default" }}>
          <Typography sx={{ color: "text.primary" }}>Loading...</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  // Обработка случая отсутствия уроков
  if (!filteredLessons || filteredLessons.length === 0) {
    return (
      <ThemeProvider theme={theme}>
        <Box sx={{ p: 3, textAlign: "center", bgcolor: "background.default", minHeight: "100vh" }}>
          <TopMenu userInfo={userInfo} handleLogout={handleLogout} />
          <Typography variant="h6" sx={{ color: "text.primary" }}>Нет доступных уроков.</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  // Основной рендеринг страницы
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
        <style jsx>{`
          .review-editor .ce-inline-toolbar__actions .ce-inline-tool--add {
            right: 130%;
          }
        `}</style>
        <TopMenu userInfo={userInfo} handleLogout={handleLogout} />
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            minHeight: "calc(100vh - 64px)",
            p: { xs: 2, sm: 3 },
            zIndex: 1,
          }}
        >
          <Tabs
            orientation={isMobile ? "horizontal" : "vertical"}
            variant="scrollable"
            value={activeTab}
            onChange={handleChangeTab}
            sx={{
              width: { xs: "100%", sm: "280px" },
              maxHeight: { xs: "auto", sm: "calc(100vh - 64px)" },
              overflowY: "auto",
              flexShrink: 0,
              mr: { sm: 3 },
            }}
          >
            {filteredLessons.map((lesson, index) => (
              <Tab
                key={lesson.id}
                label={lesson.title}
                sx={{
                  textTransform: "none",
                  fontWeight: 500,
                  color: "text.secondary",
                  "&.Mui-selected": { color: "primary.main" },
                  "&:hover": { color: "primary.main" },
                  py: 2,
                }}
              />
            ))}
          </Tabs>

          <Box sx={{ flexGrow: 1 }}>
            <Paper elevation={3} sx={{ p: { xs: 2, sm: 4 } }}>
              <LinearProgress
                variant="determinate"
                value={(getCompletedLessonsCount() / filteredLessons.length) * 100 || 0}
                sx={{ mb: 3 }}
              />
              <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                Пройдено {getCompletedLessonsCount()} из {filteredLessons.length} уроков
              </Typography>

              <Typography variant="h6" sx={{ color: "text.primary", mb: 3 }}>
                {filteredLessons[activeTab].title}
              </Typography>

              {filteredLessons[activeTab].image && (
                <Box
                  component="img"
                  src={filteredLessons[activeTab].image}
                  alt={`Lesson ${activeTab + 1}`}
                  sx={{ width: "100%", height: "auto", maxHeight: "350px", objectFit: "cover", borderRadius: "8px", mb: 3 }}
                />
              )}

              {/* Рендеринг блоков в порядке приоритета */}
              {contentBlocks.map((block) => block.component)}

              <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
                <Button
                  variant="contained"
                  color={isLessonCompleted(filteredLessons[activeTab]?.id) ? "secondary" : "primary"}
                  onClick={() => handleCompleteLesson(filteredLessons[activeTab]?.id)}
                  disabled={isLessonCompleted(filteredLessons[activeTab]?.id)}
                  sx={{ width: { xs: "100%", sm: "200px" } }}
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