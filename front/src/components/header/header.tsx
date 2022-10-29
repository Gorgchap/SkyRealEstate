import React, { MouseEvent, useState } from 'react';
import { MoreVert } from '@mui/icons-material';
import { IconButton, Menu, MenuItem, Typography } from '@mui/material';
import { useAuth } from '@src/hooks';
import './header.less';

const menuItems = [
  {
    id: 'menu-item-logout',
    value: 'Выйти из системы',
  },
];

export const Header = (): JSX.Element => {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const { onLogout, user } = useAuth();

  const handleClickMenu = (event: MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);

  const handleCloseMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(null);
    if (event.currentTarget.id === 'menu-item-logout') {
      onLogout();
    }
  };

  return (
    <header className="app-header">
      <div className="app-header__logo"></div>
      <Typography variant="body1" component="div" sx={{ flexGrow: 1, textAlign: 'right' }}>
        {user.username}
      </Typography>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls="long-menu"
        aria-expanded={!!anchorEl}
        aria-haspopup="true"
        onClick={handleClickMenu}
      >
        <MoreVert/>
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{ 'aria-labelledby': 'long-button' }}
        anchorEl={anchorEl}
        open={!!anchorEl}
        onClose={handleCloseMenu}
      >
        {menuItems.map(option => (
          <MenuItem id={option.id} key={option.id} onClick={handleCloseMenu}>
            {option.value}
          </MenuItem>
        ))}
      </Menu>
    </header>
  )
}
