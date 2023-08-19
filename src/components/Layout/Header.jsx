import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import AdbIcon from "@mui/icons-material/Adb";
import AccountCircle from "@mui/icons-material/AccountCircle";
import SportsGymnasticsIcon from "@mui/icons-material/SportsGymnastics";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import BadgeIcon from "@mui/icons-material/Badge";
import { UserContext } from "../../context/UserContext";
import { useState, useContext, useEffect } from "react";
import { MenuList } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
const pages = ["Planes", "Ejercicios", "Rutinas"];

function ResponsiveAppBar() {
  const { user, decodeToken, autorize } = useContext(UserContext);
  const [userData, setUserData] = useState(decodeToken());

  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const [anchorElPlan, setAnchorElPlan] = React.useState(null);
  const [anchorElActividad, setAnchorElActividad] = React.useState(null);
  const [anchorElRutina, setAnchorElRutina] = React.useState(null);

  const handleOpenMenuPlan = (event) => {
    setAnchorElPlan(event.currentTarget);
  };

  const handleOpenMenuActividad = (event) => {
    setAnchorElActividad(event.currentTarget);
  };

  const handleOpenMenuRutina = (event) => {
    setAnchorElRutina(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorElPlan(null);
    setAnchorElActividad(null);
    setAnchorElRutina(null);
  };

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setUserData(decodeToken());
  }, [decodeToken, user]);

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <SportsGymnasticsIcon
            sx={{ display: { xs: "none", md: "flex" }, mr: 1 }}
          />
          <IconButton
            variant="h6"
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 200,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
            Program Gym
          </IconButton>

          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
            >
              {user &&
                autorize({ allowedRoles: ["Administrador"] }) && [
                  <MenuItem
                    key="servicios"
                    component="a"
                    href="/ListaServicios"
                    onClick={handleCloseNavMenu}
                  >
                    <Typography textAlign="center">Servicios</Typography>
                  </MenuItem>,
                  <MenuItem
                    key="planes"
                    component="a"
                    href="/listaPlanes"
                    onClick={handleCloseNavMenu}
                  >
                    <Typography textAlign="center">Planes</Typography>
                  </MenuItem>,
                  <MenuItem
                    key="ejercicios"
                    component="a"
                    href="/ListaEjercicios"
                    onClick={handleCloseNavMenu}
                  >
                    <Typography textAlign="center">Ejercicios</Typography>
                  </MenuItem>,
                  <MenuItem
                    key="rutinas"
                    component="a"
                    href="/listaRutinas"
                    onClick={handleCloseNavMenu}
                  >
                    <Typography textAlign="center">Rutinas</Typography>
                  </MenuItem>,
                  <MenuItem
                    key="Clientes"
                    component="a"
                    href="/listaClientes"
                    onClick={handleCloseNavMenu}
                  >
                    <Typography textAlign="center">Clientes</Typography>
                  </MenuItem>,
                  <MenuItem
                    key="actividades"
                    component="a"
                    href="/listaActividades"
                    onClick={handleCloseNavMenu}
                  >
                    <Typography textAlign="center">Actividades</Typography>
                  </MenuItem>,
                  <MenuItem
                    key="ReservasRutinas"
                    component="a"
                    href="/Rutina/reservadas"
                    onClick={handleCloseNavMenu}
                  >
                    <Typography textAlign="center">
                      Historial de rutinas
                    </Typography>
                  </MenuItem>,
                ]}
              {user &&
                autorize({ allowedRoles: ["Adninistrador", "Empleado"] }) && [
                  <MenuItem
                    key="actividades"
                    component="a"
                    href="/listaActividades"
                    onClick={handleCloseNavMenu}
                  >
                    <Typography textAlign="center">Actividades</Typography>
                  </MenuItem>,
                ]}

              {user && autorize({ allowedRoles: ["Cliente"] }) && (
                <MenuItem
                  key="actividades-clientes"
                  component="a"
                  href="/ActividadesClientes"
                  onClick={handleCloseNavMenu}
                >
                  <Typography textAlign="center">
                    Actividades Disponibles
                  </Typography>
                </MenuItem>
              )}
              {!user && (
                <MenuItem
                  key="actividades-clientes"
                  component="a"
                  href="/Registro"
                  onClick={handleCloseNavMenu}
                >
                  <Typography textAlign="center">Registrarse</Typography>
                </MenuItem>
              )}
            </Menu>
          </Box>
          <AdbIcon sx={{ display: { xs: "flex", md: "none" }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: "flex", md: "none" },
              flexGrow: 1,
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".3rem",
              color: "inherit",
              textDecoration: "none",
            }}
          >
             Program Gym
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
            {user && autorize({ allowedRoles: ["Administrador"] }) && (
              <>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-cliente"
                  aria-haspopup="true"
                  onClick={handleOpenMenuPlan}
                  color="inherit"
                >
                  <AdminPanelSettingsIcon />
                </IconButton>

                <Menu
                  id="menu-cliente"
                  anchorEl={anchorElPlan}
                  open={Boolean(anchorElPlan)}
                  onClose={handleCloseMenu}
                >
                  <MenuItem
                    component="a"
                    href="/ListaServicios"
                    onClick={handleCloseMenu}
                  >
                    Servicios
                  </MenuItem>
                  <MenuItem
                    component="a"
                    href="/listaPlanes"
                    onClick={handleCloseMenu}
                  >
                    Planes
                  </MenuItem>
                  <MenuItem
                    component="a"
                    href="/ListaEjercicios"
                    onClick={handleCloseMenu}
                  >
                    Ejercicios
                  </MenuItem>
                  <MenuItem
                    component="a"
                    href="/listaRutinas"
                    onClick={handleCloseMenu}
                  >
                    Rutinas
                  </MenuItem>
                  <MenuItem
                    component="a"
                    href="/listaActividades"
                    onClick={handleCloseMenu}
                  >
                    Actividades
                  </MenuItem>
                  <MenuItem
                    component="a"
                    href="/listaClientes"
                    onClick={handleCloseMenu}
                  >
                    Clientes
                  </MenuItem>
                  <MenuItem
                    component="a"
                    href="/ListaActividadesReservadas"
                    onClick={handleCloseMenu}
                  >
                    Actividades Reservadas
                  </MenuItem>

                  <MenuItem
                    component="a"
                    href="/Rutina/reservadas"
                    onClick={handleCloseMenu}
                  >
                    Historial Rutinas
                  </MenuItem>

                  <MenuItem
                    component="a"
                    href="/Actividades/Grafico"
                    onClick={handleCloseMenu}
                  >
                    Reporte
                  </MenuItem>

                  <MenuItem
                    component="a"
                    href="/ListaPagos"
                    onClick={handleCloseMenu}
                  >
                    Pagos realizados
                  </MenuItem>
                </Menu>
              </>
            )}

            {user && autorize({ allowedRoles: ["Empleado"] }) && (
              <>
                <IconButton
                  size="large"
                  aria-label="account of current user"
                  aria-controls="menu-administrador"
                  aria-haspopup="true"
                  onClick={handleOpenMenuActividad}
                  color="inherit"
                >
                  <BadgeIcon />
                </IconButton>
                <Menu
                  id="menu-administrador"
                  anchorEl={anchorElActividad}
                  open={Boolean(anchorElActividad)}
                  onClose={handleCloseMenu}
                >
                  <MenuItem
                    component="a"
                    href="/listaActividades"
                    onClick={handleCloseMenu}
                  >
                    Actividades
                  </MenuItem>
                </Menu>
              </>
            )}

            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-empleado"
              aria-haspopup="true"
              onClick={handleOpenMenuRutina}
              color="inherit"
            >
              <AccountCircleIcon />
            </IconButton>
            {user && autorize({ allowedRoles: ["Empleado"] }) && (
              <Menu
                id="menu-empleado"
                anchorEl={anchorElRutina}
                open={Boolean(anchorElRutina)}
                onClose={handleCloseMenu}
              >
                <MenuItem
                  component="a"
                  href="/ActividadesClientes"
                  onClick={handleCloseMenu}
                >
                  Actividades Disponibles
                </MenuItem>
              </Menu>
            )}
            {user &&
              autorize({
                allowedRoles: ["Cliente", "Empleado", "Administrador"],
              }) && (
                <Menu
                  id="menu-Cliente"
                  anchorEl={anchorElRutina}
                  open={Boolean(anchorElRutina)}
                  onClose={handleCloseMenu}
                >
                  <MenuItem
                    component="a"
                    href="/ActividadesClientes"
                    onClick={handleCloseMenu}
                  >
                    Actividades Disponibles
                  </MenuItem>

                  <MenuItem
                    component="a"
                    href="/Usuario/RutinasInscritas"
                    onClick={handleCloseMenu}
                  >
                    Rutinas Asignadas
                  </MenuItem>
                </Menu>
              )}

            {!user && (
              <Menu
                id="menu-usuario"
                anchorEl={anchorElRutina}
                open={Boolean(anchorElRutina)}
                onClose={handleCloseMenu}
              >
                <MenuItem
                  component="a"
                  href="/Registro"
                  onClick={handleCloseMenu}
                >
                  Registrese
                </MenuItem>
              </Menu>
            )}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Más Opciones">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <AccountCircle />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "45px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {!userData && (
                <MenuList>
                  <MenuItem component="a" href="/Login">
                    <Typography textAlign="center">Login</Typography>
                  </MenuItem>
                  <MenuItem component="a" href="/Registro">
                    <Typography textAlign="center">Registrarse</Typography>
                  </MenuItem>
                </MenuList>
              )}
              {userData && (
                <MenuList>
                  <MenuItem component="a" href="/Usuario/Perfil">
                    Mi Perfil
                  </MenuItem>
                  <MenuItem component="a" href="/Usuario/ActividadesInscritas">
                    Mis Actividades
                  </MenuItem>
                  <MenuItem component="a" href="/Usuario/ActualizarPlan">
                    Mi plan
                  </MenuItem>
                  <MenuItem>
                    <Typography variant="subtitle1" gutterBottom>
                      {userData?.correo_electronico}
                    </Typography>
                  </MenuItem>
                  <MenuItem color="secondary" component="a" href="/user/logout">
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </MenuList>
              )}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
