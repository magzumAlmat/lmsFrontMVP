"use client";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  Autocomplete,
  TextField,
  Box,
} from "@mui/material";

export default function LanguageSwitcher() {
  const { i18n, ready } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState("ru"); // Начальное значение "ru"

  // Опции для выпадающего списка
  const languageOptions = [
    { value: "ru", label: "Русский" },
    { value: "en", label: "English" },
    { value: "kz", label: "Қазақша" },
  ];

  useEffect(() => {
    if (ready) {
      console.log("Translations ready, setting language to:", i18n.language);
      setSelectedLanguage(i18n.language || "ru"); // Устанавливаем текущий язык или "ru" по умолчанию
    }
  }, [ready, i18n.language]);

  const handleLanguageChange = (event, newValue) => {
    const newLanguage = newValue ? newValue.value : "ru"; // Если ничего не выбрано, возвращаем "ru"
    i18n.changeLanguage(newLanguage);
    setSelectedLanguage(newLanguage);
    console.log("Language changed to:", newLanguage);
  };

  console.log("i18n.ready:", ready);
  console.log("Current i18n.language:", i18n.language);
  console.log("Selected language:", selectedLanguage);

  return (
    <Box sx={{ minWidth: 120, m: 1 }}>
      <Autocomplete
        id="language-autocomplete"
        options={languageOptions}
        getOptionLabel={(option) => option.label} // Отображаем название языка
        value={languageOptions.find((option) => option.value === selectedLanguage) || languageOptions[0]} // Текущий выбранный язык
        onChange={handleLanguageChange}
        disabled={!ready} // Отключаем, пока переводы не готовы
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            size="small"
            sx={{
              "& .MuiOutlinedInput-root": {
                bgcolor: "#fff", // Белый фон
                color: "#000", // Чёрный текст
                borderRadius: "8px", // Скруглённые углы
                "& fieldset": {
                  borderColor: "#1565c0", // Синяя граница
                },
                "&:hover fieldset": {
                  borderColor: "#1976d2", // Более яркий синий при наведении
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#0d47a1", // Тёмно-синий при фокусе
                },
              },
              "& .MuiInputBase-input": {
                color: "#000", // Чёрный текст внутри поля
                fontWeight: 500, // Средняя жирность текста
                padding: "8px 12px", // Внутренние отступы
              },
              "& .MuiAutocomplete-endAdornment": {
                "& .MuiSvgIcon-root": {
                  color: "#1565c0", // Синий цвет стрелки dropdown
                },
              },
            }}
          />
        )}
        disableClearable // Отключаем возможность очистки выбора
        sx={{
          "& .MuiAutocomplete-paper": {
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)", // Тень для выпадающего списка
            borderRadius: "8px", // Скруглённые углы списка
          },
          "& .MuiAutocomplete-option": {
            color: "#000", // Чёрный текст в опциях
            "&:hover": {
              bgcolor: "#e3f2fd", // Светло-голубой фон при наведении
            },
            "&[aria-selected='true']": {
              bgcolor: "#bbdefb", // Более насыщенный голубой для выбранной опции
            },
          },
        }}
      />
    </Box>
  );
}