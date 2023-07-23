import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Admin.module.css";
import AdminRoom from "./AdminRoom";
import AdminUser from "./AdminUser";
import { useDispatch, useSelector } from "react-redux";
import { setModal } from "slice/modalSlice";
import axios from "axios";
import { apiAddress } from "value";
import AdminReview from "./AdminReview";
import AdminComment from "./AdminComment";
import AdminCommunity from "./AdminCommunity";
function Admin({ reviewData, setReviewData }: any) {
  const [location, setLocation] = useState("user");
  const [unlock, setUnlock] = useState(false);
  const [members, setMembers] = useState<any>();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const session = useSelector((state: any) => state.userSet.session);
  useEffect(() => {
    if (session) adminCheck();
  }, [session]);
  const adminCheck = async () => {
    try {
      const response = await axios.get(`${apiAddress}/admin/check`, {
        headers: { Authorization: session.token },
      });
      console.log(JSON.stringify(response));
      if (response.status !== 200) {
        dispatch(
          setModal({
            title: "알림",
            text: "권한이 없습니다.",
            titleColor: "red",
          } as any)
        );
        navigate("/");
      }
    } catch (error: any) {
      const errorText = JSON.stringify(error);
      console.error("에러 : " + error);
      dispatch(
        setModal({
          title: "에러!",
          titleColor: "red",
          text: errorText,
        } as any)
      );
    }
  };
  return (
    <div className={styles.container}>
      <aside className={styles.aside}>
        <div
          className={location === "user" ? styles.divOn : styles.divOff}
          onClick={() => setLocation("user")}
        >
          유저 관리
        </div>
        <div
          className={location === "room" ? styles.divOn : styles.divOff}
          onClick={() => setLocation("room")}
        >
          방 관리
        </div>
        <div
          className={location === "review" ? styles.divOn : styles.divOff}
          onClick={() => setLocation("review")}
        >
          리뷰 관리
        </div>
        <div
          className={location === "comment" ? styles.divOn : styles.divOff}
          onClick={() => setLocation("comment")}
        >
          댓글 관리
        </div>
        <div
          className={location === "community" ? styles.divOn : styles.divOff}
          onClick={() => setLocation("community")}
        >
          글 관리
        </div>
      </aside>
      <section className={styles.section}>
        {location === "user" ? <AdminUser /> : null}
        {location === "room" ? <AdminRoom /> : null}
        {location === "review" ? <AdminReview /> : null}
        {location === "comment" ? <AdminComment /> : null}
        {location === "community" ? <AdminCommunity /> : null}
      </section>
    </div>
  );
}
export default Admin;
