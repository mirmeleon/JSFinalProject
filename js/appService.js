let appService = (() => {
    function loadOrderDetails(orderId) {
        return remote.get('appdata', `orders/${orderId}`, 'Kinvey');
    }

    function createNewOrder(name, appType, comment, deadline, designElements, functionality, pageCount, publishedDate) {
        let newOrderData = {
            publishedDate: publishedDate,
            designElements: designElements,
            comment: comment,
            name:name,
            appType: appType,
            pageCount: pageCount,
            functionality: functionality,
            deadline: deadline
        };

        return remote.post('appdata', 'orders', newOrderData,'Kinvey');
    }

    function editOrder(orderId, publishedDate, designElements, name, appType, pageCount, functionality, deadline, comment, status, teamName) {
        let editOrderData = {
            publishedDate:publishedDate,
            designElements:designElements,
            name:name,
            appType:appType,
            pageCount:pageCount,
            functionality:functionality,
            deadline:deadline,
            comment:comment,
            status:status,
            teamName:teamName
        };

        return remote.update('appdata',`orders/${orderId}`, editOrderData, 'Kinvey')
    }
    return {
        loadOrderDetails,
        createNewOrder,
        editOrder
    }
})();