// "use client";
// import React, { useEffect, useRef, useState } from "react";
// import axios from "axios";
// import dynamic from "next/dynamic";
// import {
//   Container,
//   Box,
//   Typography,
//   TextField,
//   Button,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   List as MuiList,
//   ListItem,
//   ListItemText,
//   ListItemSecondaryAction,
//   IconButton,
//   Paper,
//   CircularProgress,
//   Checkbox,
//   FormControlLabel,
// } from "@mui/material";
// import { Edit, Delete } from "@mui/icons-material";
// import { useDispatch } from "react-redux";
// import TopMenu from "../../components/topmenu";
// import { logoutAction } from "../../store/slices/authSlice";
// import { useRouter } from "next/navigation";

// // Динамический импорт Editor.js и инструментов
// const EditorJS = dynamic(() => import("@editorjs/editorjs").then((mod) => mod.default), { ssr: false });
// const Header = dynamic(() => import("@editorjs/header").then((mod) => mod.default), { ssr: false });
// const List = dynamic(() => import("@editorjs/list").then((mod) => mod.default), { ssr: false });
// const ImageTool = dynamic(() => import("@editorjs/image").then((mod) => mod.default), { ssr: false });

// export default function LessonsPage() {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const [token, setToken] = useState(null);
//   const [lessons, setLessons] = useState([]);
//   const [courses, setCourses] = useState([]);
//   const [title, setTitle] = useState("");
//   const [content, setContent] = useState({ blocks: [] });
//   const [courseId, setCourseId] = useState("");
//   const [isReviewLesson, setIsReviewLesson] = useState(false); // Новое состояние для галочки
//   const [editingLesson, setEditingLesson] = useState(null);
//   const [userInfo, setUserInfo] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const editorInstance = useRef(null);
//   const host = process.env.NEXT_PUBLIC_HOST;

//   // Функция загрузки изображения на сервер
//   const uploadImageByFile = async (file) => {
//     try {
//       const fileSizeMB = file.size / (1024 * 1024);
//       console.log(`Uploading file: ${file.name}, Size: ${fileSizeMB.toFixed(2)}MB`);
//       if (fileSizeMB > 900) {
//         throw new Error("File exceeds 900MB limit");
//       }

//       const formData = new FormData();
//       formData.append("file", file);
//       formData.append("name", file.name.split(".")[0]);

