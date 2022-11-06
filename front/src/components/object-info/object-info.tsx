import React, {MouseEvent, useEffect, useState} from 'react';
import { Box, Chip, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { ObjectInformation } from '@src/models';
import { materialArray, pluralRus, segmentArray } from '@src/utils';
import './object-info.less';

interface Props {
  info: ObjectInformation;
  showChips?: boolean;
  state: string;
  updateInfo: (type: string) => void;
}

export const ObjectInfo = ({ info, showChips = true, state, updateInfo }: Props): JSX.Element => {
  const [value, setValue] = useState<string>('');

  const handleChange = (event: MouseEvent<HTMLElement>, newValue: string) => {
    setValue(newValue);
    updateInfo(newValue);
  };

  useEffect(() => setValue(state), [state]);

  return (
    <Box sx={{ display: 'flex', flexFlow: 'column nowrap', gap: 1, border: '1px solid #eff3fd', padding: 1.5 }}>
      {value && (
        <div className={`status status-${value}`}>
          Объект { value === 'push' ? 'добавлен' : 'удалён' }
        </div>
      )}
      <Typography component="p" sx={{ fontWeight: 700, lineHeight: 1.25 }}>
        { info.address }
      </Typography>
      <Typography component="p" sx={{ color: '#afb5b8', fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.2 }}>
        { info.to_metro } мин. от метро
      </Typography>
      <Typography component="p" sx={{ fontWeight: 700, lineHeight: 1.4 }}>
        { info.rooms < 1 ? 'Студия' : pluralRus(info.rooms, 'комната', 'комнаты', 'комнат') } •
        { segmentArray.find(s => s.value === info.segments)?.label ?? '–' } •
        { pluralRus(info.floors, 'этаж', 'этажа', 'этажей') } •
        { materialArray.find(s => s.value === info.wall_mat)?.label ?? '–' }
      </Typography>
      {showChips && (
        <Box sx={{ display: 'flex', flexFlow: 'row wrap', gap: 1 }}>
          <Chip label={`${info.floor} этаж`} sx={{ backgroundColor: 'rgba(128, 202, 255, 0.2)' }}/>
          <Chip label={`Площадь: ${info.square} м²`} sx={{ backgroundColor: 'rgba(128, 202, 255, 0.2)' }}/>
          <Chip label={`Кухня: ${info.kit_squa} м²`} sx={{ backgroundColor: 'rgba(128, 202, 255, 0.2)' }}/>
          <Chip label={`Балкон/лоджия: ${info.balkon ? 'Да' : 'Нет'}`} sx={{ backgroundColor: 'rgba(128, 202, 255, 0.2)' }}/>
          <Chip label={`${info.condition}`} sx={{ backgroundColor: 'rgba(128, 202, 255, 0.2)' }}/>
        </Box>
      )}
      <ToggleButtonGroup exclusive fullWidth onChange={handleChange} value={value}>
        <ToggleButton className="toggle-button" value="push">Добавить</ToggleButton>
        <ToggleButton className="toggle-button" disabled={!value} value="pop">Удалить</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};
