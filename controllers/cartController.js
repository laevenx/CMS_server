const {Cart,Product,User,sequelize} = require('../models')

class CartController{

    static list (req,res){
        Cart
            .findAll({order : [['id','ASC']],include : [Product,User]})
            .then(data => {
                res.status(200).json({
                    data
                })
            })
            .catch(err => {
                res.status(400).json({
                    error: err.message
                })
            })
    }

    static select(req,res){
        // console.log('check')
        Cart
            .findOne({ where: { id: req.params.id } })
            .then(data => {
                res.status(200).json({
                    data
                })
            })
            .catch(err => {
                res.status(404).json({
                    error: 'not found'
                })
            })
    }

    static checkout (req,res){
        // console.log('checkout')
        Cart
            .findAll({where : {
                                'UserId': req.LoginId,
                                isPaid: false
                                },include : [Product,User]})
            .then(data => {
                res.status(200).json({
                    data
                })
            })
            .catch(err => {
                res.status(400).json({
                    error : err.message
                })
            })
    }

    static add (req,res){

        let newCart = {
            ProductId : req.body.ProductId,
            UserId : req.LoginId,
            quantity : req.body.quantity,
            isPaid : false
        }
        let id;
        
        return sequelize.transaction((t) => {
            return Cart
            .findOne({where:{'UserId': newCart.UserId,'ProductId': newCart.ProductId,isPaid:false}},{transaction: t})
            .then(data1 => {
                if(data1){
                    data1.quantity = parseInt(data1.quantity) + parseInt(newCart.quantity)
                    id = data1.id
                    data1.save({ fields: ['quantity'] })
                }else{
                    return Cart.create(newCart,{transaction: t})
                }
            })
            .then(data => {
                if(data){
                    id = data.id
                }
                return data
            })
        })
        .then(data => {
            return Cart.findByPk(id)
        })
        .then(data => {
                    res.status(201).json({
                        id: data.id,
                        ProductId: data.ProductId,
                        UserId: data.UserId,
                        quantity: data.quantity
                    })
                })
        .catch(err => {
                    res.status(404).json({
                        error : err.message
                    })
                })


        
        // Cart
        //     .create(newCart)
        //     .then(data => {
        //         res.status(201).json({
        //             id: data.id,
        //             ProductId: data.ProductId,
        //             UserId: data.UserId
        //         })
        //     })
        //     .catch(err => {
        //         res.status(404).json({
        //             error : err.message
        //         })
        //     })
    }

