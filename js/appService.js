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
    return {
        createNewOrder
    }
})();