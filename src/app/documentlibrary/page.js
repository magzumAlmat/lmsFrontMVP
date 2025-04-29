
// 'use client';
// import React from 'react';
// import {
//   Container,
//   Typography,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Button,
//   Paper,
// } from '@mui/material';
// import DownloadIcon from '@mui/icons-material/Download';

// // Статический список файлов (или можно передать через props)
// const pdfFiles = [
    
//   { name: 'EUBIM_Handbook.pdf', path: '/documents/EUBIM_Handbook.pdf' },
//   { name: 'Guidance-for-Regulators_Industry_Insight_bSI.pdf', path: '/documents/Guidance-for-Regulators_Industry_Insight_bSI.pdf' },
//    { name:  'Handbook-BIM.pdf' ,path:   '/documents/Handbook-BIM.pdf'},
//    { name:  'IFC-Mandate_2025.pdf'  ,path:'/documents/IFC-Mandate_2025.pdf'},
//    { name:  "McKinsey From start‑up to scale‑up Accelerating growth in construction technology (2023).pdf"   ,path:"/documents/McKinsey From start‑up to scale‑up Accelerating growth in construction technology (2023).pdf"},
//    { name:  "McKinsey Global Institute, Reinventing Construction, 2017.pdf"  ,path:'/documents/McKinsey Global Institute, Reinventing Construction, 2017.pdf'},
//    { name:  "Survey_the-role-of-BIM-and-what-the-future-holds.pdf"   ,path:'/documents/Survey_the-role-of-BIM-and-what-the-future-holds.pdf'},
//    { name:  "Technology Report 2024.pdf"    ,path:'/documents/Technology Report 2024.pdf '},
//    { name:  "Transforming construction with AI.pdf"   ,path:'/documents/Transforming construction with AI.pdf '},
//   // Добавь свои файлы
// ];

// const DocumentLibrary = () => {
//   return (
//     <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
//       <Typography variant="h4" gutterBottom align="center">
//         Библиотека документов
//       </Typography>
//       <TableContainer component={Paper}>
//         <Table sx={{ minWidth: 650 }} aria-label="PDF documents table">
//           <TableHead>
//             <TableRow>
//               <TableCell>
//                 <Typography variant="h6">Название файла</Typography>
//               </TableCell>
//               <TableCell align="right">
//                 <Typography variant="h6">Действия</Typography>
//               </TableCell>
//             </TableRow>
//           </TableHead>
//           <TableBody>
//             {pdfFiles.length > 0 ? (
//               pdfFiles.map((file, index) => (
//                 <TableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
//                   <TableCell component="th" scope="row">
//                     {file.name}
//                   </TableCell>
//                   <TableCell align="right">
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       startIcon={<DownloadIcon />}
//                       href={file.path}
//                       download
//                     >
//                       Скачать
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))
//             ) : (
//               <TableRow>
//                 <TableCell colSpan={2} align="center">
//                   <Typography variant="body1">Документы не найдены</Typography>
//                 </TableCell>
//               </TableRow>
//             )}
//           </TableBody>
//         </Table>
//       </TableContainer>
//     </Container>
//   );
// };

// export default DocumentLibrary;


'use client';
import React from 'react';
import DocumentLibrary from '@/components/documentsComponent';

const DocumentLibraryPage = () => {
  return <DocumentLibrary />;
};

export default DocumentLibraryPage;
export const dynamic = 'force-dynamic';