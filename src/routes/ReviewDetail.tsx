import axios from "axios";
import MapContainer from "components/MapContainer";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate, useParams } from "react-router-dom";
import { setModal } from "slice/modalSlice";
import styled from "styled-components";
import { apiAddress } from "value";

function ReviewDetail() {
  const [reviewData, setReviewData] = useState<any>(null);
  const [nearBuildings, setNearBuildings] = useState<any>(null);
  const [categoryGroup, setCategoryGroup] = useState({
    now: "",
    list: [
      { name: "대형마트", code: "MT1" },
      { name: "편의점", code: "CS2" },
      { name: "지하철역", code: "SW8" },
      { name: "음식점", code: "FD6" },
      { name: "카페", code: "CE7" },
      { name: "은행", code: "BK9" },
      { name: "병원", code: "HP8" },
      { name: "약국", code: "PM9" },
    ],
  });
  const [stars, setStars] = useState("");
  const session = useSelector((state: any) => state.userSet.session);
  const params = useParams();
  const reviewId = params.id;
  const dispatch = useDispatch();
  useEffect(() => {
    getReviewDetail();
  }, []);

  useEffect(() => {
    if (reviewData) {
      setStar();
    }
  }, [reviewData]);

  useEffect(() => {
    if (categoryGroup.now === "") {
      setNearBuildings(null);
    }
  }, [categoryGroup]);

  const getReviewDetail = async () => {
    try {
      const response = await axios.get(`${apiAddress}/review/get/${reviewId}`);
      setReviewData(response.data);
      console.log(
        "ReviewDetail.tsx(getReviewDetail): " + JSON.stringify(response)
      );
    } catch (error: any) {
      console.error(
        "ReviewDetail.tsx(getReviewDetail): " + JSON.stringify(error)
      );
    }
  };

  const getNearBuilding = async (code: any) => {
    setCategoryGroup((prev) => {
      if (prev.now === code) return { ...prev, now: "" };
      else return { ...prev, now: code };
    });
    if (categoryGroup.now === code) return;
    const appKey = process.env.REACT_APP_REST;
    const apiUrl = "https://dapi.kakao.com/v2/local/search/category.json";
    const headers = { Authorization: `KakaoAK ${appKey}` };
    const params = {
      category_group_code: code, // 편의점 카테고리 코드
      x: reviewData.room.longitude, // 검색할 좌표의 경도
      y: reviewData.room.latitude, // 검색할 좌표의 위도
      radius: 1000, // 검색 반경(미터)
      sort: "distance", // 정렬 순서
    };
    try {
      const response = await axios.get(apiUrl, {
        headers,
        params,
      });
      setNearBuildings(response.data);
      console.log("카테고리 " + JSON.stringify(response));
    } catch (error) {
      console.error(error);
    }
  };

  const deleteReview = async () => {
    if (session.role !== "ADMIN") {
      if (window.confirm("리뷰를 삭제하시겠습니까?"))
        try {
          const response = await axios.delete(
            `${apiAddress}/review/delete/${reviewId}`,
            { headers: { Authorization: session.token } }
          );
          if (response) navigate("/review");
          console.log(
            "ReviewDetail.tsx(deleteReview): " + JSON.stringify(response)
          );
        } catch (error: any) {
          console.error(
            "ReviewDetail.tsx(deleteReview): " + JSON.stringify(error)
          );
        }
    } else {
      if (window.confirm("[어드민] 리뷰를 삭제하시겠습니까?"))
        try {
          const response = await axios.delete(
            `${apiAddress}/admin/review/${reviewId}`,
            { withCredentials: true }
          );
          if (response) navigate("/review");
          alert("삭제가 완료되었습니다.");
          console.log(
            "ReviewDetail.tsx(deleteReview): " + JSON.stringify(response)
          );
        } catch (error: any) {
          dispatch(
            setModal({
              title: "에러",
              titleColor: "red",
              text: JSON.stringify(error),
            } as any)
          );
          console.error(
            "ReviewDetail.tsx(deleteReview): " + JSON.stringify(error)
          );
        }
    }
  };

  const setStar = () => {
    let star = "";
    for (let i = 0; i < reviewData.score; i++) {
      star += "★";
    }
    setStars(star);
  };

  const navigate = useNavigate();

  return (
    <>
      {reviewData && (
        <>
          <MapContainer
            reviewData={reviewData}
            nearBuildings={nearBuildings?.documents}
          />
          <CategoryContainer>
            {categoryGroup.list.map((category: any, idx) => (
              <div
                key={idx}
                style={
                  category.code === categoryGroup.now
                    ? { background: "var(--orange)" }
                    : {}
                }
                onClick={() => getNearBuilding(category.code)}
              >
                {category.name}
              </div>
            ))}
          </CategoryContainer>
          <CustomDiv>
            <Building>
              {reviewData.room.building} <Star>{stars}</Star>{" "}
              <span style={{ color: "gray" }}> #{reviewData.id}</span>{" "}
            </Building>
            <Address>{reviewData.room.newAddress}</Address>
            <Address>{reviewData.room.oldAddress}</Address>
            {(reviewData.userId === session.id || session.role === "ADMIN") && (
              <Btn onClick={() => deleteReview()}>삭제</Btn>
            )}
            <Hr></Hr>
            <Pros>장점 : {reviewData.pros}</Pros>
            <Cons>단점 : {reviewData.cons}</Cons>
            {/* {reviewData.url && <Img src={reviewData.url} />} */}
            <UserName>
              작성자 : {reviewData.nickname}#{reviewData.userId}
            </UserName>
          </CustomDiv>
        </>
      )}
    </>
  );
}

