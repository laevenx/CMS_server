const app = require('../app')
const request = require('supertest')
const { sequelize } = require('../models')
const { queryInterface } = sequelize
// const ProductController = require('../controllers/productController')
let categorynum;
let token;
const multer = require('multer')
const upload = multer({})


afterAll(done => {
    queryInterface.bulkDelete('Products')
        .then(() => {
            console.log('cleaned db')
        })
        .catch(err => {
            done(err)
        })
    queryInterface.bulkDelete('Categories')
        .then(() => {
            console.log('cleaned db')
            done()
        })
        .catch(err => {
            done(err)
        })
})

// beforeAll((done) => {

//     queryInterface.bulkInsert('Categories', [{
//         name: 'buah1',
//         createdAt: new Date(),
//         updatedAt: new Date()
//     }])
//     .then((data) => {
//         console.log('beforeAll process complete')
//         done()
//     })

//     queryInterface.bulkInsert('Products', [{
//         name : 'balll',
//         image_url: 'bb.jps',
//         price : 8000,
//         stock : 90,
//         CategoryId : 1,
//         createdAt: new Date(),
//         updatedAt: new Date()
//     }])
//         // .then(() => {
//         //     console.log('user created bolu!')
//         //     done()
//         // })
//         // .catch(err => {
//         //     done(err)
//         // })


// })


describe('POST /register then POST /login', () => {
    test('should return object with id, name,and email. status 201', (done) => {
        const userInput = {
            first_name: 'yusak',
            email: 'mail@mail.com',
            password: 'asdasd',
            roles: 'admin'
        }
        request(app)
            .post('/register')
            .send(userInput)
            .end((err, response) => {
                if (err) {
                    return done(err)
                } else {
                    // console.log(response.body)
                    return done()
                }
            })
    })
    test('should return object with token. status 200', (done) => {
        const userInput = {
            first_name: 'yusak',
            email: 'mail@mail.com',
            password: 'asdasd'
        }
        request(app)
            .post('/login')
            .send(userInput)
            .end((err, response) => {
                if (err) {
                    return done(err)
                } else {
                    token = response.body.token
                    // console.log(response.body)
                    return done()
                }
            })

    })
    describe('POST /category/add', () => {
        test('return object with id and name, status 201', (done) => {
            let newCategory = {
                name: 'test'
            }

            request(app)
                .post(`/category/add`)
                .set('token', token)
                // .query({'id':id})
                .send(newCategory)
                .end((err, response) => {
                    if (err) {
                        return done(err)
                    } else {
                        console.log(response.body)
                        categorynum = response.body.id
                        expect(response.status).toBe(201)
                        expect(response.body).toHaveProperty('id', expect.any(Number))
                        expect(response.body).toHaveProperty('name', newCategory.name)
                        return done()
                    }
                })
        })
    })
})



