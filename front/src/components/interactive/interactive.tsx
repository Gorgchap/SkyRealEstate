import React, { useEffect, useState } from 'react';
import { CircularProgress, Grid } from '@mui/material';
import { Map, TrafficControl, YMaps } from '@pbe/react-yandex-maps';
import { ObjectInfo } from '@src/components';
import './interactive.less';

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
          <Map className="map" defaultOptions={{ minZoom: 9 }} state={{ center, zoom }}>
            <TrafficControl options={{ float: 'right' } as never} />
          </Map>
        </YMaps>
      </Grid>
    </Grid>
  );
};
