import MapCluster from "components/MapCluster";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setModal } from "slice/modalSlice";
import { saveSession } from "slice/userSlice";
import styled from "styled-components";

function Home({ reviewData }: any) {
  return (
    <Container>
      <Block></Block>
    </Container>
  );
}

function Block() {
  const ref = useRef<any>(null);
  const [width, setWidth] = useState("33.333% - 20px");
  const [height, setHeight] = useState<number>(100);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const session = useSelector((state: any) => state.userSet.session);
  const updateHeight = () => {
    if (ref.current) {
      setTimeout(() => {
        setHeight(ref.current.offsetWidth);
      }, 300);
      setHeight(ref.current.offsetWidth);
    }
    if (window.innerWidth < 470) setWidth("100%");
    else if (window.innerWidth < 680) {
      setWidth("50% - 15px");
    } else if (window.innerWidth >= 680) setWidth("33.333% - 20px");
  };

  useEffect(() => {
    updateHeight(); // 초기 로드 시 넓이 설정
    window.addEventListener("resize", updateHeight); // 리사이즈 이벤트 리스너 추가

    return () => {
      window.removeEventListener("resize", updateHeight); // 컴포넌트 언마운트 시 이벤트 리스너 제거
    };
  }, []);

  const logout = async () => {
    dispatch(saveSession("" as any));
    dispatch(
      setModal({
        text: "로그아웃 되었습니다.",
      } as any)
    );
  };

  return (
    <>
      <Div
        ref={ref}
        width={width}
        height={height}
        onClick={() => navigate("/map")}
      >
        리뷰 지도
        <i className="fa-solid fa-map fa-xs"></i>
        <Subtitle>지도를 통해 리뷰를 확인해보세요.</Subtitle>
      </Div>
      <Div
        ref={ref}
        width={width}
        height={height}
        onClick={() => navigate("/review")}
      >
        리뷰 목록
        <i className="fa-solid fa-list fa-xs"></i>
        <Subtitle>모든 리뷰를 리스트로 확인해보세요.</Subtitle>
      </Div>
      <Div
        ref={ref}
        width={width}
        height={height}
        onClick={() => navigate("/community")}
      >
        커뮤니티
        <i className="fa-solid fa-comment fa-xs"></i>
        <Subtitle>일상 얘기부터 자취방 꿀팁을 얻어보세요.</Subtitle>
      </Div>
      <Div
        ref={ref}
        width={width}
        height={height}
        onClick={() => navigate("/reviewfac")}
      >
        리뷰 작성
        <i className="fa-solid fa-plus fa-xs"></i>
        <Subtitle>본인이 살고 있거나 살았던 집의 후기를 남겨주세요.</Subtitle>
      </Div>
      {!session && (
        <>
          <Div
            ref={ref}
            width={width}
            height={height}
            onClick={() => navigate("/login")}
          >
            로그인
            <i className="fa-solid fa-right-to-bracket fa-xs"></i>
            <Subtitle>계정이 이미 있다면 로그인해주세요.</Subtitle>
          </Div>
          <Div
            ref={ref}
            width={width}
            height={height}
            onClick={() => navigate("/join")}
          >
            회원가입
            <i className="fa-solid fa-user-plus fa-xs"></i>
            <Subtitle>계정이 없다면 가입하고 서비스를 이용해보세요.</Subtitle>
          </Div>
        </>
      )}
      {session && (
        <>
          <Div
            ref={ref}
            width={width}
            height={height}
            onClick={() => navigate("/profile")}
          >
            내 프로필
            <i className="fa-solid fa-id-card fa-xs"></i>
            <Subtitle>
              내가 쓴 리뷰를 확인하거나 닉네임을 변경해보세요.
            </Subtitle>
          </Div>
          <Div ref={ref} width={width} height={height} onClick={() => logout()}>
            로그아웃
            <i className="fa-solid fa-arrow-right-from-bracket fa-xs"></i>
            <Subtitle>로그아웃을 하려면 눌러주세요.</Subtitle>
          </Div>
        </>
      )}
    </>
  );
}
const Container = styled.div`
  width: 100%;
  display: flex;
  padding: 30px;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 30px;
`;
const Div = styled.div<any>`
  width: ${(props) => `calc(${props.width})`};
  height: ${(props) => `${props.height}px`};
  padding: 15px;
  border-radius: 15px;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3582);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-size: 2rem;
  text-align: center;
  gap: 16px;
  margin: 0;
  transition: all 0.3s;
  &:hover {
    background-color: rgb(255, 241, 195);
    cursor: pointer;
    transform: scale(1.02);
  }
`;

const Subtitle = styled.div`
  font-size: 1.1rem;
  color: gray;
  margin-top: 5px;
`;
export default Home;
