'use client';
import * as React from "react";
import { useTheme } from "@mui/material/styles";
import MobileStepper from "@mui/material/MobileStepper";
import Button from "@mui/material/Button";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useState,useEffect } from "react";
import axios from "axios";
export default function ProgressMobileStepper() {
  const [lessons, setLessons] = useState([]);
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);

  // Массив с информацией для каждого шага
  useEffect(() => {
    fetchLessons();
    // fetchCourses();
  }, []);

  const fetchLessons = async () => {
    try {
      const response = await axios.get(`${host}/api/lessons`);
      setLessons(response.data);
      console.log('lessons= ',lessons)
    } catch (error) {
      console.error("Ошибка при загрузке уроков:", error);
    }
  };


  const stepsInfo = [
    {
      title: "Шаг 1",
      description: "Это первый шаг. Здесь вы можете узнать основы.",
      image: "/images/step1.jpg", // Путь к изображению
    },
    {
      title: "Шаг 2",
      description: "На втором шаге мы углубляемся в детали.",
      image: "/images/step2.jpg", // Путь к изображению
    },
    {
      title: "Шаг 3",
      description: "Третий шаг посвящен практическим примерам.",
      image: "/images/step3.jpg", // Путь к изображению
    },
  ];

  // Обработчики кнопок
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // Проверка на наличие данных
  if (!lessons || lessons.length === 0) {
    return <Typography variant="h6">Нет доступных шагов.</Typography>;
  }

  return (
    <Box sx={{ maxWidth: 400, flexGrow: 1, margin: "auto", textAlign: "center" }}>
      {/* Отображение информации для текущего шага */}
      <Box>
        <Typography variant="h6">{lessons[activeStep].title}</Typography>
        <Typography>{lessons[activeStep].description}</Typography>

        {/* Отображение изображения */}
        {lessons[activeStep].image && (
          <img
            src={lessons[activeStep].image}
            alt={`Step ${activeStep + 1}`}
            style={{
              width: "100%",
              height: "200px", // Фиксированная высота для изображений
              objectFit: "cover", // Корректное масштабирование
              marginTop: "10px",
              borderRadius: "8px", // Скругление углов
            }}
          />
        )}
      </Box>

      {/* Stepper */}
      <MobileStepper
        variant="progress"
        steps={lessons.length} // Количество шагов равно длине массива
        position="static"
        activeStep={activeStep}
        sx={{ maxWidth: 400, flexGrow: 1, mt: 2 }}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === lessons.length - 1}
          >
            Next
            {theme.direction === "rtl" ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button
            size="small"
            onClick={handleBack}
            disabled={activeStep === 0}
          >
            {theme.direction === "rtl" ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            Back
          </Button>
        }
      />
    </Box>
  );
}