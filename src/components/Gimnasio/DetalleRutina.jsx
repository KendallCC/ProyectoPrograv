// import React from "react";
// import { useState, useEffect } from "react";
// import RutinasApi from "../../Services/RutinasApi";
// import { useParams } from "react-router-dom";
// import Loader from "../others/Loader";
// import { Grid, Card, CardMedia, CardContent, Typography } from "@mui/material";
// import { Margin } from "@mui/icons-material";

// export function DetalleRutina() {
  // // const [data, setData] = useState(null);
  // // const [error, setError] = useState("");
  // // const [loaded, setLoaded] = useState(false);

  // // //servicios
  // // const [servicios, setServicios] = useState([]);

  // // //del menu
  // // const [open, setOpen] = React.useState(true);
  // // const handleClick = () => {
  // //   setOpen(!open);
  // // };

//   const routeParams = useParams();

  // useEffect(() => {
  //   RutinasApi.getRutinaById(routeParams.id)
  //     .then((response) => {
  //       console.log(response.data.results);
  //       setData(response.data.results);
  //       setError(response.error);
  //       setLoaded(true);
  //       setServicios(response.data.results.servicios);
  //     })
  //     .catch((error) => {
  //       if (error instanceof SyntaxError) {
  //         console.log(error);
  //         throw new Error("Respuesta no válida del servidor");
  //       }
  //     });
  // }, [routeParams.id]);

//   return (
//     <>
//       {!loaded && <Loader />}
//       {data && (
//         <Grid container spacing={2}>
//           <Grid item xs={12} sx={{ textAlign: "center" }}>
//             <Typography variant="h2">{data.nombre}</Typography>
//             <Typography variant="h6">{data.tipo}</Typography>
//           </Grid>
//           {data.ejercicios.map((ejercicio) => (
//             <Grid
//               item
//               xs={12}
//               md={4}
//               key={ejercicio.id}
//               sx={{ textAlign: "center" }}
//             >
//               <Card>
//                 <CardContent>
//                   <Typography
//                     variant="h5"
//                     sx={{ marginBottom: "1rem", fontWeight: "bolder" }}
//                   >
//                     {ejercicio.nombre}{" "}
//                   </Typography>
//                   <Typography variant="body1" sx={{ fontWeight: "300" }}>
//                     {ejercicio.descripcion}
//                   </Typography>
//                   <Typography
//                     variant="body2"
//                     sx={{ fontWeight: "bolder", marginTop: "1rem" }}
//                   >
//                     Equipamiento: {ejercicio.equipamiento}
//                   </Typography>
//                 </CardContent>
//                 <CardMedia
//                   component="img"
//                   image={
//                     "data:image/jpeg;base64," +
//                     data.imagenes.find((img) => img.nombre === ejercicio.nombre)
//                       .imagen_ejercicio
//                   }
//                 />

//                 <Typography
//                   variant="h8"
//                   sx={{ fontWeight: "bolder", marginTop: "1rem" }}
//                 >
//                   Repeticiones: {ejercicio.repeticiones}
//                 </Typography>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>

//         // image="data:image/jpeg;base64,
//       )}
//     </>
//   );
// }
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Grid } from '@mui/material';
import RutinasApi from '../../Services/RutinasApi';
import Loader from "../others/Loader";

export function DetalleRutina() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [servicios, setServicios] = useState([]);
  const routeParams = useParams();

  useEffect(() => {
    RutinasApi.getRutinaById(routeParams.id)
      .then((response) => {
        console.log(response.data.results);
        setData(response.data.results);
        setError(response.error);
        setLoaded(true);
        setServicios(response.data.results.servicios);
      })
      .catch((error) => {
        if (error instanceof SyntaxError) {
          console.log(error);
          throw new Error("Respuesta no válida del servidor");
        }
      });
  }, [routeParams.id]);

  return (
    <>
      {loaded && !error && data && (
        <Grid container spacing={2}>
          <Grid item xs={12} sx={{ textAlign: "center" }}>
            <Typography variant="h2">{data.nombre}</Typography>
            <Typography variant="h6">{data.tipo}</Typography>
          </Grid>
          {data.ejercicios.map((ejercicio) => (
            <Grid item xs={12}  key={ejercicio.id}>
              <Card sx={{ width: '100%' }}>
                <CardContent>
                  <Typography
                    variant="h5"
                    sx={{ marginBottom: "1rem", fontWeight: "bolder", textAlign: "center"  }}
                  >
                    {ejercicio.nombre}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: "200" , textAlign: "center" }}>
                    {ejercicio.descripcion}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: "bolder", marginTop: "1rem" , textAlign: "center" }}
                  >
                    Equipamiento: {ejercicio.equipamiento}
                  </Typography>
                  <Typography
                    variant="h8"
                    sx={{ fontWeight: "bolder", marginTop: "1rem" , display:'flex',justifyContent:'center',alignItems:'center' }}
                  >
                    Repeticiones: {ejercicio.repeticiones}
                  </Typography>
                </CardContent>
                <div style={{ display: 'flex', flexDirection:'column',justifyContent: 'center', alignItems:'center'}}>
                  {data.imagenes.map((imagen) => {
                    if (imagen.nombre === ejercicio.nombre) {
                      return (
                        <CardMedia
                          key={imagen.imagen_ejercicio}
                          component="img"
                          src={`data:image/jpeg;base64,${imagen.imagen_ejercicio}`}
                          alt={ejercicio.nombre}
                          style={{ width: '300px', height: '150px', margin: '10px', border:'solid'}}
                        />
                      );
                    }
                    return null;
                  })}
                </div>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {error && <Typography>Error: {error}</Typography>}
      {!loaded && !error && <Loader />}
    </>
  );
}

