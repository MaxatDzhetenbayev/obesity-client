import React, { useState } from "react";
import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  useMediaQuery,
  Button,
  Drawer,
  MenuItem,
  Menu as MuiMenu,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const menuList = [
  {
    title: "menu.main",
    path: "/",
  },
  {
    title: "menu.facts",
    children: [
      {
        title: "Распространенность",
        path: "facts/popularity"
      },
      {
        title: "Симптомы",
        path: "facts/symptoms"
      },
      {
        title: "Предотвращение",
        path: "facts/prevention"
      },
      {
        title: "Распространенность",
        path: "facts/popularity"
      },
    ]
  },
  {
    title: "menu.questionnaire",
    path: "questionnaire",
  },
  {
    title: "menu.online_calculator",
    path: "calculator",
  },
  {
    title: "menu.faq",
    path: "faq",
  },
];

const MenuList = ({ items }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const childMenuOpen = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <List sx={{display: "flex", gap: "10px"}}>
      {items.map((item) => (
        <>
        <ListItemButton key={item.title} onClick={(e) => item.children ? handleClick(e) : navigate(item.path)}>
          <ListItemText>{t(item.title)}</ListItemText>
        </ListItemButton>
          {
            item.children && (
              <MuiMenu
                anchorEl={anchorEl}
                open={childMenuOpen}
                onClose={() => handleClose(null)}
              >
                {item.children.map((child) => (
                  <MenuItem key={child.title} onClick={() => navigate(child.path)}>
                    {t(child.title)}
                  </MenuItem>
                ))}
              </MuiMenu>
            )
          }
        </>
      ))}
    </List>
  )
}

export const Menu = () => {
  const isViewMenuBurger = useMediaQuery("(max-width: 900px)");
  const { t } = useTranslation();

  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
      <List>
        {menuList.map((item) => (
          <ListItem key={item.title} disablePadding>
            <ListItemButton onClick={() => navigate(item.path)}>
              <ListItemText>{t(item.title)}</ListItemText>
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      {!isViewMenuBurger ? (
        <MenuList items={menuList} />
      ) : (
        <IconButton onClick={toggleDrawer(true)}>
          <MenuIcon sx={{ color: "#fff" }} />
        </IconButton>
      )}
      <Drawer open={open} onClose={toggleDrawer("false")}>
        {DrawerList}
      </Drawer>
    </>
  );
};
