





var socket = io.connect('http://localhost');
socket.on('instruments available', function (data) {
	console.log(data);
	//socket.emit('my other event', { my: 'data' });
});