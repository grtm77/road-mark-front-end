import axios from "axios";

const server = axios.create({
  baseURL: "http://localhost:12002",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    // token: localGet('token') || ''
    // post: {
    //     'Content-Type': 'application/jsona'
    // }
  },
});

// 请求拦截器，后续有需要再添加
// server.interceptors.request.use((config) => {
// if (localGet('token')) {
//     if (config.headers.token !== localGet('token')) {
//         config.headers.token = localGet('token')
//     }
// }
// return config
// })

// 响应拦截器，后续有需要再添加
// server.interceptors.response.use((res) => {
//     if (res.data.code === 2001) {
//         localRemove('token')
//         router.push('/login')
//     }
//     return res
// })
// response => {
//     if (response.data.code === 999) {
//         localRemove("token");
//         // router.replace('/');
//         console.log("token过期");
//     }
//     return response;
// },
// error => {
//     return Promise.reject(error);
// }

export default server;
