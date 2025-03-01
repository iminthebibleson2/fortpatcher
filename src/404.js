var canvas = document.createElement('canvas');
var renderer = document.getElementById('renderer');
renderer.appendChild(canvas); 
var ctx = canvas.getContext('2d');

var transparentMode = true; 

function getTextColor() {
    return window.getComputedStyle(renderer).color; // Get text color from #renderer
}

function setBackgroundTransparent(isTransparent) {
    transparentMode = isTransparent;
}

function resizeCanvas() {
    canvas.width = renderer.clientWidth;
    canvas.height = renderer.clientHeight;
}
resizeCanvas(); // Set initial size

window.addEventListener('resize', resizeCanvas); // Update size on window resize

function random(min, max) {
    return Math.random() * (max - min + 1) + min;
}

function range_map(value, in_min, in_max, out_min, out_max) {
    return (value - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}

var word_arr = [];
var txt_min_size = 5;
var txt_max_size = 25;
var keypress = false;
var acclerate = 2;

for (var i = 0; i < 25; i++) {
    word_arr.push({ x: random(0, canvas.width), y: random(0, canvas.height), text: '404', size: random(txt_min_size, txt_max_size) });
    word_arr.push({ x: random(0, canvas.width), y: random(0, canvas.height), text: 'page', size: random(txt_min_size, txt_max_size) });
    word_arr.push({ x: random(0, canvas.width), y: random(0, canvas.height), text: 'not found', size: random(txt_min_size, txt_max_size) });
    word_arr.push({ x: random(0, canvas.width), y: random(0, canvas.height), text: '404', size: Math.floor(random(txt_min_size, txt_max_size)) });
    word_arr.push({ x: random(0, canvas.width), y: random(0, canvas.height), text: 'imagine', size: Math.floor(random(txt_min_size, txt_max_size)) });
    word_arr.push({ x: random(0, canvas.width), y: random(0, canvas.height), text: 'Where fortnite at?!', size: Math.floor(random(txt_min_size, txt_max_size)) });

}

function render() {
    if (transparentMode) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear for full transparency
    } else {
        ctx.fillStyle = "rgba(0,0,0,0.8)"; // Default dark background
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    ctx.fillStyle = getTextColor();
    for (var i = 0; i < word_arr.length; i++) {
        ctx.font = word_arr[i].size + "px sans-serif";
        var w = ctx.measureText(word_arr[i].text);
        ctx.fillText(word_arr[i].text, word_arr[i].x, word_arr[i].y);

        if (keypress) {
            word_arr[i].x += range_map(word_arr[i].size, txt_min_size, txt_max_size, 2, 4) * acclerate;
        } else {
            word_arr[i].x += range_map(word_arr[i].size, txt_min_size, txt_max_size, 2, 3);
        }

        if (word_arr[i].x >= canvas.width) {
            word_arr[i].x = -w.width * 2;
            word_arr[i].y = random(0, canvas.height);
            word_arr[i].size = Math.floor(random(txt_min_size, txt_max_size));
        }
    }

    ctx.fill();
    requestAnimationFrame(render);
}

render();

window.addEventListener('keydown', function () { keypress = true; }, true);
window.addEventListener('keyup', function () { keypress = false; }, true);

// Example: Toggle transparency
// setBackgroundTransparent(true); // Makes canvas fully transparent
// setBackgroundTransparent(false); // Uses default background
