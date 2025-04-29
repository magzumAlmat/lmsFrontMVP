// "use client";
// import React, { useState, useEffect } from "react";
// import { Container, Box, AppBar, Toolbar, Typography, Button, Paper, Grow } from "@mui/material";
// import Link from "next/link";
// import jwtDecode from "jwt-decode";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { getAllCoursesAction, logoutAction } from "@/store/slices/authSlice";

// export default function Layout({ children }) {
//   const isAuth = useSelector((state) => state.auth.isAuth);
//   const userData = useSelector((state) => state.auth.currentUser);
//   const [userInfo, setUserInfo] = useState([]);
//   const token = localStorage.getItem("token");
//   const [lessons, setLessons] = useState([]); // Инициализируем как пустой массив
//   const { courses, loadingCourses, coursesError } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const [progress, setProgress] = useState([]);
//   let UserID = userInfo.id;

//   if (!token) {
//     console.error("Token not available");
//     return null;
//   }

//   let decodedToken;
//   try {
//     decodedToken = jwtDecode(token);
//     console.log("Decoded token:", decodedToken, decodedToken.username);
//   } catch (error) {
//     console.error("Invalid token:", error);
//     return null;
//   }

//   useEffect(() => {
//     fetchLessons();
//     fetchProgresses();
//     fetchUserInfo();
//     dispatch(getAllCoursesAction());
    
//   }, []);

//   useEffect(() => {
//     if (progress.length > 0) {
//       console.log("Fetched progresses:", progress);
//     }
//   }, [progress]);

//   const fetchLessons = async () => {
//     try {
//       const response = await axios.get(`${host}/api/lessons");
//       setLessons(response.data); // Устанавливаем данные lessons
//     } catch (error) {
//       console.error("Ошибка при загрузке уроков:", error);
//       setLessons([]); // В случае ошибки устанавливаем пустой массив
//     }
//   };

//   const fetchUserInfo = async () => {
//     try {
//       const response = await axios.get(`${host}/api/auth/getAuthentificatedUserInfo", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (response.status === 200) {
//         setUserInfo(response.data);
//       } else {
//         console.error("Server returned an error:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error fetching user info:", error.message);
//     }
//   };

//   const fetchProgresses = async () => {
//     try {
//       const response = await axios.get(`${host}/api/progresses", {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });
//       if (response.status === 200) {
//         setProgress(response.data);
//       } else {
//         console.error("Server returned an error:", response.statusText);
//       }
//     } catch (error) {
//       console.error("Error fetching progresses:", error.message);
//     }
//   };

//   const handleLogout = () => {
//     dispatch(logoutAction()); // Диспатчим действие logout из Redux
//     localStorage.removeItem("token"); // Удаляем токен из localStorage
//     window.location.href = "/login"; // Перенаправляем пользователя на страницу входа
//   };

