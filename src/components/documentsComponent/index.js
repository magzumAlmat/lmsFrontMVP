'use client';
import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  Box,
  CircularProgress,
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import TopMenu from '@/components/topmenu';
import jwtDecode from 'jwt-decode';

// Импорт logoutAction
let logoutAction;
try {
  logoutAction = require('../../store/slices/authSlice').logoutAction;
} catch (e) {
  console.warn('logoutAction не найден, проверь путь к authSlice');
}

// Тема
const theme = createTheme({
  palette: {
    primary: { main: '#009eb0', contrastText: '#fff' },
    secondary: { main: '#1e3a8a', contrastText: '#fff' },
    background: {
      default: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)',
      paper: '#ffffff',
    },
    text: { primary: '#1e293b', secondary: '#64748b' },
  },
  typography: {
    fontFamily: "'Open Sans', sans-serif",
    h4: { fontWeight: 700, letterSpacing: '-0.5px' },
    h6: { fontWeight: 600 },
    body2: { fontWeight: 400 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
          padding: '10px 20px',
          transition: 'all 0.3s ease',
          '&:hover': {
            backgroundColor: '#007a8a',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(0, 158, 176, 0.2)',
        },
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          transition: 'background-color 0.3s ease',
          '&:hover': {
            backgroundColor: 'rgba(0, 158, 176, 0.05)',
          },
        },
      },
    },
    MuiCircularProgress: {
      styleOverrides: {
        root: {
          color: '#009eb0',
        },
      },
    },
  },
});

// Статический список файлов
const pdfFiles = [
  { name: 'EUBIM_Handbook.pdf', path: '/documents/EUBIM_Handbook.pdf' },
  { name: 'Guidance-for-Regulators_Industry_Insight_bSI.pdf', path: '/documents/Guidance-for-Regulators_Industry_Insight_bSI.pdf' },
   { name:  'Handbook-BIM.pdf' ,path:   '/documents/Handbook-BIM.pdf'},
   { name:  'IFC-Mandate_2025.pdf'  ,path:'/documents/IFC-Mandate_2025.pdf'},
   { name:  "McKinsey From start‑up to scale‑up Accelerating growth in construction technology (2023).pdf"   ,path:"/documents/McKinsey From start‑up to scale‑up Accelerating growth in construction technology (2023).pdf"},
   { name:  "McKinsey Global Institute,Reinventing Construction 2017.pdf"  ,path:'/documents/McKinseyGlobalInstitute.pdf'},
   { name:  "Survey_the-role-of-BIM-and-what-the-future-holds.pdf"   ,path:'/documents/Survey_the-role-of-BIM-and-what-the-future-holds.pdf'},
   { name:  "Technology Report 2024.pdf"    ,path:'/documents/Technology Report 2024.pdf '},
   { name:  "Transforming construction with AI.pdf"   ,path:'/documents/Transforming construction with AI.pdf '},
];

const DocumentLibrary = () => {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const [token, setToken] = useState(null);
  const host = process.env.NEXT_PUBLIC_HOST || 'http://localhost:5000';
  const router = useRouter();
  const dispatch = useDispatch();

  useEffect(() => {
    // Мок-данные для серверного окружения
    if (process.env.NODE_ENV === 'production' && typeof window === 'undefined') {
      setUserInfo({ id: 1, username: 'Mock User' });
      setToken('mock-token');
      setLoading(false);
      return;
    }

    // Проверка токена на клиенте
    const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (!storedToken) {
      router.push('/login');
      setLoading(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(storedToken);
      setToken(storedToken);
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('token');
      router.push('/login');
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!token) return;

    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${host}/api/auth/getAuthentificatedUserInfo`, {
          headers: { Authorization: `Bearer ${token}` },
          timeout: 5000,
        });
        setUserInfo(response.data);
      } catch (err) {
        console.error('Ошибка при загрузке информации о пользователе:', err);
        if (err.response?.status === 401) {
          localStorage.removeItem('token');
          if (logoutAction) {
            dispatch(logoutAction());
          }
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [token, router, dispatch]);

  const handleLogout = () => {
    if (logoutAction) {
      dispatch(logoutAction());
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    router.push('/login');
  };

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            bgcolor: 'background.default',
          }}
        >
          <CircularProgress />
        </Box>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', py: 6 }}>
        <TopMenu userInfo={userInfo} handleLogout={handleLogout} />
        <Container maxWidth="lg">
          <Typography variant="h4" align="center" sx={{ mb: 4, color: 'text.primary' }}>
            Библиотека документов
          </Typography>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="PDF documents table">
              <TableHead>
                <TableRow>
                  <TableCell sx={{ py: 3 }}>
                    <Typography variant="h6" color="text.primary">
                      Название файла
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ py: 3 }}>
                    <Typography variant="h6" color="text.primary">
                      Действия
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pdfFiles.length > 0 ? (
                  pdfFiles.map((file, index) => (
                    <TableRow key={index}>
                      <TableCell component="th" scope="row" sx={{ py: 2 }}>
                        <Typography variant="body2" color="text.primary">
                          {file.name}
                        </Typography>
                      </TableCell>
                      <TableCell align="right" sx={{ py: 2 }}>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<DownloadIcon />}
                          href={file.path}
                          download
                          sx={{ fontWeight: 600 }}
                        >
                          Скачать
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={2} align="center" sx={{ py: 4 }}>
                      <Typography variant="body2" color="text.secondary">
                        Документы не найдены
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </Box>
    </ThemeProvider>
  );
};

export default DocumentLibrary;