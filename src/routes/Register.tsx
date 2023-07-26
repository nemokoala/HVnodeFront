import axios from "axios";
import Modal from "components/Modal";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { saveSession } from "slice/userSlice";
import { setModal } from "slice/modalSlice";
import styled, { keyframes } from "styled-components";
import { apiAddress, sessionTime } from "value";
import KakaoLogin from "react-kakao-login";

function Register() {
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isAnimated, setIsAnimated] = useState(false); //로그인 회원가입 전환시 애니메이션
  const [duplication, setDuplication] = useState(0); //이메일 중복체크
  const dispatch = useDispatch<any>();
  const modal = useSelector((state: any) => state.modalSet.modal);
  let enterEnable = true;
  const navigate = useNavigate();
  const login = "/login";
  const register = "/join";
  const { pathname } = useLocation();
  useEffect(() => {
    console.log(pathname);
    setTimeout(() => {
      setIsAnimated(false);
    }, 500); //애니메이션 종료
  }, [pathname]);
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { id, value },
    } = e;
    if (id === "email") setEmail(value);
    if (id === "password") setPassword(value);
    if (id === "passwordConfirm") setPasswordConfirm(value);
    if (id === "nickname") setNickname(value);
    console.log(email, password);
  };
  const enterPress = (e: any) => {
    if (e.key === "Enter") {
      confirm();
    }
  };
  const confirm = async () => {
    if (pathname === register) {
      if (
        nickname &&
        email &&
        password &&
        duplication === 1 &&
        password === passwordConfirm
      ) {
        const userData = {
          nickname: nickname,
          email: email,
          password: password,
        };
        try {
          const response = await axios.post(`${apiAddress}/register`, {
            ...userData,
          });
          if (response.status === 201) {
            dispatch(
              setModal({
                title: "알림",
                text: "회원가입이 완료되었습니다. 로그인 해주세요.",
                btn1Func: function () {
                  navigate("/login");
                },
              } as any)
            );
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
      } else if (password !== passwordConfirm) {
        dispatch(
          setModal({
            text: '"비밀번호"와 "비밀번호 확인"란을 동일하게 입력해주세요.',
          } as any)
        );
      } else {
        dispatch(
          setModal({
            text: "이메일 중복 확인을 하거나 빈칸을 모두 채워주세요.",
          } as any)
        );
      }
    }
    if (pathname === login) {
      const formUserData = {
        email: email,
        password: password,
        sessionTime: sessionTime.toString(),
      };
      try {
        const response = await axios.post(`${apiAddress}/login`, {
          ...formUserData,
        });

        // const jsonData = JSON.stringify(response.data);
        // const userData = JSON.parse(jsonData);
        // console.log("리스폰즈 : " + jsonData);
        // console.log("response.status : " + response.status);
        // console.log("토큰 " + response.data.token);
        // console.log("headers : " + response.headers);

        if (response.status === 201) {
          dispatch(saveSession(response.data as any));
          navigate("/");
        }
      } catch (error: any) {
        console.error("에러 : " + error);
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

  const duplicationCheck = async () => {
    if (modal.open) return; //엔터 중복입력방지
    try {
      const response = await axios.get(`${apiAddress}/register/check/${email}`);
      console.log(response);

      if (response.data === "ok") {
        setDuplication(1);
        dispatch(
          setModal({
            title: "알림",
            text: "사용 가능한 이메일입니다.",
            titleColor: "lightgreen",
          } as any)
        );
      }
    } catch (error: any) {
      setDuplication(-1);
      dispatch(
        setModal({
          title: "알림",
          text: error.response.data,
          titleColor: "red",
        } as any)
      );

      console.log(JSON.stringify(error));
    }
  };
  useEffect(() => {
    //모달창 enter로 종료후 바로 onclick되는 현상 수정
    if (!modal.open) {
      enterEnable = false;
      setTimeout(() => {
        enterEnable = true;
      }, 300);
    }
  }, [modal]);

  const kakaoOnSuccess = async (data: any) => {
    const access_token = data.response.access_token;
    try {
      const kakaoResponse = await axios.post(
        "https://kapi.kakao.com/v2/user/me",
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      const password = kakaoResponse.data.kakao_account.email;
      const nickname = kakaoResponse.data.kakao_account.profile.nickname;
      const email = kakaoResponse.data.kakao_account.email;
      console.log(JSON.stringify(kakaoResponse));
      try {
        const formUserData = {
          email: email,
          password: password.toString(),
          nickname: nickname,
          sessionTime: sessionTime.toString(),
        };
        const response = await axios.post(
          `${apiAddress}/kakao/auth`,
          formUserData
        );
        if (response.status === 201) {
          dispatch(saveSession(response.data as any));
          navigate("/");
        }
        if (response.status === 202) {
          kakaoOnSuccess(data);
          return;
        }
      } catch (error: any) {
        console.error(error);
      }
    } catch (error: any) {
      console.error(error);
    }
  };

  const kakaoOnFailure = (error: any) => {
    console.log(error);
  };
  return (
    <Container>
      <Form
        isAnimated={isAnimated}
        onSubmit={(e: any) => {
          e.preventDefault();
        }}
      >
        {pathname === register ? (
          <>
            <Title>회원가입</Title>
            <Label>닉네임 (2~8자 특수문자X)</Label>
            <Input
              type="text"
              id="nickname"
              onChange={onChange}
              value={nickname}
              placeholder="특수 문자 제외"
              maxLength={10}
            ></Input>
          </>
        ) : (
          <Title>로그인</Title>
        )}

        <Label>이메일</Label>
        <Input
          type="email"
          id="email"
          onChange={onChange}
          value={email}
          placeholder="example@ooo.com"
          autoComplete="on"
          onKeyUp={enterPress}
        ></Input>
        {pathname === register && (
          <DpButton
            onClick={() => {
              if (enterEnable) duplicationCheck();
            }}
            bgColor={
              (duplication === 1 && "lightgreen") ||
              (duplication === -1 && "tomato")
            }
          >
            중복 확인
          </DpButton>
        )}
        <Label>비밀번호</Label>
        <Input
          type="password"
          id="password"
          onChange={onChange}
          value={password}
          placeholder={
            pathname === register ? "8자리 이상 영어, 숫자 포함" : "Password"
          }
          autoComplete="on"
          onKeyUp={enterPress}
        ></Input>
        {pathname === register && (
          <>
            <Label>비밀번호 확인</Label>
            <Input
              type="password"
              id="passwordConfirm"
              onChange={onChange}
              value={passwordConfirm}
              placeholder="입력한 비밀번호와 똑같이 입력해주세요."
              autoComplete="off"
              onKeyUp={enterPress}
            ></Input>
          </>
        )}

        <Buttons>
          <div
            onClick={confirm}
            style={
              pathname === register
                ? { backgroundColor: "lightgreen" }
                : { backgroundColor: "skyblue" }
            }
          >
            {pathname === register ? "회원가입" : "로그인"}
          </div>
          <div>취소</div>
        </Buttons>
        <KakaoBtn
          token={process.env.REACT_APP_JS_API_KEY as any}
          onSuccess={kakaoOnSuccess}
          onFail={kakaoOnFailure}
        />
        {pathname === register ? (
          <LoginLink
            onClick={() => {
              setTimeout(() => {
                navigate(login);
              }, 250);

              setIsAnimated(true);
            }}
          >
            계정이 있으면 로그인하기
          </LoginLink>
        ) : (
          <LoginLink
            onClick={() => {
              setTimeout(() => {
                navigate(register);
              }, 250);
              setIsAnimated(true);
            }}
          >
            계정이 없으면 회원가입하기
          </LoginLink>
        )}
      </Form>
    </Container>
  );
}

const fadein = keyframes`
  0% {
    transform: scale(1);
  }
  50%{
    transform: scale(0);
  }
  100% {
    transform: scale(1);
  }
`;
const Container = styled.div`
  width: 100%;
  min-height: calc(100vh - var(--navHeight));
  height: auto;
  background: linear-gradient(to bottom, white, #d9f4ff);
  margin: 0;
  display: inline-block;
`;
const Form = styled.form<any>`
  transition: all 1s ease-in;
  overflow: hidden;
  animation: ${(props) => props.isAnimated === true && fadein} 0.5s ease-in;
  margin: 50px auto;
  /* opacity: ${(props) => (props.isAnimated ? 0 : 1)}; */
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
  margin: 15px auto;
  color: black;
  font-size: 1.8rem;
`;
const Label = styled.span`
  color: black;
  font-size: 1.2rem;
  margin-top: 20px;
`;

const Input = styled.input`
  width: 100%;
  height: 50px;
  padding: 10px;
  margin: 5px auto;
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
`;
const DpButton = styled.button<any>`
  width: 100px;
  height: 30px;
  border: 2px solid black;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 5px;
  background-color: ${(props) => props.bgColor || "white"};
  &:hover {
    filter: contrast(200%);
    cursor: pointer;
  }
  &:active {
    filter: hue-rotate(90deg);
  }
  &:focus {
    color: orange;
    border: 2px solid orange !important;
  }
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
    filter: contrast(200%);
    cursor: pointer;
  }
  & div:active {
    filter: hue-rotate(90deg);
  }
`;
const LoginLink = styled.div`
  color: purple;
  width: 100%;
  text-align: center;
  text-decoration: underline;
  &:hover {
    cursor: pointer;
  }
`;
const KakaoBtn = styled(KakaoLogin)`
  width: 100%;
  height: 100%;
  margin: -10px auto 20px auto;
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
  &:hover {
    filter: contrast(200%);
    cursor: pointer;
  }
  &:active {
    filter: hue-rotate(340deg);
  }
`;
export default Register;
