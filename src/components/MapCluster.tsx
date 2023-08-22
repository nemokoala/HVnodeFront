import {
  CustomOverlayMap,
  Map,
  MapInfoWindow,
  MapMarker,
  MapTypeControl,
  MarkerClusterer,
  ZoomControl,
} from "react-kakao-maps-sdk";
import { useEffect, useState } from "react";
import styled from "styled-components";
import React from "react";
import { useNavigate } from "react-router-dom";
import ReviewBlock from "./ReviewBlock";
import { saveZoom, saveCenter, saveShowReview } from "slice/mapSlice";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { apiAddress } from "value";
import { setModal } from "slice/modalSlice";
import { sigungu as defaultSigungu } from "value";
function MapCluster() {
  const loadZoomLevel = useSelector((state: any) => state.mapSet.zoomLevel);
  const loadCenter = useSelector((state: any) => state.mapSet.center);
  const loadShowReview = useSelector((state: any) => state.mapSet.showReview);
  const [reviewDatas, setReviewDatas] = useState<any>([]);
  const [roomDatas, setRoomDatas] = useState<any>([]);
  const [zoomLevel, setZoomLevel] = useState(loadZoomLevel);
  const [center, setCenter] = useState(loadCenter);
  const [showReview, setShowReview] = useState(loadShowReview);
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const [dongs, setDongs] = useState<any>([]);
  const [sidoTarget, setSidoTarget] = useState("");
  const [sido, setSido] = useState([
    { name: "서울", location: [37.5635694, 126.9800083] },
    { name: "제주", location: [33.485694444, 126.500333333] },
    { name: "전남", location: [34.8130444, 126.465] },
    { name: "전북", location: [35.81727, 127.11105277777777] },
    { name: "광주", location: [35.1569749999, 126.853363888] },
    { name: "경남", location: [35.234736111, 128.69416666666666] },
    { name: "경북", location: [36.399605555, 128.6027666] },
    { name: "울산", location: [35.5354083333, 129.313688] },
    { name: "대구", location: [35.86854166666, 128.60355277] },
    { name: "부산", location: [35.1770194444, 129.07695277] },
    { name: "충남", location: [36.3238722222, 126.922955555] },
    { name: "충북", location: [36.7325, 127.49358611111111] },
    { name: "세종", location: [36.4800121, 127.2890691] },
    { name: "대전", location: [36.347119444, 127.38656666] },
    { name: "인천", location: [37.4532333, 126.70735277] },
    { name: "강원", location: [37.742618, 128.270231] },
    { name: "경기", location: [37.2635694, 127.0800083] },
  ]);

  const [sigungu, setSigungu] = useState([...defaultSigungu]);
  const [windowHeight, setWindowHeight] = useState<any>(window.innerHeight);
  let timerEnable = true;
  useEffect(() => {
    if (zoomLevel <= 5) {
      setZoomLevel(10);
      setTimeout(() => {
        setZoomLevel(loadZoomLevel);
      }, 15);
    }
    document.documentElement.style.setProperty("--minHeight", `auto`);
    function handleResize() {
      //ios safari 하단바 문제 해결
      setWindowHeight(window.innerHeight);
    }
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.documentElement.style.setProperty("--minHeight", `100vh`);
    };
  }, []); //오버레이 버그 수정을 위한 지도 줌 새로고침

  useEffect(() => {
    if (sidoTarget) getRoomDatas();
  }, [sidoTarget]);

  useEffect(() => {
    setDongPosition();
    sigunguCountSet();
  }, [roomDatas]);

  const getRoomDatas = async () => {
    try {
      const response = await axios.get(
        `${apiAddress}/review/room/sido/${sidoTarget}`
      );
      setRoomDatas(response.data);
      console.log(JSON.stringify(response));
    } catch (error: any) {
      const errorText = JSON.stringify(error);
      dispatch(
        setModal({
          title: "에러!",
          titleColor: "red",
          text: errorText,
        } as any)
      );
    }
  };

  const getReviewDatas = async (id: any) => {
    try {
      const response = await axios.get(`${apiAddress}/review/search/${id}`);
      setReviewDatas(response.data);
      console.log(JSON.stringify(response));
    } catch (error: any) {
      const errorText = JSON.stringify(error);
      dispatch(
        setModal({
          title: "에러!",
          titleColor: "red",
          text: errorText,
        } as any)
      );
    }
  };
  const sigunguCountSet = () => {
    setSigungu([...defaultSigungu]); //카운트 초기화
    //시군구 counting
    roomDatas.forEach((room: any) => {
      let roomSigungu = room.sigungu;
      setSigungu((prev) =>
        prev.map((si: any): any => {
          let [sido, sigungu] = si.name.split("/");
          let space = /[\s]/g;
          if (space.test(roomSigungu)) {
            const splitted = roomSigungu.split(" ");
            roomSigungu = splitted[0];
          }
          if (sido === room.sido && sigungu === roomSigungu)
            return { ...si, count: si.count + 1 };
          else return si;
        })
      );
    });
  };
  const returnSigungu = (name: string): string => {
    const [sido, sigungu] = name.split("/");
    return sigungu;
  };

  const setDongPosition = () => {
    const room = roomDatas;
    const groupByDong = room.reduce((result: any, item: any) => {
      const { dong, latitude, longitude } = item;
      if (!result[dong]) {
        result[dong] = { latitude: latitude, longitude: longitude, count: 1 };
      } else {
        result[dong].latitude += latitude;
        result[dong].longitude += longitude;
        result[dong].count += 1;
      }
      return result;
    }, {});

    const avgLatLongByDong = Object.entries(groupByDong).map(
      ([dong, value]: any) => {
        const avgLat = value.latitude / value.count;
        const avgLng = value.longitude / value.count;
        return {
          dong,
          latitude: avgLat,
          longitude: avgLng,
          count: value.count,
        };
      }
    );

    //console.log(avgLatLongByDong);
    setDongs(avgLatLongByDong);
  };

  const setShow = (reviews: any) => {
    //오버레이 클릭 시 지도 밑에 건물 목록 표시
    // const showReview = reviewData.filter(
    //   (review: any) => review.building === reviews.building
    // );
    // dispatch(saveShowReview(showReview as any));
    // setShowReview(showReview);
  };

  async function getAddressInfo(latitude: any, longitude: any) {
    const appKey = process.env.REACT_APP_REST;
    const apiUrl = `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}`;

    try {
      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `KakaoAK ${appKey}`,
        },
      });

      if (
        response.data &&
        response.data.documents &&
        response.data.documents.length > 0
      ) {
        const addressInfo = response.data.documents[0];
        let region_1depth_name = addressInfo.address.region_1depth_name;
        if (region_1depth_name === "세종특별자치시")
          region_1depth_name = "세종";
        if (region_1depth_name === "제주특별자치도")
          region_1depth_name = "제주";
        if (region_1depth_name === "강원특별자치도")
          region_1depth_name = "강원";
        setSidoTarget(region_1depth_name);
        console.log("시도 정보:", region_1depth_name);
      } else {
        console.log("주소 정보를 찾을 수 없습니다");
      }
    } catch (error) {
      console.error("API 요청 오류:", error);
    }
  }

  return (
    <Container wHeight={windowHeight}>
      <Map // 지도를 표시할 Container
        center={center}
        isPanto={false}
        style={{
          // 지도의 크기
          width: "100%",
          height: "50%",
          boxShadow: "0px 10px 15px 0px rgba(0, 0, 0, 0.3582)",
        }}
        level={zoomLevel} // 지도의 확대 레벨
        onZoomChanged={(map) => {
          setZoomLevel(map.getLevel());
        }}
        onTileLoaded={(map) => {
          console.log("ontileloaded");
          getAddressInfo(map.getCenter().getLat(), map.getCenter().getLng());
          dispatch(saveZoom(map.getLevel() as any));
          dispatch(
            saveCenter({
              lat: map.getCenter().getLat(),
              lng: map.getCenter().getLng(),
            } as any)
          );
        }}
        onCenterChanged={(map) => {
          if (timerEnable) {
            getAddressInfo(map.getCenter().getLat(), map.getCenter().getLng());
            timerEnable = false;
            setTimeout(() => {
              timerEnable = true;
            }, 500);
          }
        }}
        // onDragEnd={(map) => {
        //   console.log("ondragEnd");
        //   setTimeout(() => {
        //     dispatch(saveZoom(map.getLevel() as any));
        //     dispatch(
        //       saveCenter({
        //         lat: map.getCenter().getLat(),
        //         lng: map.getCenter().getLng(),
        //       } as any)
        //     );
        //   }, 100);
        // }}
      >
        <MarkerClusterer
          averageCenter={true} // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
          minLevel={6} // 클러스터 할 최소 지도 레벨
        >
          {zoomLevel < 7 &&
            roomDatas.map((roomData: any, idx: any): any => (
              <React.Fragment
                key={`customoverlay_${roomData.id}-${roomData.latitude}-${roomData.longitude}`}
              >
                <CustomOverlayMap //커스텀 오버레이 건물 표시
                  position={{
                    lat: roomData.latitude,
                    lng: roomData.longitude,
                  }}
                  yAnchor={zoomLevel >= 6 ? 1.0 : 2.2}
                >
                  <CustomDiv
                    style={{ background: "rgb(255,255, 255,0.5)" }}
                    onClick={() => {
                      getReviewDatas(roomData.id);
                      dispatch(saveShowReview(reviewDatas));
                      setCenter({
                        lat:
                          roomData.latitude +
                          Math.random() * (0.000009 - 0.000001) +
                          0.0001,
                        lng:
                          roomData.longitude +
                          Math.random() * (0.000009 - 0.000001) +
                          0.0001, //같은 거 클릭했을 때 먹통 안되게 랜덤값 추가
                      });
                    }}
                  >
                    {roomData.building}
                  </CustomDiv>
                </CustomOverlayMap>
              </React.Fragment>
            ))}
        </MarkerClusterer>

        {roomDatas.map((roomData: any, idx: any): any => (
          <React.Fragment
            key={`marker_${roomData.id}-${roomData.latitude}-${roomData.longitude}`}
          >
            {zoomLevel < 6 && (
              <MapMarker // 해당 건물 마커
                position={{
                  lat: roomData.latitude,
                  lng: roomData.longitude,
                }}
              ></MapMarker>
            )}
          </React.Fragment>
        ))}

        {zoomLevel >= 11 && //시도 표시
          sido.map((root: any) => (
            <CustomOverlayMap
              key={root.name}
              position={{
                lat: root.location[0],
                lng: root.location[1],
              }}
            >
              <CustomDiv
                onClick={() => {
                  setCenter({
                    lat:
                      root.location[0] +
                      Math.random() * (0.000009 - 0.000001) +
                      0.0001,
                    lng:
                      root.location[1] +
                      Math.random() * (0.000009 - 0.000001) +
                      0.0001,
                  });
                  setZoomLevel(10);
                }}
                style={
                  root.count > 0
                    ? {
                        backgroundColor: "rgb(243, 206, 83, 0.7)",
                      }
                    : {}
                }
              >
                <div>{root.name}</div>
              </CustomDiv>
            </CustomOverlayMap>
          ))}

        {7 < zoomLevel &&
          zoomLevel < 11 && //시 군 구 표시
          sigungu.map((sigungu: any) => (
            <CustomOverlayMap
              key={sigungu.name}
              position={{
                lat: sigungu.lat,
                lng: sigungu.lng,
              }}
            >
              <CustomDiv
                onClick={() => {
                  setCenter({
                    lat:
                      sigungu.lat +
                      Math.random() * (0.000009 - 0.000001) +
                      0.0001,
                    lng:
                      sigungu.lng +
                      Math.random() * (0.000009 - 0.000001) +
                      0.0001,
                  });
                  setZoomLevel(7);
                }}
                style={
                  sigungu.count > 0
                    ? { backgroundColor: "rgb(243, 206, 83, 0.7)" }
                    : {}
                }
              >
                <div>{returnSigungu(sigungu.name)}</div>{" "}
                <div style={{ color: "red" }}>{sigungu.count}</div>
              </CustomDiv>
            </CustomOverlayMap>
          ))}

        {7 === zoomLevel &&
          //동 표시
          dongs.map((dong: any) => (
            <CustomOverlayMap
              key={dong.dong}
              position={{
                lat: dong.latitude,
                lng: dong.longitude,
              }}
            >
              <CustomDiv
                onClick={() => {
                  setCenter({
                    lat:
                      dong.latitude +
                      Math.random() * (0.000009 - 0.000001) +
                      0.0001,
                    lng:
                      dong.longitude +
                      Math.random() * (0.000009 - 0.000001) +
                      0.0001,
                  });
                  setZoomLevel(6);
                }}
                style={
                  dong.count > 0
                    ? { backgroundColor: "rgb(243, 206, 83, 0.7)" }
                    : {}
                }
              >
                <div>{dong.dong}</div>{" "}
                <div style={{ color: "red" }}>{dong.count}</div>
              </CustomDiv>
            </CustomOverlayMap>
          ))}
        <ZoomControl />
        <MapTypeControl position={kakao.maps.ControlPosition.TOPRIGHT} />
      </Map>
      <ContentDiv>
        {reviewDatas.length > 0 &&
          reviewDatas.map((review: any) => (
            <ReviewBlock key={review.id} review={review} />
          ))}
        {reviewDatas.length === 0 && (
          <Notice>마커를 클릭하여 리뷰정보를 확인하세요!</Notice>
        )}
      </ContentDiv>
    </Container>
  );
}
const Container = styled.div<any>`
  width: 100%;
  height: calc(${(props) => props.wHeight}px - var(--navHeight));
`;

