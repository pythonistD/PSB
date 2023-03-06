function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
const csrftoken = getCookie('csrftoken');

function detail_citizen(event){
    let citizen_id = event.currentTarget.textContent;
    fetch('http://127.0.0.1:8000/game/detail-citizen/', {
    method: 'POST',
    credentials: 'same-origin',
    headers:{
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', //Necessary to work with request.is_ajax()
        'X-CSRFToken': csrftoken,
    },
    body: JSON.stringify({'citizen_id': citizen_id}) //JavaScript object of data to POST
    })
    .then(response => {
        return response.json(); //Convert response to JSON
    })
    .then(data => {
    const inf_div = document.getElementById('game-inf-container');
    inf_div.innerHTML='';
    let c = 0;
    for (let key in data){
        let p = document.createElement('p');
        p.innerHTML = `${key}: ${data[key]}`;
        inf_div.append(p);
        c += 1;
    }
    })
}

function detail_ins(event){
    let citizen_id = event.currentTarget.textContent;
    fetch('http://127.0.0.1:8000/game/detail-ins/', {
    method: 'POST',
    credentials: 'same-origin',
    headers:{
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', //Necessary to work with request.is_ajax()
        'X-CSRFToken': csrftoken,
    },
    body: JSON.stringify({'citizen_id': citizen_id}) //JavaScript object of data to POST
    })
    .then(response => {
        return response.json(); //Convert response to JSON
    })
    .then(data => {
    const inf_div = document.getElementById('game-inf-container');
    inf_div.innerHTML='';
    let c = 0;
    for (let key in data){
        let p = document.createElement('p');
        p.innerHTML = `${key}: ${data[key]}`;
        inf_div.append(p);
        c += 1;
    }
    })
}

function detail_perf(event){
    let citizen_id = event.currentTarget.textContent;
    fetch('http://127.0.0.1:8000/game/detail-perf/', {
    method: 'POST',
    credentials: 'same-origin',
    headers:{
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', //Necessary to work with request.is_ajax()
        'X-CSRFToken': csrftoken,
    },
    body: JSON.stringify({'citizen_id': citizen_id}) //JavaScript object of data to POST
    })
    .then(response => {
        return response.json(); //Convert response to JSON
    })
    .then(data => {
    const inf_div = document.getElementById('game-inf-container');
    inf_div.innerHTML='';
    let c = 0;
    for (let key in data){
        let p = document.createElement('p');
        p.innerHTML = `${key}: ${data[key]}`;
        inf_div.append(p);
        c += 1;
    }
    })
}

function detail_criminal(event){
    let citizen_id = event.currentTarget.textContent;
    fetch('http://127.0.0.1:8000/game/detail-criminal/', {
    method: 'POST',
    credentials: 'same-origin',
    headers:{
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', //Necessary to work with request.is_ajax()
        'X-CSRFToken': csrftoken,
    },
    body: JSON.stringify({'citizen_id': citizen_id}) //JavaScript object of data to POST
    })
    .then(response => {
        return response.json(); //Convert response to JSON
    })
    .then(data => {
    const inf_div = document.getElementById('game-inf-container');
    inf_div.innerHTML='';
    let c = 0;
    for (let key in data){
        let p = document.createElement('p');
        p.innerHTML = `${key}: ${data[key]}`;
        inf_div.append(p);
        c += 1;
    }
    })
}

function show_table_in_load(url, el_id, label_id_name, tr_id_name, detail_f){
    let tbody = document.getElementById(el_id);
    fetch(url, {
        headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest', //Necessary to work with request.is_ajax()
        },
    })
        .then(response => {
            return response.json() //Convert response to JSON
        })
        .then(data => {
            let c = 0;
            for (let citizen of data.data){
                let tr = document.createElement('tr');
                tr.setAttribute('id', `${tr_id_name}${citizen['citizen_id']}`);
                let td0 = document.createElement('td');
                let td1 = document.createElement('td');
                let td2 = document.createElement('td');
                td0.addEventListener('click', detail_f);
                td1.innerHTML = citizen['first_name'];
                td2.innerHTML = citizen['second_name'];

                let div_form_check = document.createElement('div');
                div_form_check.className = 'form-check';
                let form_check_input = document.createElement('input');
                form_check_input.className = 'form-check-input';
                form_check_input.type = 'checkbox';
                let check_input_id = `${label_id_name}${c}`;
                form_check_input.id = check_input_id;
                let form_check_label = document.createElement('label');
                form_check_label.className = 'form-check-label';
                form_check_label.setAttribute('for', check_input_id);
                td0.append(div_form_check);
                div_form_check.append(form_check_input);
                div_form_check.append(form_check_label);
                form_check_label.innerHTML = citizen['citizen_id'];

                tr.append(td0, td1, td2);
                tbody.append(tr);
                c += 1;
            }
        });
}


