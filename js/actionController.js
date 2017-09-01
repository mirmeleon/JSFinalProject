let actionController = (()=>{
    function renderHome(ctx) {
        ctx.loggedIn = localStorage.getItem('authtoken') !== null;
        ctx.username = localStorage.getItem('username');


        this.loadPartials({
            header:'./templates/common/header.hbs',
            footer:'./templates/common/footer.hbs'
        }).then(function(){
            this.partial('./templates/home/home.hbs');

        });
    }
    function renderServices(ctx) {
        ctx.loggedIn = localStorage.getItem('authtoken') !== null;
        ctx.username = localStorage.getItem('username');

        this.loadPartials({
            header:'./templates/common/header.hbs',
            footer:'./templates/common/footer.hbs'
        }).then(function(){

            this.partial('./templates/services/services.hbs');
        })
    }
    function renderLogin(ctx) {
        this.loadPartials({
            header:'./templates/common/header.hbs',
            footer:'./templates/common/footer.hbs'
        }).then(function(){

            this.partial('./templates/login/login.hbs');
        });
    }
    function renderOrders(ctx) {
        ctx.loggedIn = localStorage.getItem('authtoken') !== null;
        ctx.username = localStorage.getItem('username');
        //Get role from localStorage
        ctx.isAdmin = localStorage.getItem('role') === 'Admin';
        $(document).ajaxStart(showLoading);
        $(document).ajaxStop(hideLoading);
        ctx.loadPartials({
            header:'./templates/common/header.hbs',
            pagenation:'templates/common/pagenation.hbs',
            footer:'./templates/common/footer.hbs',
            order:'templates/orders/order.hbs',
            orderByForm:'templates/common/orderByForm.hbs'

        }).then(function(){
            this.partial('./templates/orders/orders.hbs').then(function () {
                $('#orderCriteria').change(showOrdersList);
                $('#ordersCeckBox').change(showOrdersList)

            });
            showOrdersList();

        });
        function hideLoading() {
            $('#ordersList').text('')
        }
        function showLoading() {
            if($('#ordersList').find('#loader')){
                let loader = $('<div id="loader"></div>');
                $('#ordersList').append(loader)
            }

        }
        function showOrdersList() {
            let orderByCriteria = $('#orderCriteria').val();

            let typeCriteria= [];
            $('.page-item').addClass('disabled');
            let typesToView = $('#ordersCeckBox input').each((i,e) => {if($(e).is(':checked')===true){typeCriteria.push($(e).val())}})
            function getAppIcon(type) {
                switch(type){
                    case'Mobile':
                        return 'fa fa-tablet';
                    case'Desktop':
                        return 'fa fa-desktop';
                    case'Web':
                        return 'fa fa-code';
                    case 'Hybrid':
                        return 'fa fa-gears';
                }

            }
            $('#ordersList').text('');


            remote.get('appdata','orders','Kinvey')
                .then(function (data) {
                    let orders = data.map(o => o = {isAdmin:ctx.isAdmin,deadLine:o.deadLine,teamName:o.teamName ,pubDate:o.publishedDate,name:o.name,_id:o._id,status:o.status,appIcon:getAppIcon(o.appType)});
                    let ordersToView = [];
                    function selectType() {
                        if(typeCriteria.length ===0){
                            ordersToView = orders;
                        }else {
                            orders.map(function (a) {
                                if(typeCriteria.includes(a.status)){ordersToView.push(a)}
                            })
                        }
                    }
                    selectType()
                    function orderOrdersList() {
                        if(orderByCriteria === 'DeadLine'){
                            ordersToView.sort(function (a,b) {
                                if(a.deadLine < b.deadLine){return -1}
                                else {return 1}
                            })
                        }
                        if(orderByCriteria === 'Date ascending'){

                            ordersToView.sort(function (a,b) {
                                if(a.pubDate < b.pubDate){return -1}
                                else {return 1}
                            })
                        }
                        if(orderByCriteria === 'Date descending'){

                            ordersToView.sort(function (a,b) {
                                if(a.pubDate > b.pubDate){return -1}
                                else {return 1}
                            })
                        }
                    }
                    orderOrdersList()
                    let currentPage = 1;
                    let pageCount = 1;
                    $('#pagenationNext').unbind()
                    $('#pagenationPrevious').unbind()
                    $('#pagenationNext').click(nextOrders)
                    $('#pagenationPrevious').click(priviousOrders)
                    if(ordersToView.length > 5) {
                        pageCount = Math.ceil(ordersToView.length / 5)

                        pageButtonOn();

                    }
                    function pageButtonOn() {

                        if(currentPage===1){
                            $('#pagenationNext').parent().removeClass('disabled')
                            $('#pagenationPrevious').parent().addClass('disabled')
                        }
                        else if(currentPage === pageCount){
                            $('#pagenationNext').parent().addClass('disabled')
                            $('#pagenationPrevious').parent().removeClass('disabled')
                        }
                        else{
                            $('#pagenationNext').parent().removeClass('disabled')
                            $('#pagenationPrevious').parent().removeClass('disabled')
                        }
                    }
                    function nextOrders() {
                        event.preventDefault();
                        $('#ordersList').text('')
                        currentPage++;
                        console.log(ordersToView)
                        showList(getListPart(ordersToView,currentPage))

                        pageButtonOn();
                    }
                    function priviousOrders() {
                        event.preventDefault();
                        $('#ordersList').text('')
                        console.log(ordersToView)
                        currentPage--;
                        showList(getListPart(ordersToView,currentPage))
                        pageButtonOn();

                    }

                    function showList(ordersList) {



                        Promise.all([$.get('templates/orders/order.hbs'),$.get("templates/orders/listOrders.hbs"),$.get("templates/orders/orderDetails.hbs")])
                            .then(function (response) {

                                $('#ordersList').text('')
                                var template = Handlebars.compile(response[1]);
                                Handlebars.registerPartial('order',response[0])
                                var html = template({orders:ordersList});
                                $('#ordersList').append(html)
                                $('.list-group  .list-group-item').mouseover(function () {
                                    $(this).css('background-color','#f05f40')
                                })
                                $('.list-group  .list-group-item').mouseout(function () {
                                    $(this).css('background-color','#FFFFFF')
                                })
                                let isAdmin = localStorage.getItem('role') === 'Admin';
                                var orderDetailsTemplete = Handlebars.compile(response[2]);
                                var shown = true;
                                $('.btnDetails').on("click", function() {

                                    let btn = this;
                                    $(btn).attr('id','shown')
                                    let orderId = $(btn).parent().parent().parent().attr('id');
                                    if(shown) {
                                        $($('.orderDetails').parent()).attr('class','')
                                        let currentOrder = data.filter(o=>o._id === orderId)[0];

                                        //Show 'edit' button in details when user is Author
                                        let isAuthor = currentOrder._acl.creator === localStorage.getItem('id');
                                        currentOrder.isAuthor = isAuthor;

                                        currentOrder.isAdmin = isAdmin;
                                        currentOrder.publishedDate = util.formatDate(currentOrder.publishedDate)
                                        currentOrder.deadline = util.formatDate(currentOrder.deadline)
                                        currentOrder.lastModifyDate = util.calcTime(currentOrder._kmd.lmt)
                                        var orderDetaisHtml = orderDetailsTemplete(currentOrder)
                                        $(this).showBalloon({
                                            html: true,
                                            contents: orderDetaisHtml,
                                            position:null,showDuration: 500, hideDuration: 500
                                        });

                                        $(document).click(function () {
                                            if(!$(event.target).is(btn)){
                                                $($('.orderDetails').parent()).attr('class','animated zoomOutUp');
                                                $(btn).hideBalloon();

                                                $(document).unbind('click');
                                                $(btn).attr('id','');
                                                shown = !shown
                                            }
                                        })

                                    }else {
                                        $($('.orderDetails').parent()).attr('class','animated zoomOutUp');
                                        $(this).hideBalloon();

                                        $(document).unbind('click');
                                        $(btn).attr('id','')
                                    }
                                    shown = !shown
                                }).showBalloon({});

                            })
                    }

                    showList(getListPart(ordersToView,1));

                    function getListPart(orderList,currentPage) {
                        let currentPart = [];
                        let startIndex = (currentPage-1)*5;
                        let endIndex = startIndex+5;
                        for (var i = startIndex; i < endIndex; i++) {
                            if(orderList[i] !== undefined){
                                currentPart.push(ordersToView[i])
                            }


                        }
                        return currentPart;
                    }
                    function showOrderDetails() {
                        let orderId = $(this).parent().parent().parent().attr('id');
                        let btn = $(this);

                    }


                }).catch(function (reason) {
                    let errMessage = JSON.parse(reason.responseText).description;
                notifications.error(`Error:`,`${errMessage}`);
            })
        }
    }
    function renderOrderEdit(ctx) {
        let orderId = ctx.params.id;
        let balloon = $('.orderDetails').parent();
        balloon.attr('class','animated jello');
        setTimeout(()=>{balloon.attr('class','animated zoomOut')},1000);
        setTimeout(()=>{balloon.remove()},3000);
        $(document).unbind('click');

        ctx.orderId = orderId;
        ctx.loggedIn = localStorage.getItem('authtoken') !== null;

        let auth = localStorage.getItem('authtoken');
        ctx.username = localStorage.getItem('username');
        let url = `orders/${orderId}`;
        remote.get('appdata',url,auth).then(function (data) {
            ctx.id = data.id;
            ctx.status = data.status;
            ctx.teamName = data.teamName;
            ctx.publishedDate = data.publishedDate;
            ctx.designElements = data.designElements;
            ctx.name = data.name;
            ctx.comment = data.comment;
            ctx.pageCount = data.pageCount;
            ctx.functionality = data.functionality;
            ctx.appType = data.appType;
            ctx.deadline = util.formatDate(data.deadline);
            ctx[ctx.appType] = 'selected';
            ctx.loadPartials({
                header:'./templates/common/header.hbs',
                footer:'./templates/common/footer.hbs'
            }).then(function(){
                this.partial('./templates/orders/editOrder.hbs').then(function () {
                    $('.editOrderBtn').click(editingOrder)
                });

            });
        }).catch(function (reason) {
            let errMessage = JSON.parse(reason.responseText).description;
            notifications.error(`Error:`,`${errMessage}`);
        });
        function editingOrder() {
            let appType = $('#appType').val();
            let pageCount = $('#pageCount').val();
            let functionality = $('#functionality').val();
            let deadline = $('#deadline').val();
            let comment = $('#comment').text();
            let status = ctx.status;
            let designElements = ctx.designElements;
            let teamName = ctx.teamName;
            let name = ctx.name;
            let publishedDate = ctx.publishedDate;

            appService.editOrder(orderId, publishedDate, designElements, name, appType, pageCount, functionality, deadline, comment, status, teamName).then(function (data) {
                notifications.success(`Order: ${name}`,`editing successful`);
                ctx.redirect('#/orders')
            }).catch(function (reason) {
                let errMessage = JSON.parse(reason.responseText).description;
                notifications.error(`Error:`,`${errMessage}`);
            })
        }

    }

    function renderOrderEditAsUser(ctx) {
        //TODO: to check if the order has been in progress. If it's entered in development can not be edited
        let orderId = ctx.params.id.substr(1);
        let balloon = $('.orderDetails').parent();
        balloon.attr('class', 'animated jello');
        setTimeout(() => {
            balloon.attr('class', 'animated zoomOut')
        }, 500);
        setTimeout(() => {
            balloon.remove()
        }, 500);
        $(document).unbind('click');

        appService.loadOrderDetails(orderId)
            .then(function (orderInfo) {
                ctx.orderId = orderId;
                ctx.loggedIn = localStorage.getItem('authtoken') !== null;
                ctx.username = localStorage.getItem('username');

                if (orderInfo.status !== undefined && orderInfo.status !== null) {
                    localStorage.setItem('status', orderInfo.status);
                }
                if(orderInfo.teamName !== undefined && orderInfo.status !== null){
                    localStorage.setItem('teamName', orderInfo.status);
                }
                ctx.nameOfApp = orderInfo.name;
                ctx.pageCount = orderInfo.pageCount;
                ctx.functionality = orderInfo.functionality;
                ctx.deadline = util.formatDate(orderInfo.deadline);
                ctx.comment = orderInfo.comment;
                ctx.appType = orderInfo.appType;
                ctx[ctx.appType] = 'selected';
                if (orderInfo.designElements === "Yes"){
                    ctx.checkYes = "checked";
                }else {
                    ctx.checkNo = "checked";
                }
                ctx.loadPartials({
                    header: './templates/common/header.hbs',
                    footer: './templates/common/footer.hbs',
                    editOrderForm: './templates/orders/editOrderFm.hbs'
                }).then(function () {
                    this.partial('./templates/orders/editOrderPg.hbs');
                });
            }).catch(function (reason) {
            let errMessage = JSON.parse(reason.responseText).description;
            notifications.error(`Error:`, `${errMessage}`);
        });
    }
    function renderNewOrder(ctx) {
        ctx.loggedIn = localStorage.getItem('authtoken') !== null;
        ctx.username = localStorage.getItem('username');
        ctx.loadPartials({
            header:'./templates/common/header.hbs',
            footer:'./templates/common/footer.hbs',
            newOrderForm: './templates/orders/newOrderForm.hbs'
        }).then(function(){
            this.partial('./templates/orders/newOrderPage.hbs');
        });
    }
    function renderRegister(ctx) {
        this.loadPartials({
            header:'./templates/common/header.hbs',
            footer:'./templates/common/footer.hbs'
        }).then(function(){
            this.partial('./templates/register/register.hbs');
        });
    }
    function actionLogin(ctx) {
        let username = ctx.params.user;
        let password = ctx.params.pass;

        auth.login(username, password)
            .then(function(userInfo){
                auth.saveSession(userInfo);
                notifications.success('Login success',`Wellcome ${username}`);
                ctx.redirect('#/home');
            }).catch(function (reason) {
            let errMessage = JSON.parse(reason.responseText).description;
            console.log(reason);
            notifications.error(`Error:`,`${errMessage}`);
        })
    }
    function actionRegister(ctx) {
        let username = ctx.params.username;
        let pass = ctx.params.passwd;

        auth.register(username, pass)
            .then(function(userInfo){
                auth.saveSession(userInfo);
                notifications.success('',`Register success`);
                ctx.redirect('#/home');

            }).catch(function (reason) {
            let errMessage = JSON.parse(reason.responseText).description;
            notifications.error(`Error:`,`${errMessage}`);
        })
    }
    function actionLogout(ctx) {
        auth.logout().then(function(){
            localStorage.clear();
            notifications.success('Logout success',`Bye bye`);
            ctx.redirect('#/home');
        }).catch(function (reason) {
            let errMessage = JSON.parse(reason.responseText).description;
            notifications.error(`Error:`,`${errMessage}`);
        });
    }
    function actionNewOrder(ctx) {
        let name = ctx.params.nameOfApp;
        let appType = ctx.params.appType;
        let comment = ctx.params.comment;
        let deadline = ctx.params.deadline;
        let designElements = ctx.params.designElements;
        let functionality = ctx.params.functionality;
        let pageCount = ctx.params.pageCount;
        let publishedDate = new Date();

        appService.createNewOrder(name, appType, comment, deadline, designElements, functionality, pageCount, publishedDate)
            .then(function () {
                notifications.success(`Order ${name}`,`created successfull`);
                ctx.redirect('#/orders');
            }).catch(function (reason) {
            let errMessage = JSON.parse(reason.responseText).description;
            notifications.error(`Error:`,`${errMessage}`);
        })
    }

    function actionEditOrderAsUser(ctx) {
        let orderId = ctx.params.id.substr(1);
        let name = ctx.params.nameOfApp;
        let appType = ctx.params.appType;
        let comment = ctx.params.comment;
        let deadline = ctx.params.deadline;
        let designElements = ctx.params.designElements;
        let functionality = ctx.params.functionality;
        let pageCount = ctx.params.pageCount;
        let publishedDate = new Date();
        let status = localStorage.getItem('status');
        let teamName = localStorage.getItem('teamName');

        appService.editOrder(orderId, publishedDate, designElements, name, appType, pageCount, functionality, deadline, comment, status, teamName)
            .then(function () {
                notifications.success(`Order ${name}`, `edited successfull`);
                localStorage.removeItem('status');
                localStorage.removeItem('teamName');
                ctx.redirect('#/orders');
            }).catch(function (reason) {
            let errMessage = JSON.parse(reason.responseText).description;
            notifications.error(`Error:`, `${errMessage}`);
        })
    }

    return {renderHome,
        renderServices,
        renderLogin,
        renderRegister,
        actionLogin,
        actionRegister,
        actionLogout,
        renderOrders,
        renderOrderEdit,
        actionNewOrder,
        renderNewOrder,
        renderOrderEditAsUser,
        actionEditOrderAsUser
    }
})();