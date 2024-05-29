fetch('/header.html')
            .then(response => response.text())
            .then(data => {
                document.getElementById('header').innerHTML = data;
});

function lots_request_func(filter) {
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
    fetch('/aucs').then(response => {
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