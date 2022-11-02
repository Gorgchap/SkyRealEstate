import React, { useEffect, useState } from 'react';
import { CircularProgress, Grid } from '@mui/material';
import { Clusterer, Map, Placemark, YMaps } from '@pbe/react-yandex-maps';
import { ObjectInfo } from '@src/components';
import './interactive.less';

const features = [
  {
    id: 0,
    geometry: { type: 'Point', coordinates: [55.831903, 37.411961] },
    options: {
      balloonCloseButton: false,
      balloonOffset: [0, -20],
      hideIconOnBalloonOpen: false,
      preset: 'islands#blueStretchyIcon',
    },
    properties: {
      balloonContent: '<img src="http://img-fotki.yandex.ru/get/6114/82599242.2d6/0_88b97_ec425cf5_M" alt="" />',
      hintContent: 'Нажмите на точку для показа или скрытия подсказки',
      iconContent: '<b>2</b> – от 8.5 млн',
    },
  },
  {
    id: 1,
    geometry: { type: 'Point', coordinates: [55.821903, 37.421961] },
    options: { preset: 'islands#darkGreenStretchyIcon' },
    properties: {
      balloonContent: '<img src="http://img-fotki.yandex.ru/get/6114/82599242.2d6/0_88b97_ec425cf5_M" alt="" />',
      iconContent: 'Azerbaijan',
    },
  },
];

export const Interactive = (): JSX.Element => {
  const [center, setCenter] = useState<[number, number]>([55.751999, 37.617734]);
  const [loading, setLoading] = useState<boolean>(true);
  const [zoom, setZoom] = useState<number>(12);

  useEffect(() => {
    setTimeout(() => setLoading(false), 5000);
    setTimeout(() => {
      setCenter([55.651999, 37.517734]);
      setZoom(10);
    }, 7000);
  }, []);

  return (
    <Grid container sx={{ width: '100%', minWidth: 768, height: '100%' }} wrap="nowrap">
      <Grid className="info" item>
        <div className={`scrollable${loading ? ' loading' : ''}`}>
           {
             loading ? (
               <CircularProgress size={50} thickness={4} />
             ) : Array.from({ length: 100 }, (_, index) => (
               <ObjectInfo
                 key={index}
                 title={`Box ${index + 1}`}
               />
             ))
           }
        </div>
      </Grid>
      <Grid item sx={{ flexBasis: '100%', overflow: 'hidden' }}>
        <YMaps>
          <Map
            className="map"
            defaultOptions={{ minZoom: 9 }}
            modules={['control.ZoomControl', 'geoObject.addon.balloon', 'geoObject.addon.hint']}
            state={{ center, controls: ['zoomControl'], zoom }}
          >
            <Clusterer options={{ preset: 'islands#invertedVioletClusterIcons' }}>
              {features.map((items) => (
                <Placemark
                  key={items.id}
                  geometry={items.geometry}
                  options={items.options}
                  properties={items.properties}
                />
              ))}
            </Clusterer>
          </Map>
        </YMaps>
      </Grid>
    </Grid>
  );
};
