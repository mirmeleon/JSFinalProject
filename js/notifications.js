//Documentation: http://izitoast.marcelodolce.com/
//position: It can be bottomRight, bottomLeft, topRight, topLeft, topCenter, bottomCenter or center.

let notifications = (() => {

    function success(title, message, position){
        iziToast.success(getDetails(title, message, position));
    }

    function info(title, message, position){
        iziToast.info(getDetails(title, message, position));
    }

    function warning(title, message, position){
        iziToast.warning(getDetails(title, message, position));
    }

    function error(title, message, position){
        iziToast.error(getDetails(title, message, position));
    }

    function getDetails(title, message, position){
        if(position == undefined){
            position = 'topCenter';
        }

        return {
            title: title,
            message: message,
            position: position,
            progressBar: true,
            color:'#F05F40',
            transitionIn: 'bounceInRight',
            transitionOut: 'fadeOutRight',
            close: true,
            timeout: 3000,
            drag: true
        }
    }

    return {
        success, info, warning, error
    }
})();