document.addEventListener('DOMContentLoaded', function () {
    displayClients();

    // Manejar la apertura y cierre del modal para nuevo cliente
    const newClientModal = document.getElementById('new-client-modal');
    const newClientButton = document.querySelector('.new-client-button');
    const closeModalButton = document.querySelector('.close-button');

    newClientButton.addEventListener('click', function() {
        newClientModal.style.display = "block";
    });

    closeModalButton.addEventListener('click', function() {
        newClientModal.style.display = "none";
    });

    // Manejar la creación de un nuevo cliente
    document.getElementById('new-client-form').addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('client-name').value;
        const storeName = document.getElementById('store-name').value;
        const address = document.getElementById('address').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const locality = document.getElementById('locality').value;
        const zone = document.getElementById('zone').value;

        fetch('/Data/clients_data.json')
            .then(response => response.json())
            .then(clients => {
                const newClient = { id: generateClientId(), name, storeName, address, phone, email, locality, zone };
                clients.push(newClient);
                localStorage.setItem('clients', JSON.stringify(clients));
                displayClients();
                alert("Cliente cargado con éxito");
                document.getElementById('new-client-form').reset();
                newClientModal.style.display = "none"; // Cierra el modal
            })
            .catch(error => console.error('Error al cargar o guardar clientes:', error));
    });

    function generateClientId() {
        return 'ID-' + Math.random().toString(36).substr(2, 9);
    }

    function displayClients(filterText = '') {
        fetch('/Data/clients_data.json')
            .then(response => response.json())
            .then(clients => {
                const filteredClients = clients.filter(client =>
                    client.id.toLowerCase().includes(filterText.toLowerCase()) || 
                    client.name.toLowerCase().includes(filterText.toLowerCase()) || 
                    client.address.toLowerCase().includes(filterText.toLowerCase())
                );

                const clientList = document.getElementById('client-list');
                clientList.innerHTML = '';
                filteredClients.forEach(client => {
                    const listItem = document.createElement('li');
                    listItem.innerHTML = `
                        <div class="client-item">
                            <strong>${client.id}</strong>: ${client.name} - ${client.email} 
                            <br><small>${client.storeName}, ${client.address}, Tel: ${client.phone}</small>
                            <div class="client-actions">
                                <button class="edit-button">Editar</button>
                                <button class="delete-button">Eliminar</button>
                                <button class="history-button">Ver Historial</button>
                            </div>
                        </div>
                    `;

                    listItem.querySelector('.edit-button').onclick = () => editClient(client);
                    listItem.querySelector('.delete-button').onclick = () => deleteClient(client.id);
                    listItem.querySelector('.history-button').onclick = () => showOrderHistory(client);

                    clientList.appendChild(listItem);
                });
            })
            .catch(error => console.error('Error al cargar los clientes:', error));
    }

    function editClient(client) {
        const newClientModal = document.getElementById('new-client-modal');
        newClientModal.style.display = "block";

        document.getElementById('client-name').value = client.name;
        document.getElementById('store-name').value = client.storeName;
        document.getElementById('address').value = client.address;
        document.getElementById('phone').value = client.phone;
        document.getElementById('email').value = client.email;
        document.getElementById('locality').value = client.locality;
        document.getElementById('zone').value = client.zone;

        document.getElementById('new-client-form').onsubmit = function(event) {
            event.preventDefault();

            const updatedClient = {
                id: client.id,
                name: document.getElementById('client-name').value,
                storeName: document.getElementById('store-name').value,
                address: document.getElementById('address').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                locality: document.getElementById('locality').value,
                zone: document.getElementById('zone').value
            };

            fetch('/Data/clients_data.json')
                .then(response => response.json())
                .then(clients => {
                    const clientIndex = clients.findIndex(c => c.id === client.id);
                    clients[clientIndex] = updatedClient;
                    localStorage.setItem('clients', JSON.stringify(clients));
                    displayClients();
                    alert("Cliente actualizado con éxito");
                    newClientModal.style.display = "none"; // Cierra el modal
                })
                .catch(error => console.error('Error al actualizar el cliente:', error));
        };
    }

    function deleteClient(clientId) {
        if (confirm("¿Estás seguro de que deseas eliminar este cliente?")) {
            fetch('/Data/clients_data.json')
                .then(response => response.json())
                .then(clients => {
                    const updatedClients = clients.filter(client => client.id !== clientId);
                    localStorage.setItem('clients', JSON.stringify(updatedClients));
                    displayClients();
                    alert("Cliente eliminado con éxito");
                })
                .catch(error => console.error('Error al eliminar el cliente:', error));
        }
    }

    // Función para mostrar el historial de pedidos del cliente desde localStorage
    function showOrderHistory(client) {
        const historyModal = document.getElementById('history-modal');
        historyModal.style.display = "block";

        // Cargar pedidos desde localStorage
        let orders = JSON.parse(localStorage.getItem('orders')) || [];

        // Filtrar los pedidos del cliente actual
        const clientOrders = orders.filter(order => order.customer.id === client.id);

        // Dividir los pedidos en confirmados, guardados y pendientes
        const confirmedOrders = clientOrders.filter(order => order.status === 'confirmado');
        const savedOrders = clientOrders.filter(order => order.status === 'guardado');
        const pendingOrders = clientOrders.filter(order => order.status === 'pendiente');

        // Actualizar el contenido del historial
        const orderHistoryList = document.getElementById('order-history-list');
        orderHistoryList.innerHTML = `
            <div class="order-section">
                <h3>Confirmados</h3>
                <ul>${confirmedOrders.map(order => `<li>Pedido ${order.id} - Fecha: ${order.date} - Monto: ${order.total}</li>`).join('')}</ul>
            </div>
            <div class="order-section">
                <h3>Guardados</h3>
                <ul>${savedOrders.map(order => `<li>Pedido ${order.id} - Fecha: ${order.date} - Monto: ${order.total}</li>`).join('')}</ul>
            </div>
            <div class="order-section">
                <h3>Pendientes</h3>
                <ul>${pendingOrders.map(order => `<li>Pedido ${order.id} - Fecha: ${order.date} - Monto: ${order.total}</li>`).join('')}</ul>
            </div>
            <button class="go-to-orders-button">Ver todos los pedidos</button>
        `;

        document.querySelector('.go-to-orders-button').onclick = () => {
            window.location.href = '/views/order_list.html';
        };
    }

    // Cerrar el modal de historial
    document.querySelector('.close-history-button').addEventListener('click', function() {
        const historyModal = document.getElementById('history-modal');
        historyModal.style.display = "none";
    });

    // Filtrar clientes al escribir en el buscador
    document.getElementById('search-input').addEventListener('input', function() {
        displayClients(this.value);
    });
});