//       const response = await fetch(`${host}/api/upload`, {
//         method: "POST",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         body: formData,
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Upload failed: ${response.status} - ${errorText}`);
//       }

//       const result = await response.json();
//       return {
//         success: 1,
//         file: {
//           url: `${host}/${result.newFile.path}`,
//         },
//       };
//     } catch (error) {
//       console.error("Ошибка при загрузке изображения:", error);
//       return {
//         success: 0,
//         message: error.message || "Ошибка загрузки изображения",
//       };
//     }
//   };

//   // Инициализация токена
//   useEffect(() => {
//     const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
//     setToken(storedToken);
//     if (!storedToken) router.push("/login");
//   }, [router]);

//   // Загрузка данных
//   useEffect(() => {
//     if (token) {
//       fetchLessons();
//       fetchCourses();
//       fetchUserInfo();
//     }
//   }, [token]);

//   // Инициализация Editor.js
//   useEffect(() => {
//     if (!token) return;

//     const initEditor = async () => {
//       try {
//         const [EditorJS, Header, List, ImageTool] = await Promise.all([
//           import("@editorjs/editorjs").then((mod) => mod.default),
//           import("@editorjs/header").then((mod) => mod.default),
//           import("@editorjs/list").then((mod) => mod.default),
//           import("@editorjs/image").then((mod) => mod.default),
//         ]);

//         if (editorInstance.current?.destroy) {
//           await editorInstance.current.destroy();
//         }

//         const editor = new EditorJS({
//           holder: "editorjs-container",
//           tools: {
//             header: {
//               class: Header,
//               config: { levels: [2, 3], defaultLevel: 2, placeholder: "Введите заголовок" },
//             },
//             list: {
//               class: List,
//               inlineToolbar: true,
//             },
//             image: {
//               class: ImageTool,
//               config: {
//                 uploader: {
//                   uploadByFile: uploadImageByFile,
//                 },
//               },
//             },
//           },
//           placeholder: "Введите содержимое урока...",
//           data: content,
//           onChange: async () => {
//             const savedData = await editor.save();
//             setContent(savedData);
//           },
//           logLevel: "ERROR",
//         });

//         editorInstance.current = editor;
//       } catch (error) {
//         console.error("Ошибка инициализации редактора:", error);
//       }
//     };

//     initEditor();

//     return () => {
//       if (editorInstance.current?.destroy) {
//         editorInstance.current.destroy();
//       }
//     };
//   }, [token]);

//   // Обновление содержимого редактора при редактировании урока
//   useEffect(() => {
//     if (!editorInstance.current || !editingLesson) return;

//     const loadLessonData = async () => {
//       const currentLesson = lessons.find((l) => l.id === editingLesson);
//       const parsedContent = currentLesson?.content
//         ? JSON.parse(currentLesson.content)
//         : { blocks: [] };

//       setTitle(currentLesson.title);
//       setCourseId(currentLesson.course_id.toString());
//       setIsReviewLesson(currentLesson.isReviewLesson || false); // Устанавливаем значение галочки
//       setContent(parsedContent);
//       await editorInstance.current.render(parsedContent);
//     };

//     loadLessonData();
//   }, [editingLesson, lessons]);

//   // Загрузка уроков
//   const fetchLessons = async () => {
//     try {
//       const response = await axios.get(`${host}/api/lessons`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setLessons(response.data);
//     } catch (error) {
//       console.error("Ошибка загрузки уроков:", error);
//     }
//   };

//   // Загрузка курсов
//   const fetchCourses = async () => {
//     try {
//       const response = await axios.get(`${host}/api/courses`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setCourses(response.data);
//     } catch (error) {
//       console.error("Ошибка загрузки курсов:", error);
//     }
//   };

//   // Загрузка данных пользователя
//   const fetchUserInfo = async () => {
//     try {
//       const response = await axios.get(`${host}/api/auth/getAuthentificatedUserInfo`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUserInfo(response.data);
//     } catch (err) {
//       console.error("Ошибка при загрузке информации о пользователе:", err);
//       if (err.response && err.response.status === 401) {
//         router.push("/login");
//       }
//     }
//   };

//   // Начать редактирование урока
//   const handleEdit = (lessonId) => {
//     const lesson = lessons.find((l) => l.id === lessonId);
//     if (lesson) {
//       setTitle(lesson.title);
//       setCourseId(lesson.course_id.toString());
//       setIsReviewLesson(lesson.isReviewLesson || false); // Устанавливаем значение галочки
//       setContent(lesson.content ? JSON.parse(lesson.content) : { blocks: [] });
//       setEditingLesson(lessonId);
//     }
//   };

//   // Удаление урока
//   const handleDelete = async (lessonId) => {
//     if (!window.confirm("Удалить урок?")) return;

//     try {
//       setIsLoading(true);
//       await axios.delete(`${host}/api/lessons/${lessonId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setLessons(lessons.filter((l) => l.id !== lessonId));
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Ошибка удаления урока:", error);
//       setIsLoading(false);
//     }
//   };

//   // Сохранение урока
//   const handleSave = async () => {
//     if (!editorInstance.current) return;
//     if (!title || !courseId) return alert("Заполните все поля!");

//     try {
//       const savedContent = await editorInstance.current.save();
//       setIsLoading(true);
//       const requestData = {
//         title,
//         content: JSON.stringify(savedContent),
//         course_id: Number(courseId),
//         isReviewLesson, // Добавляем поле isReviewLesson
//       };

//       if (editingLesson) {
//         const response = await axios.put(
//           `${host}/api/lessons/${editingLesson}`,
//           requestData,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//         setLessons(lessons.map((l) => (l.id === editingLesson ? response.data : l)));
//       } else {
//         const response = await axios.post(`${host}/api/lessons`, requestData, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setLessons([...lessons, response.data]);
//       }

//       resetForm();
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Ошибка сохранения урока:", error);
//       setIsLoading(false);
//     }
//   };

//   // Сброс формы
//   const resetForm = () => {
//     setTitle("");
//     setContent({ blocks: [] });
//     setCourseId("");
//     setIsReviewLesson(false); // Сбрасываем галочку
//     setEditingLesson(null);

//     if (editorInstance.current?.render) {
//       editorInstance.current.render({ blocks: [] });
//     }
//   };

//   // Логаут
//   const handleLogout = () => {
//     dispatch(logoutAction());
//     localStorage.removeItem("token");
//     router.push("/login");
//   };

//   if (!token) return <Typography>Токен отсутствует</Typography>;

//   return (
//     <>
//       <TopMenu handleLogout={handleLogout} userInfo={userInfo} />
//       <Container maxWidth="md" sx={{ py: 4 }}>
//         <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
//           <Typography variant="h5" sx={{ mb: 3 }}>
//             {editingLesson ? "Редактировать урок" : "Создать урок"}
//           </Typography>

//           <TextField
//             fullWidth
//             label="Название урока"
//             value={title}
//             onChange={(e) => setTitle(e.target.value)}
//             sx={{ mb: 2 }}
//           />

//           <FormControl fullWidth sx={{ mb: 2 }}>
//             <InputLabel>Выберите курс</InputLabel>
//             <Select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
//               {courses.map((course) => (
//                 <MenuItem key={course.id} value={course.id}>
//                   {course.title}
//                 </MenuItem>
//               ))}
//             </Select>
//           </FormControl>

//           <FormControlLabel
//             control={
//               <Checkbox
//                 checked={isReviewLesson}
//                 onChange={(e) => setIsReviewLesson(e.target.checked)}
//                 color="primary"
//               />
//             }
//             label="Урок для отзыва"
//             sx={{ mb: 2 }}
//           />

//           <div id="editorjs-container" style={{ minHeight: "300px", border: "1px solid #ccc", borderRadius: "4px", padding: "10px" }} />

//           <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
//             <Button variant="outlined" onClick={resetForm}>
//               Очистить
//             </Button>
//             <Button
//               variant="contained"
//               color="primary"
//               onClick={handleSave}
//               disabled={isLoading || !title || !courseId}
//               startIcon={isLoading && <CircularProgress size={20} />}
//             >
//               {editingLesson ? "Обновить" : "Создать"}
//             </Button>
//           </Box>
//         </Paper>

//         <Paper elevation={3} sx={{ p: 3 }}>
//           <Typography variant="h6" sx={{ mb: 2 }}>
//             Список уроков
//           </Typography>
//           <MuiList>
//             {lessons.map((lesson) => (
//               <ListItem
//                 key={lesson.id}
//                 secondaryAction={
//                   <>
//                     <IconButton edge="end" onClick={() => handleEdit(lesson.id)} sx={{ mr: 1 }}>
//                       <Edit />
//                     </IconButton>
//                     <IconButton edge="end" onClick={() => handleDelete(lesson.id)} color="error">
//                       <Delete />
//                     </IconButton>
//                   </>
//                 }
//               >
//                 <ListItemText
//                   primary={lesson.title}
//                   secondary={`Курс: ${courses.find((c) => c.id === lesson.course_id)?.title || "Неизвестный курс"} ${lesson.isReviewLesson ? "(Отзыв)" : ""}`}
//                 />
//               </ListItem>
//             ))}
//           </MuiList>
//         </Paper>
//       </Container>
//     </>
//   );
// }



"use client";
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  List as MuiList,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Paper,
  CircularProgress,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import TopMenu from "../../components/topmenu";
import { logoutAction } from "../../store/slices/authSlice";
import { useRouter } from "next/navigation";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";

// Динамический импорт Editor.js и инструментов
const EditorJS = dynamic(() => import("@editorjs/editorjs").then((mod) => mod.default), { ssr: false });
const Header = dynamic(() => import("@editorjs/header").then((mod) => mod.default), { ssr: false });
const List = dynamic(() => import("@editorjs/list").then((mod) => mod.default), { ssr: false });
const ImageTool = dynamic(() => import("@editorjs/image").then((mod) => mod.default), { ssr: false });

// Компонент SortableItem для перетаскиваемых элементов
const SortableItem = ({ id, label, isDragging }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    transition,
    bgcolor: isDragging ? "rgba(0, 158, 176, 0.1)" : "background.paper",
    border: "1px solid #ccc",
    borderRadius: "4px",
    mb: 1,
    cursor: "grab",
    p: 2,
  };

  return (
    <ListItem ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ListItemText primary={label} />
    </ListItem>
  );
};

