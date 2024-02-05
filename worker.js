onmessage = function (e) {
    const { headerRow, dataToSort } = e.data;
  
    // Check if dataToSort is an array
    if (Array.isArray(dataToSort)) {
      sortArray(dataToSort);
      postMessage({ headerRow, sortedArray: dataToSort });
    } else {
      console.error('Data to sort is not an array.');
    }
  };
  
  function sortArray(array) {
    if (Array.isArray(array)) {
      array.sort((a, b) => {
        const locationA = (a[1] || '').toUpperCase();
        const locationB = (b[1] || '').toUpperCase();
        if (locationA < locationB) {
          return 1;
        } else if (locationA > locationB) {
          return -1;
        } else {
          return 0;
        }
      });
    } else {
      console.error('Array to sort is not an array.');
    }
  }