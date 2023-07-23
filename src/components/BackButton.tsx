import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setModal } from "slice/modalSlice";
import styled from "styled-components";

function BackButton() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  return (
    <Div onClick={() => navigate(-1)}>
      <img src="https://cdn-icons-png.flaticon.com/512/93/93634.png" alt="<" />
    </Div>
  );
}

const Div = styled.div`
  display: flex;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 29px;
  background-color: orange;
  color: black;
  font-size: 2rem;
  position: fixed;
  left: 20px;
  bottom: 20px;
  transition: all 0.5s;
  line-height: 1.7;
  z-index: 999;
  &:hover {
    cursor: pointer;
    background-color: #fdc55e;
  }
  @media screen and (min-width: 1000px) {
    left: calc((100% - 1000px) / 2 + 20px);
  }
`;

export default BackButton;
