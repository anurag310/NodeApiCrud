const mongoose = require('mongoose')

const productSchema = mongoose.Schema(
    { //Add ci
        name:{
            type:String,
            required:[true,"Please enetr a Product name"]
        },
        quantity:{
            type: Number,
            required:true,
            default : 0
        },
        price:{
            type:Number,
            required:true
        },
        warranty:{
            type:Number,
            required:false
        }
        
    },
    {
        timestamps: true
    }
)


const Product = mongoose.model('Product', productSchema);

module.exports = Product;