describe('test success /products', () => {
    let id;
    describe('GET /list', () => {
        test('should return objects status 200', (done) => {
            console.log(token)
            request(app)
                .get('/products/list')
                .set('token', token)
                // .send(userInput)
                .end((err, response) => {
                    if (err) {
                        return done(err)
                    } else {
                        // console.log(response.body)
                        expect(response.status).toBe(200)
                        // expect(response.body).toHaveProperty('first_name', expect.any(String))
                        // expect(response.body).toHaveProperty('last_name', expect.any(String))
                        // expect(response.body).toHaveProperty('id', expect.any(Number))
                        // expect(response.body).toHaveProperty('email', userInput.email)
                        // expect(response.body).not.toHaveProperty('password')
                        return done()
                    }
                })
        })
    })

    describe('POST /add', () => {
        test('should return objects with id,name,image_url,price and stock status 201', (done) => {

            // let newProduct = new FormData()
            // newProduct.append('name', 'buah')
            // newProduct.append('image_url', './sample.jpg')
            // newProduct.append('price', 8000)
            // newProduct.append('stock', 12)
            // newProduct.append('CategoryId', categorynum)
            let newProduct = {
                name : 'buah',
                price : '8000',
                stock : '12',
                image_url: 'https://i.imgur.com/94hF532.png',
                CategoryId : categorynum
            }
            request(app)
                .post('/products/add/test')
                .set('token', token)
                // .field('price', 8000)
                // .field('name', 'buah')
                // .field('stock', 12)
                // .field('CategoryId', categorynum)
                .send(newProduct)
                // .attach('image_url', './test/sample.jpg')
                .end((err, response) => {
                    if (err) {
                        return done(err)
                    } else {
                        console.log(response.body)
                        expect(response.status).toBe(201)
                        expect(response.body).toHaveProperty('name', expect.any(String))
                        expect(response.body).toHaveProperty('image_url', expect.any(String))
                        expect(response.body).toHaveProperty('price', expect.any(Number))
                        expect(response.body).toHaveProperty('stock', expect.any(Number))
                        expect(response.body).toHaveProperty('CategoryId', expect.any(Number))
                        id = response.body.id
                        return done()
                    }
                })
        })
    })

    describe('GET /:id', () => {
        test('should return objects with id,name,image_url,price and stock status 200', (done) => {

            request(app)

                .get(`/products/${id}`)
                .set('token', token)
                .query({ 'id': id })
                .end((err, response) => {
                    if (err) {
                        return done(err)
                    } else {
                        // console.log(response.body)
                        expect(response.status).toBe(200)
                        expect(response.body).toHaveProperty('name', expect.any(String))
                        expect(response.body).toHaveProperty('image_url', expect.any(String))
                        expect(response.body).toHaveProperty('price', expect.any(Number))
                        expect(response.body).toHaveProperty('stock', expect.any(Number))
                        expect(response.body).toHaveProperty('CategoryId', expect.any(Number))
                        return done()
                    }
                })
        })
    })

    describe('GET /search', () => {
        test('should return objects with id,name,image_url,price and stock status 200', (done) => {
            let test = 'buah'
            request(app)

                .post(`/products/search`)
                .set('token', token)
                .send({ 'name': test })
                .end((err, response) => {
                    if (err) {
                        return done(err)
                    } else {
                        // console.log(response.body)
                        expect(response.status).toBe(200)
                        expect(response.body).toHaveProperty('name', expect.any(String))
                        expect(response.body).toHaveProperty('image_url', expect.any(String))
                        expect(response.body).toHaveProperty('price', expect.any(Number))
                        expect(response.body).toHaveProperty('stock', expect.any(Number))
                        expect(response.body).toHaveProperty('CategoryId', expect.any(Number))
                        return done()
                    }
                })
        })
    })


    describe('PUT /edit', () => {
        test('should return objects with id,name,image_url,price and stock status 200', (done) => {
            let updateProduct = {
                name: 'buah1',
                image_url: 'pp.jpg',
                price: '8000',
                stock: '12',
                CategoryId: categorynum,
            }

            request(app)

                .put(`/products/edit/${id}`)
                .set('token', token)
                .query({ 'id': id })
                .send(updateProduct)
                .end((err, response) => {
                    if (err) {
                        return done(err)
                    } else {
                        // console.log(response.body)
                        expect(response.status).toBe(200)
                        expect(response.body).toHaveProperty('name', expect.any(String))
                        expect(response.body).toHaveProperty('image_url', expect.any(String))
                        expect(response.body).toHaveProperty('price', expect.any(Number))
                        expect(response.body).toHaveProperty('stock', expect.any(Number))
                        expect(response.body).toHaveProperty('CategoryId', expect.any(Number))
                        return done()
                    }
                })
        })
    })


    describe('DELETE /delete/:id', () => {
        test('should return objects with id,name,image_url,price and stock status 200', (done) => {

            request(app)

                .delete(`/products/delete/${id}`)
                .set('token', token)
                .query({ 'id': id })
                // .send(updateProduct)
                .end((err, response) => {
                    if (err) {
                        return done(err)
                    } else {
                        // console.log(response.body)
                        expect(response.status).toBe(200)
                        expect(response.body).toHaveProperty('name', expect.any(String))
                        expect(response.body).toHaveProperty('image_url', expect.any(String))
                        expect(response.body).toHaveProperty('price', expect.any(Number))
                        expect(response.body).toHaveProperty('stock', expect.any(Number))
                        expect(response.body).toHaveProperty('CategoryId', expect.any(Number))
                        return done()
                    }
                })
        })
    })
})


