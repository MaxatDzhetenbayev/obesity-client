import React from "react";
import { AppBar, Container, Toolbar } from "@mui/material";
import { Menu as HeaderMenu } from "./Menu/Menu";
import { SwitchLanguage } from "./SwitchLanguage/SwitchLanguage";

export const Header = () => {
  return (
    <AppBar position="static">
      <Container>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <HeaderMenu />
          <SwitchLanguage />
        </Toolbar>
      </Container>
    </AppBar>
  );
};
