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
  Collapse,
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
        title: "menu.popularity",
        path: "facts/popularity"
      },
      {
        title: "menu.symptoms",
        path: "facts/symptoms"
      },
      {
        title: "menu.prevention",
        path: "facts/prevention"
      },
      {
        title: "menu.adviсe",
        path: "facts/adviсe"
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
    <List sx={{ display: "flex", gap: "10px" }}>
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

const DrawerList = ({ handleClose }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleNavigate = (path) => {
    navigate(path);
    handleClose(false);
  }

  return (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
        {menuList.map((item) => {
          const isChild = Boolean(item.children);
          const [open, setOpen] = useState(false);
          const handleClick = () => {
            setOpen(!open);
          }
          return <>
            <ListItem key={item.title} disablePadding>
              <ListItemButton onClick={!isChild ? () => { handleNavigate(item.path) } : handleClick}>
                <ListItemText>{t(item.title)}</ListItemText>
              </ListItemButton>
            </ListItem>
            {item.children && (
              <Collapse in={open} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child) => (
                    <ListItemButton sx={{ pl: 4 }} onClick={() => handleNavigate(child.path)}>
                      <ListItemText>{t(child.title)}</ListItemText>
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>

            )}
          </>
        })}
      </List>
    </Box>)
};

export const Menu = () => {
  const isViewMenuBurger = useMediaQuery("(max-width: 950px)");
  const [open, setOpen] = useState(false);
  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <>
      {!isViewMenuBurger ? (
        <MenuList items={menuList} />
      ) : (
        <IconButton onClick={toggleDrawer(true)}>
          <MenuIcon sx={{ color: "#fff" }} />
        </IconButton>
      )}
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <DrawerList handleClose={toggleDrawer(false)} />
      </Drawer>
    </>
  );
};
