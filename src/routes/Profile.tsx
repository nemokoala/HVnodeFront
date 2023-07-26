import axios from "axios";
import Modal from "components/Modal";
import ReviewBlock from "components/ReviewBlock";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setModal } from "slice/modalSlice";
import { saveSession } from "slice/userSlice";
import styled, { css } from "styled-components";
import { apiAddress } from "value";

function Profile() {
  const session = useSelector((state: any) => state.userSet.session);
  const [password, setPassword] = useState("");
  const [newNickname, setNewNickname] = useState(session.nickname);
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [checked, setChecked] = useState(false);
  const [myReviews, setMyreviews] = useState([]);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    getMyReviews();
  }, []);

  const getMyReviews = async () => {
    try {
      const response = await axios.get(`${apiAddress}/review/mypage/all`, {
        headers: { Authorization: session.token },
      });
      setMyreviews(response.data);
      console.log(JSON.stringify(response));
    } catch (error: any) {
      const errorText = JSON.stringify(error);
      dispatch(
        setModal({
          title: "에러!",
          titleColor: "red",
          text: errorText,
        } as any)
      );
    }
  };
  const onChange = (e: any) => {
    const {
      target: { id, value },
    } = e;
    if (id === "password") setPassword(value);
    console.log(password);
    if (id === "newNickname") setNewNickname(value);
    if (id === "newPassword") setNewPassword(value);
    if (id === "newPasswordConfirm") setNewPasswordConfirm(value);
  };
  const enterPress = (e: any) => {
    if (e.key === "Enter") {
      confirm();
    }
  };

  const confirm = async () => {
    if (!checked) {
      //현재 비밀번호 맞나 확인
      try {
        const response = await axios.post(
          `${apiAddress}/user/checkpw`,
          { password: password },
          { headers: { Authorization: session.token } }
        );

        if (response.data === "ok") {
          setChecked(true);
          dispatch(
            setModal({
              title: "알림",
              text: !session.kakao
                ? "비밀번호 확인이 완료되었습니다. 수정하실 정보를 수정해 주세요."
                : "이메일 확인이 완료되었습니다. 수정하실 정보를 수정해 주세요.",
            } as any)
          );
        } else if (response.data === "failed") {
          dispatch(
            setModal({
              title: "확인 실패!",
              titleColor: "red",
              text: !session.kakao
                ? "비밀번호가 일치하지 않습니다."
                : "로그인할 때 사용한 카카오 계정 이메일을 입력해 주세요.",
            } as any)
          );
        }
        console.log(JSON.stringify(response as any));
      } catch (error: any) {
        const errorText = JSON.stringify(error);
        dispatch(
          setModal({
            title: "에러!",
            titleColor: "red",
            text: errorText,
          } as any)
        );
      }
    }
    if (checked) {
      //인증 후 바뀐 정보 보낼 때 함수
      if (newPassword !== newPasswordConfirm) {
        dispatch(
          setModal({
            title: "알림",
            text: '"새로운 비밀번호"와 "비밀번호 확인"란을 동일하게 입력해주세요.',
          } as any)
        );
        return;
      }

      const newData = {
        nickname: newNickname,
        password: newPassword === "" ? password : newPassword,
      };
      try {
        const response = await axios.post(
          `${apiAddress}/user/update`,
          { ...newData },
          { headers: { Authorization: session.token } }
        );

        if (response.status === 200) {
          dispatch(
            setModal({
              title: "알림",
              text: "정보가 업데이트 되었습니다.",
            } as any)
          );

          console.log(response.data);
          dispatch(saveSession({ ...response.data, token: session.token }));
          navigate("/");
        }
      } catch (error: any) {
        dispatch(
          setModal({
            title: "에러!",
            titleColor: "red",
            text: error.response.data,
          } as any)
        );
      }
    }
  };

  return (
    <Container>
      {checked ? (
        <Form autoComplete="new-password">
          <Title>내 프로필 수정</Title>
          <Label>닉네임</Label>
          <Input
            type="text"
            id="newNickname"
            onChange={onChange}
            value={newNickname}
            placeholder={newNickname}
            autoComplete="off"
            autoCapitalize="off"
            onKeyPress={enterPress}
          ></Input>

          {!session.kakao && (
            <>
              <Label>새로운 비밀번호 (빈 칸일 경우 기존 비밀번호 유지)</Label>
              <input
                type="text"
                name="fakeemail"
                placeholder="fake"
                value={session.email}
                tabIndex={-1}
                style={{ opacity: "0", pointerEvents: "none", height: "0px" }}
              />
              <Input
                type="password"
                id="newPassword"
                onChange={onChange}
                value={newPassword}
                placeholder="8자리 이상 영어, 숫자 포함"
                autoComplete="new-password"
                onKeyPress={enterPress}
              ></Input>
              {newPassword.length > 0 && (
                <>
                  <Label>새로운 비밀번호 확인</Label>
                  <Input
                    type="password"
                    id="newPasswordConfirm"
                    onChange={onChange}
                    value={newPasswordConfirm}
                    placeholder="비밀번호 확인"
                    autoComplete="new-password"
                    onKeyPress={enterPress}
                  ></Input>
                </>
              )}
            </>
          )}

          <Buttons>
            <div style={{ background: "var(--orange)" }} onClick={confirm}>
              수정 확인
            </div>
            <div onClick={() => navigate("/")}>취소</div>
          </Buttons>
        </Form>
      ) : (
        <Form autoComplete="new-password">
          <Title>내 프로필 수정</Title>
          <Label>
            {!session.kakao ? "현재 비밀번호" : "카카오 계정 이메일 확인"}
          </Label>
          <input
            type="text"
            name="fakeusernameremembered"
            placeholder="fake"
            defaultValue={session.email}
            tabIndex={-1}
            style={{ opacity: "0", pointerEvents: "none", height: "0px" }}
          />
          <Input
            type="password"
            id="password"
            onChange={onChange}
            value={password}
            placeholder={
              !session.kakao
                ? "현재 비밀번호를 입력해주세요."
                : "example@xxx.com"
            }
            autoComplete="new-password"
            onKeyUp={enterPress}
          ></Input>
          <Buttons>
            <div style={{ background: "var(--orange)" }} onClick={confirm}>
              확인
            </div>
            <div onClick={() => navigate("/")}>취소</div>
          </Buttons>
        </Form>
      )}

      {myReviews.length > 0 && (
        <>
          <Label
            style={{
              marginLeft: "30px",
              fontSize: "1.3rem",
              marginBottom: "-10px",
            }}
          >
            내가 작성한 리뷰
          </Label>
          {myReviews.map((review: any) => (
            <ReviewBlock review={review} key={review.id} />
          ))}
        </>
      )}
    </Container>
  );
}
const Container = styled.div`
  width: 100%;
  min-height: calc(100vh - var(--navHeight));
  height: auto;
  background: linear-gradient(to bottom, white, #d9f4ff);
  margin: 0;
  display: inline-block;
`;

