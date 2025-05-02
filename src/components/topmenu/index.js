"use client";
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Box,
} from "@mui/material";
import Link from "next/link"
import MenuIcon from "@mui/icons-material/Menu";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "react-i18next";
import Image from "next/image";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// Создаем тему
const theme = createTheme({
  palette: {
    primary: { main: "#009eb0", contrastText: "#fff" }, // Бирюзовый
    secondary: { main: "#1e3a8a", contrastText: "#fff" }, // Глубокий синий
    background: {
      default: "linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)",
      paper: "#ffffff",
    },
    text: { primary: "#1e293b", secondary: "#64748b" },
  },
  typography: {
    fontFamily: "'Open Sans', sans-serif",
    h6: { fontWeight: 700, letterSpacing: "-0.2px" },
    button: { fontWeight: 600, letterSpacing: "0.5px" },
    body1: { fontWeight: 400 },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "transparent", // Прозрачный фон
          boxShadow: "none", // Убираем тень для минимализма
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
          padding: "8px 16px",
          transition: "all 0.3s ease",
          "&:hover": {
            transform: "translateY(-2px)",
            boxShadow: "0 4px 12px rgba(0, 158, 176, 0.3)",
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: "#ffffff",
          borderLeft: "2px solid #009eb0",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "rgba(0, 158, 176, 0.1)",
            transform: "translateX(4px)",
          },
        },
      },
    },
  },
});

const handleLogout = async () => {
  try {
    await axios.post(
      `${host}/api/auth/logout`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    dispatch(logoutAction());
    localStorage.removeItem("token");
    router.push("/login");
  } catch (error) {
    console.error('Ошибка при логауте:', error);
    dispatch(logoutAction());
    localStorage.removeItem("token");
    router.push("/login");
  }
};

const TopMenu = ({ userInfo, handleLogout }) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { t, ready } = useTranslation();

  const renderMenuByRole = () => {
    if (!userInfo) return [];

    const menuItems = {
      1: [
        { text: t("topMenu.home"), href: "/layout" },
        { text: t("topMenu.addRole"), href: "/addrole" },
        { text: t("topMenu.profile"), href: "/profile" },
        { text: t("topMenu.logout"), onClick: handleLogout },
      ],
      2: [
        { text: t("topMenu.home"), href: "/layout" },
        { text: t("topMenu.streams"), href: "/addstreams" },
        { text: t("topMenu.courses"), href: "/addcourse" },
        { text: t("topMenu.lessons"), href: "/addlessons" },
        { text: t("topMenu.materials"), href: "/addmaterial" },
        { text: t("topMenu.progress"), href: "/progressstatus" },
        { text: t("topMenu.profile"), href: "/profile" },
        { text: t("topMenu.logout"), onClick: handleLogout },
      ],
      3: [
        { text: t("topMenu.home"), href: "/layout" },
        { text: t("topMenu.courses"), href: "/courses" },
        { text: t("topMenu.documentLibrary"), href: "/documentlibrary"},
        
        { text: t("topMenu.profile"), href: "/profile" },
        { text: t("topMenu.logout"), onClick: handleLogout },
      ],
    };

    return (
      menuItems[userInfo.roleId] || [
        { text: t("topMenu.home"), href: "/notauth" },
        { text: t("topMenu.profile"), href: "/profile" },
        { text: t("topMenu.logout"), onClick: handleLogout },
      ]
    );
  };

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setDrawerOpen(open);
  };

  const drawerMenu = (
    <Box
      sx={{
        width: 250,
        p: 2,
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Typography
        variant="h6"
        sx={{ color: "primary.main", fontWeight: 700, mb: 2, textAlign: "center" }}
      >
        {t("title")}
      </Typography>
      <List>
        {renderMenuByRole().map((item, index) => (
          <ListItem
            key={index}
            component={item.href ? Link : "button"}
            href={item.href}
            onClick={item.onClick}
            sx={{
              color: "text.primary",
              py: 1.5,
              "&:hover": {
                color: "primary.main",
              },
            }}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      <Box sx={{ mt: 2, textAlign: "center" }}>
        <LanguageSwitcher />
      </Box>
    </Box>
  );

  if (!ready) {
    return <div>Loading translations...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static">
        <Toolbar
          sx={{
            py: { xs: 1, sm: 2 },
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ position: "relative", width: { xs: "100%", sm: "30%" }, aspectRatio: "5 / 1" }}>
            <Image
              src="/logo.png"
              fill
              style={{ objectFit: "contain" }}
              alt="Logo"
            />
          </Box>

          <Box
            sx={{
              display: { xs: "none", sm: "flex" },
              gap: { xs: 1, sm: 2, md: 3 },
              alignItems: "center",
            }}
          >
            {renderMenuByRole().map((item, index) => (
              <Button
                key={index}
                color="inherit"
                component={item.href ? Link : "button"}
                href={item.href}
                onClick={item.onClick}
                sx={{
                  fontSize: { xs: "0.75rem", sm: "0.875rem", md: "1rem" },
                  px: { xs: 1, sm: 2 },
                  color: "#1e293b", // Темный текст для контраста с фоном страницы
                  "&:hover": {
                    color: "#009eb0", // Бирюзовый при наведении
                  },
                }}
              >
                {item.text}
              </Button>
            ))}
            <LanguageSwitcher />
          </Box>

          <IconButton
            edge="end"
            aria-label="menu"
            onClick={toggleDrawer(true)}
            sx={{
              display: { xs: "block", sm: "none" },
              color: "#1e293b", // Темный цвет для контраста
              "&:hover": {
                bgcolor: "rgba(0, 158, 176, 0.2)",
              },
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
        {drawerMenu}
      </Drawer>
    </ThemeProvider>
  );
};

export default TopMenu;