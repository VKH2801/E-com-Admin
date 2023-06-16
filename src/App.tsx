import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login/Login";
import Home from "./components/Home/Home";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./app/store";
import { useEffect } from "react";
import { setUser } from "./slice/userSlice";
import Categories from "./components/Categories/Categories";
import Locations from "./components/Locations/Locations";
import Users from "./components/Users/User";
import Posts from "./components/Posts/Posts";

function App() {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      dispatch(setUser(JSON.parse(savedUser)));
    }
  }, [dispatch]);

  return (
    <div className="container">
      <Routes>
        <Route path="/" element={user.id ? <Home user={user} /> : <Navigate to="/login" />} />
        <Route path="/login" element={user.id ? <Navigate to="/" /> : <Login />} />
        <Route path="/categories" element={!user.id ? <Login /> : <Categories user={user} />} />
        <Route path="/locations" element={!user.id ? <Login /> : <Locations user={user} />} />
        <Route path="/users" element={!user.id ? <Login /> : <Users user={user} />} />
        <Route path="/posts" element={!user.id ? <Login /> : <Posts user={user} />} />
      </Routes>
    </div>
  );
}

export default App;
