// // src/app/courses/ClientCourses.js
// "use client";
// import React, { useState, useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { getAllCoursesAction, logoutAction } from "../../store/slices/authSlice";
// import {
//   Card,
//   CardContent,
//   CardActions,
//   Button,
//   Typography,
//   Container,
//   Grid,
//   CircularProgress,
//   Box,
// } from "@mui/material";
// import Link from "next/link";
// import TopMenu from "../../components/topmenu";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { createTheme, ThemeProvider } from "@mui/material/styles";
// import { useTranslation } from "react-i18next";

// // Определяем тему внутри клиентского компонента
// const theme = createTheme({
//   palette: {
//     primary: { main: "#009eb0",  //бирюзовый
//       contrastText: "#fff" },
//     secondary: { main: "#009eb0",

//      },

//     background: { default: "#1f2937", 
//       paper: "#657894" //черный
//     },
//     text: { primary: "#fff", secondary: "#d1d5db" },
//   },
//   typography: {
//     fontFamily: "'Open Sans', sans-serif",
//     h4: { fontWeight: 600 },
//     h6: { fontWeight: 500 },
//     body2: { fontWeight: 400 },
//   },
//   components: {
//     MuiButton: {
//       styleOverrides: {
//         root: {
//           textTransform: "none",
//           borderRadius: "8px",
//           padding: "8px 16px",
//           transition: "all 0.2s ease-in-out",
//         },
//       },
//     },
//     MuiCard: {
//       styleOverrides: {
//         root: {
//           borderRadius: "12px",
//           boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
//           transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
//           "&:hover": {
//             transform: "translateY(-4px)",
//             boxShadow: "0 6px 20px rgba(16, 185, 129, 0.3)",
//           },
//         },
//       },
//     },
//   },
// });

// export default function ClientCourses() {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const { t } = useTranslation();
//   const { courses: reduxCourses, loadingCourses, coursesError } = useSelector((state) => state.auth);
//   const [userInfo, setUserInfo] = useState(null);
//   const [progresses, setProgresses] = useState({});
//   const [token, setToken] = useState(null);
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const host = process.env.NEXT_PUBLIC_HOST;

//   useEffect(() => {
//     const storedToken = localStorage.getItem("token");
//     setToken(storedToken);

//     if (!storedToken) {
//       console.log("Токен отсутствует, перенаправляем на /login");
//       router.push("/login");
//       setLoading(false);
//       return;
//     }

//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         console.log("Используемый токен:", storedToken);

//         // Проверяем валидность токена через запрос к серверу
//         const userResponse = await axios.get(`${host}/api/auth/getAuthentificatedUserInfo`, {
//           headers: { Authorization: `Bearer ${storedToken}` },
//           timeout: 5000,
//         });
//         setUserInfo(userResponse.data);

//         // Загружаем курсы только после успешной проверки токена
//         const coursesResult = await dispatch(getAllCoursesAction());
//         setCourses(coursesResult || []);
//       } catch (err) {
//         console.error("Ошибка при загрузке данных:", err);
//         if (err.response && err.response.status === 401) {
//           console.log("Токен недействителен, очищаем и перенаправляем на /login");
//           dispatch(logoutAction());
//           localStorage.removeItem("token");
//           router.push("/login");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [router, dispatch]);

//   const fetchAllProgresses = async (userId, courseId) => {
//     try {
//       const response = await axios.get(`${host}/api/course/progress/${userId}/${courseId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//         timeout: 5000,
//       });
//       const data = response.data.course_progress;
//       setProgresses((prev) => ({ ...prev, [courseId]: data }));
//     } catch (error) {
//       console.error("Ошибка при получении прогресса:", error);
//       if (error.response && error.response.status === 401) {
//         console.log("Ошибка авторизации при загрузке прогресса, перенаправляем на /login");
//         dispatch(logoutAction());
//         localStorage.removeItem("token");
//         router.push("/login");
//       }
//     }
//   };

//   useEffect(() => {
//     if (!userInfo || !courses || courses.length === 0 || !token) return;

//     const fetchProgress = async () => {
//       try {
//         await Promise.all(courses.map((course) => fetchAllProgresses(userInfo.id, course.id)));
//       } catch (error) {
//         console.error("Ошибка при загрузке прогресса:", error);
//         if (error.response && error.response.status === 401) {
//           console.log("Ошибка авторизации при загрузке прогресса, перенаправляем на /login");
//           dispatch(logoutAction());
//           localStorage.removeItem("token");
//           router.push("/login");
//         }
//       }
//     };

//     fetchProgress();
//   }, [userInfo, courses, token]);

//   const handleLogout = () => {
//     dispatch(logoutAction());
//     localStorage.removeItem("token");
//     router.push("/login");
//   };

//   if (!token || loading || loadingCourses) {
//     return (
//       <ThemeProvider theme={theme}>
//         <Box
//           sx={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             height: "100vh",
//             bgcolor: "background.default",
//           }}
//         >
//           <CircularProgress sx={{ color: "primary.main" }} />
//           <Typography sx={{ ml: 2, color: "text.primary" }}>{t("courses.loading")}</Typography>
//         </Box>
//       </ThemeProvider>
//     );
//   }

