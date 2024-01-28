const display = document.querySelector(".visible-data");

const resComparison = (char, arrSimbols, i) => {
  let _res = null;

  switch (char) {
    case "*":
      _res = arrSimbols[i - 1] * arrSimbols[i + 1];
      break;

    case "/":
      _res = arrSimbols[i - 1] / arrSimbols[i + 1];
      break;

    case "+":
      _res = arrSimbols[i - 1] + arrSimbols[i + 1];
      break;

    case "-":
      _res = arrSimbols[i - 1] - arrSimbols[i + 1];
      break;
  }

  i -= 1;

  return _res;
};

const splitter = (input) => {
  input = input.split("");
  let _res = [];
  let _temp = [];

  for (let i = 0; i < input.length; i++) {
    if (
      input[i] === "*" ||
      input[i] === "/" ||
      input[i] === "+" ||
      input[i] === "-" ||
      input[i] === "(" ||
      input[i] === ")"
    ) {
      i !== 0 &&
        input[i - 1] !== "*" &&
        input[i - 1] !== "/" &&
        input[i - 1] !== "+" &&
        input[i - 1] !== "-" &&
        input[i - 1] !== "(" &&
        input[i - 1] !== ")" &&
        _res.push(Number(_temp.join("")));

      _res.push(input[i]);

      _temp = [];

      continue;
    }

    _temp.push(input[i]);
  }

  _temp.length && _res.push(Number(_temp.join("")));

  return _res;
};

const searchBreakets = (arrSimbols) => {
  let breakets = [];
  let key = 0;

  for (let i = 0; i < arrSimbols.length; i++) {
    if (arrSimbols[i] === "(") {
      breakets[key++] = [i];
    }

    if (arrSimbols[i] === ")") {
      for (let j = breakets.length - 1; j >= 0; j--) {
        if (breakets[j].length < 2) {
          breakets[j] = [...breakets[j], i];
          break;
        }
      }
    }
  }

  if (!breakets.every((_elem) => _elem.length > 1)) return false;

  return breakets.sort((min, max) => max[0] - min[0]);
};

const calculation = (arrSimbols) => {
  let round = 0;

  while (arrSimbols.length > 1) {
    for (let i = 0; i < arrSimbols.length; i++) {
      if (arrSimbols[i] === "*") {
        arrSimbols.splice(i - 1, 3, resComparison("*", arrSimbols, i));
      }

      if (arrSimbols[i] === "/") {
        arrSimbols.splice(i - 1, 3, resComparison("/", arrSimbols, i));
      }

      if (arrSimbols[i] === "+" && round > 0) {
        arrSimbols.splice(i - 1, 3, resComparison("+", arrSimbols, i));
      }

      if (arrSimbols[i] === "-" && round > 0) {
        arrSimbols.splice(i - 1, 3, resComparison("-", arrSimbols, i));
      }
    }

    ++round;
  }

  return arrSimbols;
};

const solve = () => {
  let input = display.textContent;

  let arrSimbols = splitter(input);

  let validStart = /^[\+\/\*\-\.]/;
  let validEnd = /[\+\/\*\-\.]$/;

  if (validStart.test(input) || validEnd.test(input))
    return "Вы ввели неккоректные данные";

  if ((input.match(/[()]/g) || []).length) {
    let breakets = searchBreakets(arrSimbols);

    if (!breakets) return "Вы ввели неккоректные данные";

    for (let i = 0; i < breakets.length; i++) {
      let [start, end] = breakets[i];

      let _temp = calculation(arrSimbols.slice(start + 1, end));

      arrSimbols.splice(start, end - start + 1, Number(_temp));
    }
  }

  return String(calculation(arrSimbols));
};

document.querySelectorAll(".button").forEach((elem) => {
  elem.addEventListener(
    "click",
    () => {
      let _temp = elem.dataset.value;

      switch (_temp) {
        case "del":
          let _arr = display.textContent.split("");
          display.innerHTML = _arr.splice(0, _arr.length - 1).join("");
          break;

        case "all-del":
          display.innerHTML = "";
          break;

        case "inp":
          display.innerHTML = solve();
          break;

        default:
          display.innerHTML += _temp;
          break;
      }
    },
    false
  );
});
