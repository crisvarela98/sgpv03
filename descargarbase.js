const mongoose = require('mongoose');
const fs = require('fs');

// URI de conexión a MongoDB
const uri = "mongodb+srv://crisvarela98:8RhsLRfAy0UHpMlW@adminsgppanel.fwdca.mongodb.net/adminSGPpanel";

// Conectar a MongoDB
mongoose.connect(uri)
    .then(async () => {
        console.log('Conectado a MongoDB Atlas');

        // Definir el esquema (si es necesario) y la colección
        const schema = new mongoose.Schema({}, { strict: false }); // Esquema flexible
        const Coleccion1 = mongoose.model('clientes', schema, 'clientes'); // Reemplaza con el nombre de tu colección

        // Obtener todos los documentos
        const datos1 = await Coleccion1.find().lean();

        // Guardar los datos en un archivo JSON
        fs.writeFileSync('json/clientes.json', JSON.stringify(datos1, null, 2));

        const Coleccion2 = mongoose.model('pedidos', schema, 'pedidos'); // Reemplaza con el nombre de tu colección

        // Obtener todos los documentos
        const datos2 = await Coleccion2.find().lean();

        // Guardar los datos en un archivo JSON
        fs.writeFileSync('json/pedidos.json', JSON.stringify(datos2, null, 2));

        const Coleccion3 = mongoose.model('usuarios', schema, 'usuarios'); // Reemplaza con el nombre de tu colección

        // Obtener todos los documentos
        const datos3 = await Coleccion3.find().lean();

        // Guardar los datos en un archivo JSON
        fs.writeFileSync('json/usuarios.json', JSON.stringify(datos3, null, 2));

        const Coleccion4 = mongoose.model('productos', schema, 'productos'); // Reemplaza con el nombre de tu colección

        // Obtener todos los documentos
        const datos4 = await Coleccion4.find().lean();

        // Guardar los datos en un archivo JSON
        fs.writeFileSync('json/productos.json', JSON.stringify(datos4, null, 2));

        const Coleccion5 = mongoose.model('notas', schema, 'notas'); // Reemplaza con el nombre de tu colección

        // Obtener todos los documentos
        const datos5 = await Coleccion5.find().lean();

        // Guardar los datos en un archivo JSON
        fs.writeFileSync('json/notas.json', JSON.stringify(datos5, null, 2));

        // Cerrar la conexión
        mongoose.connection.close();
    })
    .catch((error) => {
        console.error('Error conectando a MongoDB:', error);
    });
