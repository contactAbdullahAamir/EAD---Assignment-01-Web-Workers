let dataArray;
let worker = new Worker('worker.js');
function loadCSV() {
    const filePath = 'full_data.csv'; // Hardcoded file path

    fetch(filePath)
        .then(response => response.text())
        .then(csvData => {
            dataArray = processData(csvData);
            console.log(dataArray);
        })
        .catch(error => console.error('Error loading CSV:', error));
}

function processData(csvData) {
    const lines = csvData.split('\n');
    const dataArray = [];

    lines.forEach(line => {
        const values = line.split(',');
        dataArray.push(values);
    });

    return dataArray;
}

function displayTable() {
    showTable(dataArray.slice(0, 11));
}

function showTable(array) {
    const tableContainer = document.getElementById('tableContainer');
    const existingTable = document.getElementById('table');

    // If an existing table exists, clear its contents
    if (existingTable) {
        while (existingTable.firstChild) {
            existingTable.removeChild(existingTable.firstChild);
        }
    } else {
        // If no existing table, create a new one
        const table = document.createElement('table');
        table.setAttribute('id', 'table'); // Set an id to the table for future reference
        table.setAttribute('class', 'table table-dark table-striped'); // Add desired classes

        // Create header row
        const headerRow = document.createElement('tr');

        // Create a th for row numbers
        const rowNumberTh = document.createElement('th');
        rowNumberTh.textContent = '#';
        rowNumberTh.style.width = '50px'; // Set a fixed width for the row number column
        headerRow.appendChild(rowNumberTh);

        array[0].forEach(value => {
            const th = document.createElement('th');
            th.textContent = value;
            // Set a fixed width for each column
            th.style.width = '150px'; // Adjust the width as needed
            headerRow.appendChild(th);
        });
        table.appendChild(headerRow);

        tableContainer.appendChild(table);
    }

    // Create data rows
    for (let i = 1; i < array.length; i++) {
        const dataRow = document.createElement('tr');

        // Create a cell for row number
        const rowNumberCell = document.createElement('td');
        rowNumberCell.textContent = i;
        rowNumberCell.style.width = '50px'; // Set a fixed width for the row number column
        dataRow.appendChild(rowNumberCell);

        array[i].forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            // Set a fixed width for each column
            td.style.width = '150px'; // Adjust the width as needed
            dataRow.appendChild(td);
        });

        existingTable.appendChild(dataRow);
    }
}

worker.onmessage = function (e) {
    const { headerRow, sortedArray } = e.data;
    const combinedArray = [headerRow, ...sortedArray];
    showTable(combinedArray.slice(0, 11));
    worker.terminate();
};

function sortData() {
    const headerRow = dataArray.slice(0, 1);
    const dataToSort = dataArray.slice(1);
    worker.postMessage({ headerRow, dataToSort });
}