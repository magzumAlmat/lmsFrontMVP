
"use client"; 
import './globals.css'
import ReduxProvider from '../store/provider'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// export const metadata = {
//   title: 'Second Lesson',
//   description: 'Learn nextJS and React',
// }
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { loginReducer } from "@/store/slices/authSlice";
// import useTokenFromURL from '@/components/useTokenFromURL';
// import useTokenInitialization from '../store/slices/authSlice';
// import { NextIntlClientProvider } from 'next-intl';
// import { useRouter } from 'next/navigation';
import { I18nextProvider } from "react-i18next";
import i18n from "../../i18n"; // Укажите правильный путь к i18n.js
export default function RootLayout({ children}) {
  // const router = useRouter();
 // useTokenInitialization()
 
  

  return (
    <html lang={i18n.language || "ru"}>
      <ReduxProvider>
      <head>
      <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400&display=swap" rel="stylesheet" />
 
      </head>
      <body>
        <I18nextProvider i18n={i18n}>
          {children}
        </I18nextProvider>
      </body>

      </ReduxProvider>
    </html>
  )
}


