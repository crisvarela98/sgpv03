document.addEventListener('DOMContentLoaded', function() {
    function loadOrders() {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        displayOrders(orders);
    }

    function displayOrders(orders) {
        const orderList = document.getElementById('order-list');
        orderList.innerHTML = '';

        const filterStatus = document.getElementById('filter-status');
        const selectedStatus = filterStatus.value;

        // Filtrar pedidos según el estado seleccionado
        const filteredOrders = orders.filter(order => {
            return selectedStatus === 'todos' || order.status === selectedStatus;
        });

        if (filteredOrders.length === 0) {
            orderList.innerHTML = '<p>No hay pedidos en este estado.</p>';
            return;
        }

        filteredOrders.forEach(order => {
            const orderItem = document.createElement('div');
            orderItem.className = 'order-item';
            orderItem.innerHTML = `
                <div class="order-item-info">
                    <p><strong>ID:</strong> ${order.id}</p>
                    <p><strong>Cliente:</strong> ${order.customer.name}</p>
                    <p><strong>Fecha:</strong> ${order.date}</p>
                    <p><strong>Estado:</strong> ${order.status}</p>
                </div>
                <div class="order-item-actions">
                    <button class="view-button" data-id="${order.id}">Ver</button>
                    <button class="cancel-button" data-id="${order.id}">Cancelar</button>
                </div>
            `;
            orderList.appendChild(orderItem);
        });

        attachEventListenersToButtons();
    }

    function attachEventListenersToButtons() {
        document.querySelectorAll('.view-button').forEach(button => {
            button.addEventListener('click', function(event) {
                const orderId = event.target.dataset.id;
                viewOrderDetails(orderId);
            });
        });

        document.querySelectorAll('.cancel-button').forEach(button => {
            button.addEventListener('click', function(event) {
                const orderId = event.target.dataset.id;
                cancelOrder(orderId);
            });
        });
    }

    function viewOrderDetails(orderId) {
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        const order = orders.find(order => order.id === orderId);
        if (order) {
            showOrderModal(order);
        }
    }

    function showOrderModal(order) {
        const modal = document.getElementById('order-modal');
        const modalContent = document.getElementById('modal-order-details');

        function attachEventListenersToButtons() {
            document.querySelectorAll('.confirma-button').forEach(button => {
                button.addEventListener('click', function(event) {
                    const orderId = event.target.dataset.id;
                    confirmOrder(orderId);
                });
            });
            document.querySelectorAll('.save-button').forEach(button => {
                button.addEventListener('click', function(event) {
                    const orderId = event.target.dataset.id;
                    saveOrder(orderId);
                });
            });
        }
        
        function confirmOrder(orderId) {
            let orders = JSON.parse(localStorage.getItem('orders')) || [];
            const orderIndex = orders.findIndex(order => order.id === orderId);
            if (orderIndex !== -1) {
                orders[orderIndex].status = 'confirmado'; // O el estado que desees
                localStorage.setItem('orders', JSON.stringify(orders));
                loadOrders(); // Recargar los pedidos
            }
        }
        function saveOrder(orderId) {
            let orders = JSON.parse(localStorage.getItem('orders')) || [];
            const orderIndex = orders.findIndex(order => order.id === orderId);
            if (orderIndex !== -1) {
                orders[orderIndex].status = 'guardado'; // O el estado que desees
                localStorage.setItem('orders', JSON.stringify(orders));
                loadOrders(); // Recargar los pedidos
            }
        }

        

        modalContent.innerHTML = `
            <h2>Detalles del Pedido</h2>
            <p><strong>Estado:</strong> ${order.status}</p>
            <p><strong>ID:</strong> ${order.id}</p>
            <p><strong>Cliente:</strong> ${order.customer.name}</p>
            <p><strong>Teléfono:</strong> ${order.customer.phone}</p>
            <p><strong>Fecha:</strong> ${order.date}</p>
            <h3>Productos</h3>
            <table>
                <thead>
                    <tr>
                        <th>Código</th>
                        <th>Descripción</th>
                        <th>Cantidad</th>
                        <th>Precio sin IVA</th>
                        <th>Descuento</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.cart.map(item => `
                        <tr>
                            <td>${item.codigo}</td>
                            <td>${item.descripcion}</td>
                            <td>${item.unidades}</td>
                            <td>$${item.precioUnitario.toFixed(2)}</td>
                            <td>${item.descuento}%</td>
                            <td>$${item.precioUnitario.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="order-item-actions">
            <button class="confirma-button" data-id="${order.id}">Confirmar</button>
            <button class="save-button" data-id="${order.id}">Guardar</button>
            </div>
        `;
        modal.style.display = "flex";
        attachEventListenersToButtons();
    }

    function cancelOrder(orderId) {
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        const orderIndex = orders.findIndex(order => order.id === orderId);
        if (orderIndex !== -1) {
            orders[orderIndex].status = 'cancelado';
            localStorage.setItem('orders', JSON.stringify(orders));
            loadOrders(); // Recargar los pedidos
        }
    }


    const closeModalButton = document.querySelector('.close-button');
    closeModalButton.addEventListener('click', function() {
        const modal = document.getElementById('order-modal');
        modal.style.display = "none";
    });

    const filterStatus = document.getElementById('filter-status');
    filterStatus.addEventListener('change', loadOrders);

    loadOrders();
});
