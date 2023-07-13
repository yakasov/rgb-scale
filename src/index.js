async function loadColours() {
  var colourDict = {};
  const colours = await fetch("https://xkcd.com/color/rgb.txt")
    .then((response) => {
      return response.text();
    })
    .then((data) => {
      return data;
    });

  const splitColours = colours.split("\n");
  const colourList = splitColours
    .slice(1, splitColours.length - 2)
    .map((a) => a.split("#"));
  colourList.forEach(([n, h]) => {
    n = n.replace(/(\t\r|\t|\r)/gm, "");
    h = h.replace(/(\t\r|\t|\r)/gm, "");
    colourDict[`#${h}`] = n;
  });
  return colourDict;
}

function sortColours(cd) {
  var cdEntries = Object.entries(cd);
  var sortedColourDict = cdEntries
    .map(function (c, i) {
      return { colour: hexToHSL(c[0]), index: i };
    })
    .sort(function (c1, c2) {
      return c1.colour[0] - c2.colour[0];
    })
    .map(function (data) {
      return cdEntries[data.index];
    });
  return sortedColourDict;
}

function createDivs(cd) {
  const scaleEl = document.getElementById("scale");
  cd.forEach((c) => {
    var newDiv = document.createElement("div");
    newDiv.id = c[0];
    newDiv.style = `background: ${c[0]}`;
    newDiv.classList.add("colour");
    newDiv.onmouseover = () => {
      changeColour(c[0], c[1]);
    };
    scaleEl.appendChild(newDiv);
  });
}

function changeColour(h, n) {
  const background = document.getElementById("top-div");
  background.style = `background: ${h}; transition: background 0.1s linear;`;

  const colourName = document.getElementById("colourName");
  const colourHex = document.getElementById("colourHex");
  colourName.innerText = n;
  colourHex.innerText = h;
}

function hexToHSL(H) {
  var r = 0;
  var g = 0;
  var b = 0;
  if (H.length == 4) {
    r = "0x" + H[1] + H[1];
    g = "0x" + H[2] + H[2];
    b = "0x" + H[3] + H[3];
  } else if (H.length == 7) {
    r = "0x" + H[1] + H[2];
    g = "0x" + H[3] + H[4];
    b = "0x" + H[5] + H[6];
  }

  r /= 255;
  g /= 255;
  b /= 255;
  var cmin = Math.min(r, g, b);
  var cmax = Math.max(r, g, b);
  var delta = cmax - cmin;
  var h = 0;
  var s = 0;
  var l = 0;

  if (delta == 0) h = 0;
  else if (cmax == r) h = ((g - b) / delta) % 6;
  else if (cmax == g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;

  h = Math.round(h * 60);

  if (h < 0) h += 360;

  l = (cmax + cmin) / 2;
  s = delta == 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  s = +(s * 100).toFixed(1);
  l = +(l * 100).toFixed(1);

  return [h, s, l];
}

(async () => {
  const colourDict = await loadColours();
  const sortedColourDict = sortColours(colourDict);
  createDivs(sortedColourDict);
})();
