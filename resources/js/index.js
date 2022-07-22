
//Getting all the references
const MainPlay = document.getElementById('mainplaybtn');
const Intro = document.getElementById('intro');
const SelectOption = document.getElementById('thebtns');


//Hiding select modes
SelectOption.style.display = "none";


//Displaying Select Mode after clicking MainPlay button
MainPlay.addEventListener('click', function () {

    SelectOption.style.display = "initial";

    Intro.style.display = "none";

})