//   const renderMenuByRole = () => {
//     if (userInfo.roleId === 1) {
//       // Администратор
//       return (
//         <Box sx={{ display: "flex", gap: 2 }}>
//           <Button color="inherit" component={Link} href="/layout">
//             Главная
//           </Button>
//           <Button color="inherit" component={Link} href="/addrole">
//             Добавить роль
//           </Button>
//           <Button color="inherit" component={Link} href="/profile">
//             Профиль
//           </Button>
//           <Button color="inherit" component={Link} href="/admin">
//             Админ-панель
//           </Button>
//           <Button color="inherit" onClick={handleLogout}>
//             Выйти
//           </Button>
//         </Box>
//       );
//     } else if (userInfo.roleId === 2) {
//       // Учитель
//       return (
//         <Box sx={{ display: "flex", gap: 2 }}>
//           <Button color="inherit" component={Link} href="/layout">
//             Главная
//           </Button>
//           <Button color="inherit" component={Link} href="/addcourse">
//             Курсы
//           </Button>
//           <Button color="inherit" component={Link} href="/addlessons">
//             Предметы
//           </Button>
//           <Button color="inherit" component={Link} href="/addmaterial">
//             Материалы
//           </Button>
//           <Button color="inherit" component={Link} href="/profile">
//             Профиль
//           </Button>
//           <Button color="inherit" onClick={handleLogout}>
//             Выйти
//           </Button>
//         </Box>
//       );
//     } else if (userInfo.roleId === 3) {
//       // Студент
//       return (
//         <Box sx={{ display: "flex", gap: 2 }}>
//           <Button color="inherit" component={Link} href="/layout">
//             Главная
//           </Button>
//           <Button color="inherit" component={Link} href="/courses">
//             Курсы
//           </Button>
//           <Button color="inherit" component={Link} href="/progress">
//             Прогресс
//           </Button>
//           <Button color="inherit" component={Link} href="/profile">
//             Профиль
//           </Button>
//           <Button color="inherit" onClick={handleLogout}>
//             Выйти
//           </Button>
//         </Box>
//       );
//     } else {
//       // Роль не определена
//       return (
//         <Box sx={{ display: "flex", gap: 2 }}>
//           <Button color="inherit" component={Link} href="/layout">
//             Главная
//           </Button>
//           <Button color="inherit" component={Link} href="/login">
//             Войти
//           </Button>
//         </Box>
//       );
//     }
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         flexDirection: "column",
//         height: "100vh",
//         bgcolor: "#f4f6f8",
//         fontFamily: "'Roboto', sans-serif",
//         overflow: "hidden",
//       }}
//     >
//       {/* Верхнее меню */}
//       <AppBar position="static" elevation={0} sx={{ bgcolor: "#1976d2", borderBottom: "2px solid #1565c0" }}>
//         <Toolbar sx={{ justifyContent: "space-between" }}>
//           <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold", color: "#fff" }}>
//             Учебная платформа
//           </Typography>
//           {renderMenuByRole()}
//         </Toolbar>
//       </AppBar>
//       {/* Основной контейнер */}
//       <Container maxWidth="md" sx={{ mt: 4, flexGrow: 1 }}>
//         <h1>Привет {userInfo.name}</h1>
//         <Grow in={true} timeout={1000}>
//           <Paper elevation={4} sx={{ p: 4, borderRadius: 3, bgcolor: "white", width: "100%" }}>
//             {children}
//             <Box sx={{ mt: 4 }}>{renderContentByRole(userInfo, progress, UserID)}</Box>
//           </Paper>
//         </Grow>
//       </Container>
//       {/* Футер */}
//       <Box component="footer" sx={{ textAlign: "center", p: 2, bgcolor: "#e0e0e0", mt: "auto" }}>
//         <Typography variant="body2" sx={{ fontWeight: "bold", color: "#555" }}>
//           © 2025 Учебная платформа. Все права защищены.
//         </Typography>
//       </Box>
//     </Box>
//   );
// }

// // Функция для вывода контента в зависимости от роли
// // const renderContentByRole = (userInfo, progress, UserID) => {
// //   if (userInfo.roleId === 1) {
// //     // Администратор
// //     return (
// //       <Box>
// //         <Typography variant="h5">Админ-панель</Typography>
// //         <ul>
// //           {courses.map((course) => (
// //             <li key={course.id}>{course.title}</li>
// //           ))}
// //         </ul>
// //       </Box>
// //     );
// //   } else if (userInfo.roleId === 2) {
// //     // Учитель
// //     return (
// //       <Box>
// //         <Typography variant="h5">Панель учителя</Typography>
// //         <ul>
// //             {progress
// //               .filter((item) => item.user_id === UserID)
// //               .map((item, index) => {
// //                 const lesson = lessons.find((les) => les.id === item.lesson_id);
// //                 return (
// //                   <li key={item.id || index}> {/* Use `index` as a fallback if `item.id` is missing */}
// //                     Статус: {item.status} по предмету {lesson ? lesson.title || lesson.content : "Данные не доступны"}
// //                   </li>
// //                 );
// //               })}
// //           </ul>
// //       </Box>
// //     );
// //   } else if (userInfo.roleId === 3) {
// //     // Студент
// //     const latestItem = progress
// //       .filter((item) => item.user_id === UserID)
// //       .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
// //     if (latestItem) {
// //       // Проверка на наличие lessons
// //       if (!lessons || lessons.length === 0) {
// //         return <Typography variant="body1">Данные по предметам не доступны</Typography>;
// //       }
// //       const lesson = lessons.find((les) => les.id === latestItem.lesson_id);
// //       return (
// //         <Box>
// //           <Typography variant="h5">Последний прогресс</Typography>
// //           <ul>
// //             <li>
// //               Статус: {latestItem.status} по предмету {lesson ? lesson.title || lesson.content : "Данные не доступны"}
// //             </li>
// //           </ul>
// //         </Box>
// //       );
// //     } else {
// //       return <Typography variant="body1">No data available</Typography>;
// //     }
// //   } else {
// //     return <Typography variant="body1">Роль не определена</Typography>;
// //   }
// // };