const CustomDiv = styled.div`
  display: flex;
  flex-direction: row;
  gap: 7px;
  color: black;
  justify-content: center;
  align-items: baseline;
  padding: 7px;
  font-size: 0.9rem;
  border-radius: 30px;
  background: transparent;
  -webkit-backdrop-filter: blur(5px);
  backdrop-filter: blur(5px);
  background-color: rgba(255, 241, 195, 0.4);
  box-shadow: rgba(50, 50, 93, 0.25) 0px 0px 20px 10px,
    rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;
  transition: all 0.5s;
  &:hover {
    background-color: rgba(199, 208, 247, 0.8) !important;
  }
`;
const Notice = styled.div`
  margin: 15px;
  font-size: 1.2rem;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3582);
  padding: 20px;
  border-radius: 20px;
  transition: all 0.7s;
  text-align: center;
  background-color: rgb(227, 241, 253);
  &:hover {
    background-color: rgb(255, 241, 195);
    cursor: pointer;
    transform: scale(1.03);
  }
`;
const ContentDiv = styled.div`
  width: 100%;
  height: 50%;
  overflow-y: scroll;
  background: linear-gradient(
    to bottom,
    rgb(249, 254, 255),
    rgb(255, 250, 250),
    rgb(223, 236, 252)
  );
`;

export default MapCluster;
