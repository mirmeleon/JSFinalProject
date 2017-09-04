$(() => {

    const app = Sammy('#main', function (){
       this.use('Handlebars', 'hbs');

       //HOME PAGE
       this.get('index.html', actionController.renderHome);
       this.get('#/home', actionController.renderHome);
        //SERVICES
        this.get('#/services',actionController.renderServices);
        //LOGIN
        this.get('#/login',actionController.renderLogin);
        //Login Post
        this.post('#/login',actionController.actionLogin);
        //REGISTER
        this.get('#/register', actionController.renderRegister);
        //Register Post
        this.post('#/register',actionController.actionRegister);
        //LOGOUT
        this.get('#/logout', actionController.actionLogout);
        //NEW ORDER
        this.get('#/neworder', actionController.renderNewOrder);
        //New Order Post
        this.post('#/neworder', actionController.actionNewOrder);
        //ORDERS
        this.get('#/orders',actionController.renderOrders);
        //Orders Edit
        this.get('#/orders/edit/:id',actionController.renderOrderEdit);
        //NEW ORDER
        this.get('#/neworder', actionController.renderNewOrder);
        //New Order Post
        this.post('#/neworder', actionController.actionNewOrder);
    });

    app.run();

});