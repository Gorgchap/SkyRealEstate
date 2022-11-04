import React, {MouseEvent, useEffect, useState} from 'react';
import { Box, Chip, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { ObjectInformation } from '@src/models';
import './object-info.less';

interface Props {
  info: ObjectInformation;
  showChips?: boolean;
  state: string;
  updateInfo: (type: string) => void;
}

export const ObjectInfo = ({ info, showChips = false, state, updateInfo }: Props): JSX.Element => {
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
        ЖК «Символ» • 7 мин. от метро ул. Академика Янгеля
      </Typography>
      <Typography component="p" sx={{ fontWeight: 700, lineHeight: 1.4 }}>
        Студия • Современное жильё • 22 этажа • Панель
      </Typography>
      {showChips && (
        <Box sx={{ display: 'flex', flexFlow: 'row wrap', gap: 1 }}>
          <Chip label={`7 этаж`} sx={{ backgroundColor: 'rgba(128, 202, 255, 0.2)' }}/>
          <Chip label={`Площадь: 21.3 м²`} sx={{ backgroundColor: 'rgba(128, 202, 255, 0.2)' }}/>
          <Chip label={`Кухня: 8.5 м²`} sx={{ backgroundColor: 'rgba(128, 202, 255, 0.2)' }}/>
          <Chip label={`Балкон`} sx={{ backgroundColor: 'rgba(128, 202, 255, 0.2)' }}/>
          <Chip label={`Муниципальный ремонт`} sx={{ backgroundColor: 'rgba(128, 202, 255, 0.2)' }}/>
        </Box>
      )}
      <ToggleButtonGroup exclusive fullWidth onChange={handleChange} value={value}>
        <ToggleButton className="toggle-button" value="push">Добавить</ToggleButton>
        <ToggleButton className="toggle-button" disabled={!value} value="pop">Удалить</ToggleButton>
      </ToggleButtonGroup>
    </Box>
  );
};
