'use strict';

module.exports = function (Coffeeshop) {
    Coffeeshop.status = function (cb) {
        var currentDate = new Date();
        var currentHour = currentDate.getHours();
        var OPEN_HOUR = 6;
        var CLOSE_HOUR = 20;
        console.log('Current hour is %d', currentHour);
        var response;
        if (currentHour >= OPEN_HOUR && currentHour < CLOSE_HOUR) {
            response = 'We are open for business'
        } else {
            response = 'Sorry, we are closed, Open daily from 6am to 8pm.';
        }
        cb(null, response);
    };
    Coffeeshop.remoteMethod(
        'status', {
        http: {
            path: '/status',
            verb: 'GET'
        },
        returns: {
            arg: 'status',
            type: 'string'
        }
    }
    );

    // Get API for getting coffee shop name from table.
    Coffeeshop.getName = function (shopId, cb) {
        console.log('Coffee shop ID : ', shopId)
        Coffeeshop.findById(shopId, function (err, instance) {
            var response = 'Name of Coffee Shop is ' + instance.name;
            cb(null, response)
            console.log(response)
        });
    }
    Coffeeshop.remoteMethod('getName', {
        http: { path: '/getName', verb: 'GET' },
        accepts: { arg: 'id', type: 'number', required: true, http: { source: 'query' } },
        returns: { arg: 'name', type: 'string' }
    })

    // Create Coffe Shop Details --- > Completed
    Coffeeshop.createCoffeeShop = function (data, cb) {
        Coffeeshop.create(data, function (err, result) {
            var response = {}
            if (err) {
                response.status = 422
                response.message = "Something Went wrong"
                response.data = err
            } else {
                response.status = 200
                response.message = "Coffe Shop Details Added Successfully"
                response.data = result
            }
            cb(null, response)
        })
    }
    Coffeeshop.remoteMethod('createCoffeeShop', {
        http: { path: '/createCoffeeShop', verb: 'post' },
        accepts: [
            { arg: 'data', type: 'object', required: true, http: { source: 'body' } },
        ],
        returns: { type: 'object', root: true }
    })

    // Update Coffee Shop Details By Name
    Coffeeshop.updateCoffeeShop = function (name, city, cb) {
        var response = {}
        Coffeeshop.findOne({ where: { name: name } }, function (err, coffeshop) {
            if (err) return cb(null, err);
            Coffeeshop.updateAll({ id: coffeshop.id }, { city }, function (err, res) {
                if (err) return cb(null, err);
                response.status = 200
                response.message = "Coffee Shop updated successfully"
                response.data = res
                cb(null, response)
            })
        })
    }

    Coffeeshop.remoteMethod('updateCoffeeShop', {
        http: { path: '/updateCoffeeShop', verb: 'PUT' },
        accepts: [
            { arg: 'name', type: 'string', required: true, http: { source: 'form' } },
            { arg: 'city', type: 'string', required: true, http: { source: 'form' } }
        ],
        returns: { type: 'object', root: true }
    })

    // Delete Coffee Shop Details by name
    Coffeeshop.deleteCoffeeShop = function (name, callback) {
        var response = {}
        const promise = new Promise(function (reslove, reject) {
            console.log(name)
            Coffeeshop.findOne({ where: { name: name } })
                .then(function (coffeshop) {
                    if (coffeshop) {
                        Coffeeshop.deleteById(coffeshop.id, function (err, res) {
                            if (err) return callback(null, err)
                            response.status = 200
                            response.message = "Deleted Successfully"
                            callback(null, response)
                        })
                    }
                })
        })
    }

    Coffeeshop.remoteMethod('deleteCoffeeShop', {
        http: { path: '/deleteCoffeeShop', verb: 'DELETE' },
        accepts: { arg: 'name', type: 'string', required: true, http: { source: 'form' } },
        returns: { type: 'object', root: true },
        description: 'API to delete coffee shop details'
    })

    // Get All Coffee Shop Details --- > Completed
    Coffeeshop.getAllCoffeeShop = function (cb) {
        Coffeeshop.find(function (err, results) {
            cb(null, results)
        })
    }

    Coffeeshop.remoteMethod('getAllCoffeeShop', {
        http: { path: '/getAllCoffeeShop', verb: "GET" },
        returns: { type: 'array', root: true },
        description: 'Get All Coffee Shop Details'
    })
};
