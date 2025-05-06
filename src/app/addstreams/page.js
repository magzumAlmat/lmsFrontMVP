// "use client";
// import React, { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import axios from "axios";
// import {
//   Box,
//   Typography,
//   Paper,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Button,
//   TextField,
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   Select,
//   MenuItem,
//   FormControl,
//   InputLabel,
//   Chip,
//   CircularProgress,
// } from "@mui/material";
// import { useRouter } from "next/navigation";
// import TopMenu from "../../components/topmenu";
// import { logoutAction, getAllCoursesAction } from "../../store/slices/authSlice";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// export default function StreamsPage() {
//   const dispatch = useDispatch();
//   const router = useRouter();
//   const [token, setToken] = useState(null);

//   const [streams, setStreams] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [openCreate, setOpenCreate] = useState(false);
//   const [openEdit, setOpenEdit] = useState(false);
//   const [openStudents, setOpenStudents] = useState(false);
//   const [openViewStudents, setOpenViewStudents] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [newStream, setNewStream] = useState({
//     name: "",
//     startDate: "",
//     endDate: "",
//     cost: "",
//     maxStudents: "",
//     courseId: "",
//     teacherId: "",
//   });
//   const [editStream, setEditStream] = useState(null);
//   const [selectedStream, setSelectedStream] = useState(null);
//   const [selectedStudents, setSelectedStudents] = useState([]);
//   const { courses } = useSelector((state) => state.auth);
//   const [userInfo, setUserInfo] = useState(null);
//   const [allCourses, setAllCourses] = useState([]);
//   const host = process.env.NEXT_PUBLIC_HOST;

//   // Получаем token на клиенте
//   useEffect(() => {
//     const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
//     setToken(storedToken);

//     if (!storedToken) {
//       router.push("/login");
//     }
//   }, [router]);

//   // Загружаем данные после получения token
//   useEffect(() => {
//     const fetchData = async () => {
//       if (!token) return;

//       setLoading(true);
//       try {
//         // Информация о пользователе
//         const userInfoResponse = await axios.get(`${host}/api/auth/getAuthentificatedUserInfo`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setUserInfo(userInfoResponse.data);

//         // Потоки
//         let streamsWithStudents = [];
//         try {
//           const streamsResponse = await axios.get(`${host}/api/streams`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           console.log("Streams Response:", streamsResponse.data);

//           if (streamsResponse.data.streams && streamsResponse.data.streams.length > 0) {
//             streamsWithStudents = await Promise.all(
//               streamsResponse.data.streams.map(async (stream) => {
//                 const studentsResponse = await axios.get(`${host}/api/streams/getstudentsbystreamid/${stream.id}`, {
//                   headers: { Authorization: `Bearer ${token}` },
//                 });
//                 return { ...stream, students: studentsResponse.data.students || [] };
//               })
//             );
//           } else {
//             streamsWithStudents = []; // Нет потоков в ответе
//           }
//         } catch (streamErr) {
//           console.warn("Предупреждение при загрузке потоков:", streamErr.message);
//           // Если 404 или "Потоки не найдены", считаем это нормальным случаем
//           if (streamErr.response && streamErr.response.status === 404) {
//             streamsWithStudents = [];
//           } else {
//             throw streamErr; // Пробрасываем другие ошибки
//           }
//         }
//         setStreams(streamsWithStudents);

//         // Пользователи
//         const usersResponse = await axios.get(`${host}/api/getallusers`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         console.log("Users Response:", usersResponse.data);
//         setUsers(usersResponse.data.users || []);

//         // Курсы
//         const coursesResponse = await axios.get(`${host}/api/courses`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         console.log("Courses Response:", coursesResponse.data);
//         setAllCourses(coursesResponse.data.courses || []);

//         await dispatch(getAllCoursesAction());
//       } catch (err) {
//         console.error("Критическая ошибка при загрузке данных:", err);
//         setError(err.response?.data?.message || "Не удалось загрузить данные");
//         if (err.response && err.response.status === 401) {
//           router.push("/login");
//         }
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, [dispatch, token, router]);

//   const handleCreateStream = async () => {
//     try {
//       setLoading(true);
//       const response = await axios.post(
//         `${host}/api/stream`,
//         {
//           ...newStream,
//           cost: parseFloat(newStream.cost),
//           maxStudents: parseInt(newStream.maxStudents, 10),
//           courseId: parseInt(newStream.courseId, 10),
//           teacherId: parseInt(newStream.teacherId, 10),
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setStreams((prev) => [...prev, response.data.stream]);
//       setOpenCreate(false);
//       setNewStream({
//         name: "",
//         startDate: "",
//         endDate: "",
//         cost: "",
//         maxStudents: "",
//         courseId: "",
//         teacherId: "",
//       });
//       setError(null);
//       window.location.reload();
//     } catch (err) {
//       setError(err.response?.data?.error || "Ошибка при создании потока");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateStream = async () => {
//     try {
//       const response = await axios.put(
//         `${host}/api/streams/${editStream.id}`,
//         {
//           ...editStream,
//           cost: Number(editStream.cost),
//           maxStudents: Number(editStream.maxStudents),
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setStreams(streams.map((s) => (s.id === editStream.id ? response.data.stream : s)));
//       setOpenEdit(false);
//       setEditStream(null);
//     } catch (err) {
//       console.error("Ошибка при обновлении потока:", err);
//       setError("Ошибка при обновлении потока");
//     }
//   };

