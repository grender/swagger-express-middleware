var env = require('./../test-environment');

describe('Resource class', function() {
    'use strict';

    describe('constructor', function() {
        it('can be called without any params',
            function() {
                var resource = new env.swagger.Resource();

                expect(resource.collection).to.equal('');
                expect(resource.name).to.equal('/');
                expect(resource.data).to.be.undefined;
                expect(resource.createdOn).to.be.null;
                expect(resource.modifiedOn).to.be.null;
            }
        );

        it('can be called with just a collection path',
            function() {
                var resource = new env.swagger.Resource('/users/jdoe/orders');

                expect(resource.collection).to.equal('/users/jdoe');
                expect(resource.name).to.equal('/orders');
                expect(resource.data).to.be.undefined;
                expect(resource.createdOn).to.be.null;
                expect(resource.modifiedOn).to.be.null;
            }
        );

        it('can be called with just a single-depth collection path',
            function() {
                var resource = new env.swagger.Resource('/users');

                expect(resource.collection).to.equal('');
                expect(resource.name).to.equal('/users');
                expect(resource.data).to.be.undefined;
                expect(resource.createdOn).to.be.null;
                expect(resource.modifiedOn).to.be.null;
            }
        );

        it('can be called with just a single-depth collection path, with no slash',
            function() {
                var resource = new env.swagger.Resource('users');

                expect(resource.collection).to.equal('');
                expect(resource.name).to.equal('/users');
                expect(resource.data).to.be.undefined;
                expect(resource.createdOn).to.be.null;
                expect(resource.modifiedOn).to.be.null;
            }
        );

        it('can be called with just a collection path and resource name',
            function() {
                var resource = new env.swagger.Resource('/users/jdoe/orders', '/12345');

                expect(resource.collection).to.equal('/users/jdoe/orders');
                expect(resource.name).to.equal('/12345');
                expect(resource.data).to.be.undefined;
                expect(resource.createdOn).to.be.null;
                expect(resource.modifiedOn).to.be.null;
            }
        );

        it('can be called with a collection path, resource name, and data',
            function() {
                var data = {orderId: 12345};
                var resource = new env.swagger.Resource('/users/jdoe/orders', '/12345', data);

                expect(resource.collection).to.equal('/users/jdoe/orders');
                expect(resource.name).to.equal('/12345');
                expect(resource.data).to.equal(data);
                expect(resource.createdOn).to.be.null;
                expect(resource.modifiedOn).to.be.null;
            }
        );

        it('should throw an error if the resource name contains slashes',
            function() {
                function throws() {
                    new env.swagger.Resource('/users', '/jdoe/orders', 'foo');
                }

                expect(throws).to.throw(Error, 'Resource names cannot contain slashes');
            }
        );
    });

    var express = env.express();
    express.enable('strict routing');
    express.enable('case sensitive routing');

    var router = env.router();
    router.caseSensitive = true;
    router.strict = true;

    // The behavior should be the same for all of these configurations
    var configs = [
        {method: 'toString'},
        {method: 'valueOf'},
        {method: 'valueOf', app: express},
        {method: 'valueOf', router: router}
    ];

    configs.forEach(function(config) {
        var signature = config.method + (config.app ? '(express)' : '') + (config.router ? '(router)' : '');
        describe(signature, function() {
            it('should return the a single slash ()',
                function() {
                    var resource = new env.swagger.Resource();
                    var toString = resource[config.method](config.app || config.router);
                    expect(toString).to.equal('/');
                }
            );

            it('should return the a single slash ("")',
                function() {
                    var resource = new env.swagger.Resource('');
                    var toString = resource[config.method](config.app || config.router);
                    expect(toString).to.equal('/');
                }
            );

            it('should return the a single slash ("", "")',
                function() {
                    var resource = new env.swagger.Resource('', '');
                    var toString = resource[config.method](config.app || config.router);
                    expect(toString).to.equal('/');
                }
            );

            it('should return the a single slash ("/")',
                function() {
                    var resource = new env.swagger.Resource('/');
                    var toString = resource[config.method](config.app || config.router);
                    expect(toString).to.equal('/');
                }
            );

            it('should return the a single slash ("/", "")',
                function() {
                    var resource = new env.swagger.Resource('/', '');
                    var toString = resource[config.method](config.app || config.router);
                    expect(toString).to.equal('/');
                }
            );

            it('should return the a single slash ("", "/")',
                function() {
                    var resource = new env.swagger.Resource('', '/');
                    var toString = resource[config.method](config.app || config.router);
                    expect(toString).to.equal('/');
                }
            );

            it('should return the a single slash ("/", "/")',
                function() {
                    var resource = new env.swagger.Resource('', '/');
                    var toString = resource[config.method](config.app || config.router);
                    expect(toString).to.equal('/');
                }
            );

            it('should return the a single slash ("//")',
                function() {
                    var resource = new env.swagger.Resource('/');
                    var toString = resource[config.method](config.app || config.router);
                    expect(toString).to.equal('/');
                }
            );

            it('should return the a single slash ("//", "")',
                function() {
                    var resource = new env.swagger.Resource('//', '');
                    var toString = resource[config.method](config.app || config.router);
                    expect(toString).to.equal('/');
                }
            );

            it('should return the a single slash ("", "//")',
                function() {
                    var resource = new env.swagger.Resource('', '//');
                    var toString = resource[config.method](config.app || config.router);
                    expect(toString).to.equal('/');
                }
            );

            it('should return the a single slash ("//", "//")',
                function() {
                    var resource = new env.swagger.Resource('//', '//');
                    var toString = resource[config.method](config.app || config.router);
                    expect(toString).to.equal('/');
                }
            );

            it('should add a leading slash (one param)',
                function() {
                    var resource = new env.swagger.Resource('users/JDoe/orders/');
                    var toString = resource[config.method](config.app || config.router);
                    expect(toString).to.equal('/users/JDoe/orders/');
                }
            );

            it('should add a leading slash (two params)',
                function() {
                    var resource = new env.swagger.Resource('users/JDoe', 'orders/');
                    var toString = resource[config.method](config.app || config.router);
                    expect(toString).to.equal('/users/JDoe/orders/');
                }
            );

            it('should NOT add a trailing slash (one param)',
                function() {
                    var resource = new env.swagger.Resource('users/JDoe/orders/12345');
                    var toString = resource[config.method](config.app || config.router);
                    expect(toString).to.equal('/users/JDoe/orders/12345');
                }
            );

            it('should NOT add a trailing slash (two params)',
                function() {
                    var resource = new env.swagger.Resource('users/JDoe/orders', '12345');
                    var toString = resource[config.method](config.app || config.router);
                    expect(toString).to.equal('/users/JDoe/orders/12345');
                }
            );

            it('should remove redundant slashes between collection and resource name',
                function() {
                    var resource = new env.swagger.Resource('/users/', '/JDoe/');
                    var toString = resource[config.method](config.app || config.router);
                    expect(toString).to.equal('/users/JDoe/');
                }
            );

            it('should return "/users/", even though no resource name is given',
                function() {
                    var resource = new env.swagger.Resource('/users/');
                    var toString = resource[config.method](config.app || config.router);
                    expect(toString).to.equal('/users/');
                }
            );

            it('should return "/users/", even though the resource name is blank',
                function() {
                    var resource = new env.swagger.Resource('/users/', '');
                    var toString = resource[config.method](config.app || config.router);
                    expect(toString).to.equal('/users/');
                }
            );

            it('should return "/users/", even though the resource name is blank and the collection doesn\'t have a trailing slash',
                function() {
                    var resource = new env.swagger.Resource('/users', '');
                    var toString = resource[config.method](config.app || config.router);
                    expect(toString).to.equal('/users/');
                }
            );
        });
    });

    describe('valueOf (case-insensitive, non-strict)', function() {
        it('should return a case-insensitive, non-strict string',
            function() {
                var resource = new env.swagger.Resource('/users', '/JDoe/');
                var express = env.express();
                var valueOf = resource.valueOf(express);
                expect(valueOf).to.equal('/users/jdoe');    // all-lowercase, no trailing slash
            }
        );

        it('should return a case-sensitive, non-strict string',
            function() {
                var resource = new env.swagger.Resource('/users', '/JDoe/');
                var express = env.express();
                express.enable('case sensitive routing');
                var valueOf = resource.valueOf(express);
                expect(valueOf).to.equal('/users/JDoe');    // no trailing slash
            }
        );

        it('should return a case-insensitive, strict string',
            function() {
                var resource = new env.swagger.Resource('/users', '/JDoe/');
                var express = env.express();
                express.enable('strict routing');
                var valueOf = resource.valueOf(express);
                expect(valueOf).to.equal('/users/jdoe/');    // all-lowercase
            }
        );

        it('should return an empty string',
            function() {
                var resource = new env.swagger.Resource('/', '//');
                var express = env.express();
                var valueOf = resource.valueOf(express);
                expect(valueOf).to.equal('');               // all-lowercase, no trailing slash
            }
        );

        it('should remove the trailing slash from the collection',
            function() {
                var resource = new env.swagger.Resource('/Users/', '');
                var express = env.express();
                var valueOf = resource.valueOf(express);
                expect(valueOf).to.equal('/users');         // all-lowercase, no trailing slash
            }
        );

        it('should remove the trailing slash from the resource name',
            function() {
                var resource = new env.swagger.Resource('/Users', '/');
                var express = env.express();
                var valueOf = resource.valueOf(express);
                expect(valueOf).to.equal('/users');         // all-lowercase, no trailing slash
            }
        );

        it('should remove the trailing slash from the collection and resource name',
            function() {
                var resource = new env.swagger.Resource('/Users/', '/');
                var express = env.express();
                var valueOf = resource.valueOf(express);
                expect(valueOf).to.equal('/users');         // all-lowercase, no trailing slash
            }
        );

        it('should remove the resource name and trailing slash (non-strict)',
            function() {
                var resource = new env.swagger.Resource('/Users/', '/Jdoe/');
                var express = env.express();
                var valueOf = resource.valueOf(express, true);
                expect(valueOf).to.equal('/users');         // all-lowercase, no trailing slash
            }
        );

        it('should remove the resource name and trailing slash (strict)',
            function() {
                var resource = new env.swagger.Resource('/Users/', '/Jdoe/');
                var express = env.express();
                express.enable('strict routing');
                var valueOf = resource.valueOf(express, true);
                expect(valueOf).to.equal('/users');         // all-lowercase, no trailing slash
            }
        );
    });

    describe('normalizeCollection', function() {
        it('should normalize the collection path',
            function() {
                var resource = new env.swagger.Resource('users/jdoe/orders/', '/12345', 'foo');

                expect(resource.collection).to.equal('/users/jdoe/orders');    // added leading slash, removed trailing slash
                expect(resource.name).to.equal('/12345');
            }
        );

        it('should normalize an empty collection path',
            function() {
                var resource = new env.swagger.Resource('', '/12345', 'foo');

                expect(resource.collection).to.equal('');   // empty string = root
                expect(resource.name).to.equal('/12345');
            }
        );

        it('should normalize an empty collection path (after splitting the `collection` parameter)',
            function() {
                var resource = new env.swagger.Resource('/12345');

                expect(resource.collection).to.equal('');   // empty string = root
                expect(resource.name).to.equal('/12345');
            }
        );

        it('should normalize a single-slash collection path',
            function() {
                var resource = new env.swagger.Resource('/', '/12345', 'foo');

                expect(resource.collection).to.equal('');   // empty string = root
                expect(resource.name).to.equal('/12345');
            }
        );

        it('should normalize a double-slash collection path',
            function() {
                var resource = new env.swagger.Resource('//', '/12345', 'foo');

                expect(resource.collection).to.equal('');   // empty string = root
                expect(resource.name).to.equal('/12345');
            }
        );
    });

    describe('normalizeName', function() {
        it('should normalize the resource names',
            function() {
                var resource = new env.swagger.Resource('users/jdoe/orders', '12345/', 'foo');

                expect(resource.collection).to.equal('/users/jdoe/orders');
                expect(resource.name).to.equal('/12345/');                   // Added leading slash
            }
        );

        it('should normalize an empty resource name',
            function() {
                var resource = new env.swagger.Resource('', '', 'foo');

                expect(resource.collection).to.equal('');    // empty string = root
                expect(resource.name).to.equal('/');         // Added leading slash
            }
        );

        it('should normalize a single-slash resource name',
            function() {
                var resource = new env.swagger.Resource('/users', '/', 'foo');

                expect(resource.collection).to.equal('/users');
                expect(resource.name).to.equal('/');             // good as-is
            }
        );

        it('should normalize a double-slash resource name',
            function() {
                var resource = new env.swagger.Resource('/users', '//', 'foo');

                expect(resource.collection).to.equal('/users');
                expect(resource.name).to.equal('/');             // Removed one of the slashes
            }
        );
    });

    describe('parse', function() {
        it('should initialize all properties from a POJO',
            function() {
                var data = {
                    collection: '/users/jdoe/orders',
                    name: '/12345',
                    data: {orderId: 12345},
                    createdOn: new Date(1990, 12, 15, 16, 45, 0),
                    modifiedOn: new Date(1991, 4, 5, 8, 0, 25)
                };
                var resource = env.swagger.Resource.parse(data);

                expect(resource).to.be.an.instanceOf(env.swagger.Resource);
                expect(resource.collection).to.equal('/users/jdoe/orders');
                expect(resource.name).to.equal('/12345');
                expect(resource.data).to.deep.equal(data.data);         // value equality
                expect(resource.data).not.to.equal(data.data);          // not reference equality
                expect(resource.createdOn).to.equalTime(data.createdOn);
                expect(resource.modifiedOn).to.equalTime(data.modifiedOn);
            }
        );

        it('should initialize all properties from JSON',
            function() {
                var data = {
                    collection: '/users/jdoe/orders',
                    name: '/12345',
                    data: {orderId: 12345},
                    createdOn: new Date(1990, 12, 15, 16, 45, 0),
                    modifiedOn: new Date(1991, 4, 5, 8, 0, 25)
                };
                var resource = env.swagger.Resource.parse(JSON.stringify(data));

                expect(resource).to.be.an.instanceOf(env.swagger.Resource);
                expect(resource.collection).to.equal('/users/jdoe/orders');
                expect(resource.name).to.equal('/12345');
                expect(resource.data).to.deep.equal(data.data);         // value equality
                expect(resource.data).not.to.equal(data.data);          // not reference equality
                expect(resource.createdOn).to.equalTime(data.createdOn);
                expect(resource.modifiedOn).to.equalTime(data.modifiedOn);
            }
        );

        it('should initialize all properties from a POJO array',
            function() {
                var data = [
                    {
                        collection: '/users/jdoe/orders',
                        name: '/12345',
                        data: {orderId: 12345},
                        createdOn: new Date(1990, 12, 15, 16, 45, 0),
                        modifiedOn: new Date(1991, 4, 5, 8, 0, 25)
                    },
                    {
                        collection: '',
                        name: '/',
                        data: '<h1>hello world</h1>',
                        createdOn: new Date(),
                        modifiedOn: new Date()
                    }
                ];
                var resources = env.swagger.Resource.parse(data);

                expect(resources[0]).to.be.an.instanceOf(env.swagger.Resource);
                expect(resources[0].collection).to.equal('/users/jdoe/orders');
                expect(resources[0].name).to.equal('/12345');
                expect(resources[0].data).to.deep.equal(data[0].data);         // value equality
                expect(resources[0].data).not.to.equal(data[0].data);          // not reference equality
                expect(resources[0].createdOn).to.equalTime(data[0].createdOn);
                expect(resources[0].modifiedOn).to.equalTime(data[0].modifiedOn);

                expect(resources[1]).to.be.an.instanceOf(env.swagger.Resource);
                expect(resources[1].collection).to.equal('');
                expect(resources[1].name).to.equal('/');
                expect(resources[1].data).to.be.a('string');                    // type equality (for intrinsic types)
                expect(resources[1].data).to.equal('<h1>hello world</h1>');     // value equality
                expect(resources[1].createdOn).to.equalTime(data[1].createdOn);
                expect(resources[1].modifiedOn).to.equalTime(data[1].modifiedOn);
            }
        );

        it('should initialize all properties from a JSON array',
            function() {
                var data = [
                    {
                        collection: '/users/jdoe/orders',
                        name: '/12345',
                        data: {orderId: 12345},
                        createdOn: new Date(1990, 12, 15, 16, 45, 0),
                        modifiedOn: new Date(1991, 4, 5, 8, 0, 25)
                    },
                    {
                        collection: '',
                        name: '/',
                        data: '<h1>hello world</h1>',
                        createdOn: new Date(),
                        modifiedOn: new Date()
                    }
                ];
                var resources = env.swagger.Resource.parse(JSON.stringify(data));

                expect(resources[0]).to.be.an.instanceOf(env.swagger.Resource);
                expect(resources[0].collection).to.equal('/users/jdoe/orders');
                expect(resources[0].name).to.equal('/12345');
                expect(resources[0].data).to.deep.equal(data[0].data);         // value equality
                expect(resources[0].data).not.to.equal(data[0].data);          // not reference equality
                expect(resources[0].createdOn).to.equalTime(data[0].createdOn);
                expect(resources[0].modifiedOn).to.equalTime(data[0].modifiedOn);

                expect(resources[1]).to.be.an.instanceOf(env.swagger.Resource);
                expect(resources[1].collection).to.equal('');
                expect(resources[1].name).to.equal('/');
                expect(resources[1].data).to.be.a('string');                    // type equality (for intrinsic types)
                expect(resources[1].data).to.equal('<h1>hello world</h1>');     // value equality
                expect(resources[1].createdOn).to.equalTime(data[1].createdOn);
                expect(resources[1].modifiedOn).to.equalTime(data[1].modifiedOn);
            }
        );
    });
});