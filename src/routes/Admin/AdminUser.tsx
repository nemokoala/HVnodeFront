import { useState, useEffect } from "react";
import styles from "./AdminUser.module.css";
import { apiAddress } from "value";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setModal } from "slice/modalSlice";

function AdminUser() {
  const [users, setUsers] = useState<any>([]);
  const dispatch = useDispatch();
  const session = useSelector((state: any) => state.userSet.session);

  useEffect(() => {
    if (session) getUserData();
  }, [session]);
  const getUserData = async () => {
    try {
      const response = await axios.get(`${apiAddress}/admin/user/list`, {
        headers: { Authorization: session.token },
      });
      console.log(JSON.stringify(response));
      setUsers(response.data);
      // dispatch(setModal({ text: JSON.stringify(response) } as any));
    } catch (error: any) {
      // dispatch(setModal({ text: JSON.stringify(error) } as any));
      console.error(JSON.stringify(error));
    }
  };
  const deleteUserData = async (id: any) => {
    try {
      const response = await axios.delete(
        `${apiAddress}/admin/user/delete/${id}`,
        { headers: { Authorization: session.token } }
      );
      console.log(JSON.stringify(response));
      // dispatch(setModal({ text: JSON.stringify(response) } as any));
      getUserData();
    } catch (error: any) {
      // dispatch(setModal({ text: JSON.stringify(error) } as any));
      console.error(JSON.stringify(error));
    }
  };
  const onClickDestroy = (id: any) => {
    const answer = prompt(
      `해당 유저의 아이디("${id}")를 입력하면 삭제처리가 됩니다.`
    );
    if (answer === null) alert("유저 삭제를 취소하였습니다.");
    else if (answer == id) {
      alert("유저를 삭제합니다.");
      deleteUserData(id);
    } else if (answer != id)
      alert("id값을 잘못 입력하여서 유저저 삭제가 취소 되었습니다.");
  };
  const sortId = (n: any) => {
    const sortedId = [...users].sort((a, b) => {
      if (a.id < b.id) return n;
      if (a.id > b.id) return -n;
      return 0;
    });
    setUsers(sortedId);
  };
  const sortName = (n: any) => {
    const sortedName = [...users].sort((a, b) => {
      if (a.nickname < b.nickname) return n;
      if (a.nickname > b.nickname) return -n;
      return 0;
    });
    setUsers(sortedName);
  };
  const sortEmail = (n: number) => {
    const sortedEmail = [...users].sort((a, b) => {
      if (a.email < b.email) return n;
      if (a.email > b.email) return -n;
      return 0;
    });
    setUsers(sortedEmail);
  };
  const sortTime = (n: number) => {
    const sortedTime = [...users].sort((a, b) => {
      if (a.registerTime < b.registerTime) return n;
      if (a.registerTime > b.registerTime) return -n;
      return 0;
    });
    setUsers(sortedTime);
  };

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <tbody>
          <tr>
            <th>
              id
              <button onClick={() => sortId(-1)}>▲</button>
              <button onClick={() => sortId(+1)}>▼</button>
            </th>
            <th>
              이메일
              <button onClick={() => sortEmail(-1)}>▲</button>
              <button onClick={() => sortEmail(1)}>▼</button>
            </th>
            <th>
              닉네임<button onClick={() => sortName(-1)}>▲</button>
              <button onClick={() => sortName(1)}>▼</button>
            </th>
            <th>권한</th>
            <th>카카오</th>
            <th>
              가입일<button onClick={() => sortTime(-1)}>▲</button>
              <button onClick={() => sortTime(1)}>▼</button>
            </th>
            <th>삭제</th>
          </tr>
          {users.map((user: any) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.email}</td>
              <td>{user.nickname}</td>
              <td>{user.role}</td>
              <td>{user.kakao}</td>
              <td>{user.registerTime}</td>
              {/*<td>
                {user.interestArea.map((area: any, index: any) => (
                  <span key={`${user.id}${index}_inter`}>
                    {area}
                    {user.interestArea.length - 1 != index ? "," : null}
                  </span>
                ))}
                </td>*/}
              <td>
                <button
                  style={{ background: "rgb(228, 84, 84)" }}
                  onClick={() => onClickDestroy(user.id)}
                >
                  삭제
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUser;
