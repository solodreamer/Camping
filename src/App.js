// import logo from './logo.svg';
// import './App.css';
import { Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import HomePage from "./pages/homePage";
import PrivacyPolicy from "./pages/privacyPolicy";
import TermService from "./pages/termService";
import SearchPage from "./pages/searchPage";
import DetailCamp from "./pages/detailCamp";

function App() {
  // useEffect(() => {
  //     console.log(process.env.REACT_APP_API_URL, process.env.REACT_APP_API_PATH);
  //     (async () => {
  //         const res = await axios.get(`/v2/api/${process.env.REACT_APP_API_PATH}/products/all`);
  //         console.log('我是axios', res);
  //       })()
  //     }, [])

  // useEffect(() => {
  //   // fetch("https://student-json-api.lidemy.me/comments?_sort=createdAt&_order=desc")
  //   // fetch("https://ec-course-api.hexschool.io/v2/api/john-test/products/all")
  //   fetch("http://172.105.209.194/api/test", { method: "GET" })
  //     .then((res) => res.json())
  //     .then((data) => {
  //       console.log('我是fetch', data);
  //     })
  //     .catch((err) => {
  //       console.log('我是fetch', err);
  //     })
  // }, [])

  // const submit = async(e) => {
  //   try {
  //     const res = await axios.get(`http://172.105.209.194/api/test`); 
  //     console.log('我是fetch', res);
  //   } catch (err) {

  //   }
  // }

  return (
    <div className="App">
      {/* 設定路由路徑 */}
      <Routes>
        <Route path="" element={<HomePage />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/privacyPolicy" element={<PrivacyPolicy />}></Route>
        <Route path="/termService" element={<TermService />}></Route>
        <Route path="/searchPage" element={<SearchPage />}></Route>
        <Route path="/detailCamp" element={<DetailCamp />}></Route>
      </Routes>
    </div>
  );
}

export default App;
