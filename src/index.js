import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from "react-router-dom";
import './index.css';
import App from './App';
import axios from 'axios';

axios.defaults.baseURL = '/api'
axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    //window.localStorage.getItem("accessToken") 获取token的value
    let token = window.localStorage.getItem("token")
    if (token) {
        //将token放到请求头发送给服务器,将tokenkey放在请求头中
        config.headers.token = token;   
  
        //也可以这种写法
        // config.headers['accessToken'] = Token;
         return config;
    } else {
      return config;   //无论怎么样都必须返回config
    }
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });
  

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
    <App />
    </BrowserRouter>
);
