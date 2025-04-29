
import { createSlice, current } from '@reduxjs/toolkit';
import axios from 'axios';
import END_POINT from '../../components/config/index';
import jwt_decode from 'jwt-decode';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux'; // Import useDispatch


const initialState = {
  isAuth: false,
  currentUser: null,
  currentCompany:null,
  someVar: 'blah blah blah',
  authToken: '',
  codeFromServer:'none',
  bannersById:'',
  allBanners:'',
  allCompanies:[],
  allRevises:'',
  error: null,
  uploadProgress: 0,
  courses:[],
  currentCourse:[],
  alldocuments: [],
  allLessons:[],
  loading: true,
  loadingCourses:true,
  completedLessons:[],
  progress:[],

  reduxPriorityConfig : {
    EditorJS: 1,
    Video: 3,
    AdditionalMaterials: 2,
  },
};

// let token;
// if (typeof window !== "undefined") {
//   token = localStorage.getItem("token");
// }
const host=process.env.NEXT_PUBLIC_HOST

const initializeToken = () => {
  let token = null;

  // Проверяем localStorage
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  // Если токена нет в localStorage, пытаемся получить его из URL
  if (!token && typeof window !== "undefined") {
    const urlParams = new URLSearchParams(window.location.search);
    token = urlParams.get("token");

    // Если токен найден в URL, сохраняем его в localStorage
    if (token) {
      localStorage.setItem("token", token);
    }
  }

  return token;
};


const token = initializeToken();
// const token = localStorage.getItem('token');

// export const authSlice = createSlice({
//   name: 'auth',
//   initialState,

//   reducers: {
//     authorize: (state, action) => {
//       localStorage.setItem('token', action.payload.token);
//       axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
//       // axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
//       const decoded = jwt_decode(action.payload.token);

//       state.currentUser = {
//         id: decoded.id,
//         email: decoded.email,
//         name: decoded.name,
//         username: decoded.username,
//         password: decoded.password,
//       };
//       state.isAuth = true;
//     },

  

//     logout: (state) => {
//       // Clear user-related state when logging out
//       localStorage.removeItem('token'); // Remove the token from localStorage
//       axios.defaults.headers.common['Authorization'] = ''; // Remove Authorization header
//       state.currentUser = null;
//       state.isAuth = false;
//     },
//   },
// });

