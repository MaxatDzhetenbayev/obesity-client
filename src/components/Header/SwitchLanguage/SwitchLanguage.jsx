import { Button, Menu, MenuItem } from "@mui/material";
import { useTranslation } from "react-i18next";

import React, { useState } from "react";

export const SwitchLanguage = () => {
  const { t, i18n } = useTranslation();

  const [anchorEl, setAnchorEl] = useState(null);
  const langOpen = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button onClick={handleClick} sx={{ color: "#fff" }}>
        {t("language")}
      </Button>

      <Menu anchorEl={anchorEl} open={langOpen} onClose={handleClose}>
        <MenuItem onClick={() => i18n.changeLanguage("kz")}>Қазақша</MenuItem>
        <MenuItem onClick={() => i18n.changeLanguage("ru")}>Русский</MenuItem>
      </Menu>
    </>
  );
};
