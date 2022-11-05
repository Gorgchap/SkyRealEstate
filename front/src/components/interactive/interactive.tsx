import React, { SyntheticEvent, useEffect, useState } from 'react';
import {
  Box, Button, Checkbox, Chip, CircularProgress, Grid, FormControlLabel, Menu, MenuItem, Tab, Tabs, TextField,
} from '@mui/material';
import { Clusterer, Map, Placemark, YMaps } from '@pbe/react-yandex-maps';
import { ObjectInfo } from '@src/components';
import { ObjectInformation } from '@src/models';
import { distanceArray, materialArray, pluralRus, roomsArray, segmentArray } from '@src/utils';
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

const comparator = (a: ObjectInformation, b: ObjectInformation): number => a.id > b.id ? 1 : -1;

export const Interactive = (): JSX.Element => {
  const [activeTab, setActiveTab] = useState<number>(0);
  const [center, setCenter] = useState<[number, number]>([55.751999, 37.617734]);
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

  const getBenchmarks = (): void => {
    const filters = Object.fromEntries(Object.entries({
      address: address.trim(),
      distance,
      material: `${material}`,
      rooms,
      segment: `${segment}`,
      square,
    }).filter(([key, value]) => key === 'rooms' || value));
    console.log(filters);
  };

  const onAnaloguesChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddedAnalogues(event.target.checked ? [...analogues] : []);
    setAnaloguesChecked(event.target.checked);
    setAnaloguesState(event.target.checked ? 'push' : 'pop');
  };

  const onAnaloguesUpdate = (item: ObjectInformation, type: string): void => {
    setAddedAnalogues(value => type === 'push' ? value.concat(item).sort(comparator) : value.filter(e => e.id !== item.id));
  };

  const onBenchmarksChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setAddedBenchmarks(event.target.checked ? [...benchmarks] : []);
    setBenchmarksChecked(event.target.checked);
    setBenchmarksState(event.target.checked ? 'push' : 'pop');
  };

  const onBenchmarksUpdate = (item: ObjectInformation, type: string): void => {
    setAddedBenchmarks(value => type === 'push' ? value.concat(item).sort(comparator) : value.filter(e => e.id !== item.id));
  };

  const resetBenchmarkFilters = (): void => {
    setAddress('');
    setDistance(0);
    setMaterial([]);
    setRooms(-1);
    setSegment([]);
    setSquare(0);
  };

  useEffect(() => {
    setTimeout(() => {
      setAnalogues([]);
      setBenchmarks(Array.from({ length: 100 }, (_, index) => ({
        id: '0'.repeat(3 - `${index + 1}`.length) + `${index + 1}`,
        address: `Box ${index + 1}`,
      })));
      setAnaloguesLoading(false);
      setBenchmarksLoading(false);
    }, 3000);
    setTimeout(() => {
      setCenter([55.651999, 37.517734]);
      setZoom(10);
    }, 7000);
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
                               <Button sx={{ padding: 0 }} variant="text">
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
                                   defaultValue={''}
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
                             <div>
                               <p>Выберите аналоги для пула</p>
                               <p>(выбрано { pluralRus(addedAnalogues.length, 'объект', 'объекта', 'объектов') })</p>
                               <FormControlLabel
                                 control={<Checkbox checked={analoguesChecked} onChange={onAnaloguesChange} />}
                                 label="Выбрать все"
                               />
                             </div>
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
                               InnerContent
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