export const authSlice = createSlice({
  name: 'auth',
  initialState,

  reducers: {
    // loginReducer: (state, action) => {
    //   state.isAuth = true;
    //   state.currentUser = action.payload;
    // },
  
    getAllCoursesAction: (state, action) => {
      state.courses = action.payload;
    },
    // authorize: (state, action) => {
    //   state.isAuth = action.payload.isAuth;
    //   state.token = action.payload.token || null;
    //   state.error = null;
    // },
    setError: (state, action) => {
      state.error = action.payload;
      state.isAuth = false;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setUploadProgress: (state, action) => {
      state.uploadProgress = action.payload;
    },
    clearUploadProgress: (state) => {
      state.uploadProgress = 0;
    },
    sendErrorReducer:(state,action)=>{
      // console.log('sendErrorReducer error=',action)
      console.log('sendErrorReducer error=',action.payload)
      state.error=action.payload
    },

    loginReducer: (state, action) => {
      const decoded = jwt_decode(action.payload.token);

      state.currentUser = {
        id: decoded.id,
        email: decoded.email,
        name: decoded.name,
      };
      state.isAuth = true;
      state.authToken = action.payload.token;

      // Сохраняем токен в localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", action.payload.token);
      }

      // Устанавливаем заголовок Authorization для axios
      axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
      state.loading=false
    },

    logoutReducer: (state) => {
      state.isAuth = false;
      state.currentUser = null;
      state.authToken = '';

      // Удаляем токен из localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
      }

      // Очищаем заголовок Authorization для axios
      axios.defaults.headers.common['Authorization'] = '';
    },
  
    // loginReducer:(state,action)=>{
    //   console.log('0 Auth slice login Reducer Started')
    //   localStorage.setItem("token", action.payload.token);

  
              
    //   axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
    //   // axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
    //   const decoded = jwt_decode(action.payload.token);

    //   console.log('decoded data = ',decoded)
      
    //   state.currentUser = {
    //     id: decoded.id,
    //     email: decoded.email,
    //     name: decoded.name,
    //     username: decoded.username,
    //     password: decoded.password,
    //   };
    //   state.isAuth = true;
    //   console.log('1 Auth slice login Reducer this is currentUser- ',state.currentUser,'isAuth=',state.isAuth)
    // },


            // loginReducer: (state, action) => {
            //   const token = action.payload.token;
            //   localStorage.setItem('token', token);
            //   const decoded = jwt_decode(token);
        
            //   state.currentUser = {
            //     id: decoded.id,
            //     email: decoded.email,
            //     name: decoded.name,
            //     username: decoded.username,
            //   };
            //   state.isAuth = true;
            // },
            logout: (state) => {
              localStorage.removeItem('token');
              state.currentUser = null;
              state.isAuth = false;
            },

    ReviseReducer:(state,action)=>{
      console.log('1.3 ReviseReducer',action.payload)
      state.allRevises=action.payload
      
    },    
    getAllRevisesReducer:(state,action)=>{
      console.log('1.3 ReviseReducer',action.payload)
      state.allRevises=action.payload
      
    },   
    getAllCompaniesReducer:(state,data)=>{
      const existingPostIds = state.allCompanies.map(post => post.id);
      // Фильтруйте новые посты, чтобы исключить дубликаты
      const newPosts = data.payload.filter(newPost => !existingPostIds.includes(newPost.id));
      console.log('New posts from reducer', newPosts)
      // Добавьте только новые посты в state.allPosts
      state.allCompanies.push(...newPosts);
      console.log('All companies from reducer', state.allCompanies)



      // console.log('1.3 getAllBannersReducerr-',action.payload)
      // state.allCompanies.push(...action.payload)

      
    },        
    getAllBannersReducer:(state,action)=>{
      console.log('1.3 getAllBannersReducerr-',action.payload)
      state.allBanners=action.payload
      console.log('1.3 getAllBannersReducer-',state.bannersById)
    },
    getBannerByCompanyIdReducer:(state,action)=>{
      console.log('1.3 getBannerByCompanyIdReducer-',action.payload)
      state.bannersById=action.payload
      console.log('1.3 getBannerByCompanyIdReducer-',state.bannersById)
    },

    setCurrentUserReducer:(state,action)=>{
      console.log('setCurrentUserReducer started setCurrentUser',action.payload)
      state.currentUser=action.payload
    },


    
    authorize: (state, action) => {

      console.log('Auth slice im in authorize')
      // state.someVar=action.payload
      // state.authToken=null
      // state.authToken=action.payload
      state.isAuth = action.payload.isAuth;
      state.token = action.payload.token || null;
      state.error = null;
      console.log('PAYLOAD=',action.payload.token,'codeFromServer=',state.currentUser)

      const decoded = jwt_decode(action.payload.token);
      console.log('1 authorize decoded token=========', decoded)

      
      
      localStorage.setItem("token", action.payload.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
      // axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`; // Add space after 'Bearer'
    
      

        // };
      
    },

    loginAuthorize: (state, action) => {

      console.log('Auth slice im in authorize')
      state.someVar=action.payload
      state.authToken=null
      state.authToken=action.payload
      
      console.log('PAYLOAD=',action.payload.token,'codeFromServer=',state.currentUser)

      const decoded = jwt_decode(action.payload.token);
      console.log('1 authorize decoded token=========', decoded)

      
      localStorage.setItem("token", action.payload.token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
      state.loading=false
    },

    sendCodeReducer: (state, action) => {
      // console.log('SendCodeReducer token from profileMyposts'.action.payload)
      localStorage.setItem("token", action.payload.token);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
      // axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`; // Add space after 'Bearer'
    
      const decoded = jwt_decode(action.payload.token);
      console.log('decoded token=========', decoded)

      

      state.authToken = {
        id: decoded.id,
        email: decoded.email,
        code:decoded.code,
        name:decoded.name,
        phone:decoded.phone,
        lastname:decoded.lastname,
     
      };

      state.currentUser = {
        id: decoded.id,
        email: decoded.email,
        code:decoded.code,
        name:decoded.name,
        phone:decoded.phone,
        lastname:decoded.lastname,
     
      };
      state.isAuth = true;
  },


  sendUserDataReducer: (state, action) => {
    console.log(' 1 SendDataReducer token from sendDataUserReducer',action.payload)
    
    state.currentUser=action.payload
    state.loading = false;
    console.log(' 2 SendDataReducer state changed',state.currentUser)
    

  //   state.currentUser = state.allPosts.map(item => {
  //     if(item.id === data.payload.postId) {
  //         item.commentaries.push(data.payload)
  //         return item
  //     } 
  //     return item

  // })

    // localStorage.setItem("token", state.currentUser);
    
    // axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
    
  
    
    // console.log('decoded token=========', localStorage.getItem("token"))

    


    // state.currentUser = {
    //   id: decoded.id,
    //   email: decoded.email,
      
    // };
    // state.isAuth = true;
},
      addCompanyReducer: (state, action) => {
        // state.currentCompany = action.payload;
        console.log('AddCompanyReducer Started', action.payload)
      },


      logout: (state) => { // Clear user-related state when logging out
          console.log('Logut start')
          localStorage.removeItem('token'); // Remove the token from localStorage
          axios.defaults.headers.common['Authorization'] = ''; // Remove Authorization header
          state.currentUser = null;
          state.isAuth = false;
          state.authToken = null;
      },

      getAllCoursesReducer:(state, action) => {
        state.courses=action.payload
        state.loadingCourses=false
        console.log('getAllCoursesReducer start ')

       
  },

  
  getCurrentCoursesReducer:(state, action) => {
    state.currentCourse=action.payload
}

},


createDocumentReducer: (state, action) => {
  state.alldocuments = [...state.alldocuments, action.payload];
},
 

createLessonReducer: (state, action) => {
  console.log(action.payload)
  state.allDocuments = [...state.allDocuments, action.payload]; //нужен для обновления всех документов в реальном времени
},


addAllLessonsReducer: (state, action) => {
  state.lessons = action.payload; // Update the lessons array in the state
},

addProgressReducer: (state, action) => {
  state.progress =  [...state.progress, action.payload];; // Обновляем массив завершённых уроков
},


    });



// Action creators are generated for each case reducer function
export const { createDocumentReducer,getAllCoursesReducer,setError,clearError,setUploadProgress,
  clearUploadProgress,sendErrorReducer,getCurrentCoursesReducer,addProgressReducer,
  getAllRevisesReducer,ReviseReducer,authorize, logout, editVar ,
  sendCodeReducer,sendUserDataReducer,setCurrentUserReducer,addCompletedLessonReducer,
  getBannerByCompanyIdReducer,getAllBannersReducer, createLessonReducer,addAllLessonsReducer,
  loginReducer,addCompanyReducer,getAllCompaniesReducer} = authSlice.actions;

// Use useEffect for token initialization
// export const useTokenInitialization = () => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (token) {
//       let decodedToken = jwt_decode(token);

//       // Create a new state object and set properties
//       const newState = {
//         ...initialState,
//         isAuth: true,
//         currentUser: {
//           id: decodedToken.id,
//           email: decodedToken.email,
//           name: decodedToken.name,
//           password: decodedToken.password,
//           username: decodedToken.username,
//         },
//       };


//       axios.post(`${END_POINT}/api/auth/login`, {
//         email: decodedToken.email,
//         password: decodedToken.password,
//       }).then((res) => {
//         dispatch(login(res.data));
//       });

//       // Dispatch the login action with the new state
//       dispatch(login(newState));
//     } else {
//       localStorage.removeItem('token');
//     }
//   }, [token, dispatch]);

//   console.log('Token не найден');
//   return null;
// };


export const createLessonAction = (request) => async (dispatch) => {
  const token = localStorage.getItem("token");

  console.log(request)
  

  const data = { 
    document_name: request.documentName,
    document_content: {},
   };

  try {
    const response = await axios.post(
      `${END_POINT}/api/user/project/${request.projectId}/createdocument`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Set the content type to JSON
        },
      }
    );

    console.log("Data uploaded successfully:", response.data);
    dispatch(createLessonReducer(response.data));
    // Handle success, e.g., dispatch an action to update state
  } catch (error) {
    // Handle errors, e.g., by returning an error object or dispatching an error action
    // console.error("Error uploading data:", error);
    // You can dispatch an error action here if needed.
  }
};