// const renderContentByRole = (userInfo, progress, UserID) => {
//   if (userInfo.roleId === 1) {
//     // Администратор
//     return (
//       <Box>
//         <Typography variant="h5">Админ-панель</Typography>
//         <ul>
//           {courses.map((course) => (
//             <li key={course.id}>{course.title}</li>
//           ))}
//         </ul>
//       </Box>
//     );
//   } else if (userInfo.roleId === 2) {
//     // Учитель
//     return (
//       <Box>
//         <Typography variant="h5">Панель учителя</Typography>
//         <ul>
//           {progress
//             .filter((item) => item.user_id === UserID)
//             .map((item, index) => {
//               if (!lessons || lessons.length === 0) {
//                 return <li key={index}>Данные по предметам не доступны</li>;
//               }
//               const lesson = lessons.find((les) => les.id === item.lesson_id);
//               return (
//                 <li key={item.id || index}>
//                   Статус: {item.status} по предмету {lesson ? lesson.title || lesson.content : "Данные не доступны"}
//                 </li>
//               );
//             })}
//         </ul>
//       </Box>
//     );
//   } else if (userInfo.roleId === 3) {
//     // Студент
//     const latestItem = progress
//       .filter((item) => item.user_id === UserID)
//       .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
//     if (latestItem) {
//       if (!lessons || lessons.length === 0) {
//         return <Typography variant="body1">Данные по предметам не доступны</Typography>;
//       }
//       const lesson = lessons.find((les) => les.id === latestItem.lesson_id);
//       return (
//         <Box>
//           <Typography variant="h5">Последний прогресс</Typography>
//           <ul>
//             <li key={latestItem.id}>
//               Статус: {latestItem.status} по предмету {lesson ? lesson.title || lesson.content : "Данные не доступны"}
//             </li>
//           </ul>
//         </Box>
//       );
//     } else {
//       return <Typography variant="body1">No data available</Typography>;
//     }
//   } else {
//     return <Typography variant="body1">Роль не определена</Typography>;
//   }
// };







"use client";
import React, { useState, useEffect } from "react";
import { Container, Box, AppBar, Toolbar, Typography, Button, Paper, Grow } from "@mui/material";
import Link from "next/link";
import jwtDecode from "jwt-decode";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getAllCoursesAction, logoutAction, getUserInfo, getUserInfoAction } from "../../store/slices/authSlice";
import useTokenFromURL from "../../components/useTokenFromURL";
import TopMenu from "../../components/topmenu";
import { useRouter } from "next/navigation";

