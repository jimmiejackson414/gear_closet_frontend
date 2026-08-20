const DARK_LOGO_BACKGROUNDS = [
  'background2',
  'background3',
  'background4',
  'background6',
  'background10',
  'background13',
];

const logoColor = (publicId: string): string => {
  const backgroundName = publicId.split('/')
    .at(-1) ?? publicId;
  if (DARK_LOGO_BACKGROUNDS.some(name => backgroundName.includes(name))) {
    return '#4a4a4a';
  }
  return '#fff';
};

export default logoColor;
