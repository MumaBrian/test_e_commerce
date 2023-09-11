require('dotenv').config()
require('express-async-errors')

const express = require('express')
const app = express()
const notFoundMiddleware=require('./middleware/not-found')
const errorHandlerMiddleware = require('./middleware/error-handler')
const morgan=require('morgan')
const authRouter=require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const reviewRouter = require('./routes/reviewRoutes')
const productRouter = require('./routes/productRoutes')
const orderRouter = require('./routes/orderRoutes')
const cookieParser=require('cookie-parser')
const fileUpload=require('express-fileupload')
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize');

const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')

const swaggerDocument = YAML.load('./swagger.yaml')


const port = process.env.PORT || 3000

// database
const connectDB = require('./db/connect');

app.set('trust proxy', 1);
app.use(
    rateLimiter({
        windowMs: 15 * 60 * 1000,
        max: 60,
    })
);
app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());


//middleware
// app.use(morgan('tiny'))
app.use(express.json())
app.use(cookieParser(process.env.JWT_SECRET))
app.use(express.static('./public'))
app.use(fileUpload())


//Route

app.use('/auth',authRouter)
app.use('/users', userRouter)
app.use('/products', productRouter)
app.use('/reviews', reviewRouter)
app.use('/orders',orderRouter)

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


const start = async () => {
    try {
        await connectDB(process.env.MONGO_URL);

        app.listen(port,console.log(`server is listening on port ${port}`))
    } catch (error) {
        console.log(error)
    }
}
start();

console.log('E-Commerce API');
