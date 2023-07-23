import styled from "styled-components";

function Category({ category, setCategory }: any) {
  return (
    <>
      <Label>게시판 종류 선택</Label>
      <CategoryBtns>
        <div
          style={category === 1 ? { background: "var(--orange)" } : {}}
          onClick={() => {
            setCategory((prev: any) => (prev === 1 ? 0 : 1));
          }}
        >
          자유게시판
        </div>
        <div
          style={category === 2 ? { background: "var(--orange)" } : {}}
          onClick={() => {
            setCategory((prev: any) => (prev === 2 ? 0 : 2));
          }}
        >
          질문게시판
        </div>
        <div
          style={category === 3 ? { background: "var(--orange)" } : {}}
          onClick={() => {
            setCategory((prev: any) => (prev === 3 ? 0 : 3));
          }}
        >
          유머게시판
        </div>
        <div
          style={category === 4 ? { background: "var(--orange)" } : {}}
          onClick={() => {
            setCategory((prev: any) => (prev === 4 ? 0 : 4));
          }}
        >
          정보게시판
        </div>
      </CategoryBtns>
    </>
  );
}
export default Category;

const Label = styled.div`
  width: 90%;
  color: black;
  font-size: 1.5rem;
  margin-top: 25px;
  margin-bottom: 10px;
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
