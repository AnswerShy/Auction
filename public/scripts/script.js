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

function lots_request_func(filter, callback) {
        var filterQ = ''
        if (filter != null) {
            filterQ = `?filter=${filter}`
        }
        else {
            filterQ = ''
        }
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
                    card.id = `${row.ID}`

                    var pic = document.createElement('div')
                    pic.className = 'lot_pic'
                    
                    pic.style.backgroundImage = `url('${row.Картинка}')` 
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
                if (callback) callback()
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

// archive PAGE
function aucs_history_request_func(){
    fetch('/data?filter=aucs_history').then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const datalist = document.querySelector('.page_content');
        datalist.innerHTML = '';
        data.data.forEach(row => {
            // console.log(row)
            // console.log(JSON.parse(row.Лоти))

            var auc = document.createElement('div')
            auc.className = 'auc_class'                   

            var name = document.createElement('div')
            name.className = 'auc_name'
            name.innerHTML = row.Назва;
            auc.appendChild(name)
            
            var data = document.createElement('div')
            data.className = 'auc_data'
            data.innerHTML = `Дата початку: ${row.Дата} Час: ${row.Час}  Локація: ${row.Місце_проведення}`
            if(row.Дата_закриття != null) { data.innerHTML += ` Дата закриття: ${row.Дата_закриття}`}
            auc.appendChild(data)

            var content = document.createElement('div')
            content.className = `auc_content`
            content.id = `auc_${row.ID_аукціону}`
            auc.appendChild(content)

            datalist.appendChild(auc)
        })
        return data
    })
    .then(data => {
        data.data.forEach(row => {
            lots_request_func(row.ID_аукціону)
        })
    })
    .catch(error => console.error('Fetch error:', error));
}

function unsolded_lots_func() {
    fetch('/data?filter=unsolded_lots')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            var datalist = document.querySelector('.page_content');
            datalist.innerHTML = '';
            data.data.forEach(row => {
                var card = document.createElement('div')
                card.className = 'lot_class'

                var pic = document.createElement('div')
                pic.className = 'lot_pic'
                
                pic.style.backgroundImage = `url('${row.Картинка}')` 
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

function auc_and_buyer_func() {
    fetch('/data?filter=auc_and_buyer')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            var datalist = document.querySelector('.page_content');
            datalist.innerHTML = '';
            data.data.forEach(row => {

                var json = JSON.parse(row.Покупці)

                var auc = document.createElement('div')
                auc.className = 'auc_class'                   

                var name = document.createElement('div')
                name.className = 'auc_name'
                name.innerHTML = row.Назва_аукціону;
                auc.appendChild(name)

                var data = document.createElement('div')
                data.className = 'auc_content'

                for (var i = 0; i < json.length; i++){
                    data.innerHTML += json[i].Імя + " "
                    console.log(json[i].Імя)
                }

                auc.appendChild(data)


                datalist.appendChild(auc)
            });
        })
        .catch(error => console.error('Fetch error:', error));
}

// for all lots
function get_lot_data_func(filter){
        fetch('/data?filter=' + filter)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                var datalist = document.querySelector('.info_display');
                datalist.innerHTML = '';
                data.data.forEach(row => {
                    var pic = document.createElement('div')
                    pic.className = 'lot_pic_display'
                    pic.style.backgroundImage = `url('${row.Картинка}')` 
                    datalist.appendChild(pic)

                    var dataCon = document.createElement('div')
                    dataCon.className = "lot_data_container"
                    
                    var name = document.createElement('p')
                    name.className = 'lot_name_display'
                    name.textContent = `Назва: ${row.Опис}`;
                    dataCon.appendChild(name)

                    var seller = document.createElement('p')
                    seller.className = 'lot_name_display'
                    seller.textContent = `Продавець: ${row.Продавець}`;
                    dataCon.appendChild(seller)

                    var cost = document.createElement('p')
                    cost.className = 'lot_cost_display'
                    cost.textContent = `Ціна: ${row.Ціна}₴`;
                    dataCon.appendChild(cost)

                    var cost_now = document.createElement('p')
                    cost_now.className = 'lot_cost_now_display'
                    cost_now.textContent = `Ціна змінилася на: ${row.Ціна_зміна}₴`;
                    dataCon.appendChild(cost_now)

                    var status = document.createElement('p')
                    status.className = 'lot_status_display'
                    status.textContent = `Статус: ${row.Статус}`;
                    dataCon.appendChild(status)

                    if(row.Продано_за != null) {
                        var selled = document.createElement('p')
                        selled.className = 'lot_selled_display'
                        selled.textContent = `Продано за: ${row.Продано_за}₴`;
                        dataCon.appendChild(selled)
                    }

                    datalist.appendChild(dataCon)
                });
                if (callback) callback()
            })
            .catch(error => console.error('Fetch error:', error));
}
