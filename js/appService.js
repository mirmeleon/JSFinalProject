let appService = (() => {

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

    function editOrder(orderId, publishedDate, status, designElements, teamName, name, appType, pageCount, functionality, deadline, comment) {
        let editOrderData = {
            publishedDate:publishedDate,
            status:status,
            designElements:designElements,
            teamName:teamName,
            name:name,
            appType:appType,
            pageCount:pageCount,
            functionality:functionality,
            deadline:deadline,
            comment:comment
        };

        return remote.update('appdata',`orders/${orderId}`, editOrderData, 'Kinvey')
    }
    return {
        createNewOrder,
        editOrder
    }
})();