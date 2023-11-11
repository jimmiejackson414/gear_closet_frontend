import { Maybe, Theme } from '@/generated/types';

export interface Option {
  text: string;
  value: Theme;
  colors: string[];
}

export const Blue6 = [
  '#0f6fc6',
  '#009dd9',
  '#0bd0d9',
  '#10cf9b',
  '#7cca62',
  '#a5c249',
];

export const BlueGreen6 = [
  '#3494ba',
  '#58b6c0',
  '#75bda7',
  '#7a8c8e',
  '#84acb6',
  '#2683c6',
];

export const Breeze6 = [
  '#2c7c9f',
  '#244a58',
  '#e2751d',
  '#ffb400',
  '#7eb606',
  '#c00000',
];

export const Celestial6 = [
  '#ac3ec1',
  '#477bd1',
  '#46b298',
  '#90ba4c',
  '#dd9d31',
  '#e25247',
];

export const Circuit6 = [
  '#9acd4c',
  '#faa93a',
  '#d35940',
  '#b258d3',
  '#63a0cc',
  '#8ac4a7',
];

export const Damask6 = [
  '#9ec544',
  '#50bea3',
  '#4a9ccc',
  '#9a66ca',
  '#c54f71',
  '#de9c3c',
];

export const Depth6 = [
  '#41aebd',
  '#97e9d5',
  '#a2cf49',
  '#608f3d',
  '#f4de3a',
  '#fcb11c',
];

export const Flow6 = [
  '#0f6fc6',
  '#009dd9',
  '#0bd0d9',
  '#10cf9b',
  '#7cca62',
  '#a5c249',
];

export const Forte6 = [
  '#c70f0c',
  '#dd6b0d',
  '#faa700',
  '#93e50d',
  '#17c7ba',
  '#0a96e4',
];

export const Genesis6 = [
  '#80b606',
  '#e29f1d',
  '#2397e2',
  '#35aca2',
  '#5430bb',
  '#8d34e0',
];

export const Grayscale6 = [
  '#dddddd',
  '#b2b2b2',
  '#969696',
  '#808080',
  '#5f5f5f',
  '#4d4d4d',
];

export const IonBoardroom6 = [
  '#b31166',
  '#e33d6f',
  '#e45f3c',
  '#e9943a',
  '#9b6bf2',
  '#d53dd0',
];

export const Kilter6 = [
  '#76c5ef',
  '#fea022',
  '#ff6700',
  '#70a525',
  '#a5d848',
  '#20768c',
];

export const Tableau10 = [
  '#4E79A7',
  '#F28E2B',
  '#E15759',
  '#76B7B2',
  '#59A14F',
  '#EDC948',
  '#B07AA1',
  '#FF9DA7',
  '#9C755F',
  '#BAB0AC',
];

export const ColorBlind10 = [
  '#1170aa',
  '#fc7d0b',
  '#a3acb9',
  '#57606c',
  '#5fa2ce',
  '#c85200',
  '#7b848f',
  '#a3cce9',
  '#ffbc79',
  '#c8d0d9',
];

export const JewelBright9 = [
  '#eb1e2c',
  '#fd6f30',
  '#f9a729',
  '#f9d23c',
  '#5fbb68',
  '#64cdcc',
  '#91dcea',
  '#a4a4d5',
  '#bbc9e5',
];

export const HueCircle19 = [
  '#1ba3c6',
  '#2cb5c0',
  '#30bcad',
  '#21B087',
  '#33a65c',
  '#57a337',
  '#a2b627',
  '#d5bb21',
  '#f8b620',
  '#f89217',
  '#f06719',
  '#e03426',
  '#f64971',
  '#fc719e',
  '#eb73b3',
  '#ce69be',
  '#a26dc2',
  '#7873c0',
  '#4f7cba',
];

export const findTheme = (theme: Maybe<string> | undefined): Array<string> => {
  switch (theme) {
    case Theme.Blue6:
      return Blue6;
    case Theme.Bluegreen6:
      return BlueGreen6;
    case Theme.Breeze6:
      return Breeze6;
    case Theme.Celestial6:
      return Celestial6;
    case Theme.Circuit6:
      return Circuit6;
    case Theme.Damask6:
      return Damask6;
    case Theme.Depth6:
      return Depth6;
    case Theme.Flow6:
      return Flow6;
    case Theme.Forte6:
      return Forte6;
    case Theme.Genesis6:
      return Genesis6;
    case Theme.Grayscale6:
      return Grayscale6;
    case Theme.Ionboardroom6:
      return IonBoardroom6;
    case Theme.Kilter6:
      return Kilter6;
    case Theme.Tableau10:
      return Tableau10;
    case Theme.Colorblind10:
      return ColorBlind10;
    case Theme.Jewelbright9:
      return JewelBright9;
    case Theme.Huecircle19:
      return HueCircle19;
    default:
      return Blue6;
  }
};

const generateThemeOptions = (): Array<Option> => {
  const office = [
    { text: Theme.Blue6, value: Theme.Blue6, colors: Blue6 },
    { text: Theme.Bluegreen6, value: Theme.Bluegreen6, colors: BlueGreen6 },
    { text: Theme.Breeze6, value: Theme.Breeze6, colors: Breeze6 },
    { text: Theme.Celestial6, value: Theme.Celestial6, colors: Celestial6 },
    { text: Theme.Circuit6, value: Theme.Circuit6, colors: Circuit6 },
    { text: Theme.Damask6, value: Theme.Damask6, colors: Damask6 },
    { text: Theme.Depth6, value: Theme.Depth6, colors: Depth6 },
    { text: Theme.Flow6, value: Theme.Flow6, colors: Flow6 },
    { text: Theme.Forte6, value: Theme.Forte6, colors: Forte6 },
    { text: Theme.Genesis6, value: Theme.Genesis6, colors: Genesis6 },
    { text: Theme.Ionboardroom6, value: Theme.Ionboardroom6, colors: IonBoardroom6 },
    { text: Theme.Kilter6, value: Theme.Kilter6, colors: Kilter6 },
  ];

  const tableau = [
    { text: Theme.Tableau10, value: Theme.Tableau10, colors: Tableau10 },
    { text: Theme.Colorblind10, value: Theme.Colorblind10, colors: ColorBlind10 },
    { text: Theme.Jewelbright9, value: Theme.Jewelbright9, colors: JewelBright9 },
    { text: Theme.Huecircle19, value: Theme.Huecircle19, colors: HueCircle19 },
  ];

  return [office, tableau].flat();
};

export default generateThemeOptions;
