const generateDaysOfWeekMatches = () => {
  const defaultValues = {
    mon: {
      values: ['segunda-feira', '2ª', 'seg.', '2a. feira'],
      matches: undefined,
    },
    tue: {
      values: ['terça-feira', '3ª', '3a. feira'],
      matches: undefined,
    },
    wed: {
      values: ['quarta-feira', '4ª', '4a. feira'],
      matches: undefined,
    },
    thu: {
      values: ['quinta-feira', '5ª', '5a. feira'],
      matches: undefined,
    },
    fri: {
      values: ['sexta-feira', '6ª', '6a. feira'],
      matches: undefined,
    },
    sat: {
      values: ['sabado', 'sábado'],
      matches: undefined,
    },
    sun: {
      values: ['domingo'],
      matches: undefined,
    },
  };

  Object.values(defaultValues).forEach((data) => {
    data.matches = new RegExp(data.values.join('|'));//.replace(/\./g, '\\.').replace(/\-/g, '\\-').replace(/\ª/g, '\\ª'));
  });

  return defaultValues;
};

export const DAYS_OF_WEEK_MATCHES = generateDaysOfWeekMatches();

let dowRegex = '';
Object.values(DAYS_OF_WEEK_MATCHES).forEach((dow) => {
  if (dowRegex) {
    dowRegex += '|';
  }
  dowRegex += dow.values.join('|')
})

export const REGEX_FROM_DOW_TO_DOW = new RegExp(`(${dowRegex}) (a|até) (${dowRegex})`);
