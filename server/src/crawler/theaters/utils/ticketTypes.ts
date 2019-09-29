export const TICKET_TYPES = {
  normal: {
    description: 'Normal',
    matches: /normal|adulto/,
    excludes: /family/,
    discount: false,
  },
  family: {
    description: 'Familia',
    matches: /family/,
    excludes: undefined,
    discount: false,
  },
  ucicard: {
    description: 'Cartão UCICARD',
    matches: /ucicard/,
    excludes: undefined,
    discount: true,
  },
  tripass: {
    description: 'Cartão Tripass',
    matches: /tripass/,
    excludes: undefined,
    discount: true,
  },
  student: {
    description: 'Estudante',
    matches: /estudante|est\./,
    excludes: undefined,
    discount: true,
  },
  youngCard: {
    description: 'Cartão jovem',
    matches: /cartão jovem|cartao jovem|c\. jovem/,
    excludes: undefined,
    discount: true,
  },
  infant: {
    description: 'Crianças até aos 10 anos',
    matches: /10 anos/,
    excludes: /family/,
    discount: true,
  },
  child: {
    description: 'Crianças até aos 12 anos',
    matches: /12 anos|criança/,
    excludes: /10 anos|family/,
    discount: true,
  },
  senior: {
    description: 'Sénior',
    matches: /65 anos|senior|sénior|3ª idade/,
    excludes: undefined,
    discount: true,
  },
  '3d': {
    description: '3D',
    matches: /3d/,
    excludes: undefined,
    discount: false,
  },
  imax: {
    description: 'IMAX',
    matches: /imax/,
    excludes: undefined,
    discount: false,
  },
  vip: {
    description: 'VIP',
    matches: /vip/,
    excludes: undefined,
    discount: false,
  },
};
