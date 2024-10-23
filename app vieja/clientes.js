document.addEventListener('DOMContentLoaded', function () {
    const clienteContainer = document.getElementById('clienteContainer');
    const urlParams = new URLSearchParams(window.location.search);
    const selectedZona = urlParams.get('zone');

    // Cargar los clientes desde el archivo JSON en la carpeta Data
    fetch('/Data/clients_data.json')
        .then(response => response.json())
        .then(clients => {
            // Filtrar los clientes por zona
            const clientesPorZona = clients.filter(cliente => cliente.zone === selectedZona);

            // Crear un botón para cada cliente
            clientesPorZona.forEach(cliente => {
                const button = document.createElement('button');
                button.classList.add('cliente-button');
                button.textContent = `${cliente.name} (${cliente.storeName})`;
                button.onclick = function () {
                    // Guardar la información del cliente seleccionado en localStorage
                    localStorage.setItem('selectedClient', JSON.stringify(cliente));
                    // Redirigir a la página de marcas con la zona y el cliente seleccionados
                    window.location.href = `marcas.html?zone=${encodeURIComponent(selectedZona)}&name=${encodeURIComponent(cliente.name)}`;
                };
                clienteContainer.appendChild(button);
            });
        })
        .catch(error => console.error('Error al cargar los clientes:', error));
});
