"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const host = process.env.NEXT_PUBLIC_HOST;

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (password !== confirmPassword) {
  //     setMessage("Пароли не совпадают");
  //     return;
  //   }

  //   try {
  //     await axios.post(`${host}/api/auth/reset-password`, {
  //       token,
  //       newPassword: password,
  //     });
  //     setMessage("Пароль успешно сброшен");
  //   } catch (error) {
  //     setMessage("Ошибка при сбросе пароля");
  //     console.error(error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Пароли не совпадают");
      return;
    }
  
    try {
      const response = await axios.post(`${host}/api/auth/reset-password`, {
        token,
        newPassword: password,
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response?.data?.error || "Ошибка при сбросе пароля");
      console.error("Reset password error:", error.response || error);
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: "auto", mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>

        <Typography variant="h5" gutterBottom>
          Сброс пароля
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Новый пароль"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Подтвердите пароль"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
          >
            Сбросить пароль
          </Button>
        </form>
        {message && (
          <Typography sx={{ mt: 2 }} color={message.includes("успешно") ? "success.main" : "error.main"}>
            {message}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}