document.addEventListener('DOMContentLoaded', function () {
    show_table_in_load('http://127.0.0.1:8000/game/psb-ins-list/', 'game-tbody-ins', 'game-ins-check', 'game-tr-ins', detail_ins);
});

document.addEventListener('DOMContentLoaded', function () {
    show_table_in_load('http://127.0.0.1:8000/game/psb-perf-list/', 'game-tbody-perf', 'game-perf-check', 'game-tr-perf', detail_perf);
});

document.addEventListener('DOMContentLoaded', function () {
    show_table_in_load('http://127.0.0.1:8000/game/criminal-citizen-list/', 'game-tbody-criminal', 'game-criminal-check', '', detail_criminal);
});

function get_checked_inspectors_or_performers(tbody_id){
    let tbody_inputs = document.querySelectorAll(`#${tbody_id} tr td input`);
    let ids = [];
    console.log(tbody_inputs);
    for (let input of tbody_inputs){
        if (input.checked){
            let label = input.labels[0];
            ids.push(label.textContent);
        }
    }
    return ids;
}

let text_l = [];

const btn_submit_stack = document.getElementById("game-btn-submit-stack");
btn_submit_stack.addEventListener('click', function () {
    const ins_ids = get_checked_inspectors_or_performers('game-tbody-ins');
    const perf_ids = get_checked_inspectors_or_performers('game-tbody-perf');
    const criminal_id = get_checked_inspectors_or_performers('game-tbody-criminal');
    if (ins_ids.length < 1){
        alert('Нужно выбрать минимум одного испектора');
        return;
    }
    if (criminal_id.length < 1 || criminal_id.length > 1){
        alert('Нужно выбрать одного преступника');
        return;
    }
    console.log(ins_ids);
    console.log(perf_ids);
    console.log(criminal_id);
    fetch('http://127.0.0.1:8000/game/create-task-force/', {
    method: 'POST',
    credentials: 'same-origin',
    headers:{
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', //Necessary to work with request.is_ajax()
        'X-CSRFToken': csrftoken,
    },
    body: JSON.stringify({'ins_ids': ins_ids,
                                'perf_ids': perf_ids,
                                'criminal_id': criminal_id[0]}) //JavaScript object of data to POST
    })
    .then(response => {
        return response.json(); //Convert response to JSON
    })
    .then(data => {
        let criminal_name = data['criminal_name'];
        let hostages = data['hostages'];
        let weapon = data['criminal_weapon'];
        let mission_res = data['mission_result'];
        let criminal_id = data['criminal_citizen_id'];
        text_l = [];
        text_l.push(`Оперативная группа выдвигается к преступнику ${criminal_name}`);
        text_l.push('Оперативная группа прибыла к местонахождению преступника');
        text_l.push(`У преступника ${criminal_name} ${hostages} заложников`);
        text_l.push('Преступник заметил оперативную группу');
        text_l.push(`Преступник достал ${weapon}`);
        text_l.push('Начался бой между оперативниками и преступником');
        if (mission_res === 'psb-win'){
            let arrests_counter = document.getElementById('arrests-counter');
            let counter_val = parseInt(arrests_counter.textContent) + 1;
            arrests_counter.innerHTML = `${counter_val}`;
            window.sessionStorage.setItem('counter', `${counter_val}`);
            text_l.push('Победу одержала оперативная группа! Преступник задержан');
        } else {
            text_l.push('Победу одержал преступник. Преступник скрылся');
        }
        let tr_criminal = document.getElementById(`${criminal_id}`);
        tr_criminal.remove();
        console.log(data);
    })
});

class Timer {

    constructor() {
        this.time = 0;
        this.element = null;
        this.control = true;
        this.callback = null;
        this.timeLimit = 10;
    }

    set(time, id, callback = null) {
        this.time = time;
        this.element = document.getElementById(id);
        this.callback = callback;
    }

    setTimeLimit(time) {
        this.timeLimit = time;
    }

