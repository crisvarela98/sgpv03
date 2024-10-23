document.addEventListener('DOMContentLoaded', function () {
    const marcaContainer = document.getElementById('marcaContainer');

    // Cargar las marcas desde el archivo JSON
    fetch('/Data/ne036-xwjxv.json')
        .then(response => response.json())
        .then(data => {
            // Extraer marcas únicas
            const marcas = [...new Set(data.map(producto => producto.Marca))];

            // Crear un botón para cada marca
            marcas.forEach(marca => {
                
                
                const button = document.createElement('button');
                button.classList.add('marca-button');
                button.textContent = marca; 
                
                button.onclick = function () {
                    // Guardar la marca seleccionada en localStorage
                    localStorage.setItem('marcaSeleccionada', marca);
                    window.location.href = 'familias.html';
                };
                marcaContainer.appendChild(button);
            });
        })
        .catch(error => console.error('Error al cargar las marcas:', error));
});
