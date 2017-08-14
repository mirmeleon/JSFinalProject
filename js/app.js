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


});