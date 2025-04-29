"use client";
import { useEffect, useState } from "react";
import axios from "axios";
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
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  ListItemSecondaryAction,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { useDropzone } from "react-dropzone";
import TopMenu from "../../components/topmenu";
import { useSelector, useDispatch } from "react-redux";
import { logoutAction, getUserInfoAction } from "../../store/slices/authSlice";
import { useRouter } from "next/navigation";

export default function MaterialsPage() {
  const [materials, setMaterials] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("video");
  const [filePath, setFilePath] = useState("");
  const [lesson_id, setLessonId] = useState("");
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [files, setFiles] = useState([]);
  const [documentFiles, setDocumentFiles] = useState([]);
  const [imageFiles, setImageFiles] = useState([]); // Для картинок
  const [presentationFiles, setPresentationFiles] = useState([]);
  const [courses, setCourses] = useState([]);
  const [testFilePath, setTestFilePath] = useState("");
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(null);
  const host = process.env.NEXT_PUBLIC_HOST;

  const dispatch = useDispatch();
  const router = useRouter();

  // Check token and redirect if not present
  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(storedToken);
    if (!storedToken) {
      router.push("/login");
    }
  }, [router]);

  // Fetch data only if token is present
  useEffect(() => {
    if (token) {
      fetchMaterials();
      fetchLessons();
      fetchCourses();
      fetchUserInfo();
    }
  }, [token]);

  // Dropzone setup
  const { getRootProps: getVideoRootProps, getInputProps: getVideoInputProps } = useDropzone({
    accept: "video/*",
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const { getRootProps: getDocumentRootProps, getInputProps: getDocumentInputProps } = useDropzone({
    accept: "*/*",
    onDrop: (acceptedFiles) => {
      setDocumentFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const { getRootProps: getImageRootProps, getInputProps: getImageInputProps } = useDropzone({
    accept: "image/*",
    onDrop: (acceptedFiles) => {
      setImageFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

  const { getRootProps: getPresentationRootProps, getInputProps: getPresentationInputProps } = useDropzone({
    accept: "*/*",
    onDrop: (acceptedFiles) => {
      setPresentationFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )
      );
    },
  });

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

  const fetchCourses = async () => {
    try {
      const response = await axios.get(`${host}/api/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке курсов:", error);
    }
  };

  const fetchLessons = async () => {
    try {
      const response = await axios.get(`${host}/api/lessons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLessons(response.data);
    } catch (error) {
      console.error("Ошибка при загрузке уроков:", error);
    }
  };

  // const createMaterial = async () => {
  //   if (!title || !type || (type === "video" && files.length === 0) || !lesson_id) {
  //     alert("Заполните все поля и выберите файл!");
  //     return;
  //   }



  const createMaterial = async () => {
    if (!title || !type || !lesson_id) {
      alert("Заполните все поля!");
      return;
    }

    if (
      (type === "video" && files.length === 0) ||
      (type === "image" && imageFiles.length === 0) ||
      (type === "document" && documentFiles.length === 0) ||
      (type === "presentation" && presentationFiles.length === 0) ||
      ((type === 'test' || type === 'opros') && testFilePath.trim() === '')
    ) {
      alert("Выберите файл или укажите ссылку на тест!");
      return;
    }

    try {
      let uploadedFileResponse = null;

      if (type === "video") {
        const formData = new FormData();
        formData.append("file", files[0]);
        formData.append("name", title);

        uploadedFileResponse = await axios.post(`${host}/api/upload`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } 
      else if (type === "image") {
        const formData = new FormData();
        formData.append("file", imageFiles[0]);
        formData.append("name", title);
        uploadedFileResponse = await axios.post(`${host}/api/upload`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }
      
      
      
      else if (type === "document") {
        const formData = new FormData();
        formData.append("file", documentFiles[0]);
        formData.append("name", title);

        uploadedFileResponse = await axios.post(`${host}/api/upload`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else if (type === "presentation") {
        const formData = new FormData();
        formData.append("file", presentationFiles[0]);
        formData.append("name", title);

        uploadedFileResponse = await axios.post(`${host}/api/upload`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      } else if (type === "test" && testFilePath.trim() === "") {
        alert("Введите ссылку на тест!");
        return;
      }

      const materialResponse = await axios.post(
        `${host}/api/materials`,
        {
          title,
          type,
          // file_path: type === "test" ? testFilePath : uploadedFileResponse?.data.newFile.path,
          file_path: type === 'test' || type === 'opros' ? testFilePath : uploadedFileResponse?.data.newFile.path,
          lesson_id: Number(lesson_id),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setMaterials([...materials, materialResponse.data]);
      setTitle("");
      setType("video");
      setFilePath("");
      setLessonId("");
      setFiles([]);
      setImageFiles([]);
      setDocumentFiles([]);
      setPresentationFiles([]);
      setTestFilePath("");
      window.location.reload();
    } catch (error) {
      console.error("Ошибка при создании материала:", error);
    }
  };

  const deleteMaterial = async (material_id) => {
    try {
      await axios.delete(`${host}/api/materials/${material_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMaterials(materials.filter((material) => material.material_id !== material_id));
    } catch (error) {
      console.error("Ошибка при удалении материала:", error);
    }
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Render nothing until token is resolved
  if (token === null) {
    return null; // Or a loading spinner
  }

  return (
    <>
      <TopMenu handleLogout={handleLogout} userInfo={userInfo} />
      <Container>
        <Box mt={4}>
          <Typography variant="h4">Управление материалами</Typography>

          {/* Форма добавления/редактирования */}
          <Box mt={4}>
            <Typography variant="h6">
              {editingMaterial ? "Редактировать материал" : "Создать новый материал"}
            </Typography>
            <TextField
              label="Название"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              sx={{ mt: 2 }}
              fullWidth
              required
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Тип материала</InputLabel>
              <Select value={type} onChange={(e) => setType(e.target.value)} fullWidth required>
                <MenuItem value="video">Видео</MenuItem>
                <MenuItem value="image">Картинка</MenuItem>
                <MenuItem value="document">Документ</MenuItem>
                <MenuItem value="presentation">Презентация</MenuItem>
                <MenuItem value="test">Ссылка на тест</MenuItem>
              
              <MenuItem value="opros">Ссылка на опрос</MenuItem>
              </Select>
            </FormControl>

            {type === "video" && (
              <Box mt={2}>
                <div {...getVideoRootProps()}>
                  <input {...getVideoInputProps()} />
                  <Typography>Перетащите файл сюда или нажмите для выбора</Typography>
                </div>
                {files.length > 0 && <Typography>Выбранный файл: {files[0].name}</Typography>}
              </Box>
            )}

            {type === "image" && (
              <Box mt={2}>
                <div {...getImageRootProps()}>
                  <input {...getImageInputProps()} />
                  <Typography>Перетащите картинку сюда или нажмите для выбора</Typography>
                </div>
                {imageFiles.length > 0 && (
                  <Typography>Выбранный файл: {imageFiles[0].name}</Typography>
                )}
              </Box>
             
            )}
             {type === "image" && imageFiles.length > 0 && (
                <Box mt={2}>
                  <img src={imageFiles[0].preview} alt="Preview" style={{ maxWidth: "200px" }} />
                </Box>
              )}

            {type === "document" && (
              <Box mt={2}>
                <div {...getDocumentRootProps()}>
                  <input {...getDocumentInputProps()} />
                  <Typography>Перетащите документ сюда или нажмите для выбора</Typography>
                </div>
                {documentFiles.length > 0 && (
                  <Typography>Выбранный файл: {documentFiles[0].name}</Typography>
                )}
              </Box>
            )}

            {type === "presentation" && (
              <Box mt={2}>
                <div {...getPresentationRootProps()}>
                  <input {...getPresentationInputProps()} />
                  <Typography>Перетащите презентацию сюда или нажмите для выбора</Typography>
                </div>
                {presentationFiles.length > 0 && (
                  <Typography>Выбранный файл: {presentationFiles[0].name}</Typography>
                )}
              </Box>
            )}

{(type === 'test' || type === 'opros') && (
            <TextField
              label={type === 'test' ? 'Ссылка на тест' : 'Ссылка на опрос'}
              value={testFilePath}
              onChange={(e) => setTestFilePath(e.target.value)}
              fullWidth
              required
              sx={{ mt: 2 }}
            />
          )}

            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Выберите урок</InputLabel>
              <Select
                value={lesson_id}
                onChange={(e) => setLessonId(e.target.value)}
                fullWidth
                required
              >
                {lessons.map((lesson) => {
                  const course = courses.find((c) => c.id === lesson.course_id);
                  return (
                    <MenuItem key={lesson.id} value={lesson.id}>
                      {course ? course.title : "Курс не найден"} - {lesson.title}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>

            <Button variant="contained" color="primary" onClick={createMaterial} sx={{ mt: 2 }}>
              {editingMaterial ? "Обновить материал" : "Добавить материал"}
            </Button>
          </Box>

          {/* Список материалов */}
          <Box mt={4}>
            <Typography variant="h5">Список материалов</Typography>
            <List>
              {materials.map((material) => (
                <ListItem key={`${material.material_id}-${Date.now()}`}>
                  <ListItemText
                    primary={material.title}
                    secondary={`Урок: ${
                      lessons.find((lesson) => lesson.id === material.lesson_id)?.title || "Неизвестно"
                    }\nТип: ${material.type}\nФайл: ${material.file_path}`}
                  />
                  <ListItemSecondaryAction>
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={() => {
                        setEditingMaterial(material.material_id);
                        setTitle(material.title);
                        setType(material.type);
                        setFilePath(material.file_path);
                        setLessonId(material.lesson_id.toString());
                      }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => deleteMaterial(material.material_id)}
                    >
                      <Delete />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>
      </Container>
    </>
  );
}