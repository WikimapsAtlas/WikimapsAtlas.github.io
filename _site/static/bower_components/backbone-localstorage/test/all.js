module('version');

test('version is set', 1, function(){
    Backbone.LocalStorage.setVersion('1.0.0');
    
    strictEqual(Backbone.LocalStorage.getVersion(), '1.0.0');
});

module('prefix');

test('prefix is set', 1, function(){
    Backbone.LocalStorage.setPrefix('app');
    
    strictEqual(Backbone.LocalStorage.getPrefix(), 'app');
});

module('localstorage', {
    setup: function(){
        Backbone.LocalStorage._clear(true);
        Backbone.LocalStorage.setPrefix('app');
    }
});

test('localStorage is cleared', 1, function(){
    localStorage.setItem('test', JSON.stringify({name:'Backbone localStorage'}));
    
    Backbone.LocalStorage._clear(true);
    
    strictEqual(null, localStorage.getItem('test'));
});

test('localStorage is cleared under a prefix', 2, function(){
    localStorage.setItem('test', JSON.stringify({name:'Backbone localStorage'}));
    localStorage.setItem('app:test', JSON.stringify({name:'Backbone localStorage'}));
    
    Backbone.LocalStorage.setPrefix('app');
    Backbone.LocalStorage._clear();
    
    strictEqual('Backbone localStorage', JSON.parse(localStorage.getItem('test')).name);
    strictEqual(null, localStorage.getItem('app:test'));
});

asyncTest('data is set under unknown prefix', 1, function(){
    var object = {
        name: 'Backbone localStorage'
    };
    
    localStorage.setItem('app:http://rest.com/api/', JSON.stringify(object));
    
    var model = new (Backbone.Model.extend({
        localStorage: true,
        url: 'http://rest.com/api/'
    }));
    
    model.fetch({
        success: function(model, response, options){
            start();
            deepEqual(response, object);
        }
    });
});

asyncTest('models fetches data and localStorage is set', 2, function(){
    var model = new (Backbone.Model.extend({
        localStorage: true,
        url: 'fixtures.json'
    }));
    
    model.fetch({
        success: function(model, response, options){
            start();
            ok(response, 'response is returned');
            deepEqual(response, Backbone.LocalStorage._getData('fixtures.json'), 'returned response strict equal to localStorage');
        }
    });
});

asyncTest('models fetches data when forceRefresh is set', 3, function(){
    var model = new (Backbone.Model.extend({
        localStorage: true,
        url: 'fixtures.json'
    }));
    
    localStorage.setItem('app:fixtures.json', JSON.stringify({name:'remove-me-on-force-refresh'}));
    
    model.fetch({
        forceRefresh: true,
        success: function(model, response, options){
            start();
            ok(response, 'response is returned');
            ok(response.name !== 'remove-me-on-force-refresh', 'response differs from data before forced fetch');
            deepEqual(response, Backbone.LocalStorage._getData('fixtures.json'), 'returned response strict equal to localStorage');
        }
    });
});

test('localStorage is cleared when a different version is set', 3, function(){
    localStorage.setItem('unknown:test', JSON.stringify({name:'do-not-clear-me'}));
    
    Backbone.LocalStorage.setPrefix('app');
    
    localStorage.setItem('app:version', 1);
    localStorage.setItem('app:test', JSON.stringify({name:'test'}));
    localStorage.setItem('app:secondtest', JSON.stringify({name:'secondtest'}));
    
    Backbone.LocalStorage.setVersion(2);
    
    strictEqual(JSON.parse(localStorage.getItem('unknown:test')).name, 'do-not-clear-me');
    equal(localStorage.getItem('app:test'), null);
    equal(localStorage.getItem('app:secondtest'), null);
});

test('json is is stringified', 1, function(){
    Backbone.LocalStorage._setData('object', {name:'object'});
    
    deepEqual(Backbone.LocalStorage._getData('object'), {name:'object'});
});

test('string is not stringified', 1, function(){
    Backbone.LocalStorage._setData('string', 'This is a string.');
    
    strictEqual(Backbone.LocalStorage._getData('string'), 'This is a string.');
});
