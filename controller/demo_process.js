var model = require('../model/demo_model.js');

var UserUpdateFn = function(username, userphone, useraddress) {

    var promise = new Promise(function(resolve, reject) {
        model.User.UserProcess(username, userphone, useraddress)
            .then(function(UserResult) {
                console.log("UserResult: ", UserResult);
                if (UserResult.exist == 'No') {
                    var UR = { user_id: UserResult.user_id };
                    resolve(UR);
                } else {
                    model.User.updateOne({ username: username }, { userphone: userphone, useraddress: useraddress }, function(upderr) {
                        if (upderr) {
                            console.log("user data update error: ", upderr);
                            var data = { "error": { "reason": "User Record update error", "message": 'Something went wrong', "code": 603, "error_type": "db_update_error" } };
                            response.send(data);
                            return;
                        }
                        var UR = { user_id: UserResult.user_id };

                        resolve(UR);
                    });
                }
            });
    });
    // Return the promise that we want to use in our chain
    return promise;
};

var ProductUpdateFn = function(user_id, productname, unit_price, description) {

    var promise = new Promise(function(resolve, reject) {

        model.Product.ProductProcess(user_id, productname, unit_price, description)
            .then(function(ProductResult) {
                console.log("ProductResult: ", ProductResult);
                if (ProductResult.exist == 'No') {
                    var PR = { user_id: ProductResult.user_id, product_id: ProductResult.product_id };
                    resolve(PR);
                } else {
                    model.Product.updateOne({ productname: productname }, { unitprice: unit_price, description: description }, function(upderr) {
                        if (upderr) {
                            console.log("product data update error: ", upderr);
                            var data = { "error": { "reason": "Product Record update error", "message": 'Something went wrong', "code": 603, "error_type": "db_update_error" } };
                            response.send(data);
                            return;
                        }

                        var PR = { user_id: ProductResult.user_id, product_id: ProductResult.product_id };
                        resolve(PR);

                    });
                }
            });
    });

    // Return the promise that we want to use in our chain
    return promise;
};

var TransactionUpdateFn = function(product_id, user_id, quantity, unit_price) {

    var promise = new Promise(function(resolve, reject) {

        model.Transaction.TransactionProcess(product_id, user_id, quantity, unit_price)
            .then(function(TransactionResult) {
                console.log("TransactionResult: ", TransactionResult);
                if (TransactionResult.exist == 'No') {
                    var TR = { transaction_id: TransactionResult.transaction_id, user_id: TransactionResult.user_id, product_id: TransactionResult.product_id };
                    resolve(TR);
                } else {
                    model.Transaction.updateOne({ product_id: TransactionResult.product_id, user_id: TransactionResult.user_id }, { quantity: quantity, total_price: TransactionResult.tamt }, function(upderr) {
                        if (upderr) {
                            console.log("transaction data update error: ", upderr);
                            var data = { "error": { "reason": "Transaction Record update error", "message": 'Something went wrong', "code": 603, "error_type": "db_update_error" } };
                            response.send(data);
                            return;
                        }
                        var TR = { transaction_id: TransactionResult.transaction_id, user_id: TransactionResult.user_id, product_id: TransactionResult.product_id };
                        resolve(TR);

                    });
                }
            });
    });

    // Return the promise that we want to use in our chain
    return promise;
};

var GetUserFn = function() {

    var promise = new Promise(function(resolve, reject) {

        model.User.aggregate(
            [{
                    $lookup: {
                        from: "demo_transaction",
                        localField: "_id",
                        foreignField: "user_id",
                        as: "latest_transaction_detail"
                    }
                },
                {
                    $project: {
                        _id: 0,
                        username: 1,
                        userphone: 1,
                        useraddress: 1,
                        total_transaction: { $size: "$latest_transaction_detail" },
                        latest_transaction_detail: "$latest_transaction_detail"
                    }
                },
                {
                    $sort: { "demo_transaction.updated_date": -1 }
                }
            ],
            function(gerr, gresult) {
                if (gerr) {
                    deferred.reject(new Error(gerr));
                }

                resolve(gresult);
            });
    });

    // Return the promise that we want to use in our chain
    return promise;
};

module.exports = { UserUpdateFn: UserUpdateFn, ProductUpdateFn: ProductUpdateFn, TransactionUpdateFn: TransactionUpdateFn, GetUserFn: GetUserFn };