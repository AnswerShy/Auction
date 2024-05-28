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
                console.log(data.data)
                var datalist = document.getElementById('lot_container');
                if(document.getElementById('lot_container')) {
                    datalist = document.getElementById('lot_container');
                }
                else {
                    datalist = document.querySelector('.auc_content');
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