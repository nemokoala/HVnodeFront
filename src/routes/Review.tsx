import Map from "components/LegacyMapContainer";
import ReviewBlock from "components/ReviewBlock";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./Review.module.css";
import axios from "axios";
import { apiAddress } from "value";

function Review({ searchTerm, setSearchTerm }: any) {
  const [reviews, setReviews] = useState<any>([]);
  const [sidoList, setSidoList] = useState<any>([]);
  const [sidoFilter, setSidoFilter] = useState("전체");
  const [showNoResult, setShowNoResult] = useState(false);
  const [filteredReview, setFilteredReivew] = useState<any>([]);

  useEffect(() => {
    getReviews();
  }, []);
  useEffect(() => {
    createSidoBtn();
  }, [reviews]);
  useEffect(() => {
    if (searchTerm.length > 0) {
      let filtered = reviews.filter(
        (review: any) =>
          (review.room.building.includes(searchTerm) ||
            review.room.newAddress.includes(searchTerm) ||
            review.room.oldAddress.includes(searchTerm)) &&
          review.room.sido === sidoFilter
      );
      if (sidoFilter === "전체") {
        filtered = reviews.filter(
          (review: any) =>
            review.room.building.includes(searchTerm) ||
            review.room.newAddress.includes(searchTerm) ||
            review.room.oldAddress.includes(searchTerm)
        );
      }
      console.log(filtered);
      if (filtered.length === 0) setShowNoResult(true);
      else setShowNoResult(false);
    }
    if (reviews) {
      const newfilteredReview = reviews.filter(
        (review: any) =>
          review.room.building.includes(searchTerm) ||
          review.room.newAddress.includes(searchTerm) ||
          review.room.oldAddress.includes(searchTerm)
      );
      setFilteredReivew([...newfilteredReview]);
    }
  }, [searchTerm, sidoFilter]); //시도 버튼 클릭 시 + 검색어 입력시 검색없음 텍스트 나오게하기.

  const createSidoBtn = () => {
    const sidos = new Array();
    for (let i = 0; i < reviews.length; i++) {
      let 중복 = false;
      sidos.forEach((sido) => {
        if (sido === reviews[i].room.sido) 중복 = true;
      });
      if (중복 === false) sidos.push(reviews[i].room.sido);
    }

    const sortedSidos = sidos.sort();
    setSidoList([...sortedSidos, "전체"]);
  };

  const getReviews = async () => {
    try {
      const response = await axios.get(`${apiAddress}/review/all`);
      setReviews(response.data);
      setFilteredReivew(response.data);
      console.log("ReviewDetail.tsx(getReviews): " + JSON.stringify(response));
    } catch (error: any) {
      console.error("ReviewDetail.tsx(getReviews): " + JSON.stringify(error));
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.btns}>
          {sidoList.map((sido: any) => (
            <div
              className={`${styles.sidoBtn} ${
                sidoFilter === sido && styles.active
              }`}
              key={sido}
              onClick={() => setSidoFilter(sido)}
            >
              {sido}
            </div>
          ))}
        </div>

        {searchTerm === ""
          ? reviews.map(
              (review: any) =>
                (sidoFilter === review.room.sido || sidoFilter === "전체") && (
                  <ReviewBlock review={review} key={review.id} />
                )
            )
          : filteredReview.map(
              (review: any) =>
                (sidoFilter === review.room.sido || sidoFilter === "전체") && (
                  <ReviewBlock review={review} key={review.id} />
                )
            )}
        {showNoResult && (
          <div
            className={styles.searchNothing}
            onClick={() => {
              setSearchTerm("");
              setShowNoResult(false);
            }}
          >
            <div>현재 검색어 필터 : "{searchTerm}"</div>
            <div>현재 시도 필터 : "{sidoFilter}"</div>
            <span className={styles.x}>x</span>
            <br />
            <span>검색 결과 없음</span>
          </div>
        )}
      </div>
    </>
  );
}
export default Review;
