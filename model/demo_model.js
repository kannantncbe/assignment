var mongoose = require('mongoose');
//var Float = require('mongoose-float').loadType(mongoose, 2);
var Q = require("q");

// User
var UserSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, trim: true, default: '' },
    userphone: { type: String, trim: true, default: '' },
    useraddress: { type: String, default: '' }
}, {
    collection: 'demo_user'
});

UserSchema.statics.UserProcess = function(username, userphone, useraddress) {

    // Create our deferred object, which we will use in our promise chain
    var deferred = Q.defer();

    this.findOne({ username: username }, function(uferr, result) {

        if (uferr) {
            console.log("user find error: ", uferr);
            deferred.reject(new Error(uferr));

        }
        if (result != null) {
            var UserResult = { exist: 'Yes', user_id: result._id };
            deferred.resolve(UserResult);

        } else {
            var nuser = new User({
                _id: new mongoose.Types.ObjectId(),
                username: username,
                userphone: userphone,
                useraddress: useraddress
            });

            nuser.save(function(uierr, user_result) {
                console.log("Result: ", user_result);
                if (uierr) {
                    deferred.reject(new Error(uierr));
                }
                var UserResult = { exist: 'No', user_id: user_result._id };
                deferred.resolve(UserResult);
            });
        }
    });

    // Return the promise that we want to use in our chain
    return deferred.promise;
};

var User = mongoose.model('User', UserSchema);

// Product
var ProductSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    productname: { type: String, trim: true, default: '' },
    unitprice: { type: Number },
    description: { type: String, default: '' }
}, {
    collection: 'demo_product'
});

ProductSchema.statics.ProductProcess = function(user_id, productname, unit_price, description) {

    // Create our deferred object, which we will use in our promise chain
    var deferred = Q.defer();

    this.findOne({ productname: productname }, function(uferr, result) {
        if (uferr) {
            console.log("product find error: ", uferr);
            deferred.reject(new Error(uferr));

        }
        if (result != null) {
            console.log("product find result: ", result);
            product_id = result._id;

            var ProductResult = { exist: 'Yes', user_id: user_id, product_id: product_id };
            deferred.resolve(ProductResult);

        } else {

            var nproduct = new Product({
                _id: new mongoose.Types.ObjectId(),
                productname: productname,
                unitprice: unit_price,
                description: description
            });

            nproduct.save(function(uierr, product_result) {

                console.log("Product: ", product_result);

                if (uierr) {
                    console.log("product data insert error: ", uierr);
                    deferred.reject(new Error(uierr));

                }

                product_id = product_result._id;

                var ProductResult = { exist: 'No', user_id: user_id, product_id: product_id };
                deferred.resolve(ProductResult);

            });
        }
    });

    // Return the promise that we want to use in our chain
    return deferred.promise;
};

var Product = mongoose.model('Product', ProductSchema);

// Transaction
var TransactionSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    updated_date: {
        type: Date,
        default: Date.now
    },
    product_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    quantity: { type: Number },
    total_price: { type: Number }
}, {
    collection: 'demo_transaction'
});

TransactionSchema.statics.TransactionProcess = function(product_id, user_id, quantity, unit_price) {

    // Create our deferred object, which we will use in our promise chain
    var deferred = Q.defer();

    this.findOne({ product_id: product_id, user_id: user_id }, function(uferr, result) {
        if (uferr) {
            console.log("traction find error: ", uferr);
            deferred.reject(new Error(uferr));

        }
        if (result != null) {
            transaction_id = result._id;
            var tamt = quantity * unit_price;
            tamt = Number(tamt);
            var TransactionResult = { exist: 'Yes', user_id: user_id, product_id: product_id, transaction_id: transaction_id, tamt: tamt };

            deferred.resolve(TransactionResult);

        } else {
            //console.log("transaction2: ", tr);
            var tamt = quantity * unit_price;
            tamt = Number(tamt);

            var ntransaction = new Transaction({
                _id: new mongoose.Types.ObjectId(),
                product_id: product_id,
                user_id: user_id,
                quantity: quantity,
                total_price: tamt
            });

            ntransaction.save(function(uierr, transaction_result) {
                if (uierr) {
                    console.log("transaction data insert error: ", uierr);
                    deferred.reject(new Error(uierr));
                }

                transaction_id = transaction_result._id;
                var TransactionResult = { exist: 'No', user_id: user_id, product_id: product_id, transaction_id: transaction_id, tamt: tamt };

                deferred.resolve(TransactionResult);

            });
        }
    });

    // Return the promise that we want to use in our chain
    return deferred.promise;
};

var Transaction = mongoose.model('Transaction', TransactionSchema);

// module
module.exports = { User: User, Product: Product, Transaction: Transaction };