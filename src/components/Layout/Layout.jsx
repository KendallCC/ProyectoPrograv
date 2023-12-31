// eslint-disable-next-line no-unused-vars
import { React} from 'react'
import  Header  from './Header';
import {Footer} from './Footer';
import { Container } from '@mui/material';
import { CssBaseline, ThemeProvider } from '@mui/material';
import {appTheme} from '../../themes/theme'

// eslint-disable-next-line react/prop-types
export function Layout({children}){ 
    return(
        <ThemeProvider theme={appTheme}>
         <CssBaseline enableColorScheme />
            <Header/>
            <Container maxWidth='xl' style={{ paddingTop:'1rem', paddingBottom:'4.5rem'}}>
            {children}
            </Container>
            <Footer />
        </ThemeProvider>
    );
}