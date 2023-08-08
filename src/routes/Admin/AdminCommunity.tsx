import { useState, useEffect } from "react";
import styles from "./AdminUser.module.css";
import { apiAddress } from "value";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setModal } from "slice/modalSlice";
import styled from "styled-components";

function AdminCommunity() {
  const [posts, setPosts] = useState<any>([]);
  const dispatch = useDispatch();
  const session = useSelector((state: any) => state.userSet.session);
  useEffect(() => {
    getPosts();
  }, []);

  const getPosts = async () => {
    try {
      const response = await axios.get(`${apiAddress}/admin/posting/list`, {
        headers: { Authorization: session.token },
      });
      console.log(JSON.stringify(response));
      setPosts(response.data);
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
      `해당 글 아이디("${id}")를 입력하면 삭제처리가 됩니다.`
    );
    if (answer == null) alert("글 삭제를 취소하였습니다.");
    else if (parseInt(answer) === id) {
      try {
        const response = await axios.delete(
          `${apiAddress}/admin/posting/delete/${id}`,
          {
            headers: { Authorization: session.token },
          }
        );
        getPosts();
        alert("삭제가 완료되었습니다.");
        console.log(
          "AdminCommunity.tsx(onClickDestroy): " + JSON.stringify(response)
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
          "AdminCommunity.tsx(onClickDestroy): " + JSON.stringify(error)
        );
      }
    } else if (parseInt(answer) !== id)
      alert("id값을 잘못 입력하여서 글 삭제가 취소 되었습니다.");
  };

  const sortId = (n: number): void => {
    const sortedName = [...posts].sort((a, b) => {
      if (a.id < b.id) return n;
      if (a.id > b.id) return -n;
      return 0;
    });
    setPosts(sortedName);
  };
  const sortUserId = (n: number): void => {
    const sortedScore = [...posts].sort((a, b) => {
      if (a.userId < b.userId) return n;
      if (a.userId > b.userId) return -n;
      return 0;
    });
    setPosts(sortedScore);
  };
  const sortNickname = (n: number): void => {
    const sortedaddress = [...posts].sort((a, b) => {
      if (a.nickname < b.nickname) return n;
      if (a.nickname > b.nickname) return -n;
      return 0;
    });
    setPosts(sortedaddress);
  };
  const sortTime = (n: number): void => {
    const sortedaddress = [...posts].sort((a, b) => {
      if (changeDate(a.postTime) < changeDate(b.postTime)) return n;
      if (changeDate(a.postTime) > changeDate(b.postTime)) return -n;
      return 0;
    });
    setPosts(sortedaddress);
  };

  const changeDate = (time: any) => {
    const dateObj = new Date(time);
    const changedTime =
      dateObj.toLocaleDateString("ko-KR") +
      " " +
      dateObj.toLocaleTimeString("ko-KR", {
        hour12: true,
        hour: "2-digit",
        minute: "2-digit",
      });
    return changedTime;
  };

  return (
    <Container>
      <Table>
        <tbody>
          <tr>
            <th>
              글 id
              <br />
              <button onClick={() => sortId(-1)}>▲</button>
              <button onClick={() => sortId(1)}>▼</button>
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
              <button onClick={() => sortNickname(-1)}>▲</button>
              <button onClick={() => sortNickname(1)}>▼</button>
            </th>
            <th>글 제목</th>
            <th>글 내용</th>
            <th>
              작성 시간
              <br />
              <button onClick={() => sortTime(-1)}>▲</button>
              <button onClick={() => sortTime(1)}>▼</button>
            </th>
            <th>삭제</th>
          </tr>
          {posts.map((post: any) => (
            <tr key={post.id}>
              <td>{post.id}</td>
              <td>{post.userId}</td>
              <td>{post.nickname}</td>
              <td>{post.title}</td>
              <td>{post.content.split("<br/>").join("\n")}</td>
              <td>{changeDate(post.postTime)}</td>
              <td>
                <button
                  style={{ background: "rgb(228, 84, 84)" }}
                  onClick={() => onClickDestroy(post.id)}
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

export default AdminCommunity;

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
    white-space: pre-wrap;
  }

  & td:nth-child(1) {
    width: 80px;
  }
  & td:nth-child(2) {
    width: 80px;
  }
  & td:nth-child(3) {
    width: 150px;
  }
  & td:nth-child(4) {
    width: 150px;
  }
  & td:nth-child(7) {
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
