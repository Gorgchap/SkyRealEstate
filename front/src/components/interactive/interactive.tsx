import React, { SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Button, Checkbox, Chip, CircularProgress, Grid, FormControlLabel, Menu, MenuItem, Tab, Tabs, TextField,
} from '@mui/material';
import { Clusterer, Map, Placemark, YMaps } from '@pbe/react-yandex-maps';
import { analoguesPost, benchmarksPost } from '@src/api';
import { ObjectInfo } from '@src/components';
import { ObjectInformation } from '@src/models';
import { distanceArray, materialArray, pluralRus, roomsArray, segmentArray } from '@src/utils';
import './interactive.less';

const getMarker = (coordinates: [number, number], prices?: number[]): any => {
  return {
    id: 0,
    geometry: { type: 'Point', coordinates },
    options: {
      balloonCloseButton: false,
      balloonOffset: [0, -20],
      hideIconOnBalloonOpen: false,
      preset: prices ? 'islands#darkGreenStretchyIcon' : 'islands#blueStretchyIcon',
    },
    properties: {
      balloonContent: prices?.map(e => Math.round(e / 1000000) + ' млн руб').join('<br>') ?? '',
      hintContent: prices ? 'Здесь находится объекты-аналоги' : 'Здесь находятся эталонные объекты',
      // iconContent: prices ? `${prices.length > 1 ? `<b>${prices.length}</b> – ` : ''}от ${Math.min(...prices)}` : '',
    },
  }
};

const comparator = (a: ObjectInformation, b: ObjectInformation): number => a.bid - b.bid;
const defaultCenter: [number, number] = [55.751999, 37.617734];

