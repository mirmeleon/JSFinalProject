$(() => {

    const app = Sammy('#main', function (){
       this.use('Handlebars', 'hbs');


       //HOME PAGE
       this.get('index.html', displayHome);
      //  this.get('', displayHome);

        this.get('#/home', displayHome);

        function displayHome(ctx){
            ctx.loggedIn = localStorage.getItem('authtoken') !== null;
            ctx.username = localStorage.getItem('username');


            this.loadPartials({
                header:'./templates/common/header.hbs',
                footer:'./templates/common/footer.hbs'
            }).then(function(){
                this.partial('./templates/home/home.hbs');

            });
        }

        //SERVICES
        this.get('#/services', function(ctx){
            ctx.loggedIn = localStorage.getItem('authtoken') !== null;
            ctx.username = localStorage.getItem('username');

            this.loadPartials({
                header:'./templates/common/header.hbs',
                footer:'./templates/common/footer.hbs'
            }).then(function(){

                this.partial('./templates/services/services.hbs');
            })

        });

        //LOGIN
        this.get('#/login', function(ctx){

            this.loadPartials({
                header:'./templates/common/header.hbs',
                footer:'./templates/common/footer.hbs'
            }).then(function(){

                this.partial('./templates/login/login.hbs');
            });
        });

        this.post('#/login', function(ctx){

            let username = ctx.params.user;
            let password = ctx.params.pass;
            console.log(username);
            console.log(password);
            auth.login(username, password)
                .then(function(userInfo){
                    auth.saveSession(userInfo);
                    ctx.redirect('#/home');
            })
        });


        //REGISTER
        this.get('#/register', function(){

            this.loadPartials({
                header:'./templates/common/header.hbs',
                footer:'./templates/common/footer.hbs'
            }).then(function(){

                this.partial('./templates/register/register.hbs');
            });
        });

        this.post('#/register', function(ctx){
           let username = ctx.params.username;
           let pass = ctx.params.passwd;

                 auth.register(username, pass)
                     .then(function(userInfo){
                         auth.saveSession(userInfo);
                         ctx.redirect('#/home');

                     })

        });

        //LOGOUT
        this.get('#/logout', function(ctx){

            auth.logout().then(function(){
               localStorage.clear();
                ctx.redirect('#/home');
            });


        });

        //ORDERS
        this.get('#/orders', function(ctx){
            ctx.loggedIn = localStorage.getItem('authtoken') !== null;
            ctx.username = localStorage.getItem('username');

            this.loadPartials({
                header:'./templates/common/header.hbs',
                footer:'./templates/common/footer.hbs'
            }).then(function(){

                this.partial('./templates/orders/orders.hbs');
            });
        })

    });

    app.run();


    //LINKS and BUTTONS
   //  menuLinks();
   //  $('#logo').click(() => showView('home'));
   //  $('#linkHome').click(() => showView('home'));
   //  $('#linkServices').click(() => showView('services'));
   //  $('#linkLogin').click(() => showView('login/register'));
   // // $('#linkOrders').click(() => showView('orders'));
   //  // $('#linkContact').click(() => showView('contact'));
   //
   //  $('#btnRegister').click(registerUser);
   //   $('#buttonLoginUser').click(login);
   //  $('#linkLogout').click(logout);
   //  $('#linkContact').click(() => showView('contact'));
   //
   //
   //  function menuLinks(){
   //   $('#linkHome').show();
   //   $('#linkServices').show();
   // //  $('#linkLogin').show();
   //   $('#linkContact').show();
   //
   //      if (localStorage.getItem('authtoken')) {
   //          console.log('loged in menu lins');
   //          $('#linkLogin').hide();
   //          $('#linkOrders').show();
   //          $('#linkNewOrder').show();
   //          $('#linkLogout').show();
   //          $('#loggedInUser').text(`| Hi, ${localStorage.getItem('username')}`);
   //
   //      } else {
   //
   //          $('#linkLogin').show();
   //          $('#linkOrders').hide();
   //          $('#linkNewOrder').hide();
   //          $('#linkLogout').hide();
   //          $('#loggedInUser').text('');
   //      }
   //  }
   //
   //  function showView(name){
   //      $('#home').hide();
   //      $('section').hide();
   //
   //      switch(name){
   //          case 'home':
   //              $('#home').show();
   //              break;
   //          case 'services':
   //              $('#services').show();
   //              break;
   //          case 'login/register':
   //              let formLogin = $('.sign-in-htm');
   //
   //              $('#login').show();
   //              formLogin.trigger('reset');
   //              $('.sign-up-htm').trigger("reset");
   //              break;
   //          case 'orders':
   //              //todo
   //              $('#orders').show();
   //              break;
   //          case 'newOrder':
   //              //todo
   //              $('#newOrder').show();
   //              $('#formNewOrder').trigger("reset");
   //              break;
   //
   //          case 'edit':
   //          //todo
   //          case 'details':
   //             //todo
   //          break;
   //
   //          case 'contact': $('#contact').show(); break;
   //      }
   //  }
   //
   //  //USER INTERACTIONS
   //  function registerUser(){
   //      let username = $('#username').val();
   //      let pass= $('#passwd').val();
   //      auth.register(username, pass)
   //          .then(function(data){
   //              auth.saveSession(data);
   //
   //          });
   //      menuLinks();
   //      showView('home');
   //
   //  }
   //
   // function login(){
   //     // console.log('loggin');
   //      let username = $('#user').val();
   //      let passwd = $('#pass').val();
   //
   //      auth.login(username, passwd).then((ctx) => {
   //          auth.saveSession(ctx)
   //        });
   //
   //
   //
   //     menuLinks();
   //     showView('home');
   //
   //  }
   //
   //  function logout(){
   //      menuLinks();
   //      auth.logout().then(() => {
   //          console.log('logout');
   //          localStorage.clear();
   //
   //      });
   //
   //     showView('services');
   //  }
});