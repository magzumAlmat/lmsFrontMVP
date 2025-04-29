// src/app/courses/page.js
import React from "react";
import ClientCourses from "./ClientCourses"; // Клиентский компонент

// Основной файл остаётся серверным и просто рендерит клиентский компонент
export default function Courses() {
  return <ClientCourses />;
}

export const dynamic = "force-dynamic";