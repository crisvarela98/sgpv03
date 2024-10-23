document.addEventListener('DOMContentLoaded', function () {
    const zonaContainer = document.getElementById('zonaContainer');

    // Cargar las zonas desde el archivo JSON
    fetch('/Data/clients_data.json')
        .then(response => response.json())
        .then(data => {
            // Obtener todas las zonas únicas
            const zonas = [...new Set(data.map(cliente => cliente.zone))];
            
            // Crear un botón para cada zona
            zonas.forEach(zona => {
                const button = document.createElement('button');
                button.classList.add('zona-button');
                button.textContent = zona;
                button.onclick = function () {
                    // Guardar la zona seleccionada
                    localStorage.setItem('selectedZone', zona);
                    // Redirigir a la página de clientes con la zona seleccionada
                    window.location.href = `clientes.html?zone=${encodeURIComponent(zona)}`;
                };
                zonaContainer.appendChild(button);
            });
        })
        .catch(error => console.error('Error al cargar las zonas:', error));
});
