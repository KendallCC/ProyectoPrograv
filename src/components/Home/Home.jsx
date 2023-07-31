// eslint-disable-next-line no-unused-vars
import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Planes from "../Gimnasio/Planes";
import { Grid } from "@mui/material";
export function Home() {
  return (
    <>
      <Container sx={{ p: 2 }} maxWidth="lg">
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Tú Lugar Perfecto Para Entrenar
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="text.secondary"
          paragraph
        >
          Consulta todos nuestros planes para enterarte cual seria el perfecto
          para ti!!
        </Typography>
      </Container>

      <Grid container spacing={4}>
        <Grid item xs={6} md={3}>
          <Planes
            Plan={"Plan basico"}
            imagen={
              "https://media.revistagq.com/photos/5e4ecf6f7134d90008480182/16:9/pass/GettyImages-1054047712.jpg"
            }
            id={1}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <Planes
            Plan={"Plan Principiante"}
            imagen={
              "https://media.gq.com.mx/photos/627be914053326c8d35ba68e/16:9/w_2560%2Cc_limit/pesas-1369575706.jpg"
            }
            Descripcion={"Toca aqui para la descripcion basica del plan Principiante"}
            id={2}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <Planes
            Plan={"Plan Avanzado"}
            imagen={
              "https://img.freepik.com/fotos-premium/entrenando-pesas-mujer-entrenador-personal-ayudar-ejercicio-fisico-motivacion-gimnasio-salud-fuerte-atleta-femenina-entrenador-que-ayuda-entrenamiento-club_590464-106626.jpg"
            }
            Descripcion={"Toca aqui para la descripcion basica del Plan Avanzado"}
            id={3}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          <Planes
            Plan={"Plan Master"}
            imagen={
              "https://www.gymcompany.es/blog/wp-content/uploads/2020/08/dividir-entrenos.jpg"
            }
            Descripcion={"Toca aqui para la descripcion basica del Master"}
            id={4}
          />
        </Grid>
      </Grid>
    </>
  );
}
export default Home;
