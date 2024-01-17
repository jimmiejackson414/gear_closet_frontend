const value = [
  'background2',
  'background3',
  'background4',
  'background6',
  'background10',
  'background13',
];

const logoColor = (image: any): string => {
  const test = image.publicID.split('/')[2];
  if (value.some(v => test.includes(v))) {
    return '#4a4a4a';
  }
  return '#fff';
};

export default logoColor;
