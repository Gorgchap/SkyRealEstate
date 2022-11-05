import React from 'react';
import { Grid } from '@mui/material';
import './pool.less';

export const Pool = (): JSX.Element => {
  return (
    <Grid container item p={3} sx={{ flexFlow: 'column nowrap' }}>
      <div>
        Pool
      </div>
      <table>
        <thead>
          <tr>
            <th>Критерии сравнения</th>
            <th>Объект оценки</th>
            <th>Аналог 1</th>
            <th>Аналог 2</th>
            <th>Аналог 3</th>
            <th>Аналог 4</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th>Источник информации</th>
            <td>–</td>
            <td>–</td>
            <td>–</td>
            <td>–</td>
            <td>–</td>
          </tr>
          <tr>
            <th>Дата предложения</th>
            <td>–</td>
            <td>–</td>
            <td>–</td>
            <td>–</td>
            <td>–</td>
          </tr>
          <tr>
            <th>Назначение</th>
            <td>–</td>
            <td>–</td>
            <td>–</td>
            <td>–</td>
            <td>–</td>
          </tr>
          <tr>
            <th>Площадь</th>
            <td>–</td>
            <td>–</td>
            <td>–</td>
            <td>–</td>
            <td>–</td>
          </tr>
          <tr>
            <th>Тип объекта</th>
            <td>–</td>
            <td>–</td>
            <td>–</td>
            <td>–</td>
            <td>–</td>
          </tr>
          <tr>
            <th>Этаж расположения</th>
            <td>–</td>
            <td>–</td>
            <td>–</td>
            <td>–</td>
            <td>–</td>
          </tr>
          <tr>
            <th>Адрес</th>
            <td>–</td>
            <td>–</td>
            <td>–</td>
            <td>–</td>
            <td>–</td>
          </tr>
          <tr>
            <th>Удалённость от метро пешком</th>
            <td>–</td>
            <td>–</td>
            <td>–</td>
            <td>–</td>
            <td>–</td>
          </tr>
          <tr>
            <th>Число комнат</th>
            <td>–</td>
            <td>–</td>
            <td>–</td>
            <td>–</td>
            <td>–</td>
          </tr>
          <tr>
            <th>Материал стен</th>
            <td>–</td>
            <td>–</td>
            <td>–</td>
            <td>–</td>
            <td>–</td>
          </tr>
          <tr>
            <th>Сегмент</th>
            <td>–</td>
            <td>–</td>
            <td>–</td>
            <td>–</td>
            <td>–</td>
          </tr>
          <tr>
            <th>Площадь кухни</th>
            <td>–</td>
            <td>–</td>
            <td>–</td>
            <td>–</td>
            <td>–</td>
          </tr>
          <tr>
            <th>Наличие балкона/лоджии</th>
            <td>–</td>
            <td>–</td>
            <td>–</td>
            <td>–</td>
            <td>–</td>
          </tr>
          <tr>
            <th>Состояние отделки</th>
            <td>–</td>
            <td>–</td>
            <td>–</td>
            <td>–</td>
            <td>–</td>
          </tr>
          <tr>
            <th>Цена предложения за м² (с НДС)</th>
            <td>–</td>
            <td>–</td>
            <td>–</td>
            <td>–</td>
            <td>–</td>
          </tr>
          <tr>
            <th>Цена предложения (с НДС)</th>
            <td>–</td>
            <td>–</td>
            <td>–</td>
            <td>–</td>
            <td>–</td>
          </tr>
          <tr>
            <th>Торг</th>
            <td style={{ backgroundColor: 'var(--error-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--error-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--error-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--error-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--error-color)' }}>–</td>
          </tr>
          <tr>
            <th>Площадь</th>
            <td style={{ backgroundColor: 'var(--success-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--success-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--success-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--success-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--success-color)' }}>–</td>
          </tr>
          <tr>
            <th>Удалённость от метро</th>
            <td style={{ backgroundColor: 'var(--success-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--success-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--success-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--success-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--success-color)' }}>–</td>
          </tr>
          <tr>
            <th>Этаж</th>
            <td style={{ backgroundColor: 'var(--success-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--success-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--success-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--success-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--success-color)' }}>–</td>
          </tr>
          <tr>
            <th>Число комнат</th>
            <td style={{ backgroundColor: 'var(--success-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--success-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--success-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--success-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--success-color)' }}>–</td>
          </tr>
          <tr>
            <th>Площадь кухни</th>
            <td style={{ backgroundColor: 'var(--success-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--success-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--success-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--success-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--success-color)' }}>–</td>
          </tr>
          <tr>
            <th>Ремонт</th>
            <td style={{ backgroundColor: 'var(--error-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--error-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--error-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--error-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--error-color)' }}>–</td>
          </tr>
          <tr>
            <th>Наличие балкона/лоджии</th>
            <td style={{ backgroundColor: 'var(--error-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--error-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--error-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--error-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--error-color)' }}>–</td>
          </tr>
          <tr>
            <th>Размер произведённых корректировок</th>
            <td style={{ backgroundColor: 'var(--success-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--success-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--success-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--success-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--success-color)' }}>–</td>
          </tr>
          <tr>
            <th>Вес аналога</th>
            <td style={{ backgroundColor: 'var(--success-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--success-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--success-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--success-color)' }}>–</td>
            <td style={{ backgroundColor: 'var(--success-color)' }}>–</td>
          </tr>
        </tbody>
      </table>
    </Grid>
  )
};