//   const handleDeleteStream = async (streamId) => {
//     try {
//       await axios.delete(`${host}/api/streams/${streamId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setStreams(streams.filter((s) => s.id !== streamId));
//     } catch (err) {
//       console.error("Ошибка при удалении потока:", err);
//       setError("Ошибка при удалении потока");
//     }
//   };

//   const handleAddStudents = async () => {
//     try {
//       await axios.post(
//         `${host}/api/streams/${selectedStream.id}/students`,
//         { studentIds: selectedStudents },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       const updatedStreamResponse = await axios.get(`${host}/api/streams/getstudentsbystreamid/${selectedStream.id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setStreams(streams.map((s) => (s.id === selectedStream.id ? { ...s, students: updatedStreamResponse.data.students } : s)));
//       setOpenStudents(false);
//       setSelectedStudents([]);
//     } catch (err) {
//       console.error("Ошибка при добавлении студентов:", err);
//       setError("Ошибка при добавлении студентов");
//     }
//   };

//   const handleRemoveStudent = async (streamId, studentId) => {
//     console.log("Удаление юзера", streamId, studentId);
//     try {
//       await axios.post(
//         `${host}/api/streams/${streamId}/remove-students`,
//         { studentIds: [studentId] },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );

//       const updatedStreamResponse = await axios.get(`${host}/api/streams/getstudentsbystreamid/${streamId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setStreams(streams.map((s) => (s.id === streamId ? { ...s, students: updatedStreamResponse.data.students } : s)));
//     } catch (err) {
//       console.error("Ошибка при удалении студента:", err);
//       setError("Ошибка при удалении студента");
//     }
//     setOpenStudents(false);
//     setSelectedStudents([]);
//   };

//   // const handleGenerateStreamReport = async (stream) => {
//   //   console.log('stream= ', stream);
//   //   try {
//   //     setLoading(true);

//   //     const studentsResponse = await axios.get(`${host}/api/streams/getstudentsbystreamid/${stream.id}`, {
//   //       headers: { Authorization: `Bearer ${token}` },
//   //     });
//   //     const students = studentsResponse.data.students || [];

//   //     console.log('students= ', students);
//   //     const course = courses.find((c) => c.id === stream.courseId) || { title: "Не указан" };
//   //     console.log('course===', course);
//   //     const teacher = users.find((u) => u.id === stream.teacherId) || { name: "Не указан", lastname: "" };

//   //     const reportData = await Promise.all(
//   //       students.map(async (student) => {
//   //         const progressPromises = [
//   //           axios
//   //             .get(`${host}/api/course/progress/${student.id}/${stream.courseId}`, {
//   //               headers: { Authorization: `Bearer ${token}` },
//   //             })
//   //             .then((response) => ({
//   //               courseId: stream.courseId,
//   //               data: response.data,
//   //             }))
//   //             .catch(() => ({
//   //               courseId: stream.courseId,
//   //               data: { lessons: [], course_progress: 0 },
//   //             })),
//   //         ];

//   //         const progressResults = await Promise.all(progressPromises);
//   //         const isFinished = progressResults.some(({ data }) => data.lessons.some((lesson) => lesson.isfinished === "yes"));
//   //         const userProgress = progressResults.reduce((acc, { data }) => acc + data.course_progress, 0) / progressResults.length || 0;

//   //         return {
//   //           "Student": `${student.name ?? ""} ${student.lastname ?? ""} (${student.email})`,
//   //           "Course": course.title,
//   //           "Teacher": `${teacher.name ?? ""} ${teacher.lastname ?? ""}`,
//   //           "Progress": `${userProgress.toFixed(2)}%`,
//   //           "Is Finished": isFinished ? "yes" : "no",
//   //           "Areas of Activity": student.areasofactivity || "Не указано",
//   //         };
//   //       })
//   //     );

//   //     const streamInfo = [
//   //       { "Field": "Название потока", "Value": stream.name },
//   //       { "Field": "Курс", "Value": course.title },
//   //       { "Field": "Учитель", "Value": `${teacher.name ?? ""} ${teacher.lastname ?? ""}` },
//   //       { "Field": "Дата начала", "Value": new Date(stream.startDate).toLocaleDateString() },
//   //       { "Field": "Дата окончания", "Value": new Date(stream.endDate).toLocaleDateString() },
//   //       { "Field": "Стоимость", "Value": stream.cost },
//   //       { "Field": "Макс. студентов", "Value": stream.maxStudents },
//   //       { "Field": "", "Value": "" },
//   //     ];

//   //     const fullReportData = [...streamInfo, ...reportData];

//   //     const worksheet = XLSX.utils.json_to_sheet(fullReportData);
//   //     worksheet["!cols"] = [
//   //       { wch: 30 },
//   //       { wch: 40 },
//   //       { wch: 30 },
//   //       { wch: 40 },
//   //       { wch: 30 },
//   //       { wch: 40 },
//   //     ];
//   //     const workbook = XLSX.utils.book_new();
//   //     XLSX.utils.book_append_sheet(workbook, worksheet, "Stream Report");

//   //     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//   //     const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
//   //     saveAs(blob, `Stream_${stream.name}_Report_${new Date().toISOString().split("T")[0]}.xlsx`);
//   //   } catch (err) {
//   //     console.error("Ошибка при генерации отчета:", err);
//   //     setError("Не удалось сгенерировать отчет по потоку");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const handleGenerateStreamReport = async (stream) => {
//     console.log('stream= ', stream);
//     try {
//       setLoading(true);

//       const studentsResponse = await axios.get(`${host}/api/streams/getstudentsbystreamid/${stream.id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const students = studentsResponse.data.students || [];

