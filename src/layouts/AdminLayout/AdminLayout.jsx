import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Box, Container, Tab, Tabs } from "@mui/material";

const nav = [
  { to: "/admin", end: true, label: "Результаты" },
  { to: "/admin/questionnaires", end: false, label: "Опросники" },
];

export const AdminLayout = () => {
  const location = useLocation();
  const tabValue = nav.findIndex(({ to, end }) => end ? location.pathname === to : location.pathname.startsWith(to));
  return (
    <Container sx={{ marginTop: 2 }}>
      <Tabs value={tabValue >= 0 ? tabValue : false} sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        {nav.map(({ to, end, label }) => (
          <Tab
            key={to}
            component={NavLink}
            to={to}
            end={end}
            label={label}
            sx={{ textTransform: "none" }}
          />
        ))}
      </Tabs>
      <Box sx={{ py: 2 }}>
        <Outlet />
      </Box>
    </Container>
  );
};