export default function LessonsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState({ blocks: [] });
  const [courseId, setCourseId] = useState("");
  const [isReviewLesson, setIsReviewLesson] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const editorInstance = useRef(null);
  const host = process.env.NEXT_PUBLIC_HOST;

  // Состояние для drag-and-drop приоритетов
  const [priorityItems, setPriorityItems] = useState([
    { id: "EditorJS", label: "Контент урока (EditorJS)" },
    { id: "Video", label: "Видео-материалы" },
    { id: "AdditionalMaterials", label: "Дополнительные материалы" },
  ]);

  // Настройка сенсоров для dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Функция загрузки изображения на сервер
  const uploadImageByFile = async (file) => {
    try {
      const fileSizeMB = file.size / (1024 * 1024);
      console.log(`Uploading file: ${file.name}, Size: ${fileSizeMB.toFixed(2)}MB`);
      if (fileSizeMB > 900) {
        throw new Error("File exceeds 900MB limit");
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("name", file.name.split(".")[0]);

      const response = await fetch(`${host}/api/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Upload failed: ${response.status} - ${errorText}`);
      }

      const result = await response.json();
      return {
        success: 1,
        file: {
          url: `${host}/${result.newFile.path}`,
        },
      };
    } catch (error) {
      console.error("Ошибка при загрузке изображения:", error);
      return {
        success: 0,
        message: error.message || "Ошибка загрузки изображения",
      };
    }
  };

  // Инициализация токена
  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(storedToken);
    if (!storedToken) router.push("/login");
  }, [router]);

  // Загрузка данных
  useEffect(() => {
    if (token) {
      fetchLessons();
      fetchCourses();
      fetchUserInfo();
    }
  }, [token]);

  // Инициализация Editor.js
  useEffect(() => {
    if (!token) return;

    const initEditor = async () => {
      try {
        const [EditorJS, Header, List, ImageTool] = await Promise.all([
          import("@editorjs/editorjs").then((mod) => mod.default),
          import("@editorjs/header").then((mod) => mod.default),
          import("@editorjs/list").then((mod) => mod.default),
          import("@editorjs/image").then((mod) => mod.default),
        ]);

        if (editorInstance.current?.destroy) {
          await editorInstance.current.destroy();
        }

        const editor = new EditorJS({
          holder: "editorjs-container",
          tools: {
            header: {
              class: Header,
              config: { levels: [2, 3], defaultLevel: 2, placeholder: "Введите заголовок" },
            },
            list: {
              class: List,
              inlineToolbar: true,
            },
            image: {
              class: ImageTool,
              config: {
                uploader: {
                  uploadByFile: uploadImageByFile,
                },
              },
            },
          },
          placeholder: "Введите содержимое урока...",
          data: content,
          onChange: async () => {
            const savedData = await editor.save();
            setContent(savedData);
          },
          logLevel: "ERROR",
        });

        editorInstance.current = editor;
      } catch (error) {
        console.error("Ошибка инициализации редактора:", error);
      }
    };

    initEditor();

    return () => {
      if (editorInstance.current?.destroy) {
        editorInstance.current.destroy();
      }
    };
  }, [token]);

  // Обновление содержимого редактора и приоритетов при редактировании урока
  useEffect(() => {
    if (!editorInstance.current || !editingLesson) return;

    const loadLessonData = async () => {
      const currentLesson = lessons.find((l) => l.id === editingLesson);
      const parsedContent = currentLesson?.content
        ? JSON.parse(currentLesson.content)
        : { blocks: [] };

      setTitle(currentLesson.title);
      setCourseId(currentLesson.course_id.toString());
      setIsReviewLesson(currentLesson.isReviewLesson || false);
      setContent(parsedContent);

      // Загрузка priority_config
      if (currentLesson.priority_config) {
        const priorityConfig = currentLesson.priority_config;
        const sortedItems = [...priorityItems].sort((a, b) => {
          return priorityConfig[a.id] - priorityConfig[b.id];
        });
        setPriorityItems(sortedItems);
      } else {
        setPriorityItems([
          { id: "EditorJS", label: "Контент урока (EditorJS)" },
          { id: "Video", label: "Видео-материалы" },
          { id: "AdditionalMaterials", label: "Дополнительные материалы" },
        ]);
      }

      await editorInstance.current.render(parsedContent);
    };

    loadLessonData();
  }, [editingLesson, lessons]);

  // Загрузка уроков
  const fetchLessons = async () => {
    try {
      const response = await axios.get(`${host}/api/lessons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLessons(response.data);
    } catch (error) {
      console.error("Ошибка загрузки уроков:", error);
    }
  };

  // Загрузка курсов
  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${host}/api/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(response.data);
    } catch (error) {
      console.error("Ошибка загрузки курсов:", error);
    }
  };

  // Загрузка данных пользователя
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

  // Обработчик drag-and-drop
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setPriorityItems((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Генерация priority_config на основе порядка элементов
  const generatePriorityConfig = () => {
    const config = {};
    priorityItems.forEach((item, index) => {
      config[item.id] = index + 1; // Приоритет от 1 до 3
    });
    return config;
  };

  // Начать редактирование урока
  const handleEdit = (lessonId) => {
    setEditingLesson(lessonId);
  };

  // Удаление урока
  const handleDelete = async (lessonId) => {
    if (!window.confirm("Удалить урок?")) return;

    try {
      setIsLoading(true);
      await axios.delete(`${host}/api/lessons/${lessonId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLessons(lessons.filter((l) => l.id !== lessonId));
      setIsLoading(false);
    } catch (error) {
      console.error("Ошибка удаления урока:", error);
      setIsLoading(false);
    }
  };

  // Сохранение урока
  const handleSave = async () => {
    if (!editorInstance.current) return;
    if (!title || !courseId) return alert("Заполните все поля!");

    try {
      const savedContent = await editorInstance.current.save();
      const priorityConfig = generatePriorityConfig();
      setIsLoading(true);

      const requestData = {
        title,
        content: JSON.stringify(savedContent),
        course_id: Number(courseId),
        isReviewLesson,
        priority_config: priorityConfig,
      };

      if (editingLesson) {
        const response = await axios.put(
          `${host}/api/lessons/${editingLesson}`,
          requestData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setLessons(lessons.map((l) => (l.id === editingLesson ? response.data : l)));

        // Отправка priority_config на отдельный эндпоинт
        await axios.post(
          `${host}/api/lessons/${editingLesson}/priority`,
          { priority_config: priorityConfig },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        const response = await axios.post(`${host}/api/lessons`, requestData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setLessons([...lessons, response.data]);
      }

      resetForm();
      setIsLoading(false);
    } catch (error) {
      console.error("Ошибка сохранения урока:", error);
      setIsLoading(false);
      alert(error.response?.data?.error || "Ошибка сохранения урока");
    }
  };

  // Сброс формы
  const resetForm = () => {
    setTitle("");
    setContent({ blocks: [] });
    setCourseId("");
    setIsReviewLesson(false);
    setEditingLesson(null);
    setPriorityItems([
      { id: "EditorJS", label: "Контент урока (EditorJS)" },
      { id: "Video", label: "Видео-материалы" },
      { id: "AdditionalMaterials", label: "Дополнительные материалы" },
    ]);

    if (editorInstance.current?.render) {
      editorInstance.current.render({ blocks: [] });
    }
  };

  // Логаут
  const handleLogout = () => {
    dispatch(logoutAction());
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!token) return <Typography>Токен отсутствует</Typography>;

  return (
    <>
      <TopMenu handleLogout={handleLogout} userInfo={userInfo} />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 3 }}>
            {editingLesson ? "Редактировать урок" : "Создать урок"}
          </Typography>

          <TextField
            fullWidth
            label="Название урока"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />

          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel>Выберите курс</InputLabel>
            <Select value={courseId} onChange={(e) => setCourseId(e.target.value)}>
              {courses.map((course) => (
                <MenuItem key={course.id} value={course.id}>
                  {course.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Checkbox
                checked={isReviewLesson}
                onChange={(e) => setIsReviewLesson(e.target.checked)}
                color="primary"
              />
            }
            label="Урок для отзыва"
            sx={{ mb: 2 }}
          />

          <Typography variant="h6" sx={{ mb: 2 }}>
            Порядок блоков (Drag & Drop)
          </Typography>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={priorityItems.map((item) => item.id)} strategy={verticalListSortingStrategy}>
              <MuiList>
                {priorityItems.map((item, index) => (
                  <SortableItem
                    key={item.id}
                    id={item.id}
                    label={`${index + 1}. ${item.label}`}
                    isDragging={false} // Можно использовать для дополнительной стилизации
                  />
                ))}
              </MuiList>
            </SortableContext>
          </DndContext>

          <div
            id="editorjs-container"
            style={{ minHeight: "300px", border: "1px solid #ccc", borderRadius: "4px", padding: "10px", mt: 2 }}
          />

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button variant="outlined" onClick={resetForm}>
              Очистить
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={isLoading || !title || !courseId}
              startIcon={isLoading && <CircularProgress size={20} />}
            >
              {editingLesson ? "Обновить" : "Создать"}
            </Button>
          </Box>
        </Paper>

        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Список уроков
          </Typography>
          <MuiList>
            {lessons.map((lesson) => (
              <ListItem
                key={lesson.id}
                secondaryAction={
                  <>
                    <IconButton edge="end" onClick={() => handleEdit(lesson.id)} sx={{ mr: 1 }}>
                      <Edit />
                    </IconButton>
                    <IconButton edge="end" onClick={() => handleDelete(lesson.id)} color="error">
                      <Delete />
                    </IconButton>
                  </>
                }
              >
                <ListItemText
                  primary={lesson.title}
                  secondary={`Курс: ${courses.find((c) => c.id === lesson.course_id)?.title || "Неизвестный курс"} ${
                    lesson.isReviewLesson ? "(Отзыв)" : ""
                  } | Приоритеты: ${JSON.stringify(lesson.priority_config)}`}
                />
              </ListItem>
            ))}
          </MuiList>
        </Paper>
      </Container>
    </>
  );
}