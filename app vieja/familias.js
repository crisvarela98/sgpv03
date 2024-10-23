document.addEventListener('DOMContentLoaded', function () {
    const familiaContainer = document.getElementById('familiaContainer');
    const selectedMarca = localStorage.getItem('marcaSeleccionada');

    if (!selectedMarca) {
        alert('Por favor selecciona primero una marca.');
        window.location.href = 'marcas.html'; // Redirige si no hay una marca seleccionada
        return;
    }

    // Cargar los productos desde el archivo JSON y filtrar por marca
    fetch('/Data/ne036-xwjxv.json')
        .then(response => response.json())
        .then(data => {
            // Filtrar familias por la marca seleccionada
            const familias = [...new Set(data.filter(producto => producto.Marca === selectedMarca).map(producto => producto.Familia1))];

            // Crear un botón para cada grupo de familia
            familias.forEach(familia => {
                const button = document.createElement('button');
                button.classList.add('familia-button');
                button.textContent = familia;
                button.onclick = function () {
                    // Guardar la familia seleccionada en localStorage
                    localStorage.setItem('familiaSeleccionada', familia);
                    window.location.href = 'productos.html';
                };
                familiaContainer.appendChild(button);
            });
        })
        .catch(error => console.error('Error al cargar las familias:', error));
});
