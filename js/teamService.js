let teamService = (() => {
    function userDetails(userId) {
        return remote.get('user',`${userId}`, 'Kinvey')
    }
    function loadAllUsers() {
        return remote.get('user','', 'Kinvey')
    }
    function loadTeamMembers() {
        return remote.get('user','?query={"role":"teamMember"}', 'Kinvey')
    }
    function loadTeams() {
        return remote.get('appdata', `teams`, 'Kinvey');
    }

    function loadTeamDetails(teamId) {
        return remote.get('appdata', 'teams/' + teamId, 'Kinvey');
    }

    function createTeam(name, memberId) {
        let teamData = {
            memberId: memberId,
            name: name
        };

        return remote.post('appdata', 'teams', teamData, 'Kinvey');
    }
    return {
        userDetails,
        loadAllUsers,
        loadTeamMembers,
        loadTeams,
        loadTeamDetails,
        createTeam
    }
})();