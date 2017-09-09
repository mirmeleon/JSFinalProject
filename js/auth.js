let auth = (() => {
    function isAuthed() {
        return localStorage.getItem('authtoken') !== null;
    }

    function saveSession(data) {

        localStorage.setItem('username', data.username);
        localStorage.setItem('id', data._id);
        localStorage.setItem('authtoken', data._kmd.authtoken);
        //NEW Save role in session !!!
        localStorage.setItem('role',data.role)

        if(data.role === 'teamMember'){
            localStorage.setItem('team', data.team)
        }
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
            password,
            role: 'user'
        };
        return remote.post('user', '', userData, 'basic');

    }

    function logout() {
        return remote.post('user', '_logout', {authtoken: localStorage.getItem('authtoken')});

    }

    function getId(){
        if(isAuthed()){
            return localStorage.getItem('id');
        }

        return undefined;
    }

    function getUsername(){
        if(isAuthed()){
            return localStorage.getItem('username');
        }

        return undefined;
    }

    function getRole(){
        if(isAuthed()){
            return localStorage.getItem('role');
        }

        return undefined
    }

    function getTeam(){
        if(isAuthed() && getRole() === 'teamMember'){
            return localStorage.getItem('team');
        }

        return undefined
    }

    return {
        saveSession, login, register, logout, isAuthed, getId, getUsername, getRole, getTeam
    }
})();
