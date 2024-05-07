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

export const Menu = () => {
  const isViewMenuBurger = useMediaQuery("(max-width: 900px)");
  const { t} = useTranslation();

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
        <Box>
          {menuList.map((item) => (
            <Button variant="" onClick={() => navigate(item.path)}>
              <Typography>{t(item.title)}</Typography>
            </Button>
          ))}
        </Box>
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
