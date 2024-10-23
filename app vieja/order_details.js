document.addEventListener('DOMContentLoaded', function() {
    const orderDetails = document.getElementById('order-details');
    const totalPriceElement = document.getElementById('total-price');
    const customerInfoContainer = document.getElementById('customer-info');
    const saveOrderLink = document.getElementById('save-order-link');
    const confirmOrderLink = document.getElementById('confirm-order-link');

    // Cargar el carrito desde localStorage
    let cart = JSON.parse(localStorage.getItem('carrito')) || [];
    let orderId = localStorage.getItem('orderId') || '00000001';

    // Cargar la información del cliente desde localStorage
    let selectedClient = JSON.parse(localStorage.getItem('selectedClient')) || {};
    let selectedZone = localStorage.getItem('selectedZone') || '';

    // Mostrar la información del cliente
    displayCustomerInfo(selectedClient, selectedZone);

    function displayCustomerInfo(client, zone) {
        if (!client.name) {
            alert('Por favor, selecciona primero un cliente.');
            window.location.href = 'zona.html'; // Redirige si no hay un cliente seleccionado
            return;
        }

        customerInfoContainer.innerHTML = `
            <p><strong>Cliente:</strong> ${client.name} (${client.storeName})</p>
            <p><strong>Zona:</strong> ${zone}</p>
            <p><strong>Dirección:</strong> ${client.address}</p>
            <p><strong>Teléfono:</strong> ${client.phone}</p>
            <p><strong>Email:</strong> ${client.email}</p>
        `;
    }

    function displayOrder() {
        orderDetails.innerHTML = '';
        let subTotal = 0;

        // Crear la tabla
        const table = document.createElement('table');
        table.classList.add('order-table');

        // Crear el encabezado de la tabla
        const headerRow = document.createElement('tr');
        headerRow.innerHTML = `
            <th>Código</th>
            <th>Descripción</th>
            <th>Cantidad</th>
            <th>Descuento (%)</th>
            <th>Precio sin IVA</th>
            <th>Total sin IVA</th>
            <th>Acciones</th>
        `;
        table.appendChild(headerRow);

        if (Array.isArray(cart)) {
            cart.forEach((item, index) => {
                const nuevoPrecio = item.precioUnitario.toFixed(2)
                const totalWithoutIVA = nuevoPrecio * item.unidades;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.codigo}</td>
                    <td>${item.descripcion}</td>
                    <td><input type="number" class="quantity-input" value="${item.unidades}" min="1" data-index="${index}"></td>
                    <td>${parseFloat(item.descuento).toFixed(2)}</td>
                    <td>$${nuevoPrecio}</td>
                    <td>$${totalWithoutIVA.toFixed(2)}</td>
                    <td>
                        <button class="delete-item-button" data-index="${index}">Eliminar</button>
                    </td>
                `;
                table.appendChild(row);

                subTotal += totalWithoutIVA;
            });

            orderDetails.appendChild(table);

            const iva = subTotal * 0.21;
            const total = subTotal + iva;

            document.getElementById('subtotal').textContent = `$${subTotal.toFixed(2)}`;
            document.getElementById('iva').textContent = `$${iva.toFixed(2)}`;
            totalPriceElement.textContent = `$${total.toFixed(2)}`;

            // Manejar cambios en cantidad y descuento
            document.querySelectorAll('.quantity-input').forEach(input => {
                input.addEventListener('change', updateCart);
            });

            document.querySelectorAll('.discount-input').forEach(input => {
                input.addEventListener('change', updateCart);
            });

            // Manejar eliminación de productos
            document.querySelectorAll('.delete-item-button').forEach(button => {
                button.addEventListener('click', deleteCartItem);
            });
        } else {
            orderDetails.innerHTML = '<p>No hay productos en el carrito.</p>';
        }
    }

    function updateCart(event) {
        const index = event.target.dataset.index;
        const newValue = parseInt(event.target.value);

        if (event.target.classList.contains('quantity-input')) {
            cart[index].unidades = newValue;
        } else if (event.target.classList.contains('discount-input')) {
            cart[index].descuento = newValue;
        }

        localStorage.setItem('carrito', JSON.stringify(cart));
        displayOrder();  // Refresca la tabla con los valores actualizados
    }

    function deleteCartItem(event) {
        const index = event.target.dataset.index;
        cart.splice(index, 1);  // Elimina el producto del carrito
        localStorage.setItem('carrito', JSON.stringify(cart));
        displayOrder();  // Refresca la tabla
    }

    displayOrder();

    // Guardar el pedido
    saveOrderLink.addEventListener('click', function() {
        saveOrConfirmOrder('guardado');
    });

    // Confirmar el pedido
    confirmOrderLink.addEventListener('click', function() {
        saveOrConfirmOrder('confirmado');
    });

    function saveOrConfirmOrder(status) {
        const order = {
            id: orderId,
            customer: selectedClient,
            zone: selectedZone,
            date: new Date().toLocaleString(),
            status: status,
            cart: cart
        };

        // Incrementar el ID para el próximo pedido
        orderId = (parseInt(orderId) + 1).toString().padStart(8, '0');
        localStorage.setItem('orderId', orderId);

        // Guardar el pedido en localStorage
        let orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));

        alert(`Pedido ${status} con éxito.`);
        // Limpiar el carrito y la información del cliente
        localStorage.removeItem('carrito');
        localStorage.removeItem('selectedClient');
        localStorage.removeItem('selectedZone');
        window.location.href = 'orders_list.html';
    }
});

