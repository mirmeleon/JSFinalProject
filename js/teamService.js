let teamService = (() => {
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

    function createTeam(name, memberId, orderId) {
        let teamData = {
            orderId: orderId,
            memberId: memberId,
            name: name
        };

        return remote.post('appdata', 'teams', teamData, 'Kinvey');
    }
    return {
        loadAllUsers,
        loadTeamMembers,
        loadTeams,
        loadTeamDetails,
        createTeam
    }
})();