    start(type = 'COUNT_DOWN') {
        this.control = true;

        setTimeout(() => {
            if(type == 'COUNT_DOWN')
                this.countDown();
            else if(type == 'COUNT_UP')
                this.countUp();
        }, 1000);
    }

    decrease_time_10s() {
        this.time -= 10;
    }

    format() {
        let hours = parseInt(this.time / 3600);
        let timeLeft = this.time - hours * 3600;
        let minutes = parseInt(timeLeft / 60);
        timeLeft = timeLeft - minutes * 60;
        let seconds = timeLeft;

        hours = hours.toString();
        minutes = minutes.toString();
        seconds = seconds.toString();

        if (hours.length == 1)
            hours = '0' + hours;
        if (minutes.length == 1)
            minutes = '0' + minutes;
        if (seconds.length == 1)
            seconds = '0' + seconds;

        return hours + ':' + minutes + ':' + seconds;
    }

    countDown() {
        if(!this.control)
            return;
        let timerblock = this.element;
        timerblock.innerHTML = this.format();
        timerblock.style.display = 'block';

        if (this.time <= 59) {
            timerblock.style.color = 'red';
        }

        if (this.time <= 0) {
            timerblock.innerHTML = 'Time end!';
            this.callback();
            this.stop();
        }
        else {
            setTimeout(() => {
                this.countDown();
            }, 1000);
            this.time--;
            window.sessionStorage.setItem('Timer', this.time);
        }
    }

    countUp() {
        if(!this.control)
            return;
        let timerblock = this.element;
        timerblock.innerHTML = this.format();
        timerblock.style.display = 'block';

        if(this.time >= this.timeLimit) {
            timerblock.innerHTML = 'Timer Limit Exceed!';
            this.callback();
            this.stop();
        }
        else {
            setTimeout(() => {
                this.countUp();
            }, 1000);
            this.time++;
        }
    }

    stop() {
        this.control = false;
    }
}

function delete_analyst(url){
    fetch(url, {
        headers: {
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest', //Necessary to work with request.is_ajax()
        },
    })
        .then(response => {
            return response.json() //Convert response to JSON
        })
        .then(data => {
            console.log(data);
        });
}

const end_game_btn = document.getElementById('game-btn-end-game');
end_game_btn.addEventListener('click', function (){
    window.sessionStorage.setItem('game-res', 'criminal-win');
    delete_analyst('http://127.0.0.1:8000/game/delete-analyst/');
    window.location.replace('http://127.0.0.1:8000/game/end-game-page/');
})

const callback = () => {
    let arrests_counter = document.getElementById('arrests-counter');
    let arrests = parseInt(arrests_counter.textContent);
    if (arrests === 5){
        window.sessionStorage.setItem('game_res', 'psb-win');
    } else {
        window.sessionStorage.setItem('game_res', 'criminal-win');
    }
    delete_analyst('http://127.0.0.1:8000/game/delete-analyst/');
    window.location.replace('http://127.0.0.1:8000/game/end-game-page/');
    console.log('callback function called from timer');
}

const timer = new Timer();

document.addEventListener('DOMContentLoaded', function () {
    let countdown_time = parseInt(window.sessionStorage.getItem('Timer')) || 300;
    timer.set(countdown_time, 'timer', callback);
    timer.start('COUNT_DOWN');
});

document.addEventListener('DOMContentLoaded', function () {
    let c = document.getElementById('arrests-counter');
    c.innerHTML = window.sessionStorage.getItem('counter') || '0';
})

const send_stack_btn = document.querySelector('#game-btn-send-stack');
const console_t = document.querySelector('#typed');

function type_text(){
    let out = '';
    let p_l = 0;
    let p_ch = 0;
    console_t.innerHTML='';
    let p_console = document.createElement('p');
    console_t.append(p_console);
    function typeline() {
        let interval = setTimeout(function () {
            out += text_l[p_l][p_ch];
            p_console.innerHTML = out;
            p_ch++;
            if (p_ch >= text_l[p_l].length) {
                out = '';
                p_ch = 0;
                p_l++;
                if (p_l >= text_l.length) {
                    clearTimeout(interval);
                    return true;
                }
                p_console = document.createElement('p');
                console_t.append(p_console);
            }
            typeline();
        }, 50);
    }
    typeline();
}

send_stack_btn.addEventListener('click', function () {
    type_text();
})
