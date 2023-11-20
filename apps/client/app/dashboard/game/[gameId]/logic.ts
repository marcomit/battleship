export function generateRandomTable(
  length: number,
  isMyTable: boolean
): number[][] {
  const table: number[][] = [];
  for (var i = 0; i < length; i++) {
    const row: number[] = [];
    for (var j = 0; j < length; j++) {
      row.push(0);
    }
    table.push(row);
  }
  if (isMyTable) {
    generateShip(2, length, table);
    generateShip(2, length, table);
    generateShip(2, length, table);
    generateShip(3, length, table);
    generateShip(3, length, table);
    generateShip(4, length, table);
  }
  return table;
}

export function generateShip(
  shipLength: number,
  length: number,
  table: number[][]
) {
  var row, col;
  var placed = false;

  // verticale
  if (Math.round(Math.random()) === 0) {
    do {
      placed = true;
      row = Math.floor(Math.random() * (length - shipLength));
      col = Math.floor(Math.random() * length);
      if (row > 0) if (table[row - 1][col] === 1) placed = false;
      if (row + shipLength < length)
        if (table[row + shipLength][col]) placed = false;
      for (let i = 0; i < shipLength && placed; i++) {
        if (table[i + row][col] === 1) placed = false;
        if (col > 0) if (table[i + row][col - 1] === 1) placed = false;
        if (col + 1 < length) if (table[i + row][col + 1]) placed = false;
      }
    } while (!placed);
    for (let i = 0; i < shipLength; i++) table[row + i][col] = 1;
  }
  //orizzontale
  else {
    do {
      placed = true;
      row = Math.floor(Math.random() * length);
      col = Math.floor(Math.random() * (length - shipLength));

      if (col > 0) {
        if (table[row][col - 1] === 1) {
          placed = false;
        }
      }
      if (col + shipLength + 1 < length && placed) {
        if (table[row][col + shipLength] === 1) {
          placed = false;
        }
      }
      for (let i = 0; i < shipLength && placed; i++) {
        if (table[row][col + i] === 1) placed = false;
        if (row > 0) if (table[row - 1][col + i] === 1) placed = false;
        if (row < length - 1) if (table[row + 1][col + i] === 1) placed = false;
      }
    } while (!placed);
    for (let i = 0; i < shipLength; i++) table[row][col + i] = 1;
  }
}

export function discoverTable(tableNum: number[][], tableEl: HTMLTableElement) {
  const tds = tableEl.querySelectorAll("tr td");
  for (let i = 0; i < tableNum.length; i++)
    for (let j = 0; j < tableNum[i].length; j++)
      tds[i * tableNum.length + j].className =
        tableNum[i][j] === 1 ? "ship" : "water";
}