describe('Test fail /products', () => {

    describe('GET /:id', () => {
        test('should return error with status 404',(done) => {
        const error = "not found"

        request(app)
            .get(`/products/${9999999}`)
            .set('token',token)
            // .send(newProduct)
            .end((err, response) => {
                if (err) {
                    return done(err)
                } else {
                    console.log(response.body)
                    expect(response.status).toBe(404)
                    expect(response.body).toHaveProperty('error', error)
                    return done()
                }
            })
        })
    })

    describe('DELETE /delete/:id', () => {
        test('should return error with status 404',(done) => {
        const error = "not found"

        request(app)
            .delete(`/products/delete/${1}`)
            .set('token',token)
            .query({'id':1})
            // .send(newProduct)
            .end((err, response) => {
                if (err) {
                    return done(err)
                } else {
                    // console.log(response.body)
                    expect(response.status).toBe(404)
                    expect(response.body).toHaveProperty('error', error)
                    return done()
                }
            })
        })
    })

    describe('POST /add', () => {
        test('should return name error with status 400', (done) => {
            const error = ["Name is required field", "Name must more than 3 letters"]
            let newProduct = {
                name : '',
                image_url : 'pp.jpg',
                price : '8000',
                stock : '12',
                CategoryId : categorynum
            }
            request(app)
            .post('/products/add/test')
                .set('token',token)
                .send(newProduct)
                .end((err, response) => {
                    if (err) {
                        return done(err)
                    } else {
                        // console.log(response.body)
                        expect(response.status).toBe(400)
                        expect(response.body).toHaveProperty('error', error)
                        return done()
                    }
                })
        })
        test('should return image_url error with status 400', (done) => {
            const error = ["image_url is required field", "image url must in URL format"]
            let newProduct = {
                name : 'babydoll',
                image_url : '',
                price : '8000',
                stock : '12',
                CategoryId : categorynum
            }
            request(app)
            .post('/products/add/test')
                .set('token',token)
                .send(newProduct)
                .end((err, response) => {
                    if (err) {
                        return done(err)
                    } else {
                        console.log(response.body)
                        expect(response.status).toBe(400)
                        expect(response.body).toHaveProperty('error', error)
                        return done()
                    }
                })
        })
        test('should return price error with status 400', (done) => {
            const error = "price can't below 0. are you nuts?"
            let newProduct = {
                name : 'applejuice',
                image_url : 'pp.jpg',
                price : -1,
                stock : '12',
                CategoryId : categorynum
            }
            request(app)
            .post('/products/add/test')
                .set('token',token)
                .send(newProduct)
                .end((err, response) => {
                    if (err) {
                        return done(err)
                    } else {
                        // console.log(response.body)
                        expect(response.status).toBe(400)
                        expect(response.body).toHaveProperty('error', error)
                        return done()
                    }
                })
        })
        test('should return stock error with status 400', (done) => {
            const error = "stock can't below 0. are you nuts!"
            let newProduct = {
                name : 'babydoll',
                image_url : 'pp.jpg',
                price : '8000',
                stock : -1,
                CategoryId : categorynum
            }
            request(app)
            .post('/products/add/test')
                .set('token',token)
                .send(newProduct)
                .end((err, response) => {
                    if (err) {
                        return done(err)
                    } else {
                        // console.log(response.body)
                        expect(response.status).toBe(400)
                        expect(response.body).toHaveProperty('error', error)
                        return done()
                    }
                })
        })

        test('should return category error with status 400', (done) => {
            const error = 'category is required field'
            let newProduct = {
                name : 'babydoll',
                image_url : 'pp.jpg',
                price : '8000',
                stock : 2,
                CategoryId : ''
            }
            request(app)
            .post('/products/add/test')
                .set('token',token)
                .send(newProduct)
                .end((err, response) => {
                    if (err) {
                        return done(err)
                    } else {
                        // console.log(response.body)
                        expect(response.status).toBe(400)
                        expect(response.body).toHaveProperty('error', error)
                        return done()
                    }
                })
        })

        test('should return error with all null ,status 400', (done) => {
            const error = ["Name is required field", "image_url is required field", "Price is required field", "Stock is required field","category is required field"]
            request(app)
            .post('/products/add/test')
                .set('token',token)
                // .attach('image_url', null)
                // .send(newProduct)
                .end((err, response) => {
                    if (err) {
                        return done(err)
                    } else {
                        console.log(response.body)
                        expect(response.status).toBe(400)
                        expect(response.body).toHaveProperty('error', error)
                        return done()
                    }
                })
        })

        test('should return error with all empty with status 400', (done) => {
            const error = ["category is required field","Name is required field","Name must more than 3 letters", "image_url is required field","image url must in URL format",  "Price is required field", "Stock is required field"]
            let newProduct = {
                name : '',
                image_url : '',
                price : '',
                stock : '',
                CategoryId : ''
            }
            request(app)
            .post('/products/add/test')
                .set('token',token)
                .send(newProduct)
                // .attach('image_url', '')
                .end((err, response) => {
                    if (err) {
                        return done(err)
                    } else {
                        console.log(response.body)
                        expect(response.status).toBe(400)
                        expect(response.body).toHaveProperty('error', error)
                        return done()
                    }
                })
        })

        test('should return error with mix validation errors with status 400', (done) => {
            const error = ["price can't below 0. are you nuts?","category is required field","Name must more than 3 letters", "image_url is required field","image url must in URL format"]
            let newProduct = {
                name : 'as',
                image_url : '',
                price : -2,
                stock : 2,
                CategoryId : ''
            }
            request(app)
            .post('/products/add/test')
                .set('token',token)
                .send(newProduct)
                // .attach('image_url', '')
                .end((err, response) => {
                    if (err) {
                        return done(err)
                    } else {
                        console.log(response.body)
                        expect(response.status).toBe(400)
                        expect(response.body).toHaveProperty('error', error)
                        return done()
                    }
                })
        })


    })


})