//       console.log('students= ', students);
//       const course = courses.find((c) => c.id === stream.courseId) || { title: "Не указан" };
//       console.log('course===', course);
//       const teacher = users.find((u) => u.id === stream.teacherId) || { name: "Не указан", lastname: "" };

//       const reportData = await Promise.all(
//         students.map(async (student) => {
//           const progressPromises = [
//             axios
//               .get(`${host}/api/course/progress/${student.id}/${stream.courseId}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//               })
//               .then((response) => ({
//                 courseId: stream.courseId,
//                 data: response.data,
//               }))
//               .catch(() => ({
//                 courseId: stream.courseId,
//                 data: { lessons: [], course_progress: 0 },
//               })),
//           ];

//           const progressResults = await Promise.all(progressPromises);
//           const isFinished = progressResults.some(({ data }) => data.lessons.some((lesson) => lesson.isfinished === "yes"));
//           const userProgress = progressResults.reduce((acc, { data }) => acc + data.course_progress, 0) / progressResults.length || 0;

//           return {
//             "Student": `${student.name ?? ""} ${student.lastname ?? ""} (${student.email})`,
//             "Course": course.title,
//             "Teacher": `${teacher.name ?? ""} ${teacher.lastname ?? ""}`,
//             "Progress": `${userProgress.toFixed(2)}%`,
//             "Is Finished": isFinished ? "yes" : "no",
//             "Areas of Activity": student.areasofactivity || "Не указано",
//           };
//         })
//       );

//       const streamInfo = [
//         { "Field": "Название потока", "Value": stream.name },
//         { "Field": "Курс", "Value": course.title },
//         { "Field": "Учитель", "Value": `${teacher.name ?? ""} ${teacher.lastname ?? ""}` },
//         { "Field": "Дата начала", "Value": new Date(stream.startDate).toLocaleDateString() },
//         { "Field": "Дата окончания", "Value": new Date(stream.endDate).toLocaleDateString() },
//         { "Field": "Стоимость", "Value": stream.cost },
//         { "Field": "Макс. студентов", "Value": stream.maxStudents },
//         { "Field": "", "Value": "" },
//       ];

//       const fullReportData = [...streamInfo, ...reportData];

//       const worksheet = XLSX.utils.json_to_sheet(fullReportData);
//       worksheet["!cols"] = [
//         { wch: 30 },
//         { wch: 40 },
//         { wch: 30 },
//         { wch: 40 },
//         { wch: 30 },
//         { wch: 40 },
//       ];
//       const workbook = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(workbook, worksheet, "Stream Report");

//       const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//       const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
//       saveAs(blob, `Stream_${stream.name}_Report_${new Date().toISOString().split("T")[0]}.xlsx`);
//     } catch (err) {
//       console.error("Ошибка при генерации отчета:", err);
//       setError("Не удалось сгенерировать отчет по потоку");
//     } finally {
//       setLoading(false);
//     }
//   };


  
//   const handleLogout = () => {
//     dispatch(logoutAction());
//     localStorage.removeItem("token");
//     router.push("/login");
//   };

//   if (!token) {
//     return (
//       <Box >
//         <Typography>Перенаправление на страницу входа...</Typography>
//       </Box>
//     );
//   }

//   if (loading) {
//     return (
//       <Box >
//         {/* <CircularProgress /> */}
//         <Typography>Loading data...</Typography>
//       </Box>
//     );
//   }

//   if (error) {
//     return (
//       <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
//         <Typography color="error">{error}</Typography>
//       </Box>
//     );
//   }

//   return (
//     <>
//       <TopMenu handleLogout={handleLogout} userInfo={userInfo} />
//       <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
//         <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 4 }}>
//           Управление потоками
//         </Typography>
//         {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

//         <Button variant="contained" color="primary" onClick={() => setOpenCreate(true)} sx={{ mb: 3 }}>
//           Создать поток
//         </Button>

//         {streams.length === 0 ? (
//           <Paper elevation={3} sx={{ p: 3, borderRadius: 2, textAlign: "center" }}>
//             <Typography variant="h6" color="textSecondary">
//               Потоки отсутствуют. Создайте новый поток, чтобы начать.
//             </Typography>
//           </Paper>
//         ) : (
//           <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
//             <TableContainer>
//               <Table>
//                 <TableHead>
//                   <TableRow>
//                     <TableCell>Название</TableCell>
//                     <TableCell>Курс</TableCell>
//                     <TableCell>Учитель</TableCell>
//                     <TableCell>Дата начала</TableCell>
//                     <TableCell>Дата окончания</TableCell>
//                     <TableCell>Стоимость</TableCell>
//                     <TableCell>Макс. студентов</TableCell>
//                     <TableCell>Действия</TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {streams.map((stream) => {
//                     const course = courses.find((c) => c.id === stream.courseId) || { title: "Не указан" };
//                     console.log('render course= ', course);
//                     const teacher = users.find((u) => u.id === stream.teacherId) || { name: "Не указан", lastname: "" };