//   if (coursesError) {
//     return (
//       <ThemeProvider theme={theme}>
//         <Container sx={{ py: 4, bgcolor: "background.default" }}>
//           <Typography variant="h6" color="error" align="center" sx={{ color: "#ef4444", fontSize: "1.5rem" }}>
//             {t("courses.error", { message: coursesError })}
//           </Typography>
//         </Container>
//       </ThemeProvider>
//     );
//   }

//   return (
//     <ThemeProvider theme={theme}>
//        <Box
//                      sx={{
//                        bgcolor: theme.palette.background.default,
//                        minHeight: "100vh",
//                        backgroundImage: `url(/background.jpg)`, // Исправлено "backgound" на "background"
//                        backgroundSize: "cover",
//                        backgroundPosition: "center",
//                        backgroundRepeat: "no-repeat",
//                      }}
//                    >
//         <TopMenu userInfo={userInfo} handleLogout={handleLogout} />
//         <Container sx={{ py: { xs: 4, sm: 6 }, px: { xs: 2, sm: 3 } }}>
//           <Typography
//             variant="h4"
//             gutterBottom
//             sx={{
//               color: "   #235dff",
//               fontFamily: "'Open Sans', sans-serif",
//               textAlign: "center",
//               mb: { xs: 4, sm: 6 },
//               fontSize: { xs: "1.75rem", sm: "2.25rem" },
//             }}
//           >
//             {t("courses.title")}
//           </Typography>
//           {courses.length === 0 ? (
//             <Typography variant="h6" align="center" sx={{ color: "text.secondary", fontSize: "1.5rem" }}>
//               {t("courses.noCourses")}
//             </Typography>
//           ) : (
//             <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
//               {courses.map((course) => (
//                 <Grid item key={course.id} xs={12} sm={6} md={4} lg={3}>
//                   <Card
//                     sx={{
//                       height: "100%",
//                       display: "flex",
//                       flexDirection: "column",
//                       bgcolor: "background.paper",
//                       border: `1px solid ${theme.palette.primary.main}`,
//                       color:'#657894'
//                     }}
//                   >
//                     <CardContent sx={{ flexGrow: 1, p: 3 }}>
//                       <Typography
//                         variant="h6"
//                         component="div"
//                         gutterBottom
//                         sx={{ color: "text.primary", fontSize: { xs: "1.125rem", sm: "1.25rem" } ,}}
//                       >
//                         {course.title}
//                       </Typography>
//                       <Typography
//                         variant="body2"
//                         sx={{ color: "text.secondary", fontSize: { xs: "0.875rem", sm: "1rem" }, mb: 1 }}
//                       >
//                         {course.description || t("courses.descriptionPlaceholder")}
//                       </Typography>
//                       <Typography
//                         variant="body2"
//                         sx={{ color: "secondary.main", fontSize: { xs: "0.75rem", sm: "0.875rem" } }}
//                       >
//                         {t("courses.progress", { value: progresses[course.id] || 0 })}
//                       </Typography>
//                     </CardContent>
//                     <CardActions sx={{ p: 2 }}>
//                       <Button
//                         component={Link}
//                         href={`/courses/${course.id}`}
//                         variant="contained"
//                         color="primary"
//                         fullWidth
//                         sx={{
//                           fontSize: { xs: "0.875rem", sm: "1rem" },
//                           py: 1,
//                           "&:hover": { bgcolor: "primary.dark", transform: "scale(1.02)" },
//                         }}
//                       >
//                         {t("courses.goToCourse")}
//                       </Button>
//                     </CardActions>
//                   </Card>
//                 </Grid>
//               ))}
//             </Grid>
//           )}
//         </Container>
//       </Box>
//     </ThemeProvider>
//   );
// }




"use client";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllCoursesAction, logoutAction } from "../../store/slices/authSlice";
import {
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Container,
  Grid,
  CircularProgress,
  Box,
} from "@mui/material";
import Link from "next/link";
import TopMenu from "../../components/topmenu";
import axios from "axios";
import { useRouter } from "next/navigation";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useTranslation } from "react-i18next";
import dynamic from "next/dynamic";

const EditorJS = dynamic(() => import("@editorjs/editorjs").then((mod) => mod.default), { ssr: false });
const Header = dynamic(() => import("@editorjs/header").then((mod) => mod.default), { ssr: false });
const List = dynamic(() => import("@editorjs/list").then((mod) => mod.default), { ssr: false });

