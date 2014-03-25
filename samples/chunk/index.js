var http = require('http'),
    send = require('send'),
    path = require('path'),
    url = require('url'),
    port = 3001;

/**
 *   send static file or directory which is requested
 */
function sendfile (req, res, directory) {
    // error handler
    function error(err) {
        res.statusCode = err.status || 500;
        err.message && console.log(err.message.red);
        res.end(err.message);
    }
    // directory redirect handler
    function redirect() {
        res.statusCode = 301;
        res.setHeader('Location', req.url + '/');
        res.end('Redirecting to ' + req.url + '/');
    }
    // send
    return send(req, url.parse(req.url).pathname)
        .root(directory)
        .on('error', error)
        .on('directory', redirect)
        .pipe(res);
}

http.createServer(function (req, res) {
    console.log('Request ' + req.url);

    if (/^\/public\/.*/.exec(req.url)) {

        sendfile(req, res, path.resolve(process.cwd(), '.'));

    } else if (/^\/chunk/.exec(req.url)) {
        
        res.setHeader('Content-Type', 'text/html; charset=UTF-8');
        res.setHeader('Transfer-Encoding', 'chunked');
        
        var chunkes = [],
            count = 0;

        res.write('<html><title>bigpipe</title><body>');
 
        chunkes.push('<!--[chunk]--><h1>hello world</h1>');
        chunkes.push('<!--[chunk]--><h2>hello world</h2>');
        chunkes.push('<!--[chunk]--><h3>hello world</h3>');
        chunkes.push('<!--[chunk]--><h4>hello world</h4>');
        chunkes.push('<!--[chunk]--><h5>hello world</h5>');
        chunkes.push('<!--[chunk]--><h6>hello world</h6>');
        chunkes.push('</body></html>');
        
        chunkes.forEach(function (item) {
            setTimeout( function() {
                res.write(item);
                count ++;
                if (count >= chunkes.length) {
                    setTimeout( function() {
                        res.end();
                    }, 500);
                }
            }, parseInt(Math.random()*10000));
                
        });
    }

 
}).listen(port, function () {
    console.log('Server listening on port ' + port);
});