//                     return (
//                       <TableRow key={stream.id}>
//                         <TableCell>{stream.name}</TableCell>
//                         <TableCell>{course.title}</TableCell>
//                         <TableCell>{`${teacher.name ?? ""} ${teacher.lastname ?? ""}`}</TableCell>
//                         <TableCell>{new Date(stream.startDate).toLocaleDateString()}</TableCell>
//                         <TableCell>{new Date(stream.endDate).toLocaleDateString()}</TableCell>
//                         <TableCell>{stream.cost}</TableCell>
//                         <TableCell>{stream.maxStudents}</TableCell>
//                         <TableCell>
//                           <Button onClick={() => { setEditStream(stream); setOpenEdit(true); }}>Редактировать</Button>
//                           <Button color="error" onClick={() => handleDeleteStream(stream.id)}>Удалить</Button>
//                           <Button onClick={() => { setSelectedStream(stream); setOpenStudents(true); }}>Студенты</Button>
//                           <Button onClick={() => { setSelectedStream(stream); setOpenViewStudents(true); }}>Просмотр студентов</Button>
//                           <Button onClick={() => handleGenerateStreamReport(stream)}>Отчет по потоку</Button>
//                         </TableCell>
//                       </TableRow>
//                     );
//                   })}
//                 </TableBody>
//               </Table>
//             </TableContainer>
//           </Paper>
//         )}

//         <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
//           <DialogTitle>Создать новый поток</DialogTitle>
//           <DialogContent>
//             <TextField
//               label="Название"
//               fullWidth
//               value={newStream.name}
//               onChange={(e) => setNewStream({ ...newStream, name: e.target.value })}
//               sx={{ mt: 2 }}
//             />
//             <FormControl fullWidth sx={{ mt: 2 }}>
//               <InputLabel>Курс</InputLabel>
//               <Select
//                 value={newStream.courseId}
//                 onChange={(e) => setNewStream({ ...newStream, courseId: e.target.value })}
//               >
//                 {courses.map((course) => (
//                   <MenuItem key={course.id} value={course.id}>{course.title}</MenuItem>
//                 ))}
//               </Select>
//             </FormControl>
//             <FormControl fullWidth sx={{ mt: 2 }}>
//               <InputLabel>Учитель</InputLabel>
//               <Select
//                 value={newStream.teacherId}
//                 onChange={(e) => setNewStream({ ...newStream, teacherId: e.target.value })}
//               >
//                 {users
//                   .filter((u) => u.roleId === 2)
//                   .map((teacher) => (
//                     <MenuItem key={teacher.id} value={teacher.id}>
//                       {teacher.name ?? ""} {teacher.lastname ?? ""}
//                     </MenuItem>
//                   ))}
//               </Select>
//             </FormControl>
//             <TextField
//               label="Дата начала"
//               type="date"
//               fullWidth
//               value={newStream.startDate}
//               onChange={(e) => setNewStream({ ...newStream, startDate: e.target.value })}
//               sx={{ mt: 2 }}
//               InputLabelProps={{ shrink: true }}
//             />
//             <TextField
//               label="Дата окончания"
//               type="date"
//               fullWidth
//               value={newStream.endDate}
//               onChange={(e) => setNewStream({ ...newStream, endDate: e.target.value })}
//               sx={{ mt: 2 }}
//               InputLabelProps={{ shrink: true }}
//             />
//             <TextField
//               label="Стоимость"
//               type="number"
//               fullWidth
//               value={newStream.cost}
//               onChange={(e) => setNewStream({ ...newStream, cost: e.target.value })}
//               sx={{ mt: 2 }}
//             />
//             <TextField
//               label="Макс. студентов"
//               type="number"
//               fullWidth
//               value={newStream.maxStudents}
//               onChange={(e) => setNewStream({ ...newStream, maxStudents: e.target.value })}
//               sx={{ mt: 2 }}
//             />
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenCreate(false)}>Отмена</Button>
//             <Button onClick={handleCreateStream} color="primary">Создать</Button>
//           </DialogActions>
//         </Dialog>

//         <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
//           <DialogTitle>Редактировать поток</DialogTitle>
//           <DialogContent>
//             {editStream && (
//               <>
//                 <TextField
//                   label="Название"
//                   fullWidth
//                   value={editStream.name}
//                   onChange={(e) => setEditStream({ ...editStream, name: e.target.value })}
//                   sx={{ mt: 2 }}
//                 />
//                 <TextField
//                   label="Дата начала"
//                   type="date"
//                   fullWidth
//                   value={editStream.startDate.split("T")[0]}
//                   onChange={(e) => setEditStream({ ...editStream, startDate: e.target.value })}
//                   sx={{ mt: 2 }}
//                   InputLabelProps={{ shrink: true }}
//                 />
//                 <TextField
//                   label="Дата окончания"
//                   type="date"
//                   fullWidth
//                   value={editStream.endDate.split("T")[0]}
//                   onChange={(e) => setEditStream({ ...editStream, endDate: e.target.value })}
//                   sx={{ mt: 2 }}
//                   InputLabelProps={{ shrink: true }}
//                 />
//                 <TextField
//                   label="Стоимость"
//                   type="number"
//                   fullWidth
//                   value={editStream.cost}
//                   onChange={(e) => setEditStream({ ...editStream, cost: e.target.value })}
//                   sx={{ mt: 2 }}
//                 />
//                 <TextField
//                   label="Макс. студентов"
//                   type="number"
//                   fullWidth
//                   value={editStream.maxStudents}
//                   onChange={(e) => setEditStream({ ...editStream, maxStudents: e.target.value })}
//                   sx={{ mt: 2 }}
//                 />
//               </>
//             )}
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenEdit(false)}>Отмена</Button>
//             <Button onClick={handleUpdateStream} color="primary">Сохранить</Button>
//           </DialogActions>
//         </Dialog>

