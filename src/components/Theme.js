import { createTheme } from '@material-ui/core/styles';
import { deepPurple } from '@material-ui/core/colors';

export const Theme = createTheme({
    palette:{
        primary: {
          main: 'rgb(142, 36, 170)',
          light:'rgb(142, 36, 170, 0.2)',
        },
        mode:'dark',
        secondary: {
          main: '#ffa726',
        },
      },
    typography: {
        fontFamily: 'Jost',
        fontWeightLight:200,
        fontWeightRegular:200,
        fontWeightMedium:400,
        fontWeightBold:600,
        fontSize:18,
        button: {
            textTransform: 'none'
          }


    }
});