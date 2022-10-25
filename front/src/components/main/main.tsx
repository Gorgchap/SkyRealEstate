import React from 'react';
import { Button, Card, CardActions, CardContent, Container, Grid, Typography } from '@mui/material';
import { Map, YMaps } from '@pbe/react-yandex-maps';

export const Main = (): JSX.Element => {
  return (
    <Container sx={{ py: 8 }}>
      <Grid container spacing={4}>
        {[0, 1, 2, 3].map((card) => (
          <Grid item key={card} sm={12} md={6}>
            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  Heading
                </Typography>
                <Typography>
                  This is a media card. You can use this section to describe the content.
                </Typography>
                <YMaps>
                  <Map
                    defaultState={{ center: [55.751574, 37.573856], zoom: 9 }}
                    width="100%"
                    height="300px"
                  />
                </YMaps>
              </CardContent>
              <CardActions>
                <Button size="small">View</Button>
                <Button size="small">Edit</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};