//         <Dialog open={openStudents} onClose={() => setOpenStudents(false)}>
//           <DialogTitle>Управление студентами в потоке</DialogTitle>
//           <DialogContent>
//             {selectedStream && (
//               <>
//                 <Typography>Текущие студенты:</Typography>
//                 <Box sx={{ mt: 2 }}>
//                   {selectedStream.students?.map((student) => (
//                     <Chip
//                       key={student.id}
//                       label={`${student.name ?? ""} ${student.lastname ?? ""} ${student.email ?? ""}`}
//                       onDelete={() => handleRemoveStudent(selectedStream.id, student.id)}
//                       sx={{ mr: 1, mb: 1 }}
//                     />
//                   ))}
//                   {!selectedStream.students?.length && <Typography>Нет студентов</Typography>}
//                 </Box>
//                 <FormControl fullWidth sx={{ mt: 3 }}>
//                   <InputLabel>Добавить студентов</InputLabel>
//                   <Select
//                     multiple
//                     value={selectedStudents}
//                     onChange={(e) => setSelectedStudents(e.target.value)}
//                     renderValue={(selected) => (
//                       <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
//                         {selected.map((id) => {
//                           const student = users.find((u) => u.id === id);
//                           return <Chip key={id} label={`${student?.name ?? ""} ${student?.lastname ?? ""}`} />;
//                         })}
//                       </Box>
//                     )}
//                   >
//                     {users
//                       .filter((u) => u.roleId === 3 && !selectedStream.students?.some((s) => s.id === u.id))
//                       .map((student) => (
//                         <MenuItem key={student.id} value={student.id}>
//                           {student.name ?? ""} {student.lastname ?? ""} ({student.email})
//                         </MenuItem>
//                       ))}
//                   </Select>
//                 </FormControl>
//               </>
//             )}
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenStudents(false)}>Закрыть</Button>
//             <Button onClick={handleAddStudents} color="primary">Добавить</Button>
//           </DialogActions>
//         </Dialog>

//         <Dialog open={openViewStudents} onClose={() => setOpenViewStudents(false)}>
//           <DialogTitle>Студенты в потоке: {selectedStream?.name}</DialogTitle>
//           <DialogContent>
//             {selectedStream && (
//               <>
//                 <Typography>Список студентов:</Typography>
//                 <Box sx={{ mt: 2 }}>
//                   {selectedStream.students?.length > 0 ? (
//                     selectedStream.students.map((student) => (
//                       <Typography key={student.id} sx={{ mb: 1 }}>
//                         {student.name ?? ""} {student.lastname ?? ""} ({student.email})
//                       </Typography>
//                     ))
//                   ) : (
//                     <Typography>Нет студентов в этом потоке</Typography>
//                   )}
//                 </Box>
//               </>
//             )}
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={() => setOpenViewStudents(false)}>Закрыть</Button>
//           </DialogActions>
//         </Dialog>
//       </Box>
//     </>
//   );
// }