export const Interactive = (): JSX.Element => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<number>(0);
  const [center, setCenter] = useState<[number, number]>(defaultCenter);
  const [feat, setFeat] = useState<any[]>([]);
  const [zoom, setZoom] = useState<number>(12);

  const [addedAnalogues, setAddedAnalogues] = useState<ObjectInformation[]>([]);
  const [analogues, setAnalogues] = useState<ObjectInformation[]>([]);
  const [analoguesChecked, setAnaloguesChecked] = useState<boolean>(false);
  const [analoguesEl, setAnaloguesEl] = useState<HTMLElement | null>(null);
  const [analoguesLoading, setAnaloguesLoading] = useState<boolean>(false);
  const [analoguesState, setAnaloguesState] = useState<string>('');

  const [addedBenchmarks, setAddedBenchmarks] = useState<ObjectInformation[]>([]);
  const [benchmarks, setBenchmarks] = useState<ObjectInformation[]>([]);
  const [benchmarksChecked, setBenchmarksChecked] = useState<boolean>(false);
  const [benchmarksEl, setBenchmarksEl] = useState<HTMLElement | null>(null);
  const [benchmarksLoading, setBenchmarksLoading] = useState<boolean>(true);
  const [benchmarksState, setBenchmarksState] = useState<string>('');

  const [address, setAddress] = useState<string>('');
  const [distance, setDistance] = useState<number>(0);
  const [material, setMaterial] = useState<string[]>([]);
  const [rooms, setRooms] = useState<number>(-1);
  const [segment, setSegment] = useState<string[]>([]);
  const [square, setSquare] = useState<number>(0);

  const getAnalogues = async (): Promise<void> => {
    try {
      setAnaloguesLoading(true);
      const data = await analoguesPost(addedBenchmarks.map(e => e.bid));
      setAddedAnalogues([...data]);
      setAnalogues(data);
      setAnaloguesChecked(true);
      setAnaloguesState('push');
      setActiveTab(1);
      const [first] = feat;
      const markers = data.map(e => getMarker([+e.lat, +e.lon], [e.price]));
      setFeat([first, ...markers]);
    } catch (e) {
      console.error(e);
      setAddedAnalogues([]);
      setAnalogues([]);
      setAnaloguesState('');
    } finally {
      setAnaloguesLoading(false);
    }
  };

  const getBenchmarks = async (): Promise<void> => {
    try {
      setBenchmarksLoading(true);
      const result = await benchmarksPost({
        address: address.trim(),
        distance,
        material: `${material}`,
        rooms,
        segment: `${segment}`,
        square,
      });
      setBenchmarks(result);
      if (result.length > 0) {
        const coordinates: [number, number] = [+result[0].lat, +result[0].lon];
        setCenter(coordinates);
        setFeat([getMarker(coordinates)]);
        setZoom(12);
      }
    } catch (e) {
      console.error(e);
      setBenchmarks([]);
    } finally {
      setBenchmarksLoading(false);
      setAddedBenchmarks([]);
      setBenchmarksState('');
      setAnalogues([]);
      setAddedAnalogues([]);
      setAnaloguesState('');
    }
  };

  const onAnaloguesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddedAnalogues(event.target.checked ? [...analogues] : []);
    setAnaloguesChecked(event.target.checked);
    setAnaloguesState(event.target.checked ? 'push' : 'pop');
  };

  const onAnaloguesUpdate = (item: ObjectInformation, type: string): void => {
    if (addedAnalogues.length === analogues.length - 1 && type === 'push') {
      setAddedAnalogues([...analogues]);
      setAnaloguesChecked(true);
    } else {
      setAddedAnalogues(value => type === 'push' ? value.concat(item).sort(comparator) : value.filter(e => e.bid !== item.bid));
    }
  };

  const onBenchmarksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddedBenchmarks(event.target.checked ? [...benchmarks] : []);
    setBenchmarksChecked(event.target.checked);
    setBenchmarksState(event.target.checked ? 'push' : 'pop');
  };

  const onBenchmarksUpdate = (item: ObjectInformation, type: string): void => {
    if (addedBenchmarks.length === benchmarks.length - 1 && type === 'push') {
      setAddedBenchmarks([...benchmarks]);
      setBenchmarksChecked(true);
    } else {
      setAddedBenchmarks(value => type === 'push' ? value.concat(item).sort(comparator) : value.filter(e => e.bid !== item.bid));
    }
  };

  // const onPool = (): void => {
  //   navigate('/pool');
  // };

  const resetBenchmarkFilters = (): void => {
    setAddress('');
    setDistance(0);
    setMaterial([]);
    setRooms(-1);
    setSegment([]);
    setSquare(0);
  };

  useEffect(() => {
    getBenchmarks();
  }, []);

  return (
    <Grid container sx={{ width: '100%', minWidth: 768, height: '100%' }} wrap="nowrap">
      <Grid className="info" item>
        <div className="scrollable">
           {
             <>
               <Box sx={{ borderBottom: 1, borderColor: 'divider', marginBottom: '1rem' }}>
                 <Tabs
                   onChange={(e: SyntheticEvent, value: number) => setActiveTab(value)}
                   value={activeTab}
                   variant="fullWidth"
                 >
                   <Tab label="Эталоны" />
                   <Tab label="Аналоги" />
                 </Tabs>
               </Box>
               <Box className="objects" component="div" sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
                 {activeTab === 0 && (
                   <>
                     {
                       benchmarksLoading ? (
                         <CircularProgress size={50} thickness={4} />
                       ) : benchmarks.length > 0 ? (
                         <>
                           <div className="filters">
                             <p>Выберите объекты оценки</p>
                             <p>(выбрано { pluralRus(addedBenchmarks.length, 'объект', 'объекта', 'объектов') })</p>
                             <FormControlLabel
                               control={<Checkbox checked={benchmarksChecked} onChange={onBenchmarksChange} />}
                               label="Выбрать все"
                               sx={{ width: '100%' }}
                             />
                             {addedBenchmarks.length > 0 && (
                               <Button onClick={() => getAnalogues()} sx={{ padding: 0 }} variant="text">
                                 Рассчитать
                               </Button>
                             )}
                             <div className="filter-menu" onClick={e => setBenchmarksEl(e.currentTarget)} />
                           </div>
                           <Menu
                             id="benchmarks-menu"
                             anchorEl={benchmarksEl}
                             anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                             open={!!benchmarksEl}
                             onClose={() => setBenchmarksEl(null)}
                             transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                           >
                             <Grid container sx={{ maxWidth: '350px', minWidth: '350px', rowGap: 2, mx: 2, my: 1 }}>
                               <Grid item xs={12}>
                                 <TextField
                                   fullWidth
                                   label="Адрес"
                                   onChange={e => setAddress(e.target.value)}
                                   size="small"
                                   value={address}
                                 />
                               </Grid>
                               <Grid item sx={{ width: 'calc(50% - 8px)', marginRight: '16px' }}>
                                 <TextField
                                   fullWidth
                                   label="Число комнат"
                                   onChange={e => setRooms(+e.target.value)}
                                   select
                                   size="small"
                                   value={rooms}
                                 >
                                   {roomsArray.map((option) => (
                                     <MenuItem key={option.value} value={option.value}>
                                       {option.label}
                                     </MenuItem>
                                   ))}
                                 </TextField>
                               </Grid>
                               <Grid item sx={{ width: 'calc(50% - 8px)' }}>
                                 <TextField
                                   InputProps={{ inputProps: { type: 'number', min: 0, step: 0.1 } }}
                                   fullWidth
                                   label="Общая площадь м²"
                                   onChange={e => +e.target.value > 0 && setSquare(+e.target.value)}
                                   size="small"
                                   value={square}
                                 />
                               </Grid>
                               <Grid item xs={12} sx={{ fontSize: '14px', lineHeight: '17px' }}>
                                 <p><b>Сегмент</b></p>
                                 <Box sx={{ display: 'flex', flexFlow: 'row wrap', gap: 1, mt: 1 }}>
                                   {
                                     segmentArray.map((option) => (
                                       <Chip
                                         key={option.value}
                                         label={option.label}
                                         onClick={() => setSegment(
                                           e => e.includes(option.value) ? e.filter(i => i !== option.value) : e.concat(option.value)
                                         )}
                                         sx={{
                                           backgroundColor: segment.includes(option.value) ? 'var(--primary-color)' : '#eff3fd',
                                           color: segment.includes(option.value) ? '#ffffff' : '#000000dd',
                                         }}
                                       />
                                     ))
                                   }
                                 </Box>
                               </Grid>
                               <Grid item xs={12} sx={{ fontSize: '14px', lineHeight: '17px' }}>
                                 <p><b>Удалённость от метро пешком</b></p>
                                 <Box sx={{ display: 'flex', flexFlow: 'row wrap', gap: 1, mt: 1 }}>
                                   {
                                     distanceArray.map((option) => (
                                       <Chip
                                         key={option.value}
                                         label={option.label}
                                         onClick={() => setDistance(e => e === option.value ? 0 : option.value)}
                                         sx={{
                                           backgroundColor: distance === option.value ? 'var(--primary-color)' : '#eff3fd',
                                           color: distance === option.value ? '#ffffff' : '#000000dd',
                                         }}
                                       />
                                     ))
                                   }
                                 </Box>
                               </Grid>
                               <Grid item xs={12} sx={{ fontSize: '14px', lineHeight: '17px' }}>
                                 <p><b>Материал</b></p>
                                 <Box sx={{ display: 'flex', flexFlow: 'row wrap', gap: 1, mt: 1 }}>
                                   {
                                     materialArray.map((option) => (
                                       <Chip
                                         key={option.value}
                                         label={option.label}
                                         onClick={() => setMaterial(
                                           e => e.includes(option.value) ? e.filter(i => i !== option.value) : e.concat(option.value)
                                         )}
                                         sx={{
                                           backgroundColor: material.includes(option.value) ? 'var(--primary-color)' : '#eff3fd',
                                           color: material.includes(option.value) ? '#ffffff' : '#000000dd',
                                         }}
                                       />
                                     ))
                                   }
                                 </Box>
                               </Grid>
                               <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                 <Button color="primary" onClick={() => getBenchmarks()} type="button" variant="contained">
                                   Применить
                                 </Button>
                                 <Button color="info" onClick={() => resetBenchmarkFilters()} type="button" variant="contained">
                                   Сбросить
                                 </Button>
                               </Grid>
                             </Grid>
                           </Menu>
                           {
                             benchmarks.map((item: ObjectInformation, index: number) => (
                               <ObjectInfo
                                 key={index}
                                 info={item}
                                 state={benchmarksState}
                                 updateInfo={type => onBenchmarksUpdate(item, type)}
                               />
                             ))
                           }
                         </>
                       ) : (
                         <>Эталоны не найдены</>
                       )
                     }
                   </>
                 )}
               </Box>
               <Box className="objects" component="div" sx={{ display: activeTab === 0 ? 'block' : 'none' }}>
                 {activeTab === 1 && (
                   <>
                     {
                       analoguesLoading ? (
                         <CircularProgress size={50} thickness={4} />
                       ) : analogues.length > 0 ? (
                         <>
                           <div className="filters">
                             <p>Выберите аналоги для пула</p>
                             <p>(выбрано { pluralRus(addedAnalogues.length, 'объект', 'объекта', 'объектов') })</p>
                             <FormControlLabel
                               control={<Checkbox checked={analoguesChecked} onChange={onAnaloguesChange} />}
                               label="Выбрать все"
                               sx={{ width: '100%' }}
                             />
                             {addedAnalogues.length > 0 && (
                               <Button sx={{ padding: 0 }} variant="text">
                                 Рассчитать пул
                               </Button>
                             )}
                             <div className="filter-menu" onClick={e => setAnaloguesEl(e.currentTarget)} />
                           </div>
                           <Menu
                             id="analogues-menu"
                             anchorEl={analoguesEl}
                             anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                             open={!!analoguesEl}
                             onClose={() => setAnaloguesEl(null)}
                             transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                           >
                             <Grid container sx={{ maxWidth: '350px', minWidth: '350px', mx: 1.5, my: 0.5 }}>
                               <Grid item sx={{ width: 'calc(50% - 8px)' }}>
                                 <TextField
                                   InputProps={{ inputProps: { type: 'number', min: 0, step: 0.1 } }}
                                   fullWidth
                                   label="Этаж расположения (%)"
                                   onChange={e => +e.target.value > 0 && setSquare(+e.target.value)}
                                   size="small"
                                   value={2.5}
                                 />
                               </Grid>
                               <Grid item sx={{ width: 'calc(50% - 8px)' }}>
                                 <TextField
                                   InputProps={{ inputProps: { type: 'number', min: 0, step: 0.1 } }}
                                   fullWidth
                                   label="Площадь дома (%)"
                                   onChange={e => +e.target.value > 0 && setSquare(+e.target.value)}
                                   size="small"
                                   value={1.5}
                                 />
                               </Grid>
                               <Grid item sx={{ width: 'calc(50% - 8px)' }}>
                                 <TextField
                                   InputProps={{ inputProps: { type: 'number', min: 0, step: 0.1 } }}
                                   fullWidth
                                   label="Площадь кухни (%)"
                                   onChange={e => +e.target.value > 0 && setSquare(+e.target.value)}
                                   size="small"
                                   value={2}
                                 />
                               </Grid>
                               <Grid item sx={{ width: 'calc(50% - 8px)' }}>
                                 <TextField
                                   InputProps={{ inputProps: { type: 'number', min: 0, step: 0.1 } }}
                                   fullWidth
                                   label="Балкон/лоджия (%)"
                                   onChange={e => +e.target.value > 0 && setSquare(+e.target.value)}
                                   size="small"
                                   value={5}
                                 />
                               </Grid>
                               <Grid item sx={{ width: 'calc(50% - 8px)' }}>
                                 <TextField
                                   InputProps={{ inputProps: { type: 'number', min: 0, step: 0.1 } }}
                                   fullWidth
                                   label="Удаленность от метро (%)"
                                   onChange={e => +e.target.value > 0 && setSquare(+e.target.value)}
                                   size="small"
                                   value={1}
                                 />
                               </Grid>
                               <Grid item sx={{ width: 'calc(50% - 8px)' }}>
                                 <TextField
                                   InputProps={{ inputProps: { type: 'number', min: 0, step: 0.1 } }}
                                   fullWidth
                                   label="Состояние отделки (%)"
                                   onChange={e => +e.target.value > 0 && setSquare(+e.target.value)}
                                   size="small"
                                   value={1}
                                 />
                               </Grid>
                               <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                                 <Button color="primary" type="button" variant="contained">
                                   Рассчитать пул
                                 </Button>
                                 <Button color="info" type="button" variant="contained">
                                   Сбросить
                                 </Button>
                               </Grid>
                             </Grid>
                           </Menu>
                           {
                             analogues.map((item: ObjectInformation, index: number) => (
                               <ObjectInfo
                                 key={index}
                                 info={item}
                                 showChips
                                 state={analoguesState}
                                 updateInfo={type => onAnaloguesUpdate(item, type)}
                               />
                             ))
                           }
                         </>
                       ) : (
                         <>Аналоги не найдены</>
                       )
                     }
                   </>
                 )}
               </Box>
             </>
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
            {feat.map((items) => (
              <Placemark
                key={items.id}
                geometry={items.geometry}
                options={items.options}
                properties={items.properties}
              />
            ))}
          </Map>
        </YMaps>
      </Grid>
    </Grid>
  );
};
