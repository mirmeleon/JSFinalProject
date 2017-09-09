let actionController = (()=>{
    function renderHome(ctx) {
        ctx.loggedIn = auth.isAuthed;
        ctx.username = localStorage.getItem('username');
        ctx.isAdmin = localStorage.getItem('role') === 'Admin';
        ctx.isTeamMember = auth.getRole() === 'teamMember'

        this.loadPartials({
            header:'./templates/common/header.hbs',
            footer:'./templates/common/footer.hbs'
        }).then(function(){
            this.partial('./templates/home/home.hbs');

        });
    }
    function renderServices(ctx) {
        ctx.loggedIn = auth.isAuthed;
        ctx.username = localStorage.getItem('username');
        ctx.isAdmin = localStorage.getItem('role') === 'Admin';
        ctx.isTeamMember = auth.getRole() === 'teamMember'

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
        ctx.loggedIn = auth.isAuthed;
        ctx.username = auth.getUsername()
        //Get role from localStorage
        ctx.isAdmin = auth.getRole() === 'Admin'
        ctx.isTeamMember = auth.getRole() === 'teamMember'
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

            let query = 'orders'
            let userRole = auth.getRole()

            //TODO: the query have a problem here, cannot load with multiple teams. Leaving some queries that I've tried

            if(userRole !== undefined && userRole === 'teamMember'){
                //?query={"and":[{"firstName":"James", "lastName":"Bond"}]}
                //?query={"$or":[{"firstName":"James", "lastName":"Bond"}]}
                // {'name': { $regex: '^searchString' }};
                let teams = auth.getTeam();
                query += '?query={"teamName": "' + teams + '"}'
                //query += '?query={"$or":[{"teamName": "' + teams[0] + '"';

                for (var i = 1; i < teams.length; i++) {
                    //query += ', "teamName": "' + teams[i] + '"';
                    //query += '|' + teams[i]

                }

                //query += '}]}'
                //query += ')"}}'
                //query = {'teamName': { $regex: '^' + regex }};
            }

            if(userRole !== undefined && userRole == 'user'){
                let userId = auth.getId();

                query += '?query={"_acl.creator": "' + userId + '"}'
                query += '&sort={"publishedDate": -1}'
            }

            remote.get('appdata', query, 'Kinvey')
                .then(function (data) {
                    console.log(data)
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

                                //Show 'edit' button in details when current user is teamMember
                                let isTeamMember = localStorage.getItem('role') === 'teamMember';

                                var orderDetailsTemplete = Handlebars.compile(response[2]);
                                var shown = true;
                                $('.btnDetails').on("click", function() {
                                        //Fix bug: In case that have opened ballon dont open second
                                    if(!shown){
                                        event.preventDefault();
                                        return;
                                        shown = true;
                                    };


                                    let btn = this;
                                    $(btn).attr('id','shown')
                                    let orderId = $(btn).parent().parent().parent().attr('id');
                                    if(shown) {

                                        $($('.orderDetails').parent()).attr('class','')
                                        let currentOrder = data.filter(o=>o._id === orderId)[0];

                                        if (currentOrder.status === undefined || currentOrder.status === null) {
                                            currentOrder.isInProduction = false;
                                        }else{
                                            currentOrder.isInProduction = true;
                                        }

                                        //Show 'edit' button in details when user is Author
                                        let isAuthor = currentOrder._acl.creator === localStorage.getItem('id');
                                        currentOrder.isAuthor = isAuthor;

                                        //Show 'edit' button in details when current user is teamMember
                                        currentOrder.isTeamMember = isTeamMember;

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


                                            if(!$(event.target).is(btn) ){

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
        let orderId = ctx.params.id.substr(1);
        ctx.loggedIn = auth.isAuthed;
        ctx.username = localStorage.getItem('username');
        ctx.isTeamMember = localStorage.getItem('role') === 'teamMember';
        ctx.isAdmin = localStorage.getItem('role') === 'Admin';

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
                if (orderInfo.status === undefined || orderInfo.status === null){
                    ctx.isInProduction = false;
                }
                else {
                    ctx.isInProduction = true;

                }
                ctx.isAuthor = orderInfo._acl.creator === localStorage.getItem('id');
                ctx.orderId = orderId;
                ctx.appStatus = orderInfo.status;
                ctx[ctx.appStatus] = 'selected';
                ctx.teamName = orderInfo.teamName;
                ctx.publishedDate = orderInfo.publishedDate;
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
                }).then(function () {
                    this.partial('./templates/orders/editOrderPg.hbs')
                        .then(function () {
                            if(ctx.isInProduction === true) $('#orderDetails').hide();
                            $('#editOrderBtn').click(actionEditOrder);
                            $('#enableEditing').click(function () {
                                $('#orderDetails').show();
                                $('#enableEditingInfo').hide();
                            })
                        })
                });
            }).catch(function (reason) {
            let errMessage = JSON.parse(reason.responseText).description;
            notifications.error(`Error:`, `${errMessage}`);
        });

        function actionEditOrder() {

            let name, appType, pageCount, functionality, deadline, comment, designElements, status, teamName;

            if(ctx.isAuthor || ctx.isAdmin) name = $('#nameOfApp').val();
            else name = ctx.nameOfApp;

            if(ctx.isAuthor || ctx.isAdmin) appType = $('#appType').val();
            else appType = ctx.appType;

            if(ctx.isAuthor || ctx.isAdmin) pageCount = $('#numberOfPage').val();
            else pageCount = ctx.pageCount;

            if(ctx.isAuthor || ctx.isAdmin) functionality = $('#functionality').val();
            else functionality = ctx.functionality;

            if(ctx.isAuthor || ctx.isAdmin) deadline = $('#deadline').val();
            else deadline = ctx.deadline;

            if(ctx.isAuthor || ctx.isAdmin)comment = $('#comment').text();
            else comment = ctx.comment;

            if (ctx.isAuthor || ctx.isAdmin) designElements = $("input[type='radio'][name='designElements']:checked").val();
            else designElements = ctx.appType;

            if(ctx.isTeamMember || ctx.isAdmin) status = $('#appStatus').val();
            else status = ctx.appStatus;

            //TODO: teams load and edit
            /*
            if(ctx.isAdmin) teamName = $('#assignedTeam').val();
            else teamName = ctx.teamName;
            */

            teamName = ctx.teamName;
            let publishedDate = ctx.publishedDate;

            appService.editOrder(orderId, publishedDate, designElements, name, appType, pageCount, functionality, deadline, comment, status, teamName)
                .then(function () {
                    notifications.success(`Order ${name}`, `edited successfull`);
                    ctx.redirect('#/orders');
                }).catch(function (reason) {
                let errMessage = JSON.parse(reason.responseText).description;
                notifications.error(`Error:`, `${errMessage}`);
            })
        }
    }
    function renderNewOrder(ctx) {
        ctx.loggedIn = auth.isAuthed;
        ctx.username = localStorage.getItem('username');
        ctx.isAdmin = localStorage.getItem('role') === 'Admin';
        ctx.isTeamMember = auth.getRole() === 'teamMember'

        ctx.loadPartials({
            header:'./templates/common/header.hbs',
            footer:'./templates/common/footer.hbs',
            newOrderForm: './templates/orders/newOrderForm.hbs'
        }).then(function(){
            this.partial('./templates/orders/newOrderPage.hbs');
        });
    }
    function renderTeams(ctx) {
        ctx.loggedIn = auth.isAuthed;
        ctx.username = localStorage.getItem('username');
        ctx.isAdmin = localStorage.getItem('role') === 'Admin';
        ctx.isTeamMember = auth.getRole() === 'teamMember'

        ctx.loadPartials({
            header: './templates/common/header.hbs',
            footer: './templates/common/footer.hbs'
        }).then(function () {
            this.partial('./templates/teams/teams.hbs')
        })

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
        if(auth.isAuthed){
            ctx.redirect('#/register');
        }
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
    function actionDeleteOrder(ctx) {
        ctx.loggedIn = auth.isAuthed;
        ctx.username = localStorage.getItem('username');
        ctx.isAdmin = localStorage.getItem('role') === 'Admin';

        let orderId = ctx.params.id.substr(1);
        if(ctx.isAdmin === true) {
            appService.deleteOrder(orderId)
                .then(function () {
                    notifications.success('The order', 'has been successfully deleted');

                    ctx.redirect('#/orders');
                }).catch(function (reason) {
                let errMessage = JSON.parse(reason.responseText).description;
                notifications.error(`Error:`, `${errMessage}`);
            })
        }
        else{
            if(ctx.loggedIn()) {
                notifications.error(`No permissions:`, 'You are not Administrator!');
                ctx.redirect('#/orders');
            }
            else {
                notifications.error(`Error:`, 'You are not logged in!');
                ctx.redirect('#/login');
            }
        }
    }

    return {renderHome,
        renderServices,
        renderLogin,
        renderRegister,
        actionLogin,
        actionRegister,
        actionLogout,
        renderOrders,
        renderTeams,
        actionNewOrder,
        renderNewOrder,
        renderOrderEdit,
        actionDeleteOrder
    }
})();