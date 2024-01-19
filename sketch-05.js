const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');

const settings = {
  dimensions: [ 1080, 1080 ]
};

let manager;

let text = 'G';
let fontSize = 1200;
let fontFamily = 'Comic Sans';
// let fontStyle = 'normal';
// let fontWeight = 'normal';

const typeCanvas = document.createElement('canvas');
const typeContext = typeCanvas.getContext('2d');

const sketch = ({ context, width, height }) => {
  const cell = 20;
  const cols = Math.floor(width / cell);
  const rows = Math.floor(height / cell);
  const numCells = cols * rows;

  typeCanvas.width = cols;
  typeCanvas.height = rows;

  return ({ context, width, height }) => {
    typeContext.fillStyle = 'black';
    typeContext.fillRect(0, 0, cols, rows);

    fontSize = cols * 1.2;

    typeContext.fillStyle = 'orange';
    // context.font = fontSize + 'px ' + fontFamily;
    typeContext.font = `${fontSize}px ${fontFamily}`;//best practice to use Template Literals
    typeContext.textBaseLine = 'top';
    // context.textAlign = 'center';
    
    
    const metrics = typeContext.measureText(text);
    const mx = metrics.actualBoundingBoxLeft * -1;
    const my = metrics.actualBoundingBoxAscent * -1;
    const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
    const mh = metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    const tx = (cols - mw) * 0.5 - mx;
    const ty = (rows - mh) * 0.5 - my;
    
    typeContext.save();
    typeContext.translate(tx, ty);
    
    typeContext.beginPath();
    typeContext.rect(mx, my, mw, mh);
    typeContext.stroke();
    
    typeContext.fillText(text, 0, 0);
    typeContext.restore();

    const typeData = typeContext.getImageData(0, 0, cols, rows).data;

    context.textBaseLine = 'middle'; //changes alignment for less accurate glyphs(newest)
    context.textAlign = 'center';
    
    context.fillStyle = 'black';  //Black background
    context.fillRect(0, 0, width, height);
    
    // context.drawImage(typeCanvas, 0, 0); //Little letter in top left corner

    for (let i = 0; i < numCells; i++) {
      const col = i % cols;
      const row = Math.floor(i / cols);

      const x = col * cell;
      const y = row * cell;

      const r = typeData[i * 4 + 0];
      const g = typeData[i * 4 + 1];
      const b = typeData[i * 4 + 2];
      const a = typeData[i * 4 + 3];

      const glyph = getGlyph(r);

      context.font = `${cell * 2}px ${fontFamily}`; //controls size of little glyphs
      if (Math.random() < 0.1) context.font = `${cell * 6}px ${fontFamily}`;// creates random chance for larger glyphs

      context.fillStyle = `rgb(${r}, ${g}, ${b})`; //`rgb(${r}, ${g}, ${b})`

      context.save();
      context.translate(x, y);
      context.translate(cell * 0.5, cell * 0.5); //needed for circles


      // context.fillRect(0, 0, cell, cell); fill area with squares

      // context.beginPath(); fill area will circles
      // context.arc(0, 0, cell * 0.5, 0, Math.PI * 2);
      // context.fill();

      context.fillText(glyph, 0, 0); //was text before glyph


      context.restore();
    }
  };
};

const getGlyph = (v) => {
  if (v < 50) return '';
  if (v < 100) return 'C';
  if (v < 150) return 'T';
  if (v < 200) return 'B';

  const glyphs = '_= /'.split('');

  return random.pick(glyphs); // was text before
}

const onKeyUp = (e) => {
  text = e.key.toUpperCase();//can remove toUpperCase and use lowercase
  manager.render();
}

// document.addEventListener('keyup', onKeyUp); //changes letter with key press

const start = async () => {
  manager = await canvasSketch(sketch, settings);
};

start();

// canvasSketch(sketch, settings); //Asynchronous Function




// const url = 'https://picsum.phots/200';

// const loadMeSomeImage = (url) => {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.onload = () => resolve(img);
//     img.onerror = () => reject();
//     img.src = url;
//   })
// }

// const start = async () => {
//   const img = await loadMeSomeImage(url);
//   console.log('image width', img.width);
//   console.log('this line');
// }

// const start = () => {
//   loadMeSomeImage(url).then(img => {
//     console.log('image width', img.width);//Asynchronous function
//   });
//   console.log('this line'); //Synchronous function
// }