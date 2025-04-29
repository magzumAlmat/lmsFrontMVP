
import React from "react";
import { Box, AppBar, Toolbar, Typography, Button } from "@mui/material";
import Link from "next/link";

const Header = ({ userInfo }) => {
  const renderMenuByRole = () => {
    if (userInfo.roleId === 1) {
      // Администратор
      return (
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" component={Link} href="/layout">
            Главная
          </Button>
          <Button color="inherit" component={Link} href="/courses">
            Курсы
          </Button>
          <Button color="inherit" component={Link} href="/profile">
            Профиль
          </Button>
          <Button color="inherit" component={Link} href="/admin">
            Админ-панель
          </Button>
        </Box>
      );
    } else if (userInfo.roleId === 2) {
      // Учитель
      return (
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" component={Link} href="/layout">
            Главная
          </Button>
          <Button color="inherit" component={Link} href="/addcourse">
            Курсы
          </Button>
          <Button color="inherit" component={Link} href="/addlessons">
            Предметы
          </Button>
          <Button color="inherit" component={Link} href="/addmaterial">
            Материалы
          </Button>
          <Button color="inherit" component={Link} href="/profile">
            Профиль
          </Button>
        </Box>
      );
    } else if (userInfo.roleId === 3) {
      // Студент
      return (
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" component={Link} href="/layout">
            Главная
          </Button>
          <Button color="inherit" component={Link} href="/student/courses">
            Курсы
          </Button>
          <Button color="inherit" component={Link} href="/student/progress">
            Прогресс
          </Button>
          <Button color="inherit" component={Link} href="/profile">
            Профиль
          </Button>
        </Box>
      );
    } else {
      // Роль не определена
      return (
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button color="inherit" component={Link} href="/layout">
            Главная
          </Button>
          <Button color="inherit" component={Link} href="/login">
            Войти
          </Button>
        </Box>
      );
    }
  };

  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: "#1976d2", borderBottom: "2px solid #1565c0" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold", color: "#fff" }}>
          Учебная платформа
        </Typography>
        {renderMenuByRole()}
      </Toolbar>
    </AppBar>
  );
};

export default Header;