const {Banner} = require('../models')
let imgur = require('imgur')

class BannerController {

    static list (req,res){
        Banner
            .findAll({order : [['id','ASC']]})
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

    static create(req,res){

        let encoded = req.file.buffer.toString('base64')

        let {name} = req.body

        imgur.uploadBase64(encoded)
            .then(json => {
                return Banner.create({name,'image_url': json.data.link})
            })
            .then(data => {
                res.status(201).json({
                    id: data.id,
                    name: data.name,
                    image_url: data.image_url
                })
            })
            .catch(err => {
                // console.log(err.message)
                let errorfix = err.message
                if(errorfix.includes(',')){
                    errorfix.replace('category is required field','')
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
                }
                res.status(400).json({
                    error : errorfix
                })
            })
    }

    static createTest(req,res){
        let {name,image_url} = req.body
    
        Banner  
            .create({name,image_url})
            .then(data => {
                res.status(201).json({
                    id: data.id,
                    name: data.name,
                    image_url: data.image_url
                })
            })
            .catch(err => {
                // console.log(err.message)
                let errorfix = err.message
                if(errorfix.includes(',')){
                    errorfix.replace('category is required field','')
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
                }
                res.status(400).json({
                    error : errorfix
                })
            })
    }

    static select(req,res){

        Banner
            .findOne({where: {id : req.params.id}})
            .then(data => {
                res.status(200).json({
                    id: data.id,
                    name: data.name,
                    image_url: data.image_url
                })
            })
            .catch(err => {
                let errorfix = err.message
                if(errorfix.includes(',')){
                    errorfix.replace('category is required field','')
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
                }
                res.status(400).json({
                    error : errorfix
                })
            })
    }

    static edit(req,res){
        let {name,image_url} = req.body

        Banner
            .update({name,image_url}, {where : {id : req.params.id}})
            .then(data => {
                
                return Banner.findByPk(req.params.id)
            })
            .then(data => {
                res.status(200).json({
                    id: data.id,
                    name: data.name,
                    image_url: data.image_url
                })
            })
            .catch(err => {
                let errorfix = err.message
                if(errorfix.includes(',')){
                    errorfix.replace('category is required field','')
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
                }
                res.status(400).json({
                    error : errorfix
                })
            })

    }

    static delete(req,res){
        let results;

        Banner
            .findByPk(req.params.id)
            .then(data1 => {
                console.log(data1.id)
                if(data1.id == req.params.id){
                    results = Object.assign(data1)
                    return Banner.destroy({where : {id : req.params.id},returning : true})
                }else{
                    res.status(404).json({error : "not found"})
                }
                        })
            .then(data2 => {
                res.status(200).json({  id : results.id,
                                        name : results.name,
                                        image_url : results.image_url
                                    })
            })
            .catch(err => {
                // console.log(err.message)
                res.status(404).json({error : "not found"})
            })

    }
}

module.exports = BannerController