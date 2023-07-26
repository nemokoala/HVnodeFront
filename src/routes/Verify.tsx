import axios from "axios";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setModal } from "slice/modalSlice";
import { saveSession } from "slice/userSlice";
import styled from "styled-components";
import { apiAddress } from "value";

function Verify() {
  const [verifyCode, setVerifyCode] = useState("");
  const session = useSelector((state: any) => state.userSet.session);
  const modal = useSelector((state: any) => state.modalSet.modal);
  const dispatch = useDispatch();
  const onChange = (e: any) => {
    setVerifyCode(e.target.value);
  };
  const confirm = async () => {
    try {
      const response = await axios.post(
        `${apiAddress}/verify`,
        { verifyCode },
        {
          headers: {
            Authorization: session.token,
          },
        }
      );
      if (response.data === "ok") {
        try {
          const response = await axios.get(`${apiAddress}/user/info`, {
            headers: {
              Authorization: session.token,
            },
          });
          const userData = { ...response.data, token: session.token };
          dispatch(saveSession(userData as any));
        } catch (error: any) {
          dispatch(
            setModal({
              title: "에러!",
              titleColor: "red",
              text: error.response.data,
            } as any)
          );
          return "";
        }
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
  };

  const resend = async () => {
    try {
      const response = await axios.get(`${apiAddress}/verify/resend`, {
        headers: {
          Authorization: session.token,
        },
      });
      if (response.data === "재전송 완료") {
        dispatch(
          setModal({
            title: "알림",
            titleColor: "black",
            text: "이메일을 재발송 했습니다.",
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
  };
  return (
    <Container>
      <Form
        onSubmit={(e: any) => {
          e.preventDefault();
        }}
      >
        <Label>
          메일 {`"${session.email}"`} 을
          <br /> 확인하여 인증번호 입력 후 가입을 완료해주세요.
        </Label>
        <Input value={verifyCode} onChange={onChange} maxLength={5} />
        <Buttons>
          <div
            style={{ background: "var(--orange)" }}
            onClick={() => confirm()}
          >
            가입 완료
          </div>
          <div onClick={() => resend()}>다시 보내기</div>
        </Buttons>
      </Form>
    </Container>
  );
}
const Container = styled.div`
  width: 100%;
  min-height: calc(100vh - var(--navHeight));
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background: linear-gradient(to bottom, white, #d9f4ff);
`;
const Label = styled.p`
  color: black;
  font-size: 1.2rem;
  margin: 20px 0;
`;

const Form = styled.form<any>`
  transition: all 1s ease-in;
  overflow: hidden;
  margin-top: 50px;
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
export default Verify;
