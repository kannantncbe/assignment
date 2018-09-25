var mongoose = require('mongoose');
var config = require('../includes/config.js');
var p = require('../controller/demo_process.js');

module.exports = function(app) {
    mongoose.connect(config.DB).then(
        () => {
            // API - create transaction
            app.post('/transaction/create', function(request, response) {

                var username = request.body.name;
                var userphone = request.body.phone;
                var useraddress = request.body.address;
                var tr = request.body.transaction;

                if (typeof(username) == 'undefined') {
                    var data = { "error": { "reason": "parameter missing", "message": "Name parameter required", "field_name": "name", "code": 701, "error_type": "missing_parameter" } };
                    response.send(data);
                    return;
                }

                if (typeof(userphone) == 'undefined') {
                    var data = { "error": { "reason": "parameter missing", "message": "Phone parameter required", "field_name": "phone", "code": 701, "error_type": "missing_parameter" } };
                    response.send(data);
                    return;
                }

                if (typeof(useraddress) == 'undefined') {
                    var data = { "error": { "reason": "parameter missing", "message": "Address parameter required", "field_name": "address", "code": 701, "error_type": "missing_parameter" } };
                    response.send(data);
                    return;
                }

                if (typeof(tr) == 'undefined') {
                    var data = { "error": { "reason": "parameter missing", "message": "Transaction parameter required", "field_name": "transaction", "code": 701, "error_type": "missing_parameter" } };
                    response.send(data);
                    return;
                }

                if (typeof(tr) != 'undefined') {

                    if (typeof(tr.product) == 'undefined') {
                        var data = { "error": { "reason": "parameter missing", "message": "Product parameter required", "field_name": "product", "code": 701, "error_type": "missing_parameter" } };
                        response.send(data);
                        return;
                    }

                    if (typeof(tr.product) != 'undefined') {

                        if (typeof(tr.product.name) == 'undefined') {
                            var data = { "error": { "reason": "parameter missing", "message": "Product name parameter required", "field_name": "product name", "code": 701, "error_type": "missing_parameter" } };
                            response.send(data);
                            return;
                        }

                        if (typeof(tr.product.unit_price) == 'undefined') {
                            var data = { "error": { "reason": "parameter missing", "message": "Product unit price parameter required", "field_name": "product unit price", "code": 701, "error_type": "missing_parameter" } };
                            response.send(data);
                            return;
                        }

                        if (typeof(tr.product.description) == 'undefined') {
                            var data = { "error": { "reason": "parameter missing", "message": "Product description parameter required", "field_name": "product description", "code": 701, "error_type": "missing_parameter" } };
                            response.send(data);
                            return;
                        }

                        if (typeof(tr.product.quantity) == 'undefined') {
                            var data = { "error": { "reason": "parameter missing", "message": "Product quantity parameter required", "field_name": "product quantity", "code": 701, "error_type": "missing_parameter" } };
                            response.send(data);
                            return;
                        }
                    }
                }

                p.UserUpdateFn(username, userphone, useraddress)
                    .then(function(UR) {
                        return p.ProductUpdateFn(UR.user_id, tr.product.name, tr.product.unit_price, tr.product.description);
                    })
                    .then(function(PR) {
                        return p.TransactionUpdateFn(PR.product_id, PR.user_id, tr.product.quantity, tr.product.unit_price);
                    })
                    .then(function(TR) {
                        var sdata = {
                            transaction_id: TR.transaction_id,
                            user_id: TR.user_id,
                            product_id: TR.product_id
                        }

                        var data = {
                            status: "success",
                            status_code: 200,
                            message: "Transaction created or updated successfully",
                            result: sdata
                        };

                        response.send(data);
                        return;
                    })
                    .catch(function(error) {
                        console.log(error);
                        var data = { "error": { "reason": "Unknown", "message": error.message } };
                        response.send(data);
                        return;
                    });

            });

            app.get('/users', function(request, response) {
                p.GetUserFn()
                    .then(function(RES) {
                        response.send(RES);
                        return;
                    })
                    .catch(function(error) {
                        console.log(error);
                        var data = { "error": { "reason": "Unknown", "message": error.message } };
                        response.send(data);
                        return;
                    });
            });

        });
};