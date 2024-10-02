const mergeArrays = (arr1, arr2) => (
  arr1.map(obj1 => {
    const obj2 = arr2.find((obj) => obj.project === obj1.project);
    return { ...obj1, ...obj2 };
  })
);

export { mergeArrays };