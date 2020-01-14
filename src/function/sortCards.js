const sortCards = listToSort => {
  for (let data of listToSort) {
    data.itens.sort(compare);
  }
  return listToSort.sort(compare);
};

const compare = (a, b) => {
  let dateA = null;
  let dateB = null;

  if ('dateFull' in a && 'dateFull' in b) {
    dateA = a.dateFull ? a.dateFull.getTime() : 0;
    dateB = b.dateFull ? b.dateFull.getTime() : 0;
  } else if ('timeFull' in a && 'timeFull' in b) {
    dateA = a.timeFull ? a.timeFull.getTime() : 0;
    dateB = b.timeFull ? b.timeFull.getTime() : 0;
  }

  return dateA - dateB;
};

export default sortCards;
