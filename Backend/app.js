require('dotenv').config({ quiet: true });

const express = require('express');
const morgan = require('morgan');
const mysql = require('mysql2');
const cors = require('cors');
const myConnection = require('express-myconnection');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();

// CORS: se permite solo el frontend y con credenciales para que viaje la cookie del token
app.use(cors({
  origin: [
    'http://127.0.0.1:4200',
    'http://localhost:4200',
  ],
  credentials: true
}));

// rutas backend
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const roleRoutes = require('./routes/role');
const drawerRoutes = require('./routes/drawer');
const employeeRoutes = require('./routes/employee');
const customerRoutes = require('./routes/customer');
const productRoutes = require('./routes/product');
const supplierRoutes = require('./routes/supplier');
const orderRoutes = require('./routes/order');
const receiptRoutes = require('./routes/receipt');
const orderDetailRoutes = require('./routes/orderDetail');
const complaintRoutes = require('./routes/complaint');
const productSupplierRoutes = require('./routes/productSupplier');

app.set('port', process.env.PORT || 3000);

app.use(morgan('dev'));

app.use(myConnection(mysql, {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    dateStrings: true   // devuelve las fechas como 'YYYY-MM-DD'
}, 'single'));

app.use(express.urlencoded({ extended: false }));

// procesar peticiones en formato JSON
app.use(bodyParser.json());

// leer las cookies (token de sesión)
app.use(cookieParser());

// enlazar cada ruta con su tabla
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/roles', roleRoutes);
app.use('/api/drawers', drawerRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/suppliers', supplierRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/receipts', receiptRoutes);
app.use('/api/order-details', orderDetailRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/product-suppliers', productSupplierRoutes);

// iniciar el servidor
app.listen(app.get('port'), () => {
    console.log("PORT " + app.get('port'));
});
