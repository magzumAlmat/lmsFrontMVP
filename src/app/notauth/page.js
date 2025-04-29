"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import TopMenu from "../../components/topmenu";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { logoutAction } from "../../store/slices/authSlice";
import { Container } from "@mui/material";

const NotAuth = () => {
  const [userInfo, setUserInfo] = useState(null);
  const isAuth = useSelector((state) => state.auth.isAuth);
  const dispatch = useDispatch();
  const router = useRouter();
  const host = process.env.NEXT_PUBLIC_HOST;
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // Добавляем состояние загрузки

  useEffect(() => {
    // Во время сборки используем заглушки
    if (process.env.NODE_ENV === "production" && typeof window === "undefined") {
      setUserInfo({ id: 1, username: "Mock User" });
      setToken("mock-token");
      setLoading(false);
      return;
    }

    const storedToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    setToken(storedToken);

    if (!storedToken) {
      console.error("Token not available");
      router.push("/login");
      setLoading(false);
      return;
    }

    try {
      const decodedToken = jwtDecode(storedToken);
      console.log("Decoded token:", decodedToken.username);
      fetchUserInfo(); // Загружаем данные только если токен валиден
    } catch (error) {
      console.error("Invalid token:", error);
      router.push("/login");
      setLoading(false);
    }
  }, [router]);

  const fetchUserInfo = async () => {
    const storedToken = localStorage.getItem("token");
    try {
      setLoading(true);
      const response = await axios.get(`${host}/api/auth/getAuthentificatedUserInfo`, {
        headers: { Authorization: `Bearer ${storedToken}` },
        timeout: 5000,
      });
      setUserInfo(response.data);
    } catch (err) {
      console.error("Ошибка при загрузке информации о пользователе:", err);
      if (err.response && err.response.status === 401) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (loading) {
    return <div>Loading...</div>; // Простое состояние загрузки
  }

  return (
    <>
      <TopMenu userInfo={userInfo} handleLogout={handleLogout} />
      
    </>
  );
};

export default NotAuth;

export const dynamic = "force-dynamic";