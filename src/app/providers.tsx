import { MantineProvider, createTheme, MantineColorsTuple } from '@mantine/core';
import { PropsWithChildren } from 'react';

const primaryColor: MantineColorsTuple = [
  '#e6fff0',
  '#d3fae1',
  '#a8f3c3',
  '#79eca2',
  '#53e686',
  '#3ae374',
  '#2be16b',
  '#1cc759',
  '#0db14d',
  '#00993f'
];

const theme = createTheme({
  fontFamily: 'Nunito, sans-serif',
  colors: {
    'primary': primaryColor
  },
  primaryColor: 'primary',

});

export default function Providers({ children }: PropsWithChildren) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      {children}
    </MantineProvider>
  );
}