export default function Layout({ children }) {
  // Инициализация состояния и хуков
  const isAuth = useSelector((state) => state.auth.isAuth);
  const userData = useSelector((state) => state.auth.currentUser);
  const [userInfo, setUserInfo] = useState(null); // Инициализируем как null
  // const token = localStorage.getItem("token");
  const [lessons, setLessons] = useState([]); // Уроки
  const [progress, setProgress] = useState([]); // Прогресс
  const dispatch = useDispatch();
  const [token, setToken] = useState(null);
  //const token = localStorage.getItem("token");
  // Проверка наличия токена
  const host=process.env.NEXT_PUBLIC_HOST
  const router=useRouter()
  // Декодирование токена
 

  
   useEffect(() => {
      const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
      setToken(storedToken);
  
      if (!storedToken) {
        //  setTimeout(20000)
        router.push("/login");
        console.log('StoredToken= ',storedToken)
      }
  



    }, [router]);
    


  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log("3. Decoded token:", decoded);
      localStorage.setItem("token", token);
      console.log("4. Token saved to localStorage:", localStorage.getItem("token"));
    } catch (error) {
      console.error("5. Invalid token:", error.message);
    }
  } else {
    // console.error("6. Token not found in URL");
  }

  // Вызов хука для обработки токена из URL
  useTokenFromURL();

  

  // Эффект для загрузки данных при монтировании компонента
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
         dispatch(getAllCoursesAction());
        //  dispatch(getUserInfo());
         fetchUserInfo()
         fetchLessons();
        //  fetchProgresses();
        // dispatch(getUserInfoAction())
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchInitialData();
  }, [dispatch]);

  // Функция для загрузки уроков
  const fetchUserInfo = async () => {
    console.log('host= ',host)
    const token = localStorage.getItem("token");
    try {
      const response = await axios.get(`${host}/api/auth/getAuthentificatedUserInfo`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserInfo(response.data);
    } catch (err) {
      console.error('Ошибка при загрузке информации о пользователе:', err);
      if (err.response && err.response.status === 401) {
        // Перенаправляем на страницу логина при 401
        console.log('Перенаправляю на логин',err.response)
        router.push('/login');
      }
    }
  };

  const fetchLessons = async () => {
    console.log('host= ',host)
    try {
      const response = await axios.get(`${host}/api/lessons`);
      setLessons(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке уроков:", error);
      setLessons([]);
    }
  };

  // Функция для загрузки прогресса
  // const fetchProgresses = async () => {
  //   try {
  //     const response = await axios.get(`${host}/api/progresses`, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     if (response.status === 200) {
  //       setProgress(response.data);
  //     } else {
  //       console.error("Server returned an error:", response.statusText);
  //     }
  //   } catch (error) {
  //     console.error("Error fetching progresses:", error.message);
  //   }
  // };

  // Обработка выхода из системы
  // const handleLogout = () => {
  //   dispatch(logoutAction());
  //   localStorage.removeItem("token");
  //   window.location.href = "/login";
  // };

  // Отрисовка меню в зависимости от роли пользователя
  // const renderMenuByRole = () => {
  //   if (!userInfo) return null;

  //   if (userInfo.roleId === 1) {
  //     // Администратор
  //     return (
  //       <>
  //          <Button color="inherit" component={Link} href="/layout">
  //           Главная
  //         </Button>
  //         <Button color="inherit" component={Link} href="/addrole">
  //           Добавить роль
  //         </Button>
  //         <Button color="inherit" component={Link} href="/profile">
  //           Профиль
  //         </Button>
  //         <Button color="inherit" component={Link} href="/admin">
  //           Админ-панель
  //         </Button>
  //         <Button color="inherit" onClick={handleLogout}>
  //           Выйти
  //         </Button>
  //       </>
  //     );
  //   } else if (userInfo.roleId === 2) {
  //     // Учитель
  //     return (
  //       <>
        
  //          <Button color="inherit" component={Link} href="/layout">
  //            Главная
  //          </Button>
  //          <Button color="inherit" component={Link} href="/addstreams">
  //            Потоки
  //          </Button>
  //          <Button color="inherit" component={Link} href="/addcourse">
  //            Курсы
  //          </Button>
  //          <Button color="inherit" component={Link} href="/addlessons">
  //            Предметы
  //          </Button>
  //          <Button color="inherit" component={Link} href="/addmaterial">
  //            Материалы
  //          </Button>
  //          <Button color="inherit" component={Link} href="/progressstatus">
  //            Прогресс
  //          </Button>
         
  //          <Button color="inherit" component={Link} href="/profile">
  //            Профиль
  //          </Button>
  //          <Button color="inherit" onClick={handleLogout}>
  //            Выйти
  //          </Button>
  //       </>
  //     );
  //   } else if (userInfo.roleId === 3) {
  //     // Студент
  //     return (
  //       <>
  //         <Button color="inherit" component={Link} href="/layout">
  //           Главная
  //         </Button>
  //         <Button color="inherit" component={Link} href="/courses">
  //           Курсы
  //         </Button>
  //         <Button color="inherit" component={Link} href="/progress">
  //           Прогресс
  //         </Button>
  //         <Button color="inherit" component={Link} href="/profile">
  //           Профиль
  //         </Button>
  //         <Button color="inherit" onClick={handleLogout}>
  //           Выйти
  //         </Button>
  //       </>
  //     );
  //   } else {
  //     // Роль не определена
  //     return (
  //       <>
  //         <Link href="/noauth">Главная</Link>
  //         <Button color="inherit" onClick={handleLogout}>
  //           Выйти
  //         </Button>
  //       </>
  //     );
  //   }
  // };

  // Отрисовка контента в зависимости от роли пользователя
  // const renderContentByRole = (courses) => {
  //   console.log('userINFO= ',userInfo)
  //   if (!userInfo) return null;

  //   if (userInfo.roleId === 1) {
  //     // Администратор
  //     return (
  //       <div>
  //         <h2>Админ-панель</h2>
  //         {courses && courses.length > 0 ? (
  //           courses.map((course) => <div key={course.id}>{course.title}</div>)
  //         ) : (
  //           <p>Нет доступных курсов.</p>
  //         )}
  //       </div>
  //     );
  //   } else if (userInfo.roleId === 2) {
  //     // Учитель
  //     return (
  //       <div>
  //         <h2>Панель учителя</h2>
  //         {courses && courses.length > 0 ? (
  //           courses.map((course) => <div key={course.id}>{course.title}</div>)
  //         ) : (
  //           <p>Нет доступных курсов.</p>
  //         )}
  //       </div>
  //     );
  //   } else if (userInfo.roleId === 3) {

  //     // Студент
  //     const latestItem = progress
  //       .filter((item) => item.user_id === userInfo.id)
  //       .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];

  //     if (latestItem) {
  //       const lesson = lessons.find((les) => les.id === latestItem.lesson_id);
  //       return (
  //         <div>
       
  //           <h2>Последний прогресс</h2>
  //           <p>
  //             Статус: {latestItem.status} по предмету{" "}
  //             {lesson ? lesson.title || lesson.content : "Данные не доступны"}
  //           </p>
  //         </div>
  //       );
  //     } else {
  //       return <p>Нет данных о прогрессе.</p>;
  //     }
  //   } else {
  //     return <p>Роль не определена.</p>;
  //   }
  // };

  // Возвращаем JSX
  return (
    <TopMenu userInfo={userInfo}  />

    // <Box
    //   sx={{
    //     display: "flex",
    //     flexDirection: "column",
    //     height: "100vh",
    //     bgcolor: "#f4f6f8",
    //     fontFamily: "'Roboto', sans-serif",
    //     overflow: "hidden",
    //   }}
    // >
    //   {/* Верхнее меню */}
    //   <AppBar position="static">
    //     <Toolbar>
    //       <Typography variant="h6">Kazniisa LMS</Typography>
    //       {renderMenuByRole()}
    //     </Toolbar>
    //   </AppBar>

    //   {/* Основной контейнер */}
    //   <Container>
    //   <Box mt={4}>

    //     <Typography variant="h5">Привет, {userInfo?.name}</Typography>
    //     {children}
    //     {renderContentByRole()}
    //   </Box>
    //   </Container>
    //   {/* Футер */}
    
   
    //     <Box component="footer" sx={{ textAlign: "center", p: 2, bgcolor: "#e0e0e0", mt: "auto" }}>
    //             <Typography variant="body2" sx={{ fontWeight: "bold", color: "#555" }}>
    //               © 2025 Учебная платформа. Все права защищены.
    //             </Typography>
    //     </Box>
    // </Box>
  );
}





  <Box
        sx={{
          bgcolor: theme.palette.background.default,
          minHeight: "100vh",
          backgroundImage: `url(/background.jpg)`, // Исправлено "backgound" на "background"
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      ></Box>