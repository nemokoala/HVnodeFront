import { createSlice } from "@reduxjs/toolkit";
export const modalSlice = createSlice({
  name: "modalSet",
  initialState: {
    modal: {
      open: false,
      title: "",
      titleColor: "",
      text: "",
      btn1Text: "",
      btn2Text: "",
      btn1Color: "",
      btn2Color: "",
      btn1Func: "",
      btn2Func: "",
    },
  },
  reducers: {
    setModal: (state: any, action: any): any => {
      console.log(JSON.stringify(action.payload));
      if (
        typeof action.payload.text === "string" &&
        action.payload.text.includes("500") &&
        action.payload.text.includes("failed")
      ) {
        action.payload.text =
          "로그인 세션이 유효하지 않습니다. 다시 로그인 해주세요.";
      }
      state.modal = { ...defaultModal, ...action.payload };
    },
  },
});

export const { setModal } = modalSlice.actions;
export default modalSlice.reducer;

const defaultModal = {
  open: true,
  title: "",
  titleColor: "",
  text: "",
  btn1Text: "",
  btn2Text: "",
  btn1Color: "",
  btn2Color: "",
  btn1Func: function () {},
  btn2Func: function () {},
};