export const createDocumentAction = (file, name) => async (dispatch) => {
  const formData = new FormData();
  const blob = new Blob([file], { type: file.type });
  formData.append("file", blob, file.name);
  formData.append("name", name);

  try {
    const response = await axios.post(`${host}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    dispatch(createDocumentReducer(response.data));
  } catch (error) {
    dispatch(setError(error.message));
  }
};


export const  getCourseByIdAction = (id) => async(dispatch) => {
  console.log('1 getCourseByIdAction started  id=',id)
  
  const response = await axios.get(
    `${host}/api/courses/${id}`,{
      // headers: {
      //   'Authorization': `Bearer ${token}`,
      //   'Content-Type': 'application/json', 
      // },
    }
  ).then((response) => {
    console.log('1.2 getcoursebyid response ',response.data)
    dispatch(getCurrentCoursesReducer(response.data));
  });
};


// export const  getAllCoursesAction= () => async(dispatch) => {
//   console.log('1 getAllCourse started')
  
//   const response = await axios.get(
//     `${host}/api/courses`
     
//   ).then((response) => {
//     console.log('1.2 getAllCourse response ',response.data)
//     dispatch(getAllCoursesReducer(response.data));
//   });
// };

export const getAllCoursesAction = () => async (dispatch) => {
  console.log("1 getAllCourse started");

  // Во время сборки возвращаем заглушку
  if (process.env.NODE_ENV === "production" && typeof window === "undefined") {
    const mockData = [{ id: 1, title: "Mock Course", description: "Mock Description" }];
    console.log("1.1 Using mock data for build:", mockData);
    dispatch(getAllCoursesReducer(mockData));
    return Promise.resolve(mockData); // Обязательно возвращаем промис для .unwrap()
  }

  // Реальный запрос для выполнения в браузере
  try {
    const response = await axios.get(`${host}/api/courses`, {
      timeout: 5000, // Тайм-аут для надежности
    });
    console.log("1.2 getAllCourse response:", response.data);
    dispatch(getAllCoursesReducer(response.data));
    return response.data; // Возвращаем данные для .unwrap()
  } catch (error) {
    console.error("Ошибка в getAllCoursesAction:", error);
    throw error; // Пробрасываем ошибку для .unwrap()
  }
};


export const  getAllCompanies= () => async(dispatch) => {
  console.log('1 getAllBanner started', token)
  
  const response = await axios.get(
    `${END_POINT}/api/auth/getallcompanies`,{
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json', // Set the content type to JSON
      },
    }
  ).then((response) => {
    console.log('1.2 getAllCompanies RESPONSE ',response.data)
    dispatch(getAllCompaniesReducer(response.data));
  });
};

export const  getAllBanners= () => async(dispatch) => {
  console.log('1 getAllBanner started')
  
  const response = await axios.get(
    `${END_POINT}/api/banner/getall`,{
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json', // Set the content type to JSON
      },
    }
  ).then((response) => {
    console.log('1.2 getBannerByCompanyId response ',response.data)
    dispatch(getAllBannersReducer(response.data));
  });
};


export const  getBannerByCompanyIdAction= (companyId) => async(dispatch) => {
  console.log('1 getBannerByCompanyId started')
  console.log('1.1 COMPANYID======', companyId)
  const response = await axios.get(
    `${END_POINT}/api/banner/getbycompanyid/${companyId}`,{
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json', // Set the content type to JSON
      },
    }
  ).then((response) => {
    console.log('1.2 getBannerByCompanyId response ',response.data)
    dispatch(getBannerByCompanyIdReducer(response.data));
  });
};




export const  getUserInfoAction =() => async(dispatch)=>{
  initializeToken()
  console.log('1 getUserInFo started token=,',token)

  const response = await axios.get(`${host}/api/auth/getAuthentificatedUserInfo`,
    {headers: {
      'Authorization': `Bearer ${token}`,
    }
    },).then((response) => {
    console.log('1.2 getUserInFo response ',response.data)
    dispatch(setCurrentUserReducer(response.data));
  });
};

export const getAllLessonsAction = () => async (dispatch) => {
  console.log("1 getAllLessonsAction started");

  try {
    const token = localStorage.getItem("token"); // Ensure the token is retrieved
    const response = await axios.get(`${host}/api/lessons`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("1.2 getAllLessonsAction response ", response.data);
    dispatch(addAllLessonsReducer(response.data)); // Dispatch the data to the reducer
  } catch (error) {
    console.error("Error fetching lessons:", error);
  }
};


// const fetchUserInfo = async () => {
//   console.log('fetchUserInfo started!')
//   try {
//     const response = await axios.get(`${host}/api/auth/getAuthentificatedUserInfo",
//     {headers: {
//       'Authorization': `Bearer ${token}`,
//     }
//     },);
//     setUserInfo(response.data);
//   } catch (error) {
//     console.error("Ошибка при загрузке уроков:", error);
    
//   }
// };




export const useTokenInitialization = (dispatch) => {
  const urlParams = new URLSearchParams(window.location.search);
     const token = urlParams.get("token");
 
     if (token) {
       try {
         // Save token to localStorage
         localStorage.setItem("token", token);
 
         // Decode token
         const decoded = jwt_decode(token);
         console.log("Decoded token:", decoded);
 
         // Update Redux state
         dispatch(loginReducer({ token }));
       } catch (error) {
         console.error("Invalid token:", error);
         localStorage.removeItem("token"); // Remove invalid token
       }
 
       // Clean up the URL (optional)
       window.history.replaceState({}, document.title, "/layout");
     }
  

  return null;
};





export const createUserAction = ({email, password} ) => async (dispatch) => {
  console.log('1 createUser запустился ', email, password);
  dispatch({ type: 'REGISTER_USER_REQUEST' }); // Запрос начат

  try {
    // Проверка, существует ли пользователь с таким email
    const checkUserResponse = await axios.get(`${host}/api/auth/check-email?email=${email}`);
    
    if (checkUserResponse.data.exists) {
      
      // Если пользователь с таким email уже существует
      dispatch({
        type: 'REGISTER_USER_FAILURE',
        payload: 'Пользователь с таким email уже существует',
      });
      console.log('Существует такой email')
      return; // Прерываем выполнение функции
    }

    // Если пользователя с таким email нет, продолжаем регистрацию
    await axios.post(`${host}/api/register`, {
      email,
      password,
      roleId: 3,
    });


  } catch (error) {
    // Обработка ошибок сети или сервера
    dispatch({
      type: 'REGISTER_USER_FAILURE',
      payload: error.response?.data?.error || error.message,
    });
  }
};

export const createTeacherAction = ({email, password} ) => async (dispatch) => {
  console.log('1 createUser запустился ', email, password);
  dispatch({ type: 'REGISTER_USER_REQUEST' }); // Запрос начат

  try {
    // Проверка, существует ли пользователь с таким email
    const checkUserResponse = await axios.get(`${host}/api/auth/check-email?email=${email}`);
    
    if (checkUserResponse.data.exists) {
      
      // Если пользователь с таким email уже существует
      dispatch({
        type: 'REGISTER_USER_FAILURE',
        payload: 'Пользователь с таким email уже существует',
      });
      console.log('Существует такой email')
      return; // Прерываем выполнение функции
    }

    // Если пользователя с таким email нет, продолжаем регистрацию
    await axios.post(`${host}/api/register`, {
       email,
     
      password,
      roleId: 2,
    });


  } catch (error) {
    // Обработка ошибок сети или сервера
    dispatch({
      type: 'REGISTER_USER_FAILURE',
      payload: error.response?.data?.error || error.message,
    });
  }
};

// export const createTeacherAction = ({email, password}) => async(dispatch) => {
//   console.log('1 creatTeacher запустился ', email, password);
//   dispatch({ type: 'REGISTER_USER_REQUEST' }); // Запрос начат

//   try {
//     // Отправка данных на сервер
//     const response = await axios.post('${host}/api/auth/sendmail', {
//         email: email,
//         name: 'notcompleted',
//         lastname: 'notcompleted',
//         phone:'+2342454535',
//         password: password,
//         roleId:3
//     });

//     // Если регистрация успешна
//     if (response.status === 201) {
//       dispatch({
//         type: 'REGISTER_USER_SUCCESS',
//         payload: response.data.message, // Сообщение от сервера
//       });
//     } else {
//       // Если сервер вернул ошибку
//       dispatch({
//         type: 'REGISTER_USER_FAILURE',
//         payload: response.data.error || 'Ошибка при регистрации',
//       });
//     }
//   } catch (error) {
//     // Обработка ошибок сети или сервера
//     dispatch({
//       type: 'REGISTER_USER_FAILURE',
//       payload: error.response?.data?.error || error.message,
//     });
//   }
//   // await axios.post(`${host}/api/auth/sendmail`, {
//   //   email: email,
//   //   name: 'not completed',
//   //   lastname: 'not completed',
//   //   phone:'2342454535',
//   //   password: password,

//   // }).then((res) => {
//   //   dispatch(authorize(res.data));
//   // }).catch((error)=>{
//   //   console.log('error')
//   // });
// };



export const loginInspectorAction = (email,password) => async(dispatch) => {
  // axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
  console.log('loginAction  start',email,password)
  // console.log('1 AutheUser запустился ', email, password);
 await axios.post(`${END_POINT}/api/auth/login`, {
    email: email,
    password:password,
    
  }).then((res) => {
    console.log('response from loginAction ',res)
    dispatch(loginReducer(res.data));
  });
};

export const loginAction = ({ email, password }) => async (dispatch) => {
  console.log('1 login Action started host- ',host)
  try {
    const response = await axios.post(`${host}/api/auth/login`, {
      email,
      password,
    });

    const token = response.data.token;

    // Save the token to localStorage
    localStorage.setItem("token", token);

    // Update Redux state
    

    if (typeof window !== "undefined") {
      localStorage.setItem("token", token); // Set token only in the browser
    }

    await dispatch(loginReducer({ token }));
  } catch (error) {
    console.error("Login failed:", error);
  }
};





export const sendCodeToEmailAction = (email) => async(dispatch) => {
  // axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;

  // console.log('auth user start')
  // console.log('1 AutheUser запустился ', email, password);

 await axios.post(`${END_POINT}/api/auth/sendmail`, {
    email: email,
  }).then((res) => {
    console.log('response ',res)
    dispatch(authorize(res.data));
  });
};





export const verifyCodeAction = (email,code) => async (dispatch) => {
  // axios.defaults.headers.common['Authorization'] = `Bearer ${action.payload.token}`;
  console.log('VerifuCodeAction started',email,typeof(email),code,typeof(code))
  // console.log('1 AutheUser запустился ', email, password);
 await axios.post(`${END_POINT}/api/auth/verifycode`, {
    email: email,
    fullcode:code
  }).then((res) => {
    console.log('response from verifyCodeAction ',res.data)
    localStorage.setItem('token',res.data)
    dispatch(sendCodeReducer(res.data));
  });
};




// export const addWatermarkToImageAction=(images)=>async(dispatch)=>{
  
// console.log('addWatermarkToImageAction Started images=',images)
//   const token = localStorage.getItem("token");


//   const formData = new FormData();
//   formData.append('images', images[0]);
//   formData.append('images', images[1]);
 

//   let sometext='text from shareFUNCTION'

//   // console.log('FORMDATA before pass to redux',formData)
//   // for (const value of formData.values()) {
//   //     console.log('addWatermarkToImageAction  formData Values',value);
//   //   }
//   // console.log('1 createPostSlice | createPostFunc запустился ');

//   if (!token) {
//     // Handle the case where the token is not available or invalid
//     console.error('Token not available');
//     return;
// }
 

  
 
//   try {
//     const data = {
//      images
//     };
//     console.log('Token from addFullProfileDataAction=',token,'addFullProfileDataAction Started formData=',data.images)
//     const response = await axios.post(
//       `${END_POINT}/api/banner/addimagecode`,
//       formData,
//       {
//         headers: {
//           // 'Authorization': `Bearer ${token}`,
//           'Content-Type': 'multipart/form-data', // Set the content type to JSON
//         },
//       }
//     );

//     console.log('Data uploaded successfully:', response.data);
//     // dispatch(sendUserDataReducer(response.data))

 
//     // Handle success, e.g., dispatch an action to update state
//   } catch (error) {
//     console.log('erro from auth Slicer=',error.response.data.message)
    
//       await dispatch(sendErrorReducer(error.response.data))
    

//     // Handle errors, e.g., by returning an error object or dispatching an error action
//     console.error('Error uploading data:', error);
//     // You can dispatch an error action here if needed.
//   }}



// export const addWatermarkToImageAction = (images,updateUploadProgress) => async (dispatch) => {
//   const token = localStorage.getItem('token');
//   const formData = new FormData();
//   formData.append('images', images[0]);
//   formData.append('images', images[1]);

//   if (!token) {
//     console.error('Token not available');
//     return;
//   }

//   try {
//     const config = {
//       headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//       onUploadProgress: (progressEvent) => {
//         const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
//         dispatch(setUploadProgress(percentage));
//         if (updateUploadProgress) {
//           updateUploadProgress(percentage);
//         }
//       },
//     };

//     const response = await axios.post(
//       `${END_POINT}/api/banner/addimagecode`,
//       formData,
//       config
//     );

//     console.log('Data uploaded successfully:', response.data);
//     dispatch(sendUserDataReducer(response.data));
//     dispatch(updateUploadProgress(100)); // Set the progress to 100% on success
//   } catch (error) {
//     console.error('Error uploading data:', error);
//     await dispatch(sendErrorReducer(error.response.data));
//   }
// };









export const addFullProfileDataAction=(password,phone,name,lastname)=>async(dispatch)=>{
  console.log('addFullProfileDataAction started',password,phone,name,lastname)

  const token = localStorage.getItem("token");


  const formData = new FormData();
  formData.append('password', password);
  formData.append('phone', phone);
  formData.append('name', name);
  formData.append('lastname', lastname);

  let sometext='text from shareFUNCTION'

  // console.log('FORMDATA before pass to redux',formData)
  for (const value of formData.values()) {
      console.log('addFullProfileDataAction  formData Values',value);
    }
  // console.log('1 createPostSlice | createPostFunc запустился ');

  if (!token) {
    // Handle the case where the token is not available or invalid
    console.error('Token not available');
    return;
}
 

  
 
  try {
    const data = {
      password,
      phone,
      name,
      lastname,
    };
    console.log('Token from addFullProfileDataAction=',token,'addFullProfileDataAction Started formData=',data.password)
    const response = await axios.post(
      `${END_POINT}/api/auth/addfullprofile`,
      data.password,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json', // Set the content type to JSON
        },
      }
    );

    console.log('Data uploaded successfully:', response.data);
    dispatch(sendUserDataReducer(response.data))

 
    // Handle success, e.g., dispatch an action to update state
  } catch (error) {
    console.log('erro from auth Slicer=',error.response.data.message)
    
      await dispatch(sendErrorReducer(error.response.data))
    

    // Handle errors, e.g., by returning an error object or dispatching an error action
    console.error('Error uploading data:', error);
    // You can dispatch an error action here if needed.
  }}

export const addCompanyAction=(name,description,bin,address,contactEmail,contactPhone,isUR)=>async(dispatch)=>{
    console.log('addFullProfileDataAction started',name,description,bin,address,contactEmail,contactPhone,isUR)
  
    const token = localStorage.getItem("token");
  
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('bin', bin);
    formData.append('address', address);
    formData.append('contactEmail', contactEmail);
    formData.append('contactPhone', contactPhone);
    formData.append('isUR', isUR);

    let sometext='text from shareFUNCTION'
  
    // console.log('FORMDATA before pass to redux',formData)
    for (const value of formData.values()) {
        console.log('addFullProfileDataAction  formData Values',value);
      }
  
  
    if (!token) {
      // Handle the case where the token is not available or invalid
      console.error('Token not available');
      return;
  }
   
  
    try {
      const data = {
        name,
        description,
        bin,
        address,
        contactPhone,
        contactEmail,
        isUR
      };
      console.log('Token from addFullProfileDataAction=',token,'addFullProfileDataAction Started formData=',data.name)
      const response = await axios.post(
        `${END_POINT}/api/auth/createcompany`,
        data.name,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json', // Set the content type to JSON
          },
        }
      );
  
      
      console.log('Data uploaded successfully:', response.data);
      dispatch(addCompanyReducer(response.data))
      // Handle success, e.g., dispatch an action to update state
    } catch (error) {
      await dispatch(sendErrorReducer(error.response.data))
    
      // Handle errors, e.g., by returning an error object or dispatching an error action
      console.error('Error uploading data:', error);
      // You can dispatch an error action here if needed.
    }}