const CustomDiv = styled.div`
  margin: 20px 15px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3582);
  padding: 20px;
  border-radius: 20px;
  transition: all 0.7s;

  &:hover {
    transform: scale(1.005);
  }
`;
const Building = styled.div`
  font-size: 1.5rem;
  font-weight: bolder;
`;
const Address = styled.div`
  font-size: 1.1rem;
  color: rgb(134, 134, 134);
`;
const Star = styled.span`
  font-size: 1.3rem;
  vertical-align: 3px;
  color: rgb(255, 202, 44);
`;
const Pros = styled.div`
  font-size: 1.2rem;
  font-weight: bolder;
  color: rgb(107, 107, 240);
`;
const Cons = styled.div`
  font-size: 1.2rem;
  font-weight: bolder;
  color: rgb(240, 107, 107);
`;
const Year = styled.div`
  font-size: 1.1rem;
  color: rgb(46, 50, 53);
  margin: 15px 0;
`;
const Detail = styled.div`
  font-size: 0.9rem;
  color: rgb(70, 142, 190);
  margin-top: 10px;
`;
const Hr = styled.hr`
  width: 100%;
  height: 1px;
  border: 0px;
  background-color: black;
  margin: 10px 0;
`;
const UserName = styled.div`
  font-size: 1rem;
  color: rgb(156, 89, 0);
  text-align: right;
`;

const Btn = styled.div<any>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: ${(props) => props.height || "30px"};
  border-radius: 20px;
  color: white;
  background-color: ${(props) => props.backgroundColor || "rgb(253, 132, 132)"};
  box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.2);
  margin-top: 7px;
  margin-bottom: 3px;
  transition: all 0.7s;
  &:hover {
    filter: contrast(170%);
    cursor: pointer;
  }
  &:active {
    filter: hue-rotate(320deg);
  }
`;

const Img = styled.img`
  width: 100%;
  max-width: 600px;
  margin: 15px auto;
`;

const CategoryContainer = styled.div`
  margin: 20px 15px;
  gap: 20px;
  display: flex;
  flex-wrap: wrap;
  & div {
    min-width: 20%;
    padding: 10px 30px;
    border-radius: 20px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3582);
    transition: all 0.5s;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  & div:hover {
    cursor: pointer;
    background: rgb(250, 241, 203);
  }
`;
export default ReviewDetail;
