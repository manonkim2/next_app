/* global kakao */
import Script from 'next/script';
import * as stores from 'data/store_data.json';

declare global {
  interface Window {
    kakao: any;
  }
}

const DEFAULT_LAT = 37.497625203;
const DEFAULT_LNG = 127.03088379;

const Map = () => {
  const loadKakaoMap = () => {
    //kakao map 로드
    window.kakao.maps.load(() => {
      const mapContainer = document.getElementById('map');
      const mapOption = {
        center: new window.kakao.maps.LatLng(DEFAULT_LAT, DEFAULT_LNG),
        level: 3,
      };
      const map = new window.kakao.maps.Map(mapContainer, mapOption);

      // 식당 데이터 마커
      stores?.['DATA']?.map((store) => {
        var markerPosition = new window.kakao.maps.LatLng(
          store.y_dnts,
          store.x_cnts
        );

        // 마커를 생성합니다
        var marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });

        // 마커가 지도 위에 표시되도록 설정합니다
        marker.setMap(map);
      });
    });
  };

  return (
    <>
      <Script
        strategy='afterInteractive'
        type='text/javascript'
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_CLIENT}&autoload=false`}
        onReady={loadKakaoMap}
      />
      <div id='map' className='w-full h-screen'></div>
    </>
  );
};

export default Map;
