import { useState, useEffect } from "react";
import styles from "./AdminUser.module.css";
import { apiAddress } from "value";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setModal } from "slice/modalSlice";
import styled from "styled-components";

function AdminRoom() {
  const [rooms, setRooms] = useState<any>([]);
  const dispatch = useDispatch();
  const session = useSelector((state: any) => state.userSet.session);

  useEffect(() => {
    if (session) getRooms();
  }, [session]);

  const getRooms = async () => {
    try {
      const response = await axios.get(`${apiAddress}/admin/room/list`, {
        headers: { Authorization: session.token },
      });
      console.log(JSON.stringify(response));
      setRooms(response.data);
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
      `해당 방의 아이디("${id}")를 입력하면 삭제처리가 됩니다.`
    );
    if (answer == null) alert("방 삭제를 취소하였습니다.");
    else if (parseInt(answer) === id) {
      try {
        const response = await axios.delete(
          `${apiAddress}/admin/room/delete/${id}`,
          {
            headers: { Authorization: session.token },
          }
        );
        getRooms();
        alert("삭제가 완료되었습니다.");
        console.log(
          "AdminRoom.tsx(onClickDestroy): " + JSON.stringify(response)
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
          "AdminRoom.tsx(onClickDestroy): " + JSON.stringify(error)
        );
      }
    } else if (parseInt(answer) !== id)
      alert("id값을 잘못 입력하여서 방 삭제가 취소 되었습니다.");
  };

  const sortId = (n: number): void => {
    const sortedId = [...rooms].sort((a, b) => {
      if (a.id < b.id) return n;
      if (a.id > b.id) return -n;
      return 0;
    });
    setRooms(sortedId);
  };
  const sortName = (n: number): void => {
    const sortedName = [...rooms].sort((a, b) => {
      if (a.building < b.building) return n;
      if (a.building > b.building) return -n;
      return 0;
    });
    setRooms(sortedName);
  };
  const sortSido = (n: number): void => {
    const sortedScore = [...rooms].sort((a, b) => {
      if (a.sido < b.sido) return n;
      if (a.sido > b.sido) return -n;
      return 0;
    });
    setRooms(sortedScore);
  };
  const sortaddress = (n: number): void => {
    const sortedaddress = [...rooms].sort((a, b) => {
      if (a.newAddress < b.newAddress) return n;
      if (a.newAddress > b.newAddress) return -n;
      return 0;
    });
    setRooms(sortedaddress);
  };

  return (
    <Container>
      <Table>
        <tbody>
          <tr>
            <th>
              id
              <br />
              <button onClick={() => sortId(-1)}>▲</button>
              <button onClick={() => sortId(+1)}>▼</button>
            </th>
            <th>
              이름
              <br />
              <button onClick={() => sortName(-1)}>▲</button>
              <button onClick={() => sortName(1)}>▼</button>
            </th>
            <th>
              시도 | 시군구 | 동<br />
              <button onClick={() => sortSido(-1)}>▲</button>
              <button onClick={() => sortSido(1)}>▼</button>
            </th>
            <th>
              방 주소
              <br />
              <button onClick={() => sortaddress(-1)}>▲</button>
              <button onClick={() => sortaddress(1)}>▼</button>
            </th>
            <th>지역 좌표</th>
            <th>삭제</th>
          </tr>
          {rooms.map((room: any) => (
            <tr key={room.id}>
              <td>{room.id}</td>
              <td>{room.building}</td>
              <td>
                {room.sido} | {room.sigungu} | {room.dong}
              </td>
              <td>
                {room.newAddress}
                <br />
                {room.old_address}
              </td>
              <td>
                {room.latitude.toFixed(4)},{room.longitude.toFixed(4)}
              </td>
              <td>
                <button
                  style={{ background: "rgb(228, 84, 84)" }}
                  onClick={() => onClickDestroy(room.id)}
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

export default AdminRoom;

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
    width: 160px;
  }
  & td:nth-child(3) {
    width: 170px;
  }
  & td:nth-child(5) {
    width: 150px;
  }
  & td:nth-child(6) {
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
