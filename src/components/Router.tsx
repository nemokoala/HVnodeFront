import { useState } from "react";
import {
  HashRouter as Router,
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import Admin from "routes/Admin/Admin";
import Home from "routes/Home";
import Review from "routes/Review";
import ReviewDetail from "routes/ReviewDetail";
import ReviewFac from "routes/ReviewFac";
import Map from "./LegacyMapContainer";
import Nav from "./Nav";
import styles from "./Router.module.css";
import BackButton from "./BackButton";
import Register from "routes/Register";
import Profile from "routes/Profile";
import { useSelector } from "react-redux";
import Modal from "./Modal";
import Community from "routes/Community";
import CommunityFactory from "routes/CommunityFactory";
import Post from "./Post";
import Verify from "routes/Verify";

function AppRouter() {
  const [searchTerm, setSearchTerm] = useState("");
  const session = useSelector((state: any) => state.userSet.session);
  const modal = useSelector((state: any) => state.modalSet.modal);
  return (
    <div className={styles.body}>
      <Router>
        <Nav searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <BackButton />
        {modal.open && <Modal />}
        <Routes>
          {(!session || session.verified) && (
            <>
              <Route path="/" element={<Home />} />
              <Route
                path="/review"
                element={
                  <Review
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                }
              />
              <Route path="/review/:id" element={<ReviewDetail />} />
              <Route path="/reviewfac" element={<ReviewFac />} />
              <Route path="/map" element={<Map />} />
              <Route path="/community" element={<Community />} />
              <Route path="/community/:id" element={<Post />} />
              <Route path="/community/post" element={<CommunityFactory />} />
              {session ? (
                <Route path="/profile" element={<Profile />} />
              ) : (
                <>
                  <Route path="/join" element={<Register />} />
                  <Route path="/login" element={<Register />} />
                </>
              )}
              <Route path="*" element={<Navigate replace to="/" />} />
            </>
          )}
          {session.role === "ADMIN" && (
            <Route path="/admin" element={<Admin />} />
          )}

          {/* 미인증 시 로그인 인증창으로 */}
          {session && !session.verified && (
            <>
              <Route path="/verify" element={<Verify />} />
              <Route path="*" element={<Navigate replace to="/verify" />} />
            </>
          )}
        </Routes>
      </Router>
    </div>
  );
}

export default AppRouter;
