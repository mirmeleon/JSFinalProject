$(() => {

    const app = Sammy('#main', function (){
       this.use('Handlebars', 'hbs');


       //HOME PAGE
       this.get('index.html', actionController.renderHome);
       this.get('#/home', actionController.renderHome);
        //SERVICES
        this.get('#/services',actionController.renderServices);
        //LOGIN
        this.get('#/login',actionController.renredLogin);
        //Login Post
        this.post('#/login',actionController.actionLogin)
        //REGISTER
        this.get('#/register', actionController.renderRegister);
        //Register Post
        this.post('#/register',actionController.actionRegister);
        //LOGOUT
        this.get('#/logout', actionController.actionLogout);
        //ORDERS
        this.get('#/orders',actionController.renderOrders)
        //Order Edit
        this.get('#/orders/edit/:id',actionController.renderOrderEdit)
    });

    app.run();

});