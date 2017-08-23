let infoBoxController = (()=>{
    function showInfo(message)
    {

       // if (isLoading) {
       //     stopLoading();
      //  }

        $('.infoBox').text('');
        $('.infoBox').show();

        let html = $(`<div class="infoBox"></i><h1 class="infoMessage">   ${message}</h1></div>`);
        $('.profilLink').showBalloon({
            html: true,
            contents: html,
            position:'bottom left',
            showDuration: 500,
            hideDuration: 500,
            css:{ backgroundColor: "#f05f40", color:'#c9beaf'}

        })
          setTimeout(()=>{$('.infoBox').parent().attr('class','animated zoomOutRight')},2000);
          setTimeout(()=>{$('.infoBox').parent().remove()},3000);



    }

    return {showInfo}
    
    
})()