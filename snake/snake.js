function Snake(canvas, options, drawFrameCallback){
	if (!canvas) {
		console.log('Snake: canvas not found');
		return;
	}
	let snake = this;
	options = options || {};
	setDefaultOptions();
	snake.canvas = canvas;
	snake.options = options;
	snake.drawFrameCallback = drawFrameCallback;
	snake.ctx = canvas.getContext('2d');
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	snake.centerX = 0;
	snake.centerY = 0;
	snake.mouseX = snake.canvas.width / 2;
	snake.mouseY = snake.canvas.height / 2;
	snake.refresh = methodRefresh;
	snake.drawFrame = methodDrawFrame;
	snake.timer = Date.now();
	snake.tail = [];
	snake.tailSize = 32;
	
	setPause();
	
	setInterval(tailCalculate, 50);
	
	snake.canvas.addEventListener('click', function(){
		setPlay();
	});
	snake.canvas.addEventListener('mouseleave', function(){
		snake.mouseX = snake.canvas.width / 2;
		snake.mouseY = snake.canvas.height / 2;
	});
	snake.canvas.addEventListener('mousemove', function(e){
		snake.mouseX = e.layerX;
		snake.mouseY = e.layerY;
	});
	window.addEventListener('keypress', function(e){
		if (e.keyCode === 27) setPause();
	});
	window.addEventListener('blur', function(e){
		setPause();
	});

	snake.drawFrame();

	function setDefaultOptions(){
		options.gridSize = options.gridSize || 10;
		options.gridColor = options.gridColor || '#aaf';
		options.speed = options.speed || 100;
		options.funSpeed = options.funSpeed || 'line';
	}
	function methodRefresh(){
		snake.canvas.width = snake.canvas.clientWidth;
		snake.canvas.height = snake.canvas.clientHeight;
		snake.drawFrame();
	}
	function methodDrawFrame(){
		let t = Date.now();
		snake.deltaTime = t - snake.timer;
		snake.timer = t;
		snake.ctx.clearRect(0, 0, snake.canvas.width, snake.canvas.height);
		calcCenter();
		drawGrid();
		drawSnake();
		drawPause();
		if (snake.drawFrameCallback) snake.drawFrameCallback(snake);
		if (!snake.pause) requestAnimationFrame(snake.drawFrame);
	}
	
	
	
	function setPlay(){
		if (!snake.pause) return;
		snake.pause = false;
		snake.canvas.classList.remove('pause');
		snake.timer = Date.now();
		snake.drawFrame();
	}
	
	function setPause(){
		if (snake.pause) return;
		snake.pause = true;
		snake.canvas.classList.add('pause');
		snake.drawFrame();
	}
	
	
	function drawGrid(){
		snake.ctx.save();
		snake.ctx.beginPath();
		snake.ctx.strokeStyle = snake.options.gridColor;
		snake.ctx.lineWidth = 0.5;
		let gridSize = snake.options.gridSize;
		let w = snake.canvas.width;
		let h = snake.canvas.height;
		let x0 = snake.centerX - w / 2;
		let y0 = snake.centerY - h / 2;
		let x1 = x0 + w;
		let y1 = y0 + h;
		let rx, x = Math.round(x0 / gridSize) * gridSize;
		let ry, y = Math.round(y0 / gridSize) * gridSize;
		while (x <= x1) {
			rx = Math.round(x - x0);
			snake.ctx.moveTo(rx, 0);
			snake.ctx.lineTo(rx, h);
			x += gridSize;
		}
		while (y <= y1) {
			ry = y - y0;
			snake.ctx.moveTo(0, ry);
			snake.ctx.lineTo(w, ry);
			y += gridSize;
		}
		snake.ctx.stroke();
		snake.ctx.closePath();
		snake.ctx.restore();
	}
	
	function drawSnake(){
		let img = snake.options.snakeFace;
		if (!img) return;
		let w = img.naturalWidth;
		let h = img.naturalHeight;
		if (w === 0 || h === 0) return;
		let x, y;
		for (let i = 0; i < snake.tail.length; i++) {
			x = snake.canvas.width / 2 - snake.centerX + snake.tail[i].x;
			y = snake.canvas.height / 2 - snake.centerY + snake.tail[i].y;
			snake.ctx.drawImage(img, x - w / 2, y - h / 2);
		}
		snake.ctx.drawImage(img, (snake.canvas.width - w) / 2, (snake.canvas.height - h) / 2);
	}
	
	function drawPause(){
		if (!snake.pause) return;
		snake.ctx.save();
		snake.ctx.beginPath();
		snake.ctx.textBaseline = "middle";
		snake.ctx.textAlign = "center";
		snake.ctx.font = "bold 120px Arial";
		snake.ctx.fillStyle = "red";
		snake.ctx.fillText("Пауза", snake.canvas.width / 2, snake.canvas.height / 2);
		snake.ctx.closePath();
		snake.ctx.restore();
	}
	
	function calcCenter(){
		let w = snake.canvas.width;
		let h = snake.canvas.height;
		let cx = w / 2;
		let cy = h / 2;
		dx = (snake.mouseX - cx) / cx;
		dy = (snake.mouseY - cy) / cy;
		if (snake.options.funSpeed === 'sqrt') {
			dx = Math.sqrt(Math.abs(dx)) * Math.sign(dx);
			dy = Math.sqrt(Math.abs(dy)) * Math.sign(dy)
		}
		if (snake.options.funSpeed === 'sqr') {
			dx = dx * dx * Math.sign(dx);
			dy = dy * dy * Math.sign(dy);
		}
		let deltaS = snake.options.speed * snake.deltaTime / 1000;
		snake.centerX += dx * deltaS;
		snake.centerY += dy * deltaS;
	}
	
	
	
	
	function tailCalculate(){
		if (snake.pause) return;
		snake.tail.push({ x: snake.centerX, y: snake.centerY });
		if (snake.tail.length > snake.tailSize) snake.tail.shift();
	}
	
	
	
}