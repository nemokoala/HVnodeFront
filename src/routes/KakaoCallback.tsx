import axios from "axios";
import { useEffect } from "react";

function KakaoCallback() {
  const params = new URL(document.location.toString()).searchParams;
  const code = params.get("code");
  const grantType = "authorization_code";
  const REST_API_KEY = `${process.env.REACT_APP_REST_API_KEY}`;
  const REDIRECT_URI = `${process.env.REACT_APP_REDIRECT_URL}`;
  useEffect(() => {
    getKakao();
  });

  const getKakao = async () => {
    try {
      const response1 = await axios.post(
        `https://kauth.kakao.com/oauth/token?grant_type=${grantType}&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&code=${code}`,
        {},
        {
          headers: {
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        }
      );
      console.log("res1" + JSON.stringify(response1));
      const { access_token } = response1.data;
      const response2 = await axios.post(
        `https://kapi.kakao.com/v2/user/me`,
        {},
        {
          headers: {
            Authorization: `Bearer ${access_token}`,
            "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        }
      );
      console.log("res2" + JSON.stringify(response2));
    } catch (error: any) {
      console.error(error);
    }
  };
  return <>hi</>;
}

export default KakaoCallback;
