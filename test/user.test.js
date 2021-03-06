const app = require('../app')
const request = require('supertest')
const { sequelize } = require('../models')
const { queryInterface } = sequelize
const {compare} = require('../app')


afterAll(done => {
    queryInterface.bulkDelete('Users')
        .then(() => {
            console.log('cleaned db')
            done()
        })
        .catch(err => {
            done(err)
        })
})

describe('Test Register', () => {
    describe('POST /register', () => {
        test('should return object with id, name,and email. status 201', (done) => {
            const userInput = {
                first_name: 'yusak',
                email: 'mail@maill.com',
                password: 'asdasd'
            }
            request(app)
                .post('/register')
                .send(userInput)
                .end((err, response) => {
                    if (err) {
                        return done(err)
                    } else {
                        // console.log(response.body)
                        expect(response.status).toBe(201)
                        expect(response.body).toHaveProperty('first_name', expect.any(String))
                        expect(response.body).toHaveProperty('last_name', expect.any(String))
                        expect(response.body).toHaveProperty('id', expect.any(Number))
                        expect(response.body).toHaveProperty('email', userInput.email)
                        expect(response.body).not.toHaveProperty('password')
                        return done()
                    }
                })
        })
        test('should return first_name error with status 400', (done) => {
            const error = 'first name must more than 3 letters'
            const userInput = {
                first_name: 'y',
                email: 'mail@mail.com',
                password: 'asdasd'
            }
            request(app)
                .post('/register')
                .send(userInput)
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
        test('should return first_name empty error with status 400', (done) => {
            const error = 'Name is required field'
            const userInput = {
                first_name: '   ',
                email: 'beli@beli.com',
                password: 'asdasd'
            }
            request(app)
                .post('/register')
                .send(userInput)
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
        test('should return email unique error with status 400', (done) => {
            const error = 'email already used'
            const userInput = {
                first_name: 'yusak',
                email: 'mail@mail.com',
                password: 'asdasd'
            }
            request(app)
                .post('/register')
                .send(userInput)
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
        test('should return email input error without . with status 400', (done) => {
            const error = `email must with '@' and '.' `
            const userInput = {
                first_name: 'yusak',
                email: 'mail@',
                password: 'asdasd'
            }
            request(app)
                .post('/register')
                .send(userInput)
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
        test('should return email input error without @ with status 400', (done) => {
            const error = `email must with '@' and '.' `
            const userInput = {
                first_name: 'yusak',
                email: 'mail.com',
                password: 'asdasd'
            }
            request(app)
                .post('/register')
                .send(userInput)
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
        test('should return password error with status 400 because less than 6 chars', (done) => {
            const error = `password minimal is 6 length`
            const userInput = {
                first_name: 'yusak',
                email: 'mail@mail.com',
                password: 'asdad'
            }
            request(app)
                .post('/register')
                .send(userInput)
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
        describe('show multiple validation error from /register', () => {
            test('first_name less than 3 chars and email without @ with error status 400', (done) => {
                const error = [`first name must more than 3 letters`, `email must with '@' and '.'`]
                const userInput = {
                    first_name: 'yu',
                    email: 'mailru.com',
                    password: 'asdada'
                }
                request(app)
                    .post('/register')
                    .send(userInput)
                    .end((err, response) => {
                        if (err) {
                            return done(err)
                        } else {
                            console.log(response.body.error)
                            expect(response.status).toBe(400)
                            expect(response.body).toHaveProperty('error', error)
                            return done()
                        }
                    })
            })
            test('first_name less than 3 chars , email without @ and  password with less than 6 chars with error status 400', (done) => {
                const error = [`first name must more than 3 letters`, `email must with '@' and '.'`, "password minimal is 6 length"]
                const userInput = {
                    first_name: 'yu',
                    email: 'mailru.com',
                    password: 'asdad'
                }
                request(app)
                    .post('/register')
                    .send(userInput)
                    .end((err, response) => {
                        if (err) {
                            return done(err)
                        } else {
                            console.log(response.body.error)
                            expect(response.status).toBe(400)
                            expect(response.body).toHaveProperty('error', error)
                            return done()
                        }
                    })
            })
        })
    })
})

describe('test login', () => {
    describe('POST /login', () => {
        describe('success /login', () => {
            test('should return token with status 200', (done) => {
                const userInput = {
                    email: 'mail@mail.com',
                    password: 'asdasd'
                }
                request(app)
                    .post('/login')
                    .send(userInput)
                    .end((err, response) => {
                        if (err) {
                            console.log(`there's error for you:`, err)
                            return done(err)
                        } else {
                            console.log(response.body)
                            expect(response.status).toBe(200)
                            expect(response.body).toHaveProperty('token', expect.any(String))
                            expect(response.body).not.toHaveProperty('password', userInput.password)
                            return done()
                        }
                    })
            })
        })
        describe('error /login', () => {
            test('should return error with wrong email with status 400', (done) => {
                const error = 'invalid email'
                const userInput = {
                    email: 'mail@mail.co',
                    password: 'asdasd'
                }
                request(app)
                    .post('/login')
                    .send(userInput)
                    .end((err, response) => {
                        if (err) {
                            console.log(`there's error for you:`, err)
                            return done(err)
                        } else {
                            console.log(response.body)
                            expect(response.status).toBe(400)
                            expect(response.body).toHaveProperty('error', error)
                            return done()
                        }
                    })
            })
            test('should return error with wrong password with status 400', (done) => {
                const error = 'invalid password'
                const userInput = {
                    email: 'mail@mail.com',
                    password: 'asda'
                }
                request(app)
                    .post('/login')
                    .send(userInput)
                    .end((err, response) => {
                        if (err) {
                            console.log(`there's error for you:`, err)
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

})