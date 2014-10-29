# Backbone localStorage

[![Build Status](https://secure.travis-ci.org/moorinteractive/backbone-localstorage.png?branch=master)](https://travis-ci.org/moorinteractive/backbone-localstorage)

## Installing Backbone localStorage

The package can be installed through [npm](https://npmjs.org/) or [bower](http://bower.io/).

##### Using npm
```
npm install backbone-localstorage
```

##### Using bower
```
bower install backbone-localstorage
```

After installing the package, you can grab the `backbone-localstorage.js` or the minified version of it `backbone-localstorage.min.js`

## Using Backbone localStorage

When data is fetched via `Backbone.sync` (models & collections), the reponse will be stored with `JSON.stringify` in localStorage (before any `success` method is called).
The name under the data is stored is in the following format:

```
<prefix>:<url>
```

Where `prefix` is the value set by ``Backbone.LocalStorage.setPrefix`` (default ``unknown``) and where ``url`` is the remote url from a model or collection.

##### Using Backbone.Model
```
var model = Backbone.Model.extend({
    urlRoot: '/api/pages',
    localStorage: true
});
```

##### Using Backbone.Collection
```
var collection = Backbone.Collection.extend({
    url: '/api/pages',
    localStorage: true
});
```

##### Using forceRefresh option
```
var collection = Backbone.Collection.extend({
    url: '/api/pages',
    localStorage: true
});

collection.fetch({forceRefresh:true});
```

##### Set a prefix
```
Backbone.LocalStorage.setPrefix('my-namespace');
```

## Autoclear localStorage when new content is available

Since many web applications have managable content, it's hard to determine when to recognize new content.
The only thing we know about our data is the url and it's timestamp when the data is strored in localStorage.
With the method `setVerion` you can determine in which state of content the localStorage is set.
At the point you call this method verions are compared (in strict mode).
If the verion is not equal to it's, if present, previous version the localStorage will be cleared (only data set under `prefix`).
```
Backbone.LocalStorage.setVersion(100);
```
The value may be of any type (int, string, etc.).

## Changelog

0.3.2

* Fixed url property compatible as a function, not just as a string value

0.3.1

* Fixed support of localStorage in case of iOS private mode
* Added tests for storing objects and string (stringified or not)

0.3.0

* Added forceRefresh option
* Refactored id to url of model/collection

0.2.1

* Fixed setVersion clear localStorage when verions differs

0.2.0

* Fixed issue return null when no localStorage can be found
* Added documentation

0.1.0 (released on friday, november 15, 2013)

* Prototype