let util = (()=>{

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }
    function calcTime(dateIsoFormat) {
        let diff = new Date - (new Date(dateIsoFormat));
        diff = Math.floor(diff / 60000);
        if (diff < 1) return 'less than a minute';
        if (diff < 60) return diff + ' minute' + pluralize(diff);
        diff = Math.floor(diff / 60);
        if (diff < 24) return diff + ' hour' + pluralize(diff);
        diff = Math.floor(diff / 24);
        if (diff < 30) return diff + ' day' + pluralize(diff);
        diff = Math.floor(diff / 30);
        if (diff < 12) return diff + ' month' + pluralize(diff);
        diff = Math.floor(diff / 12);
        return diff + ' year' + pluralize(diff);
        function pluralize(value) {
            if (value !== 1) return 's';
            else return '';
        }
    }

    //sanitaize
    function cleanForm(html){
        return $($.parseHTML(html)).text();
    }

    return {formatDate,calcTime, cleanForm}

})();