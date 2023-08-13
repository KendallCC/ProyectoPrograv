import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Home from "./components/Home/Home";
import TablaPlanes from "./components/Gimnasio/TablaPlanes";
import { Layout } from "./components/Layout/Layout";
import TablaRutinas from "./components/Gimnasio/TablaRutinas";
import TablaActividades from "./components/Gimnasio/TablaActividades";
import { DetallePlan } from "./components/Gimnasio/DetallePlan";
import DetalleActividad from "./components/Gimnasio/DetalleActividad";
import ActividadesClientes from "./components/Gimnasio/ActividadesClientes";
import { DetalleRutina } from "./components/Gimnasio/DetalleRutina";
import PlanForm from "./components/Gimnasio/PlanForm";
import PlanUpdate from "./components/Gimnasio/PlanUpdate";
import { Toaster } from "react-hot-toast";
import EjercicioForm from "./components/Gimnasio/EjercicioForm";
import ActividadGrupalForm from "./components/Gimnasio/ActividadesForm";
import ActualizarActividadForm from "./components/Gimnasio/ActividadesUpdate";
import ServicioForm from "./components/Gimnasio/ServiciosForm";
import ServicioUpdate from "./components/Gimnasio/ServiciosUpdate";
import EjercicioUpdate from "./components/Gimnasio/EjercicioUpdate";
import RutinaForm from "./components/Gimnasio/RutinasForm";
import RutinaUpdateForm from "./components/Gimnasio/RutinasUpdate";
import { LoginForm } from "./components/Gimnasio/Login";
import ClienteForm from "./components/Gimnasio/ClienteForm";
import TablaEjercicios from "./components/Gimnasio/TablaEjercicios";
import EjercicioDetalle from "./components/Gimnasio/DetalleEjercicio";
import TablaServicios from "./components/Gimnasio/TablaServicios";
import DetalleServicio from "./components/Gimnasio/DetalleServicio";
import Miperfil from "./components/Gimnasio/MiPerfil";
import TablaClientes from "./components/Gimnasio/TablaClientes";
import DetallePerfilCliente from "./components/Gimnasio/DetalleCliente";
import ActividadesInscritas from "./components/Gimnasio/ListaActividadesCliente";
import TablaActividadesReservadas from "./components/Gimnasio/TablaActividadesReservadas";
import DetalleActividadReservada from "./components/Gimnasio/DetalleActividadReservada";
import TablaHistorialRutinas from "./components/Gimnasio/TablaHistorialRutina";
import DetalleReservaCliente from "./components/Gimnasio/DetalleRutinaReservada";
import ActualizarReservaRutina from "./components/Gimnasio/ActualizarReservaRutina";
import ReservarRutina from "./components/Gimnasio/ClienteRutina";
import RutinasAsignadas from "./components/Gimnasio/DetalleRutinasClientes";

import { Login } from "./components/User/Login";
import { Logout } from "./components/User/Logout";
import { Unauthorized } from "./components/User/Unauthorized";
import UserProvider from "./components/User/UserProvider";
import { Auth } from "./components/User/Auth";
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },

  {
    path: "/",
    element: <Auth allowedRoles={["Administrador"]}></Auth>,
    children: [
      //Empieza Clientes
      {
        path: "/listaClientes",
        element: <TablaClientes />,
      },

      {
        path: "/Cliente/detalle/:id",
        element: <DetallePerfilCliente />,
      },
      //Empieza Servicios
      {
        path: "/ListaServicios",
        element: <TablaServicios />,
      },
      {
        path: "/Servicios/Crear",
        element: <ServicioForm />,
      },
      {
        path: "/Servicios/Actualizar/:id",
        element: <ServicioUpdate />,
      },
      //termina Servicios

      //Inicia Planes
      {
        path: "/listaPlanes",
        element: <TablaPlanes />,
      },
      {
        path: "/Plan/CrearPlan",
        element: <PlanForm />,
      },
      {
        path: "/Plan/ActualizarPlan/:id",
        element: <PlanUpdate />,
      },
      //Termina Plan
      //Inicia Ejercicio
      {
        path: "/ListaEjercicios",
        element: <TablaEjercicios />,
      },
      {
        path: "/Ejercicio/Crear",
        element: <EjercicioForm />,
      },
      {
        path: "/Ejercicio/Actualizar/:id",
        element: <EjercicioUpdate />,
      },
      //Termina Ejercicio

      //empieza Actividades Reservadas
      {
        path: "/ListaActividadesReservadas",
        element: <TablaActividadesReservadas />,
      },
      {
        path: "/Actividad/reservada/:id",
        element: <DetalleActividadReservada />,
      },
      //empieza HistorialRutinas
      {
        path: "/Rutina/reservadas",
        element: <TablaHistorialRutinas />,
      },

      {
        path: "/Rutina/DetalleHistorialCliente/:id",
        element: <DetalleReservaCliente />,
      },

      {
        path: "/Rutina/ActualizarHistorial/:Rutinaid",
        element: <ActualizarReservaRutina />,
      },
      {
        path: "/Rutina/reservar",
        element: <ReservarRutina />,
      },
    ],
  },

  {
    path: "/",
    element: <Auth allowedRoles={["Administrador", "Empleado"]} />,
    children: [
      //Empieza Actividades
      {
        path: "/listaActividades",
        element: <TablaActividades />,
      },
      {
        path: "/Actividades/Crear",
        element: <ActividadGrupalForm />,
      },
      {
        path: "/Actividades/Actualizar/:id",
        element: <ActualizarActividadForm />,
      },
      //Termina Actividades

      //Empieza Rutinas
      {
        path: "/listaRutinas",
        element: <TablaRutinas />,
      },
      {
        path: "/Rutina/Crear",
        element: <RutinaForm />,
      },
      {
        path: "/Rutina/Actualizar/:id",
        element: <RutinaUpdateForm />,
      },
    ],
  },

  {
    path: "/",
    element: <Auth allowedRoles={["Administrador", "Empleado", "Cliente"]} />,
    children: [
      {
        path: "/Usuario/Perfil",
        element: <Miperfil />,
      },
      {
        path: "/Usuario/ActividadesInscritas",
        element: <ActividadesInscritas />,
      },
      {
        path: "/Usuario/RutinasInscritas",
        element: <RutinasAsignadas />,
      },
      {
        path: "/DetalleRutina/:id",
        element: <DetalleRutina />,
      },
    ],
  },
  {
    path: "/user/logout",
    element: <Logout />,
  },
  {
    path: "/Unauthorized",
    element: <Unauthorized />,
  },

  {
    path: "/DetallePlan/:id",
    element: <DetallePlan />,
  },
  {
    path: "/DetalleActividades/:id",
    element: <DetalleActividad />,
  },
  {
    path: "/ActividadesClientes",
    element: <ActividadesClientes />,
  },

  ,
  {
    path: "/Login",
    element: <Login />,
  },
  {
    path: "/Registro",
    element: <ClienteForm />,
  },

  {
    path: "/Ejercicio/Detalle/:id",
    element: <EjercicioDetalle />,
  },
  {
    path: "/Servicio/Detalle/:id",
    element: <DetalleServicio />,
  },
  {
    path: "/Ejercicio/Detalle/:id",
    element: <EjercicioDetalle />,
  },
]);

function App() {
  return (
    <>
      <UserProvider>
        <Layout>
          <Toaster />
          <RouterProvider router={router} />
        </Layout>
      </UserProvider>
    </>
  );
}

export default App;
