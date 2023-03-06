document.addEventListener('DOMContentLoaded', function () {
    const res_container = document.getElementById('end-game-results');
    let h1 = document.createElement('h1');
    let res = window.sessionStorage.getItem('game_res');
    if (res === 'psb-win'){
        h1.innerHTML = 'Поздравляем, вы выйграли!';
    } else {
        h1.innerHTML = 'Вы проиграли (';
    }
    res_container.append(h1);
});