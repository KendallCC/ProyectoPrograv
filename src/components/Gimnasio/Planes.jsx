import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
export default function Planes(props) {

const {Plan,imagen,Descripcion,id} = props

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardActionArea component='a' href={'/DetallePlan/'+id}>
        <CardMedia
          component="img"
          height="350"
          image={imagen}
          alt="Planes de Gimasio"
        />
        <CardContent sx={{textAlign:'center'}}>
          <Typography gutterBottom variant="h5" component="div" textAlign={'center'}>
            {Plan}
          </Typography>
          <InfoIcon/>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}