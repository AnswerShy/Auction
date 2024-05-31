fetch('/header.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('header').innerHTML = data;
                headerFunc()
});
function headerFunc() {
    document.querySelectorAll('.menu_button').forEach(element => {
        element.addEventListener('click', () => {
            if( document.querySelector('.menu').style.display == "flex") {
                document.querySelector('.menu').style.display = "none"
            }
            else {
                document.querySelector('.menu').style.display = "flex"
            }  
        })
    });
}

function lots_request_func(filter) {
        var filterQ = ''
        if (filter != null) {
            filterQ = `?filter=${filter}`
        }
        else {
            filterQ = ''
        }
        console.log('/lots' + filterQ + "      " + filter)
        fetch('/lots' + filterQ)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                var datalist = document.getElementById('lot_container');
                var isReturn = false
                if (!datalist) {
                    datalist = document.querySelector(`#auc_${filter}`);
                    isReturn = true;
                }
                datalist.innerHTML = '';
                data.data.forEach(row => {
                    var card = document.createElement('div')
                    card.className = 'lot_class'

                    var pic = document.createElement('div')
                    pic.className = 'lot_pic'
                    card.appendChild(pic)

                    var name = document.createElement('p')
                    name.className = 'lot_name'
                    name.textContent = row.Опис;
                    pic.appendChild(name)

                    var cost = document.createElement('p')
                    cost.className = 'lot_cost'
                    cost.textContent = row.Ціна + "₴";
                    pic.appendChild(cost)

                    datalist.appendChild(card)
                });
            })
            .catch(error => console.error('Fetch error:', error));
}

function aucs_request_func(){
    fetch('/data?filter=aucs').then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const datalist = document.querySelector('.page_content');
        datalist.innerHTML = '';
        data.data.forEach(row => {
            var cardsThis = ''
            var auc = document.createElement('div')
            auc.className = 'auc_class'                   

            var name = document.createElement('div')
            name.className = 'auc_name'
            name.innerHTML = row.Назва;
            auc.appendChild(name)
            
            var content = document.createElement('div')
            content.className = `auc_content`
            content.id = `auc_${row.ID}`

            auc.appendChild(content)
            datalist.appendChild(auc)

        });
        return data
    })
    .then(data => {
        data.data.forEach(row => {
            lots_request_func(row.ID)
        })
    })
    .catch(error => console.error('Fetch error:', error));
}

// STATS PAGE
function get_users_stats_func(){
    fetch('/data?filter=users_sum_stats').then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const datalist = document.querySelector('#stats_user');
        datalist.innerHTML += '';
        for (var i = 0; i < 6; i++){
            var div = document.createElement('div')
            div.className = 'user'

            var name = document.createElement('p')
            name.className = 'name'
            name.innerHTML = `${i+1}. ` + data.data[i].Імя_користувача;
            div.appendChild(name)                   

            var sum = document.createElement('p')
            sum.className = 'sum'
            sum.innerHTML = data.data[i].Сума_транзакцій + "₴";
            div.appendChild(sum)

            datalist.appendChild(div)
        }
    })
    .catch(error => console.error('Fetch error:', error));
}

function get_most_sum_lot_func(){
    fetch('/data?filter=sums_list').then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const datalist = document.querySelector('#sums_list');
        datalist.innerHTML += '';
        for (var i = 0; i < 6; i++){
            var div = document.createElement('div')
            div.className = 'lot'

            var name = document.createElement('p')
            name.className = 'name'
            name.innerHTML = `${i+1}. ` + data.data[i].Опис;
            div.appendChild(name)                   

            var sum = document.createElement('p')
            sum.className = 'sum'
            sum.innerHTML = data.data[i].Ціна + data.data[i].Ціна_зміна + "₴";
            div.appendChild(sum)

            datalist.appendChild(div)
        }
    })
    .catch(error => console.error('Fetch error:', error));
}

function get_most_changed_sum_lot_func(){
    fetch('/data?filter=changed_sums_list').then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const datalist = document.querySelector('#changed_sum');
        datalist.innerHTML += '';
        for (var i = 0; i < 6; i++){
            var div = document.createElement('div')
            div.className = 'lot'

            var name = document.createElement('p')
            name.className = 'name'
            name.innerHTML = `${i+1}. ` + data.data[i].Опис;
            div.appendChild(name)                   

            var sum = document.createElement('p')
            sum.className = 'sum'
            sum.innerHTML = data.data[i].Ціна_зміна + "₴" + "|" + Number.parseFloat(data.data[i].Ціна/data.data[i].Ціна_зміна).toFixed(1) + "%";
            div.appendChild(sum)

            datalist.appendChild(div)
        }
    })
    .catch(error => console.error('Fetch error:', error));
}
function get_most_valued_by_lot_func(){
    fetch('/data?filter=valued_buy_list').then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const datalist = document.querySelector('#valued_by');
        datalist.innerHTML += '';
        for (var i = 0; i < 6; i++){
            var div = document.createElement('div')
            div.className = 'lot'

            var name = document.createElement('p')
            name.className = 'name'
            name.innerHTML = `${i+1}. ` + data.data[i].Опис;
            div.appendChild(name)                   

            var sum = document.createElement('p')
            sum.className = 'sum'
            sum.innerHTML = data.data[i].Продано_за + "₴";
            div.appendChild(sum)

            datalist.appendChild(div)
        }
    })
    .catch(error => console.error('Fetch error:', error));
}