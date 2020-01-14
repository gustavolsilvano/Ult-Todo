const dateHandler = (date, mode) => {
  const monthName = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  switch (mode) {
    case 'text':
      if (date.getFullYear() === new Date().getFullYear()) {
        if (date.getMonth() === new Date().getMonth()) {
          if (date.getDate() === new Date().getDate()) {
            return 'Hoje';
          } else if (date.getDate() === new Date().getDate() + 1) {
            return 'Amanhã';
          } else if (date.getDate() === new Date().getDate() - 1) {
            return 'Ontem';
          } else {
            return `${date.getDate()} de ${monthName[date.getMonth()]}`;
          }
        } else {
          return `${date.getDate()} de ${monthName[date.getMonth()]}`;
        }
      } else {
        return `${date.getDate()} de ${
          monthName[date.getMonth()]
        } de ${date.getFullYear()}`;
      }
    case 'full':
      return date;
    default:
      break;
  }
};

export default dateHandler;
