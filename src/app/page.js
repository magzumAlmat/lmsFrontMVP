"use client"; // Mark this as a Client Component

import Image from 'next/image'
import styles from './page.module.css'
import * as React from 'react';
import Button from '@mui/material/Button';
import Login from './login/page';
import Layout from './layout/page';
import { useTokenInitialization } from '../store/slices/authSlice';


import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginReducer } from "../store/slices/authSlice";
import jwt_decode from "jwt-decode";



// export const metadata = {
//   icons: {
//     icon: [
//       { url: '/favicon.ico' },
//       { url: '/favicon-16x16.png', type: 'image/png' },
//     ],
//     apple: [
//       { url: '/apple-touch-icon.png' },
//     ],
//   }
// }


export  function TokenInitializer() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token); // Decode the token
        console.log("Decoded token on initialization:", decoded);

        dispatch(loginReducer({ token })); // Set the current user state
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token"); // Remove invalid token
      }
    }
  }, [dispatch]);

  return null; // This component doesn't render anything
}
export default function Home() {
  return (
   <main>
{TokenInitializer()}
  <Login/>

   {/* <Button variant="contained">Hello world</Button> */}
   </main>
  )
}
