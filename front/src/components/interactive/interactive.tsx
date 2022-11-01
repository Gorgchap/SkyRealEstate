import React from 'react';
import { Grid } from '@mui/material';
import { Map, TrafficControl, YMaps } from '@pbe/react-yandex-maps';
import './interactive.less';

export const Interactive = (): JSX.Element => {
  return (
    <Grid container sx={{ width: '100%', minWidth: 768, height: '100%' }} wrap="nowrap">
      <Grid className="info" item>
        { Array.from({ length: 100 }, (_, index) => (<p key={index}>Box { index + 1 }</p>)) }
      </Grid>
      <Grid item sx={{ flexBasis: '100%', overflow: 'hidden' }}>
        <YMaps>
          <Map className="map" defaultState={{ center: [55.751574, 37.573856], zoom: 9 }}>
            <TrafficControl options={{ float: 'right' } as never} />
          </Map>
        </YMaps>
      </Grid>
    </Grid>
  );
};