export const addBannerAction=(formData)=>async(dispatch)=>{
      console.log('addFullProfileDataAction started',formData)
    
      const token = localStorage.getItem("token");
    
    
      

     
      for (const value of formData.values()) {
        console.log('formData Values',value);
    }
      
      if (!token) {
        console.error('Token not available');
        return;
      }
      



      try {
        const response = await axios.post(
          `${END_POINT}/api/banner`,formData,{
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'multipart/form-data', // Set the content type to 'multipart/form-data'
            },
          }
        );
      
        console.log('Data uploaded successfully:', response.data);
        // Handle success, e.g., dispatch an action to update state
      } catch (error) {
        console.error('Error uploading data:', error);
        // Handle errors, e.g., by returning an error object or dispatching an error action
      }
  

    }



export const addProgressAction = (userId,course) => async (dispatch) => {
  console.log('addProgressAction started')
  
       
        // const response = await axios.get(`${host}/api/course/progress/${userId}/${course}`)
          
        //   dispatch(addProgressReducer(response.data));
        

          await axios.get(`${END_POINT}/api/course/progress/${userId}/${course}` ).then((res) => {
            console.log('response from verifyCodeAction ',res.data)
            
            // dispatch(addProgressReducer(res.data));
          });
        // Диспатчим редуктор с новыми данными
        
    
    };






    export const addReviseForBannerAction = (formData, bannerId) => async (dispatch) => {
      try {
        const token = localStorage.getItem('token');
    
        if (!token) {
          console.error('Token not available');
          return;
        }
    
        const response = await axios.post(`${END_POINT}/api/revise/${bannerId}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data', // Set the content type to 'multipart/form-data'
          },
        });
    
        console.log('Data uploaded successfully:', response.data);
    
        // Dispatch an action to update state or handle the response as needed
        dispatch(ReviseReducer(response.data));
      } catch (error) {
        console.error('Error uploading data:', error);
        // Handle errors, e.g., by returning an error object or dispatching an error action
      }
    };
    

    
export const logoutAction = () => (dispatch) => {
  // console.log('logoutAction started/');

  dispatch(logout());
};



export default authSlice.reducer;