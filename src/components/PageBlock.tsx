import styled, { keyframes } from "styled-components";

function PageBlock({ posts, pageSet, page, setPage, setPageSet }: any) {
  return (
    <PageContentBlock>
      <div
        onClick={() => {
          if (pageSet.now > 1)
            setPageSet((prev: any) => ({ ...prev, now: prev.now - 1 }));
        }}
      >
        ◀
      </div>
      {[...Array(posts.totalPages > 5 ? 5 : posts.totalPages)].map(
        (p: any, index) => (
          <div
            key={index}
            style={{
              color:
                page === index + (pageSet.now - 1) * 5 ? "purple" : "black",
            }}
            onClick={() => {
              setPage(index + (pageSet.now - 1) * 5);
            }}
          >
            {index + (pageSet.now - 1) * 5 + 1}
          </div>
        )
      )}
      <div
        onClick={() => {
          if (pageSet.now < pageSet.max)
            setPageSet((prev: any) => ({ ...prev, now: prev.now + 1 }));
        }}
      >
        ▶
      </div>
    </PageContentBlock>
  );
}

export default PageBlock;

const fadein = keyframes`
  from {
    opacity: 0;
    transform:translateY(-25px);
  }
  to {
    opacity: 1;
    transform:translateY(0);
  }
`;
const PageContentBlock = styled.div`
  width: 90%;
  margin: 15px 0;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3582);
  padding: 5px 10px;
  border-radius: 20px;
  transition: all 0.7s;
  animation: ${fadein} 0.5s ease-out;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  & div {
    width: 50px;
    max-width: 100px;
    flex-grow: 1;
    font-size: 1.3rem;
    padding: 10px 0;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  & div:hover {
    background-color: rgb(255, 241, 195);
    cursor: pointer;
  }
`;
