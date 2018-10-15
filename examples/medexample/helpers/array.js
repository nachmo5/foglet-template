const forEachAsync = async (array, callback) => {
  const promises = [];

  array.forEach((element, index) => {
    const promise = new Promise(async (resolve, reject) => {
      const result = await callback(element, index);
      resolve(result);
    });
    promises.push(promise);
  });

  return Promise.all(promises);
};
