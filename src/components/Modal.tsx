import styled from "styled-components";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setModal } from "slice/modalSlice";
import { saveSession } from "slice/userSlice";
function Modal({ ...props }: any) {
  const modal = useSelector((state: any) => state.modalSet.modal);
  const dispatch = useDispatch();
  /* 모달 modal 정리
  modal.isModalOpen<Boolean> : true 일경우 모달 창 표시
  modal.title : 맨위에 나타나는 큰 텍스트
  modal.btn1Text : 왼쪽버튼 텍스트 내용
  modal.btn2Text : 오른쪽버튼 텍스트 내용, 미지정시 버튼 안보임
  modal.btn1Color : 왼쪽버튼 색, 미지정시 skyblue
  modal.btn2Color : 오른쪽버튼 색, 미지정시 tomato
  */
  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  });
  useEffect(() => {
    if (modal.text == "로그인 세션이 유효하지 않습니다. 다시 로그인 해주세요.")
      dispatch(saveSession("" as any));
  }, [modal]);
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter") {
      if (modal.open) {
        modal.btn1Func();
        dispatch(setModal({ open: false } as any));
      }
    }
    if (e.key === "Esc") {
      if (modal.open) {
        modal.btn2Func();
        dispatch(setModal({ open: false } as any));
      }
    }
  };
  return (
    <Container>
      <Form>
        <Title titleColor={modal.titleColor}>{modal.title || "알림"}</Title>
        <Hr />
        {modal.text || "None-Text"}
        <Buttons
          btn1Color={modal.btn1Color || "skyblue"}
          btn2Color={modal.btn2Color || "tomato"}
          btn1Text={modal.btn1Text}
          btn2Text={modal.btn2Text}
        >
          <button
            onClick={() => {
              modal.btn1Func();
              dispatch(setModal({ open: false } as any));
            }}
          >
            {modal.btn1Text || "확인"}
          </button>
          <button
            onClick={() => {
              modal.btn2Func();
              dispatch(setModal({ open: false } as any));
            }}
          >
            {modal.btn2Text || "취소"}
          </button>
        </Buttons>
      </Form>
    </Container>
  );
}
const Container = styled.div<any>`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: transparent;
  -webkit-backdrop-filter: blur(7px);
  backdrop-filter: blur(7px);
  background-color: rgba(0, 0, 0, 0.4);
  position: fixed;
  top: 0px;
  left: 0px;
  z-index: 10000;
`;
const Form = styled.div<any>`
  width: 300px;
  height: auto;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  padding: 15px;
  border-radius: 20px;

  @media screen and (min-width: 500px) {
    //큰 화면에서 모달창 크기 업
    transform: scale(1.2);
  }
  @media screen and (max-width: 320px) {
    //작은 화면에서 넓이를 화면에 맞춤
    width: calc(100% - 20px);
  }
`;
const Title = styled.div<any>`
  color: ${(props) => props.titleColor || "black"};
  font-size: 1.5rem;
`;
const Hr = styled.hr`
  width: 100%;
  height: 1px;
  border: 0px;
  background-color: black;
`;
const Buttons = styled.div<any>`
  width: 100%;
  height: 40px;
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  & button {
    width: 75px;
    height: 100%;
    border: 0px;
    border-radius: 10px;
    transition: 0.5s all;
  }
  & button:nth-child(1) {
    background-color: ${(props) => props.btn1Color};
  }
  & button:nth-child(2) {
    display: ${(props) => props.btn2Text || "none"};
    background-color: ${(props) => props.btn2Color};
  }
  & button:hover {
    filter: contrast(130%);
    cursor: pointer;
  }
  & button:active {
    filter: hue-rotate(340deg);
  }
`;
export default Modal;
