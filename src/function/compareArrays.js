const compareArrays = (arr1, arr2) => {
  const newArr = [];
  let newArr2 = arr2;
  arr1.forEach(elList1 => {
    newArr.push(elList1);
    newArr2 = newArr2.filter(elList2 => elList2.id !== elList1.id);
  });
  newArr2.forEach(elList => {
    newArr.push(elList);
  });
  return newArr;
};

export default compareArrays;
