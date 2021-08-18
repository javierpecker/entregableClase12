const socket = io.connect();

socket.emit('askData');

function sendData(e) {
  //const input = document.getElementById('MyForm');
  const formData = {
      title: document.getElementById("title").value,
      price: document.getElementById("price").value,
      thumbnail: document.getElementById("thumbnail").value
  }
  console.log(formData);
  socket.emit('new-message', formData);
  return false;
}

function render(data) {
  var html = data
    .map(function (elem, index) {
      console.log(elem)
      return `<tr>
                <td>${elem.title}</td>
                <td>${elem.price}</td>
                <td><img style="width: 100px" src="${elem.thumbnail}"></img></td>
            </tr>`;
      })
      .join(' ');

  document.getElementById('lista').innerHTML = html;
}



socket.on('messages', function (data) {
  console.log('RECIBI MENSAJE');
  render(data);
});