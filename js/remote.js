let remote = (() => {
    const baseUrl = 'https://baas.kinvey.com/';
    const appKey = 'kid_H1AA86dwb';
    const appSecret = 'a9fb7032693c4762adacd7b681e8b67e';

    function makeAuth(type) {
        if (type === 'basic') return 'Basic ' + btoa(appKey + ':' + appSecret);
        else return 'Kinvey ' + localStorage.getItem('authtoken');
    }

    function makeRequest(method, module, url, auth, isSync) {
         let req = {
            url: baseUrl + module + '/' + appKey + '/' + url,
            method,
            headers: {
                'Authorization': makeAuth(auth)
            }};

         if(isSync === true){
             req.async = false;
         }

        return req
    }

    function get(module, url, auth, isSync) {
        return $.ajax(makeRequest('GET', module, url, auth, isSync));
    }

    function post(module, url, data, auth, isSync) {

        let req = makeRequest('POST', module, url, auth, isSync);
        req.data = JSON.stringify(data);
        req.headers['Content-Type'] = 'application/json';
        return $.ajax(req);
    }

    function update(module, url, data, auth, isSync) {
        let req = makeRequest('PUT', module, url, auth, isSync);
        req.data = JSON.stringify(data);
        req.headers['Content-Type'] = 'application/json';
        return $.ajax(req);
    }

    function remove(module, url, auth, isSync) {
        return $.ajax(makeRequest('DELETE', module, url, auth, isSync));
    }

    return {
        get, post, update, remove
    }
})();