const Form = styled.div<any>`
  transition: all 1s ease-in;

  margin: 50px auto;
  width: 500px;
  height: auto;
  display: flex;
  flex-flow: column wrap;
  -webkit-backdrop-filter: blur(15px);
  backdrop-filter: blur(15px);
  background-color: rgba(255, 253, 247, 0.438);
  box-shadow: rgba(50, 50, 93, 0.25) 0px 0px 20px 10px,
    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
  border-radius: 15px;
  padding: 20px 50px;
  @media screen and (max-width: 540px) {
    width: calc(100% - 40px);
    padding: 20px 10%;
  }
`;

const Title = styled.div`
  width: 100%;
  margin: 15px 0;
  color: black;
  font-size: 1.8rem;
  white-space: wrap;
  text-align: center;
`;
const Label = styled.span`
  color: black;
  font-size: 1.2rem;
  margin-top: 23px;
  margin-bottom: 3px;
`;

const Input = styled.input`
  width: 100%;
  height: 50px;
  padding: 10px;
  margin: 5px 0;
  border-radius: 15px;
  border: 0px;
  backdrop-filter: blur(15px);
  background-color: rgba(255, 255, 255, 0.712);
  filter: drop-shadow(0px 0px 20px 5px rgba(50, 50, 93, 0.25));
  box-shadow: rgba(50, 50, 93, 0.25) 0px 0px 20px 5px,
    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
  &:focus {
    outline: 1px solid var(--orange) !important;
    border-color: var(--orange) !important;
    box-shadow: 0 0 7px var(--orange);
  }
  ${({ id }) =>
    (id === "newPasswordnono" || id === "passwordnono") &&
    css`
      -webkit-text-security: disc;
      ime-mode: disabled; //영어만 입력
    `};
`;

const Buttons = styled.div`
  display: flex;
  width: 100%;
  height: 60px;
  gap: 25px;
  padding: 0;
  margin: 50px 0;
  justify-content: center;
  & div {
    flex-grow: 1;
    width: 50%;
    height: 100%;
    padding: 0 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 15px;
    -webkit-backdrop-filter: blur(15px);
    backdrop-filter: blur(15px);
    background-color: rgba(251, 252, 255, 0.226);
    box-shadow: rgba(50, 50, 93, 0.25) 0px 0px 20px 5px,
      rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
    font-size: 1.3rem;
  }
  & div:hover {
    filter: contrast(150%);
    cursor: pointer;
  }
  & div:active {
    filter: hue-rotate(330deg);
  }
`;
export default Profile;
