"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import jwt_decode from "jwt-decode";
import { loginReducer } from "../store/slices/authSlice";

export default function useTokenFromURL() {
  const dispatch = useDispatch();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      try {
        // Сохраняем токен в localStorage
        localStorage.setItem("token", token);

        // Декодируем токен
        const decoded = jwt_decode(token);
        console.log("Decoded token from URL:", decoded);

        // Обновляем Redux состояние
        dispatch(loginReducer({ token }));

        // Очищаем URL
        window.history.replaceState({}, document.title, "/layout");
      } catch (error) {
        console.error("Invalid token from URL:", error.message);
        localStorage.removeItem("token"); // Удаляем некорректный токен
      }
    }
  }, [dispatch]);
}