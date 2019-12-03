const express=require('express');
const app=express();
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const db=mongoose.connect('mongodb://localhost/swag-shop');

const Product=require('./model/product');
const WishList=require('./model/wishlist');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

app.post('/product',function(request, response){
	response.header('Access-Control-Allow-Origin', "*");
    response.send("hellow");
    let product=new Product();
    product.title=request.body.title;
    product.price=request.body.price;
    product.save(function(err, savedProduct){
        if(err){
            response.status(500).send({error:"couldnt save product"});

        }else{
            response.status(200).send(savedProduct);
        }
    });
    
});

app.get('/product',function(request,response){
   response.header('Access-Control-Allow-Origin', "*");
    Product.find({},function(err,products){
        if(err){
            response.status(500).send({error: "could not fetch products"});
        }else{
            response.send(products);
        }
    });

});

app.get('/wishlist',function(req,res){
	res.header('Access-Control-Allow-Origin', "*");
    WishList.find({}).populate({path:'products',model: 'Product'}).exec(function(err,wishLists){
        if(err){
            res.status(500).send({error:"could not fetch wishlists"});
        }else{
            res.status(200).send(wishLists);
        }
    });
});

app.post('/wishlist',function(req,res){
	res.header('Access-Control-Allow-Origin', "*");
    let wishList=new WishList();
    wishList.title=req.body.title;

    wishList.save(function(err,newWishList){
        if(err){
            res.status(500).send({error:"Could not create wishlist"});
        }else{
            res.send(newWishList);
        }
    });
});

app.put('/wishlist/product/add',function(req,res){
    Product.findOne({_id: req.body.productId},function(err,product){
        if(err){
            response.status(500).send({error:"Could not add item to wishlist"});
        }else{
            WishList.update({_id:req.body.wishListId},{$addToSet:{products:product._id}},function(err,wishList){
                if(err){
                    response.status(500).send({error:"Could not add item to wishlist"});
                }else{
                    res.send("Successfully added to wishlist");
                }
            });
        }
    });
});
app.listen(3000,function(){
    console.log("Api ruunning on port 3000...")
});