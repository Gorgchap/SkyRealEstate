import React from 'react';
import { Box, Typography } from '@mui/material';

interface Props {
  title: string;
}

export const ObjectInfo = ({ title }: Props): JSX.Element => {
  return (
    <Box sx={{ border: '1px solid #eff3fd', padding: 1 }}>
      <Typography component="h6" sx={{ fontWeight: 600, lineHeight: 1.25 }}>
        { title }
      </Typography>
    </Box>
  );
};
