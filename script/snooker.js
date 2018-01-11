$(function () {

    //variáveis de responsividade da página
    var pageWidth = screen.width * 0.85; //aplica ao tamanho da screen um valor fixo de ajuste para a largura
    var pageHeight = screen.height * 0.74; //aplica ao tamanho da screen um valor fixo de ajuste para a comprimento
    var buttonWidth = screen.width * 0.25 //aplica ao tamanho do botão um valor fixo de ajuste para a largura
    var buttonHeight = screen.height * 0.1 //aplica ao tamanho do botão um valor fixo de ajuste para a o comprimento
    var btnFontSize = (screen.width / screen.height) / 0.034; //aplica à fonte do botão um valor fixo de ajuste
    var canvasZoom = screen.width * 0.052; //zoom a aplicar ao canvas(browser) para responsividade do jogo



    //verifica a origem do dispositivo para apresentar uma mensagem de incompatibilidade
    if (/Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini|IPAD/i.test(navigator.userAgent)) {
        $('body').empty(); //limpa o body
        $('#body').css("background-image", "url('images/menu/menu.jpg')");
        $('body').append('<div><img class="center-block" src="images/logo_snooker.png" width="400"></div>');
        $('body').append('<p id="membroequipa"class="text-center">O Jogo encontra-se indisponivel para Smartphones e Tablets...</p>');
    } else {
        //Background
        $('#body').css("background-color", "green");
        $('body').css("background-size", pageWidth + "px" + " " + pageHeight + "px");
        //Butões Menu Principal
        $('.btn').css("width", buttonWidth + "px");
        $('.btn').css("height", buttonHeight + "px");
        $('.btn').css("font-size", btnFontSize + "px");

        //Clique no Botão JOGAR
        $('#btn_jogar').click(function () {
            location.href = 'Jogo.html';
            console.log("jogo");
        });

        //Clique no Botão COMOJOGAR
        $('#btn_ajuda').click(function () {
            location.href = 'menuajuda.html';
        });

        //Clique no Botão CRÉDITOS
        $('#btn_creditos').click(function () {
            location.href = 'creditos.html';
        });
        //Clique no Botão MENU
        $('#btn_menu').click(function () {
            location.href = 'index.html';
        });

        
    }
});