import axios from "axios";
import Category from "components/Category";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setModal } from "slice/modalSlice";
import styled from "styled-components";
import { apiAddress } from "value";

function CommunityFactory({ postData, setFixToggle }: any) {
  const [title, setTitle] = useState(postData?.title || "");
  const [content, setContent] = useState(postData?.content || "");
  const [category, setCategory] = useState(postData?.categoryId || 0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const session = useSelector((state: any) => state.userSet.session);
  const textareaRef = useRef(null); //textarea 높이 자동조절
  const handleInput = useCallback((event: any) => {
    event.target.style.height = "auto";
    event.target.style.height = `${event.target.scrollHeight}px`;
  }, []);

  useEffect(() => {
    if (!session) {
      dispatch(
        setModal({
          title: "알림",
          text: "글을 작성하려면 로그인이 필요합니다.",
        } as any)
      );
      navigate("/community");
    }
  }, []);

  const onChange = (e: any) => {
    const {
      target: { id, value },
    } = e;
    if (id === "title") setTitle(value);
    if (id === "content") setContent(value);
  };

  const confirm = async () => {
    if (title.length < 2 || title.length > 50) {
      dispatch(
        setModal({
          title: "알림",
          text: "글 제목은 2~50자리 사이로 입력해주세요.",
        } as any)
      );
      return;
    }
    if (content.length < 2 || content.length > 500) {
      dispatch(
        setModal({
          title: "알림",
          text: "글 내용은 2~500자리 사이로 입력해주세요.",
        } as any)
      );
      return;
    }
    if (!category) {
      dispatch(
        setModal({
          title: "알림",
          text: "게시판 종류를 선택해주세요.",
        } as any)
      );
      return;
    }
    if (!postData) {
      //글 작성일 경우
      try {
        const response = await axios.post(
          `${apiAddress}/community/add`,
          {
            title: title,
            content: content.replace(/\n/g, "<br/>"),
            //nickname: session.nickname,
            categoryId: category,
          },
          { headers: { Authorization: session.token } }
        );

        console.log("리스폰즈DATAthen : " + response.data);
        console.log("리스폰즈STATUS : " + response.status);
        console.log(session.id + " // " + session.nickname);
        if (response.status === 201) {
          dispatch(
            setModal({
              title: "알림",
              text: "글 작성을 완료했습니다.",
              btn1Func: function () {
                navigate("/community");
              },
            } as any)
          );
        }
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
    if (postData) {
      //글 수정일경우
      try {
        const response = await axios.post(
          `${apiAddress}/community/edit/${postData.id}`,
          {
            title: title,
            content: content.replace(/\n/g, "<br/>"),
            categoryId: category,
          },
          { headers: { Authorization: session.token } }
        );

        console.log("글수정 response : " + response.data);
        console.log("글수정 STATUS : " + response.status);
        console.log(session.id + " // " + session.nickname);
        if (response.status === 200) {
          dispatch(
            setModal({
              title: "알림",
              text: "글 수정을 완료했습니다.",
            } as any)
          );
        }
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
  };

  return (
    <Container>
      <Category category={category} setCategory={setCategory} />
      <Label>글 제목</Label>
      <Title
        id="title"
        onChange={onChange}
        value={title}
        placeholder="2~50자리 글자 수"
      />
      <Label>글 내용</Label>
      <Content
        id="content"
        ref={textareaRef}
        className="autoresize-textarea"
        onInput={handleInput}
        onChange={onChange}
        value={content}
        rows={1}
        placeholder="2~500자리 글자 수"
      />
      <Button onClick={confirm}>{postData ? "수정 완료" : "작성 완료"}</Button>
      {postData && (
        <Button
          onClick={() => setFixToggle(false)}
          style={{
            background: "rgb(202, 202, 202)",
            margin: "-10px 0px 20px 0px",
          }}
        >
          수정 취소
        </Button>
      )}
    </Container>
  );
}
export default CommunityFactory;

const Container = styled.div`
  width: 100%;
  min-height: calc(100% - var(--navHeight));
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const CategoryBtns = styled.div`
  width: 90%;
  margin: 0px;
  gap: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  & div {
    min-width: 40%;
    padding: 10px 30px;
    border-radius: 20px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3582);
    transition: all 0.3s;
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    &:hover {
      cursor: pointer;
      background: rgb(250, 241, 203);
    }
    @media screen and (min-width: 768px) {
      min-width: 15%;
    }
  }
`;
const Label = styled.div`
  width: 90%;
  color: black;
  font-size: 1.5rem;
  margin-top: 25px;
  margin-bottom: 10px;
`;

const Title = styled.input`
  width: 90%;
  height: 50px;
  padding: 0px 13px;
  margin: 0;
  border-radius: 15px;
  border: 0px;
  backdrop-filter: blur(15px);
  background-color: rgba(255, 255, 255, 0.712);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3582);
  &:focus {
    outline: 1px solid var(--orange) !important;
    border-color: var(--orange) !important;
    box-shadow: 0 0 7px var(--orange);
  }
`;

const Content = styled.textarea`
  width: 90%;
  min-height: 200px;
  border: 1px solid black;
  display: flex;
  align-items: center;
  padding: 10px 14px;
  resize: none;
  overflow-y: auto;
  border-radius: 15px;
  border: 0px;
  backdrop-filter: blur(15px);
  background-color: rgba(255, 255, 255, 0.712);
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3582);
  &:focus {
    outline: 1px solid var(--orange) !important;
    border-color: var(--orange) !important;
    box-shadow: 0 0 7px var(--orange);
  }
`;

const Button = styled.button`
  width: 90%;
  height: 60px;
  margin: 40px 0;
  font-size: 1.5rem;
  background-color: var(--orange);
  border-radius: 15px;
  border: 0px;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 0px 15px 5px,
    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
  &:hover {
    filter: contrast(140%);
    cursor: pointer;
  }
  &:active {
    filter: hue-rotate(330deg);
  }
`;
