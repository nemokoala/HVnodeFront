import { useEffect } from "react";
import { useRef } from "react";

declare global {
  interface Window {
    kakao: any;
  }
}
const { kakao } = window;

function MapContainer({
  address,
  title,
}: {
  address?: string | null;
  title?: string | null;
}): JSX.Element {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let container = ref.current; //지도를 담을 영역의 DOM 레퍼런스
    let options = {
      //지도를 생성할 때 필요한 기본 옵션
      center: new window.kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
      level: 3, //지도의 레벨(확대, 축소 정도)
    };
    let map = new kakao.maps.Map(container, options); //지도 생성 및 객체 리턴

    var geocoder = new kakao.maps.services.Geocoder();

    // 주소로 좌표를 검색합니다
    geocoder.addressSearch(address, function (result: any, status: any): any {
      // 정상적으로 검색이 완료됐으면
      if (status === kakao.maps.services.Status.OK) {
        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);

        // 결과값으로 받은 위치를 마커로 표시합니다
        var marker = new kakao.maps.Marker({
          map: map,
          position: coords,
        });

        // 인포윈도우로 장소에 대한 설명을 표시합니다
        var infowindow = new kakao.maps.InfoWindow({
          content: `<a href="https://map.kakao.com/link/map/${address},${result[0].y},${result[0].x}" target="_blank"><div style="width:150px;text-align:center;padding:6px 0;">${title}</div></a>`,
        });
        infowindow.open(map, marker);

        // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
        map.setCenter(coords);
      }
    });
    let locationAccess = 0;
    let message;

    if (locationAccess == 0) {
      if (navigator.geolocation) {
        // GeoLocation을 이용해서 접속 위치를 얻어옵니다
        navigator.geolocation.getCurrentPosition(function (position: any): any {
          var lat = position.coords.latitude, // 위도
            lon = position.coords.longitude; // 경도

          var locPosition = new kakao.maps.LatLng(lat, lon); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
          message = '<div style="padding:5px;">현재 위치</div>'; // 인포윈도우에 표시될 내용입니다
          var marker = new kakao.maps.Marker({
            map: map,
            position: new kakao.maps.LatLng(lat, lon),
          });
          // 마커와 인포윈도우를 표시합니다
          var infowindow = new kakao.maps.InfoWindow({
            content: `<div style="width:150px;text-align:center;padding:6px 0;">내 위치</div>`,
          });
          infowindow.open(map, marker);
          if (locationAccess == 1) {
            map.setCenter(locPosition); // 지도 중심좌표를 접속위치로 변경합니다
          }
          locationAccess = 1;
        });
      }
    }
  }, []);

  return <div id="map" ref={ref} style={{ width: "100vw", height: "300px" }} />;
}

export default MapContainer;
