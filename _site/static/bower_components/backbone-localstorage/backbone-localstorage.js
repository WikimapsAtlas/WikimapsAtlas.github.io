(function(root, Backbone){
    
    var prefix = 'unknown';
    var version = '';
    
    // Save the previous value of the `Backbone.sync` method, so that it can be called later on.
    var previousSync = root.Backbone.sync;
    
    // Save a reference to the global Backbone object
    var LocalStorage = root.Backbone.LocalStorage = {};
    
    // Current version of the library. Keep in sync with `package.json` and `bower.json`.
    LocalStorage.VERSION = '0.3.1';
    
    /**
     * @param {string}
     * @param {object}
    */
    LocalStorage._setData = function(id, value){
        root.localStorage.setItem(prefix+':'+id, JSON.stringify(value));
    };
    
    /**
     * @param {string}
     * @return {object}
     */
    LocalStorage._getData = function(id){
        var data = root.localStorage.getItem(prefix+':'+id);
        
        return typeof data === 'string' ? JSON.parse(data) : data;
    };
    
    /**
     * @param {boolean}
     */
    LocalStorage._clear = function(ignorePrefixCondition){
        if (!ignorePrefixCondition){
            for(var prop in root.localStorage) {
                if(prop.indexOf(prefix) === 0) {
                    root.localStorage.removeItem(prop);
                }
            }
        }
        else {
            root.localStorage.clear();
        }
    };
    
    /**
     * @param {string}
     * @param {Backbone.Model}
     * @param {object}
     */
    LocalStorage.sync = function(method, model, options){
        if (method === 'read' && ((typeof this.localStorage === 'object') || (this.localStorage !== undefined && this.localStorage !== null && this.localStorage.toString().toLowerCase() === 'true'))){
            // Retrieve unique id under which the data will be stored, if no id found use the id of the model
            var id = _.result(model, 'url');
            
            // Retrieve timestamp from localStorage
            var timestamp = LocalStorage._getData(id+':timestamp');
            
            if (id !== undefined && id !== null){
                var data = LocalStorage._getData(id);
                
                if (data === null || data === undefined || options.forceRefresh || (timestamp !== undefined && model.localStorage.maxRefresh && (((new Date().getTime()) - timestamp) > model.localStorage.maxRefresh))){
                    var success = options.success;
                    
                    options.success = function(response, status, xhr){
                        try{
                            LocalStorage._setData(id, response);
                            LocalStorage._setData(id+':timestamp', new Date().getTime());
                        }
                        catch(err){
                            if(err === QUOTA_EXCEEDED_ERR){
                                LocalStorage._clear();
                            }
                        }
                        
                        if (success){
                            success.apply(this, arguments);
                        }
                    };
                    
                    previousSync.apply(this, [method, model, options]);
                }
                else {
                    options.success.apply( this, [data, 'success', null]);
                }
            }
            else {
                previousSync.apply(this, arguments);
            }
        }
        else {
            previousSync.apply(this, arguments);
        }
    };
    
    /**
     * @param {string}
     */
    LocalStorage.setVersion = function(value){
        var versionInStorage = LocalStorage._getData('version');
        
        // clear localStorage (only prefixed data) if version differs
        if (versionInStorage !== null && versionInStorage !== value){
            LocalStorage._clear(false);
        }
        
        // store new version in storage
        LocalStorage._setData('version', value);
        
        version = value;
    };
    
    /**
     * @return {string}
     */
    LocalStorage.getVersion = function(){
        return version;
    };
    
    /**
     * @param {string}
     */
    LocalStorage.setPrefix = function(value){
        prefix = value;
    };
    
    /**
     * @return {string}
     */
    LocalStorage.getPrefix = function(){
        return prefix;
    };
    
    /**
     * @return {boolean}
     */
    LocalStorage.isSupported = function(){
        try { 
            var supported = root.localStorage !== undefined;
            
            if (supported){
                localStorage.setItem('storage', '');
                localStorage.removeItem('storage');
            }
            
            return supported;
        }
        catch(err){
            return false;
        }
    };
    
    // Override Backbone.sync method when localStorage is supported.
    if (LocalStorage.isSupported()){
        root.Backbone.sync = LocalStorage.sync;
    }
    
}).call(this, window, Backbone);