    static confirm(req,res){
        // let {id} = req.body 
        // console.log(req.params.id)
        // Cart
        //     .findByPk(req.params.id)
        //     .then(data => {
        //         if(data.UserId == req.LoginId){
        //             return  Cart.update({isPaid : true},{where : {id : req.params.id}})
        //         }else{
        //             res.status(400).json({
        //                 error: 'unable confirm cart which not yours'
        //             })
        //         }
                
        //     }) 
        let cartQuantity;
        return sequelize.transaction((t) => {

            return Cart.findOne({where : {id :req.params.id}},{transaction: t})
                .then(data => {
                    // console.log(test)
                    cartQuantity = data.quantity
                    return Product.findByPk(data.ProductId,{transaction: t})
                })
                .then(data => { 
                    // console.log(`${data.stock} + ${cartQuantity}`)
                    data.stock = parseInt(data.stock) - parseInt(cartQuantity)
                    
                    data.save({ fields: ['stock'] })
                    return Cart.update({isPaid : true},{where : {id : req.params.id}},{transaction: t})
                }) 
        })
        .then(data => {
            // console.log(data)
            return Cart.findByPk(req.params.id) 
        })
        .then(data => {
            // console.log(data)
            res.status(200).json({
                id : data.id,
                ProductId : data.ProductId,
                UserId : data.LoginId,
                quantity : data.quantity,
                isPaid : data.isPaid
            })
        })
        .catch(err => {
                    let errorfix = err.message
                    if(errorfix.includes(',')){
                        errorfix = errorfix.split(',')
                        for (let i=0 ; i <errorfix.length ; i++){
                            errorfix[i] = errorfix[i].replace('Validation error: ','').replace('\n','')
                            errorfix[i] = errorfix[i].replace('notNull Violation: ','')
                            if (errorfix[i].charAt(errorfix[i].length-1) == ' '){
                                errorfix[i] = errorfix[i].slice(0, -1); 
                            }
                        }
    
                    }else {
                        errorfix = errorfix.replace('Validation error: ','')
                        errorfix = errorfix.replace('notNull Violation: ','')
                    }
                    res.status(400).json({
                        error : errorfix
                    })
                })

        // Cart
        //     .update({isPaid : true},{where : {id : req.params.id}})
        //     .then(data => {
        //         // console.log(data)
        //         return Cart.findByPk(req.params.id) 
        //     })
        //     .then(data => {
        //         // console.log(data)
        //         res.status(200).json({
        //             id : data.id,
        //             ProductId : data.ProductId,
        //             UserId : data.LoginId,
        //             quantity : data.quantity,
        //             isPaid : data.isPaid
        //         })
        //     })
        //     .catch(err => {
        //         let errorfix = err.message
        //         if(errorfix.includes(',')){
        //             errorfix = errorfix.split(',')
        //             for (let i=0 ; i <errorfix.length ; i++){
        //                 errorfix[i] = errorfix[i].replace('Validation error: ','').replace('\n','')
        //                 errorfix[i] = errorfix[i].replace('notNull Violation: ','')
        //                 if (errorfix[i].charAt(errorfix[i].length-1) == ' '){
        //                     errorfix[i] = errorfix[i].slice(0, -1); 
        //                 }
        //             }

        //         }else {
        //             errorfix = errorfix.replace('Validation error: ','')
        //             errorfix = errorfix.replace('notNull Violation: ','')
        //         }
        //         res.status(400).json({
        //             error : errorfix
        //         })
        //     })
    }

    static edit(req,res){

        let { quantity, isPaid} = req.body

        Cart
        .update({
            'quantity': quantity,
            'isPaid': isPaid
        },{where : {id : req.params.id}})
        .then(data => {
            // console.log(data)
            return Cart.findByPk(req.params.id) 
        })
        .then(data => {
            // console.log(data)
            res.status(200).json({
                id : data.id,
                ProductId : data.ProductId,
                UserId : data.LoginId,
                quantity : data.quantity,
                isPaid : data.isPaid
            })
        })
        .catch(err => {
            let errorfix = err.message
            if(errorfix.includes(',')){
                errorfix = errorfix.split(',')
                for (let i=0 ; i <errorfix.length ; i++){
                    errorfix[i] = errorfix[i].replace('Validation error: ','').replace('\n','')
                    errorfix[i] = errorfix[i].replace('notNull Violation: ','')
                    if (errorfix[i].charAt(errorfix[i].length-1) == ' '){
                        errorfix[i] = errorfix[i].slice(0, -1); 
                    }
                }

            }else {
                errorfix = errorfix.replace('Validation error: ','')
                errorfix = errorfix.replace('notNull Violation: ','')
            }
            res.status(400).json({
                error : errorfix
            })
        })
    }

    static delete (req,res){
        let results;

        Cart
            .findByPk(req.params.id)
            .then(data1 => {
                console.log(data1.id)
                if(data1.id == req.params.id){
                    results = Object.assign(data1)
                    return Cart.destroy({where : {id : req.params.id},returning : true})
                }else{
                    res.status(404).json({error : "not found"})
                }
                        })
            .then(data2 => {
                res.status(200).json({  id : results.id,
                                        ProductId : results.ProductId,
                                        UserId : results.UserId,
                                        stock : results.stock,
                                        isPaid : results.isPaid})
            })
            .catch(err => {
                console.log(err.message)
                res.status(404).json({error : "not found"})
            })
    }
}

module.exports = CartController