import { createSlice } from "@reduxjs/toolkit";
let now = new Date();
export const userSlice = createSlice({
  name: "userSet",
  initialState: {
    session: "",
  },
  reducers: {
    saveSession: (state, action: any): any => {
      alert("reducer : " + JSON.stringify(action.payload));
      const data = { ...action.payload, date: now };
      if (!action.payload.app)
        localStorage.setItem("session", JSON.stringify(data)); //sessionstoarge에 저장
      if (action.payload === "") localStorage.removeItem("session"); // 값이 비면 세선 삭제
      state.session = action.payload;
    },
  },
});

export const { saveSession } = userSlice.actions;
export default userSlice.reducer;

// const example = {
//   id: 2,
//   name: "mmm",
//   nickname: "mmm",
//   email: "mmm@naver.com",
//   password: "mmmm",
//   role: "mmm",
// };
