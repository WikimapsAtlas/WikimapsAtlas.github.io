// DEMO JAVASCRIPT
// Renders demo inline javascripts inside the html page  

// Released under MIT License by Arun Ganesh arun.planemad@gmail.com
// Based on http://stackoverflow.com/questions/8946715/lazy-loading-javascript-and-inline-javascript

$(document).ready(function () {
    console.log("demoscript");
    
    var
        _scripts = document.getElementsByTagName("script"),
        _doc = document,
        _txt = "demo/javascript";   //Finds all <script type="demo/javascript"> blocks

    for (var i = 0, l = _scripts.length; i < l; i++) {
        var _type = _scripts[i].getAttribute("type");
        if (_type && _type.toLowerCase() == _txt)
            _scripts[i].parentNode.replaceChild((function (sB) {
                var _s = _doc.createElement('script');
                _s.type = 'text/javascript';    //Reinserts into DOM with javascript MIME type
                _s.innerHTML = sB.innerHTML;

                return _s;
            })(_scripts[i]), _scripts[i]);
    }

    //Render the scripts inside <pre> blocks
    $("[type='example/javascript']").each(function () {
        $(this).after("<pre>" + $(this).html() + "</pre>")
    });

});