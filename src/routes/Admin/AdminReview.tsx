import { useState, useEffect } from "react";
import { apiAddress } from "value";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setModal } from "slice/modalSlice";
import styled from "styled-components";

function AdminReview() {
  const [reviews, setReviews] = useState<any>([]);
  const dispatch = useDispatch();
  const session = useSelector((state: any) => state.userSet.session);

  useEffect(() => {
    getReviews();
  }, []);

  const getReviews = async () => {
    try {
      const response = await axios.get(`${apiAddress}/admin/review/list`, {
        headers: { Authorization: session.token },
      });
      console.log(JSON.stringify(response));
      setReviews(response.data);
    } catch (error: any) {
      dispatch(
        setModal({
          title: "에러",
          titleColor: "red",
          text: JSON.stringify(error),
        } as any)
      );
    }
  };

  const onClickDestroy = async (id: number) => {
    const answer = prompt(
      `해당 리뷰의 아이디("${id}")를 입력하면 삭제처리가 됩니다.`
    );
    if (answer == null) alert("리뷰 삭제를 취소하였습니다.");
    else if (parseInt(answer) === id) {
      try {
        const response = await axios.delete(
          `${apiAddress}/admin/review/delete/${id}`,
          { headers: { Authorization: session.token } }
        );
        getReviews();
        alert("삭제가 완료되었습니다.");
        console.log(
          "AdminReview.tsx(onClickDestroy): " + JSON.stringify(response)
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
          "AdminReview.tsx(onClickDestroy): " + JSON.stringify(error)
        );
      }
    } else if (parseInt(answer) !== id)
      alert("id값을 잘못 입력하여서 리뷰 삭제가 취소 되었습니다.");
  };

  const sortId = (n: number): void => {
    const sortedId = [...reviews].sort((a, b) => {
      if (a.id < b.id) return n;
      if (a.id > b.id) return -n;
      return 0;
    });
    setReviews(sortedId);
  };
  const sortRoomId = (n: number): void => {
    const sortedName = [...reviews].sort((a, b) => {
      if (a.room.id < b.room.id) return n;
      if (a.room.id > b.room.id) return -n;
      return 0;
    });
    setReviews(sortedName);
  };
  const sortUserId = (n: number): void => {
    const sortedScore = [...reviews].sort((a, b) => {
      if (a.userId < b.userId) return n;
      if (a.userId > b.userId) return -n;
      return 0;
    });
    setReviews(sortedScore);
  };
  const sortUserNickname = (n: number): void => {
    const sortedaddress = [...reviews].sort((a, b) => {
      if (a.nickname < b.nickname) return n;
      if (a.nickname > b.nickname) return -n;
      return 0;
    });
    setReviews(sortedaddress);
  };
  const sortScore = (n: number): void => {
    const sortedaddress = [...reviews].sort((a, b) => {
      if (a.score < b.score) return n;
      if (a.score > b.score) return -n;
      return 0;
    });
    setReviews(sortedaddress);
  };

  return (
    <Container>
      <Table>
        <tbody>
          <tr>
            <th>
              리뷰 id
              <br />
              <button onClick={() => sortId(-1)}>▲</button>
              <button onClick={() => sortId(+1)}>▼</button>
            </th>
            <th>
              방 id
              <br />
              <button onClick={() => sortRoomId(-1)}>▲</button>
              <button onClick={() => sortRoomId(1)}>▼</button>
            </th>
            <th>
              유저 id
              <br />
              <button onClick={() => sortUserId(-1)}>▲</button>
              <button onClick={() => sortUserId(1)}>▼</button>
            </th>
            <th>
              유저 닉네임
              <br />
              <button onClick={() => sortUserNickname(-1)}>▲</button>
              <button onClick={() => sortUserNickname(1)}>▼</button>
            </th>
            <th>
              별점
              <br />
              <button onClick={() => sortScore(-1)}>▲</button>
              <button onClick={() => sortScore(1)}>▼</button>
            </th>
            <th>장점</th>
            <th>단점</th>
            <th>삭제</th>
          </tr>
          {reviews.map((review: any) => (
            <tr key={review.id}>
              <td>{review.id}</td>
              <td>{review.room.id}</td>
              <td>{review.userId}</td>
              <td>{review.nickname}</td>
              <td>{review.score}</td>
              <td>{review.pros}</td>
              <td>{review.cons}</td>
              <td>
                <button
                  style={{ background: "rgb(228, 84, 84)" }}
                  onClick={() => onClickDestroy(review.id)}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default AdminReview;

const Container = styled.div`
  width: 100%;
  min-width: 850px;
  display: flex;
  justify-content: center;
`;

const Table = styled.table`
  border: 1px solid black;
  background-color: rgb(254, 255, 220);
  width: calc(100% - 20px);
  margin: 30px 0;
  & * {
    padding: 5px;
    text-align: center;
  }
  & th {
    border: 1px solid black;
  }
  & td {
    border: 1px solid black;
    margin: 1;
  }
  & td {
    border: 1px solid black;
    margin: 1;
  }
  & td:nth-child(1) {
    width: 80px;
  }
  & td:nth-child(2) {
    width: 80px;
  }
  & td:nth-child(3) {
    width: 80px;
  }
  & td:nth-child(4) {
    width: 100px;
  }
  & td:nth-child(5) {
    width: 80px;
  }
  & td:nth-child(8) {
    width: 65px;
  }
  & tr:nth-child(odd) {
    background-color: rgb(248, 250, 195);
  }
  & button {
    border-radius: 5px;
    border: 0px;
    color: white;
    background-color: rgb(88, 107, 219);
    margin: 0 3px;
    transition: all 0.7s;
  }
  & button:hover {
    cursor: pointer;
    background-color: rgb(117, 134, 228);
  }
`;
