import React from 'react';
import { Grid } from '@mui/material';
import { sxProperties } from '@src/utils';
import './interactive.less';

export const Interactive = (): JSX.Element => {
  return (
    <Grid container item sx={sxProperties}>
      Interactive
    </Grid>
  );
};
