
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
    const inf_div = document.getElementById('start-game-inf');
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


function show_table_in_load(url, el_id, label_id_name){
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
                let td0 = document.createElement('td');
                let td1 = document.createElement('td');
                let td2 = document.createElement('td');
                td0.addEventListener('click', detail_citizen);
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
    show_table_in_load('http://127.0.0.1:8000/game/citizen-json/', 'start-game-tbody-citizen', 'citizen-check');
});

document.addEventListener('DOMContentLoaded', function () {
    show_table_in_load('http://127.0.0.1:8000/game/inspector-list/', 'start-game-tbody-ins', 'ins-check');
});

document.addEventListener('DOMContentLoaded', function () {
    show_table_in_load('http://127.0.0.1:8000/game/performer-list/', 'start-game-tbody-perf', 'perf-check');
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

const btn_submit_stack = document.getElementById("start-game-btn-submit-stack");
btn_submit_stack.addEventListener('click', function () {
    const ins_ids = get_checked_inspectors_or_performers('start-game-tbody-ins');
    const perf_ids = get_checked_inspectors_or_performers('start-game-tbody-perf');
    if (ins_ids.length > 2 || ins_ids.length < 2){
        alert('Для того, чтобы начать игру вам нужно выбрать 2 Инспекторов');
        return;
    }
    if (perf_ids.length > 5 || perf_ids.length < 3){
        alert('Для того, чтобы начать игру вам нужно выбрать минимум 3 Исполнителей');
        return;
    }
    console.log(ins_ids);
    console.log(perf_ids);
    fetch('http://127.0.0.1:8000/game/create-psb/', {
    method: 'POST',
    credentials: 'same-origin',
    headers:{
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest', //Necessary to work with request.is_ajax()
        'X-CSRFToken': csrftoken,
    },
    body: JSON.stringify({'ins_ids': ins_ids,
                                'perf_ids': perf_ids}) //JavaScript object of data to POST
    })
    .then(response => {
        return response.json(); //Convert response to JSON
    })
    .then(data => {
        console.log(data);
    })
});