"use client";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import TopMenu from "../../components/topmenu";
import { logoutAction, getAllCoursesAction } from "../../store/slices/authSlice";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function StreamsPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const [token, setToken] = useState(null);
  const [streams, setStreams] = useState([]);
  const [users, setUsers] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openStudents, setOpenStudents] = useState(false);
  const [openViewStudents, setOpenViewStudents] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newStream, setNewStream] = useState({
    name: "",
    startDate: "",
    endDate: "",
    cost: "",
    maxStudents: "",
    courseId: "",
    teacherId: "",
  });
  const [editStream, setEditStream] = useState(null);
  const [selectedStream, setSelectedStream] = useState(null);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const { courses } = useSelector((state) => state.auth);
  const [userInfo, setUserInfo] = useState(null);
  const [allCourses, setAllCourses] = useState([]);
  const host = process.env.NEXT_PUBLIC_HOST;

  // Маппинг статусов на читаемые названия
  const statusLabel = {
    not_checked: "Не проверено",
    checked: "Проверено",
    unsatisfactory: "Не удовлетворительно",
    satisfactory: "Удовлетворительно",
    good: "Хорошо",
    excellent: "Отлично",
  };

  // Получаем token на клиенте
  useEffect(() => {
    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(storedToken);

    if (!storedToken) {
      router.push("/login");
    }
  }, [router]);

  // Загружаем данные после получения token
  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;

      setLoading(true);
      try {
        // Информация о пользователе
        const userInfoResponse = await axios.get(`${host}/api/auth/getAuthentificatedUserInfo`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserInfo(userInfoResponse.data);

        // Потоки
        let streamsWithStudents = [];
        try {
          const streamsResponse = await axios.get(`${host}/api/streams`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (streamsResponse.data.streams && streamsResponse.data.streams.length > 0) {
            streamsWithStudents = await Promise.all(
              streamsResponse.data.streams.map(async (stream) => {
                try {
                  const studentsResponse = await axios.get(`${host}/api/streams/getstudentsbystreamid/${stream.id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  return { ...stream, students: studentsResponse.data.students || [] };
                } catch (err) {
                  console.error(`Ошибка загрузки студентов для потока ${stream.id}:`, err);
                  return { ...stream, students: [] };
                }
              })
            );
          } else {
            streamsWithStudents = [];
          }
        } catch (streamErr) {
          console.warn("Предупреждение при загрузке потоков:", streamErr.message);
          if (streamErr.response && streamErr.response.status === 404) {
            streamsWithStudents = [];
          } else {
            throw streamErr;
          }
        }
        setStreams(streamsWithStudents);

        // Пользователи
        const usersResponse = await axios.get(`${host}/api/getallusers`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(usersResponse.data.users || []);

        // Курсы
        const coursesResponse = await axios.get(`${host}/api/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAllCourses(coursesResponse.data.courses || []);

        await dispatch(getAllCoursesAction());
      } catch (err) {
        console.error("Критическая ошибка при загрузке данных:", err);
        setError(err.response?.data?.message || "Не удалось загрузить данные");
        if (err.response && err.response.status === 401) {
          router.push("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, token, router]);

  const handleCreateStream = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        `${host}/api/stream`,
        {
          ...newStream,
          cost: parseFloat(newStream.cost),
          maxStudents: parseInt(newStream.maxStudents, 10),
          courseId: parseInt(newStream.courseId, 10),
          teacherId: parseInt(newStream.teacherId, 10),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStreams((prev) => [...prev, { ...response.data.stream, students: [] }]);
      setOpenCreate(false);
      setNewStream({
        name: "",
        startDate: "",
        endDate: "",
        cost: "",
        maxStudents: "",
        courseId: "",
        teacherId: "",
      });
      setError(null);
    } catch (err) {
      setError(err.response?.data?.error || "Ошибка при создании потока");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStream = async () => {
    try {
      const response = await axios.put(
        `${host}/api/streams/${editStream.id}`,
        {
          ...editStream,
          cost: Number(editStream.cost),
          maxStudents: Number(editStream.maxStudents),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStreams(streams.map((s) => (s.id === editStream.id ? { ...response.data.stream, students: s.students } : s)));
      setOpenEdit(false);
      setEditStream(null);
    } catch (err) {
      console.error("Ошибка при обновлении потока:", err);
      setError("Ошибка при обновлении потока");
    }
  };

  const handleDeleteStream = async (streamId) => {
    try {
      await axios.delete(`${host}/api/streams/${streamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStreams(streams.filter((s) => s.id !== streamId));
    } catch (err) {
      console.error("Ошибка при удалении потока:", err);
      setError("Ошибка при удалении потока");
    }
  };

  const handleAddStudents = async () => {
    try {
      await axios.post(
        `${host}/api/streams/${selectedStream.id}/students`,
        { studentIds: selectedStudents },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedStreamResponse = await axios.get(`${host}/api/streams/getstudentsbystreamid/${selectedStream.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStreams(streams.map((s) => (s.id === selectedStream.id ? { ...s, students: updatedStreamResponse.data.students } : s)));
      setOpenStudents(false);
      setSelectedStudents([]);
    } catch (err) {
      console.error("Ошибка при добавлении студентов:", err);
      setError("Ошибка при добавлении студентов");
    }
  };

  const handleRemoveStudent = async (streamId, studentId) => {
    try {
      await axios.post(
        `${host}/api/streams/${streamId}/remove-students`,
        { studentIds: [studentId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedStreamResponse = await axios.get(`${host}/api/streams/getstudentsbystreamid/${streamId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStreams(streams.map((s) => (s.id === streamId ? { ...s, students: updatedStreamResponse.data.students } : s)));
    } catch (err) {
      console.error("Ошибка при удалении студента:", err);
      setError("Ошибка при удалении студента");
    }
  };

  const handleGenerateStreamReport = async (stream) => {
    try {
      setLoading(true);

      // Получение студентов потока
      const studentsResponse = await axios.get(`${host}/api/streams/getstudentsbystreamid/${stream.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const students = studentsResponse.data.students || [];

      const course = courses.find((c) => c.id === stream.courseId) || { title: "Не указан" };
      const teacher = users.find((u) => u.id === stream.teacherId) || { name: "Не указан", lastname: "" };

      // Формирование данных отчета
      const reportData = await Promise.all(
        students.map(async (student) => {
          // Получение прогресса студента
          const progressPromises = [
            axios
              .get(`${host}/api/course/progress/${student.id}/${stream.courseId}`, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .then((response) => ({
                courseId: stream.courseId,
                data: response.data,
              }))
              .catch(() => ({
                courseId: stream.courseId,
                data: { lessons: [], course_progress: 0 },
              })),
          ];

          const progressResults = await Promise.all(progressPromises);
          const userProgress = progressResults.reduce((acc, { data }) => acc + data.course_progress, 0) / progressResults.length || 0;

          // Получение домашних заданий студента
          let homeworks = [];
          try {
            const homeworkResponse = await axios.get(`${host}/api/homeworks/user/${student.id}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            homeworks = homeworkResponse.data || [];
          } catch (homeworkErr) {
            console.error(`Ошибка при загрузке домашних заданий для пользователя ${student.id}:`, homeworkErr);
          }

          // Формирование строк для каждого домашнего задания
          return homeworks.length > 0
            ? homeworks.map((hw) => ({
                "Урок": hw.lesson?.title || "Неизвестный урок",
                "Домашнее задание": hw.description || `Задание ${hw.homework_id}`,
                "Пользователь": `${student.name ?? ""} ${student.lastname ?? ""} (${student.email})`,
                "Статус": statusLabel[hw.status] || hw.status,
                "Прогресс в процентах": `${userProgress.toFixed(2)}%`,
                "Поток в котором он состоит": `${stream.name} | Начало: ${new Date(stream.startDate).toLocaleDateString()} | Конец: ${new Date(stream.endDate).toLocaleDateString()} | Стоимость: ${stream.cost} | Макс. студентов: ${stream.maxStudents} | Курс: ${course.title} | Учитель: ${teacher.name ?? ""} ${teacher.lastname ?? ""}`,
              }))
            : [{
                "Урок": "-",
                "Домашнее задание": "Нет домашних заданий",
                "Пользователь": `${student.name ?? ""} ${student.lastname ?? ""} (${student.email})`,
                "Статус": "-",
                "Прогресс в процентах": `${userProgress.toFixed(2)}%`,
                "Поток в котором он состоит": `${stream.name} | Начало: ${new Date(stream.startDate).toLocaleDateString()} | Конец: ${new Date(stream.endDate).toLocaleDateString()} | Стоимость: ${stream.cost} | Макс. студентов: ${stream.maxStudents} | Курс: ${course.title} | Учитель: ${teacher.name ?? ""} ${teacher.lastname ?? ""}`,
              }];
        })
      );

      // Разворачиваем массив массивов в плоский массив
      const flattenedReportData = reportData.flat();

      // Добавление информации о потоке в начало отчета
      const streamInfo = [
        { "Урок": "Название потока", "Домашнее задание": stream.name, "Пользователь": "", "Статус": "", "Прогресс в процентах": "", "Поток в котором он состоит": "" },
        { "Урок": "Курс", "Домашнее задание": course.title, "Пользователь": "", "Статус": "", "Прогресс в процентах": "", "Поток в котором он состоит": "" },
        { "Урок": "Учитель", "Домашнее задание": `${teacher.name ?? ""} ${teacher.lastname ?? ""}`, "Пользователь": "", "Статус": "", "Прогресс в процентах": "", "Поток в котором он состоит": "" },
        { "Урок": "Дата начала", "Домашнее задание": new Date(stream.startDate).toLocaleDateString(), "Пользователь": "", "Статус": "", "Прогресс в процентах": "", "Поток в котором он состоит": "" },
        { "Урок": "Дата окончания", "Домашнее задание": new Date(stream.endDate).toLocaleDateString(), "Пользователь": "", "Статус": "", "Прогресс в процентах": "", "Поток в котором он состоит": "" },
        { "Урок": "Стоимость", "Домашнее задание": stream.cost, "Пользователь": "", "Статус": "", "Прогресс в процентах": "", "Поток в котором он состоит": "" },
        { "Урок": "Макс. студентов", "Домашнее задание": stream.maxStudents, "Пользователь": "", "Статус": "", "Прогресс в процентах": "", "Поток в котором он состоит": "" },
        { "Урок": "", "Домашнее задание": "", "Пользователь": "", "Статус": "", "Прогресс в процентах": "", "Поток в котором он состоит": "" },
      ];

      const fullReportData = [...streamInfo, ...flattenedReportData];

      const worksheet = XLSX.utils.json_to_sheet(fullReportData);
      worksheet["!cols"] = [
        { wch: 30 }, // Урок
        { wch: 50 }, // Домашнее задание
        { wch: 30 }, // Пользователь
        { wch: 20 }, // Статус
        { wch: 20 }, // Прогресс в процентах
        { wch: 80 }, // Поток в котором он состоит
      ];
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Stream Homework Report");

      const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
      const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
      saveAs(blob, `Stream_${stream.name}_Homework_Report_${new Date().toISOString().split("T")[0]}.xlsx`);
    } catch (err) {
      console.error("Ошибка при генерации отчета:", err);
      setError("Не удалось сгенерировать отчет по потоку");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!token) {
    return (
      <Box>
        <Typography>Перенаправление на страницу входа...</Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box>
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

  return (
    <>
      <TopMenu handleLogout={handleLogout} userInfo={userInfo} />
      <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
        <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", mb: 4 }}>
          Управление потоками
        </Typography>
        {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

        <Button variant="contained" color="primary" onClick={() => setOpenCreate(true)} sx={{ mb: 3 }}>
          Создать поток
        </Button>

        {streams.length === 0 ? (
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2, textAlign: "center" }}>
            <Typography variant="h6" color="textSecondary">
              Потоки отсутствуют. Создайте новый поток, чтобы начать.
            </Typography>
          </Paper>
        ) : (
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Название</TableCell>
                    <TableCell>Курс</TableCell>
                    <TableCell>Учитель</TableCell>
                    <TableCell>Дата начала</TableCell>
                    <TableCell>Дата окончания</TableCell>
                    <TableCell>Стоимость</TableCell>
                    <TableCell>Макс. студентов</TableCell>
                    <TableCell>Действия</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {streams.map((stream) => {
                    const course = courses.find((c) => c.id === stream.courseId) || { title: "Не указан" };
                    const teacher = users.find((u) => u.id === stream.teacherId) || { name: "Не указан", lastname: "" };

                    return (
                      <TableRow key={stream.id}>
                        <TableCell>{stream.name}</TableCell>
                        <TableCell>{course.title}</TableCell>
                        <TableCell>{`${teacher.name ?? ""} ${teacher.lastname ?? ""}`}</TableCell>
                        <TableCell>{new Date(stream.startDate).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(stream.endDate).toLocaleDateString()}</TableCell>
                        <TableCell>{stream.cost}</TableCell>
                        <TableCell>{stream.maxStudents}</TableCell>
                        <TableCell>
                          <Button onClick={() => { setEditStream(stream); setOpenEdit(true); }}>Редактировать</Button>
                          <Button color="error" onClick={() => handleDeleteStream(stream.id)}>Удалить</Button>
                          <Button onClick={() => { setSelectedStream(stream); setOpenStudents(true); }}>Студенты</Button>
                          <Button
                            onClick={() => {
                              setSelectedStream(streams.find((s) => s.id === stream.id)); // Синхронизация с актуальным состоянием
                              setOpenViewStudents(true);
                            }}
                          >
                            Просмотр студентов
                          </Button>
                          <Button onClick={() => handleGenerateStreamReport(stream)}>Отчет по потоку</Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
          <DialogTitle>Создать новый поток</DialogTitle>
          <DialogContent>
            <TextField
              label="Название"
              fullWidth
              value={newStream.name}
              onChange={(e) => setNewStream({ ...newStream, name: e.target.value })}
              sx={{ mt: 2 }}
            />
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Курс</InputLabel>
              <Select
                value={newStream.courseId}
                onChange={(e) => setNewStream({ ...newStream, courseId: e.target.value })}
              >
                {courses.map((course) => (
                  <MenuItem key={course.id} value={course.id}>{course.title}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Учитель</InputLabel>
              <Select
                value={newStream.teacherId}
                onChange={(e) => setNewStream({ ...newStream, teacherId: e.target.value })}
              >
                {users
                  .filter((u) => u.roleId === 2)
                  .map((teacher) => (
                    <MenuItem key={teacher.id} value={teacher.id}>
                      {teacher.name ?? ""} {teacher.lastname ?? ""}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
            <TextField
              label="Дата начала"
              type="date"
              fullWidth
              value={newStream.startDate}
              onChange={(e) => setNewStream({ ...newStream, startDate: e.target.value })}
              sx={{ mt: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Дата окончания"
              type="date"
              fullWidth
              value={newStream.endDate}
              onChange={(e) => setNewStream({ ...newStream, endDate: e.target.value })}
              sx={{ mt: 2 }}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Стоимость"
              type="number"
              fullWidth
              value={newStream.cost}
              onChange={(e) => setNewStream({ ...newStream, cost: e.target.value })}
              sx={{ mt: 2 }}
            />
            <TextField
              label="Макс. студентов"
              type="number"
              fullWidth
              value={newStream.maxStudents}
              onChange={(e) => setNewStream({ ...newStream, maxStudents: e.target.value })}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCreate(false)}>Отмена</Button>
            <Button onClick={handleCreateStream} color="primary">Создать</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
          <DialogTitle>Редактировать поток</DialogTitle>
          <DialogContent>
            {editStream && (
              <>
                <TextField
                  label="Название"
                  fullWidth
                  value={editStream.name}
                  onChange={(e) => setEditStream({ ...editStream, name: e.target.value })}
                  sx={{ mt: 2 }}
                />
                <TextField
                  label="Дата начала"
                  type="date"
                  fullWidth
                  value={editStream.startDate.split("T")[0]}
                  onChange={(e) => setEditStream({ ...editStream, startDate: e.target.value })}
                  sx={{ mt: 2 }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Дата окончания"
                  type="date"
                  fullWidth
                  value={editStream.endDate.split("T")[0]}
                  onChange={(e) => setEditStream({ ...editStream, endDate: e.target.value })}
                  sx={{ mt: 2 }}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  label="Стоимость"
                  type="number"
                  fullWidth
                  value={editStream.cost}
                  onChange={(e) => setEditStream({ ...editStream, cost: e.target.value })}
                  sx={{ mt: 2 }}
                />
                <TextField
                  label="Макс. студентов"
                  type="number"
                  fullWidth
                  value={editStream.maxStudents}
                  onChange={(e) => setEditStream({ ...editStream, maxStudents: e.target.value })}
                  sx={{ mt: 2 }}
                />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEdit(false)}>Отмена</Button>
            <Button onClick={handleUpdateStream} color="primary">Сохранить</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openStudents} onClose={() => setOpenStudents(false)}>
          <DialogTitle>Управление студентами в потоке</DialogTitle>
          <DialogContent>
            {selectedStream && (
              <>
                <Typography>Текущие студенты:</Typography>
                <Box sx={{ mt: 2 }}>
                  {selectedStream.students?.map((student) => (
                    <Chip
                      key={student.id}
                      label={`${student.name ?? ""} ${student.lastname ?? ""} ${student.email ?? ""}`}
                      onDelete={() => handleRemoveStudent(selectedStream.id, student.id)}
                      sx={{ mr: 1, mb: 1 }}
                    />
                  ))}
                  {!selectedStream.students?.length && <Typography>Нет студентов</Typography>}
                </Box>
                <FormControl fullWidth sx={{ mt: 3 }}>
                  <InputLabel>Добавить студентов</InputLabel>
                  <Select
                    multiple
                    value={selectedStudents}
                    onChange={(e) => setSelectedStudents(e.target.value)}
                    renderValue={(selected) => (
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                        {selected.map((id) => {
                          const student = users.find((u) => u.id === id);
                          return <Chip key={id} label={`${student?.name ?? ""} ${student?.lastname ?? ""}`} />;
                        })}
                      </Box>
                    )}
                  >
                    {users
                      .filter((u) => u.roleId === 3 && !selectedStream.students?.some((s) => s.id === u.id))
                      .map((student) => (
                        <MenuItem key={student.id} value={student.id}>
                          {student.name ?? ""} {student.lastname ?? ""} ({student.email})
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenStudents(false)}>Закрыть</Button>
            <Button onClick={handleAddStudents} color="primary">Добавить</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openViewStudents} onClose={() => setOpenViewStudents(false)}>
          <DialogTitle>Студенты в потоке: {selectedStream?.name}</DialogTitle>
          <DialogContent>
            {selectedStream && (
              <>
                <Typography>Список студентов:</Typography>
                <Box sx={{ mt: 2 }}>
                  {selectedStream.students?.length > 0 ? (
                    selectedStream.students.map((student) => (
                      <Typography key={student.id} sx={{ mb: 1 }}>
                        {student.name ?? ""} {student.lastname ?? ""} ({student.email})
                      </Typography>
                    ))
                  ) : (
                    <Typography>Нет студентов в этом потоке</Typography>
                  )}
                </Box>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenViewStudents(false)}>Закрыть</Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
}




