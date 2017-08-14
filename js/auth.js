let auth = (() => {
    function isAuthed() {
        return localStorage.getItem('authtoken') !== null;
    }

    function saveSession(data) {

        localStorage.setItem('username', data.username);
        localStorage.setItem('id', data._id);
        localStorage.setItem('authtoken', data._kmd.authtoken);

    }

    function login(username, password) {

        let userData = {
            username,
            password
        };

        return remote.post('user', 'login', userData, 'basic');

    }

    function register(username, password) {
        let userData = {
            username,
            password
        };
        return remote.post('user', '', userData, 'basic');

    }

    function logout() {
        return remote.post('user', '_logout', {authtoken: localStorage.getItem('authtoken')});

    }

    return {
        saveSession, login, register, logout, isAuthed
    }
})();