// Определяем тему
// Тема остается прежней
const theme = createTheme({
  palette: {
    primary: { main: "#009eb0", contrastText: "#fff" }, // Бирюзовый
    secondary: { main: "#1e3a8a", contrastText: "#fff" }, // Глубокий синий
    background: {
      default: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)", // Мягкий градиент фона
      paper: "#ffffff", // Белый для карточек
    },
    text: { primary: "#1e293b", secondary: "#64748b" }, // Темный текст для контраста
  },
  typography: {
    fontFamily: "'Open Sans', sans-serif",
    h4: { fontWeight: 700, letterSpacing: "-0.5px" }, // Жирный заголовок
    h6: { fontWeight: 600 },
    body2: { fontWeight: 400, lineHeight: 1.5 },
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
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          border: "1px solid rgba(0, 158, 176, 0.2)",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 8px 20px rgba(0, 158, 176, 0.3)",
          },
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

export default function ClientCourses() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { t } = useTranslation();
  const { courses: reduxCourses, loadingCourses, coursesError } = useSelector((state) => state.auth);
  const [userInfo, setUserInfo] = useState(null);
  const [progresses, setProgresses] = useState({});
  const [token, setToken] = useState(null);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const host = process.env.NEXT_PUBLIC_HOST;

   useEffect(() => {
        const storedToken = localStorage.getItem("token");
        setToken(storedToken);
    
        if (!storedToken) {
          console.log("Токен отсутствует, перенаправляем на /login");
          router.push("/login");
          setLoading(false);
          return;
        }
    
        const fetchData = async () => {
          try {
            setLoading(true);
            console.log("Используемый токен:", storedToken);
    
            // Проверяем валидность токена через запрос к серверу
            const userResponse = await axios.get(`${host}/api/auth/getAuthentificatedUserInfo`, {
              headers: { Authorization: `Bearer ${storedToken}` },
              timeout: 5000,
            });
            setUserInfo(userResponse.data);
    
            // Загружаем курсы только после успешной проверки токена
            const coursesResult = await dispatch(getAllCoursesAction());
            setCourses(coursesResult || []);
          } catch (err) {
            console.error("Ошибка при загрузке данных:", err);
            if (err.response && err.response.status === 401) {
              console.log("Токен недействителен, очищаем и перенаправляем на /login");
              dispatch(logoutAction());
              localStorage.removeItem("token");
              router.push("/login");
            }
          } finally {
            setLoading(false);
          }
        };
    
        fetchData();
      }, [router, dispatch]);
    
      const fetchAllProgresses = async (userId, courseId) => {
        try {
          const response = await axios.get(`${host}/api/course/progress/${userId}/${courseId}`, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000,
          });
          const data = response.data.course_progress;
          setProgresses((prev) => ({ ...prev, [courseId]: data }));
        } catch (error) {
          console.error("Ошибка при получении прогресса:", error);
          if (error.response && error.response.status === 401) {
            console.log("Ошибка авторизации при загрузке прогресса, перенаправляем на /login");
            dispatch(logoutAction());
            localStorage.removeItem("token");
            router.push("/login");
          }
        }
      };
    
      useEffect(() => {
        if (!userInfo || !courses || courses.length === 0 || !token) return;
    
        const fetchProgress = async () => {
          try {
            await Promise.all(courses.map((course) => fetchAllProgresses(userInfo.id, course.id)));
          } catch (error) {
            console.error("Ошибка при загрузке прогресса:", error);
            if (error.response && error.response.status === 401) {
              console.log("Ошибка авторизации при загрузке прогресса, перенаправляем на /login");
              dispatch(logoutAction());
              localStorage.removeItem("token");
              router.push("/login");
            }
          }
        };
    
        fetchProgress();
      }, [userInfo, courses, token]);
    
      const handleLogout = () => {
        dispatch(logoutAction());
        localStorage.removeItem("token");
        router.push("/login");
      };
    
  if (!token || loading || loadingCourses) {
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
          <Typography sx={{ ml: 2, color: "text.primary" }}>{t("courses.loading")}</Typography>
        </Box>
      </ThemeProvider>
    );
  }

  if (coursesError) {
    return (
      <ThemeProvider theme={theme}>
        <Container sx={{ py: 4, bgcolor: "background.default" }}>
          <Typography variant="h6" color="error" align="center">
            {t("courses.error", { message: coursesError })}
          </Typography>
        </Container>
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
        <Container sx={{ py: { xs: 4, sm: 6 }, zIndex: 1 }}>
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              color: "text.primary",
              textAlign: "center",
              mb: { xs: 4, sm: 6 },
              fontSize: { xs: "1.75rem", sm: "2.25rem" },
            }}
          >
            {t("courses.title")}
          </Typography>
          {courses.length === 0 ? (
            <Typography variant="h6" align="center" sx={{ color: "text.secondary" }}>
              {t("courses.noCourses")}
            </Typography>
          ) : (
            <Grid container spacing={{ xs: 2, sm: 3, md: 4 }} justifyContent="center">
              {courses.map((course) => (
                <Grid item key={course.id} xs={12} sm={6} md={4}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      bgcolor: "background.paper",
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1, p: 3 }}>
                      <Typography variant="h6" component="div" gutterBottom sx={{ color: "text.primary" }}>
                        {course.title}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
                        {course.description || t("courses.descriptionPlaceholder")}
                      </Typography>
                      <Typography variant="body2" sx={{ color: "primary.main" }}>
                        {t("courses.progress", { value: progresses[course.id] || 0 })}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ p: 2 }}>
                      <Button
                        component={Link}
                        href={`/courses/${course.id}`}
                        variant="contained"
                        color="primary"
                        fullWidth
                      >
                        {t("courses.goToCourse")}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}