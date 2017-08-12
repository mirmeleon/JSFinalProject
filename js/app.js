$(() => {


    //LINKS and BUTTONS
    menuLinks();
    $('#logo').click(() => showView('home'));
    $('#linkHome').click(() => showView('home'));
    $('#linkServices').click(() => showView('services'));
    $('#linkLogin').click(() => showView('login/register'));
   // $('#linkOrders').click(() => showView('orders'));
    // $('#linkContact').click(() => showView('contact'));

    $('#btnRegister').click(registerUser);
     $('#buttonLoginUser').click(login);
    $('#linkLogout').click(logout);
    $('#linkContact').click(() => showView('contact'));


    function menuLinks(){
     $('#linkHome').show();
     $('#linkServices').show();
   //  $('#linkLogin').show();
     $('#linkContact').show();

        if (localStorage.getItem('authtoken')) {
            console.log('loged in menu lins');
            $('#linkLogin').hide();
            $('#linkOrders').show();
            $('#linkNewOrder').show();
            $('#linkLogout').show();
            $('#loggedInUser').text(`| Hi, ${localStorage.getItem('username')}`);

        } else {

            $('#linkLogin').show();
            $('#linkOrders').hide();
            $('#linkNewOrder').hide();
            $('#linkLogout').hide();
            $('#loggedInUser').text('');
        }
    }

    function showView(name){
        $('#home').hide();
        $('section').hide();

        switch(name){
            case 'home':
                $('#home').show();
                break;
            case 'services':
                $('#services').show();
                break;
            case 'login/register':
                let formLogin = $('.sign-in-htm');

                $('#login').show();
                formLogin.trigger('reset');
                $('.sign-up-htm').trigger("reset");
                break;
            case 'orders':
                //todo
                $('#orders').show();
                break;
            case 'newOrder':
                //todo
                $('#newOrder').show();
                $('#formNewOrder').trigger("reset");
                break;

            case 'edit':
            //todo
            case 'details':
               //todo
            break;

            case 'contact': $('#contact').show(); break;
        }
    }

    //USER INTERACTIONS
    function registerUser(){
        let username = $('#username').val();
        let pass= $('#passwd').val();
        auth.register(username, pass)
            .then(function(data){
                auth.saveSession(data);

            });
        menuLinks();
        showView('home');

    }

   function login(){
        console.log('loggin');
        let username = $('#user').val();
        let passwd = $('#pass').val();

        auth.login(username, passwd).then((ctx) => {
            auth.saveSession(ctx)
          });



       menuLinks();
       showView('home');

    }

    function logout(){
        menuLinks();
        auth.logout().then(() => {
            console.log('logout');
            localStorage.clear();

        });

       showView('services');
    }
});