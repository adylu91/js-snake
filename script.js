document.addEventListener("DOMContentLoaded", (e) => {
  //stałe program
  const canvas = document.querySelector("#canvas");
  const ctx = canvas.getContext("2d");
  let direction = { actual: "RIGHT", toSet: "RIGHT" }; //actual/toSet zabezpiecznie przed tym żeby wąż przy szybki naciskaniu strzałek nie przechodził przez samego siebie
  let start = false;
  let arr = [
    { x: 180, y: 200 },
    { x: 200, y: 200 },
    { x: 220, y: 200 },
    { x: 240, y: 200 },
  ];
  let appleExist = false; //po to by jałbko nie generowało się co czas głównego interwału
  let applePosition = { x: -10, y: -10 }; //domyślnie na początku jabłko poza planszą
  let inter; //zmienna dla setInterval
  const startBtn = document.querySelector(".startBtn");
  let szachownica = [];
  //stałe do css
  const infoArrrow = document.querySelector(".arrow");
  infoArrrow.innerHTML = "ArrowRight";

  //obsługa strzałek
  document.addEventListener("keydown", (e) => {
    switch (e.key) {
      case "ArrowUp":
        if (direction.actual == "LEFT" || direction.actual == "RIGHT") {
          direction.toSet = "UP";
          infoArrrow.innerHTML = "ArrowUp";
        }
        break;
      case "ArrowDown":
        if (direction.actual == "LEFT" || direction.actual == "RIGHT") {
          direction.toSet = "DOWN";
          infoArrrow.innerHTML = "ArrowDown";
        }
        break;
      case "ArrowLeft":
        if (direction.actual == "UP" || direction.actual == "DOWN") {
          direction.toSet = "LEFT";
          infoArrrow.innerHTML = "ArrowLeft";
        }
        break;
      case "ArrowRight":
        if (direction.actual == "UP" || direction.actual == "DOWN") {
          direction.toSet = "RIGHT";
          infoArrrow.innerHTML = "ArrowRight";
        }
        break;
      default:
    }
  });

  //obsługa klinięć
  startBtn.addEventListener("click", (e) => {
    if (!start) {
      startGame();
      startBtn.innerHTML = "STOP";
      start = true;
    } else {
      stopGame();
      startBtn.innerHTML = "START";
      start = false;
    }
  });

  //rysowanie planszy
  function drawBoard() {
    // ctx.beginPath();
    // let i = 20;
    // while (i < 400) {
    //   ctx.moveTo(0, i);
    //   ctx.lineTo(400, i);
    //   i += 20;
    // }
    // i = 20;
    // while (i < 400) {
    //   ctx.moveTo(i, 0);
    //   ctx.lineTo(i, 400);
    //   i += 20;
    // }
    // ctx.stroke(); //po zakończeniu rysowania obrysowujemy linię

    ctx.fillStyle = "grey";
    let i = 0;
    while (i < 20) {
      let j = 0;
      while (j < 20) {
        if (i % 2 == 0) {
          if (j % 2 == 0) {
            ctx.fillStyle = "grey";
            ctx.fillRect(i * 20, j * 20, 20, 20);
            szachownica.push({ x: i * 20, y: j * 20, color: "grey" });
          } else {
            ctx.fillStyle = "white";
            ctx.fillRect(i * 20, j * 20, 20, 20);
            szachownica.push({ x: i * 20, y: j * 20, color: "white" });
          }
        } else {
          if (j % 2 != 0) {
            ctx.fillStyle = "grey";
            ctx.fillRect(i * 20, j * 20, 20, 20);
            szachownica.push({ x: i * 20, y: j * 20, color: "grey" });
          } else {
            ctx.fillStyle = "white";
            ctx.fillRect(i * 20, j * 20, 20, 20);
            szachownica.push({ x: i * 20, y: j * 20, color: "white" });
          }
        }
        j++;
      }
      i++;
    }

    // for (let i = 0; i < arr.length; i++) {
    //   ctx.fillRect(arr[i].x, arr[i].y, 20, 20);
    // }
  }
  //czyszczenie planszy
  function clearBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  //rysowanie węża
  function drawSnake() {
    ctx.fillStyle = "black";
    for (let i = 0; i < arr.length; i++) {
      ctx.fillRect(arr[i].x, arr[i].y, 20, 20);
    }
  }
  //poruszanie węża
  function moveSnake() {
    let tempItemArr;
    direction.actual = direction.toSet;
    switch (direction.actual) {
      case "LEFT":
        tempItemArr = arr.shift();
        tempItemArr.x = arr[arr.length - 1].x - 20;
        tempItemArr.y = arr[arr.length - 1].y;
        arr.push(tempItemArr);
        break;
      case "RIGHT":
        tempItemArr = arr.shift();
        tempItemArr.x = arr[arr.length - 1].x + 20;
        tempItemArr.y = arr[arr.length - 1].y;
        arr.push(tempItemArr);
        break;
      case "UP":
        tempItemArr = arr.shift();
        tempItemArr.y = arr[arr.length - 1].y - 20;
        tempItemArr.x = arr[arr.length - 1].x;
        arr.push(tempItemArr);
        break;
      case "DOWN":
        tempItemArr = arr.shift();
        tempItemArr.y = arr[arr.length - 1].y + 20;
        tempItemArr.x = arr[arr.length - 1].x;
        arr.push(tempItemArr);
        break;
      default:
    }
  }
  //tworzenie jabłka
  function makeAndDrawApple() {
    if (appleExist == false) {
      const x = Math.floor(Math.random() * 20);
      const y = Math.floor(Math.random() * 20);
      applePosition.x = x;
      applePosition.y = y;
      appleExist = true;
    }
    ctx.fillStyle = "red";
    ctx.fillRect(applePosition.x * 20 - 2, applePosition.y * 20 - 2, 24, 24);
  }
  //sprawdzanie warunków
  function checkConditions() {
    //zbieranie jabłka
    if (
      arr[arr.length - 1].x == applePosition.x * 20 &&
      arr[arr.length - 1].y == applePosition.y * 20
    ) {
      let tempItem = { ...arr[0] };
      arr.unshift(tempItem);
      appleExist = false;
    }
    //wyjście poza plansze, zmiana orientacji węża
    else if (arr[arr.length - 1].x >= 400) {
      szachownica = szachownica.filter((e) => {
        if (arr[arr.length - 2].x == e.x && arr[arr.length - 2].y == e.y) {
          return true;
        }
      });
      if (szachownica[0].color == "grey") {
        resetGame();
      } else {
        arr[arr.length - 1].x = arr[arr.length - 1].y;
        arr[arr.length - 1].y = 400;
        direction.toSet = "UP";
      }
    } else if (arr[arr.length - 1].x < 0) {
      szachownica = szachownica.filter((e) => {
        if (arr[arr.length - 2].x == e.x && arr[arr.length - 2].y == e.y) {
          return true;
        }
      });
      if (szachownica[0].color == "grey") {
        resetGame();
      } else {
        arr[arr.length - 1].x = arr[arr.length - 1].y;
        arr[arr.length - 1].y = -20;
        direction.toSet = "DOWN";
      }
    } else if (arr[arr.length - 1].y >= 400) {
      szachownica = szachownica.filter((e) => {
        if (arr[arr.length - 2].x == e.x && arr[arr.length - 2].y == e.y) {
          return true;
        }
      });
      if (szachownica[0].color == "grey") {
        resetGame();
      } else {
        arr[arr.length - 1].y = arr[arr.length - 1].x;
        arr[arr.length - 1].x = -20;
        direction.toSet = "RIGHT";
      }
    } else if (arr[arr.length - 1].y < 0) {
      szachownica = szachownica.filter((e) => {
        if (arr[arr.length - 2].x == e.x && arr[arr.length - 2].y == e.y) {
          return true;
        }
      });
      if (szachownica[0].color == "grey") {
        resetGame();
      } else {
        arr[arr.length - 1].y = arr[arr.length - 1].x;
        arr[arr.length - 1].x = 400;
        direction.toSet = "LEFT";
      }
    }
    //przecięcie węża, jeśli tak przegrana
    for (let i = 0; i < arr.length - 2; i++) {
      if (
        arr[arr.length - 1].x == arr[i].x &&
        arr[arr.length - 1].y == arr[i].y
      ) {
        resetGame();
      }
    }
  }

  function resetGame() {
    direction = { actual: "RIGHT", toSet: "RIGHT" };
    start = false;
    arr = [
      { x: 180, y: 200 },
      { x: 200, y: 200 },
      { x: 220, y: 200 },
      { x: 240, y: 200 },
    ];
    appleExist = false;
    applePosition = { x: -10, y: -10 };
    startBtn.innerHTML = "JESZCZE RAZ?";
    alert("PRZEGRANA");
    clearInterval(inter);
  }

  function startGame() {
    console.log(szachownica);
    inter = setInterval(() => {
      clearBoard();
      drawBoard();
      makeAndDrawApple();
      moveSnake();
      drawSnake();
      checkConditions();
      szachownica = [];
    }, 400);
  }

  function stopGame() {
    clearInterval(inter);
  }
});
