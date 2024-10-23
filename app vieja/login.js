document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const dict = [
        {name: 'Admin', pas: '1234'},
        {name: 'Cris', pas: '1234'},
        {name: 'Mike', pas: '1234'},
        {name: 'Marce', pas: '1234'},
        {name: 'Ivan', pas: '1234'}
    ]

    const usuvalid = dict.find(user => user.name === username && user.pas === password);
    if(!usuvalid){
        return alert('Usuario o contraseña incorrectos')
    }
    alert('Bienvenido ' + username)
    localStorage.setItem('usuario', username )
    window.location.href = 'main_menu.html'; 

    });

