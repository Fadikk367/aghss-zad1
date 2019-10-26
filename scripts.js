let markers = [];

const coordinates = JSON.parse(window.localStorage.getItem('coordinates')) || [];

const listItems = document.getElementsByClassName('list__item')

const list = document.querySelector('.list__list');





function addListPosition(coords, index) {

    const listItem = document.createElement('div');
    listItem.className = 'list__item';

    const itemHeader = document.createElement('div');
    itemHeader.className = 'item__header';

    const title = document.createElement('h3');
    title.textContent = `${index + 1}) coordinates:`;
    title.className = 'item__title';

    const deleteBtn = document.createElement('img');
    deleteBtn.src = './images/delete.png';
    deleteBtn.className = 'item__deleteBtn';
    deleteBtn.addEventListener('click', function (e) {
        const idx = [...listItems].findIndex(el => el === this.parentNode.parentNode)
        this.parentNode.parentNode.remove();
        markers[idx].setMap(null);
        markers.splice(idx, 1);
        coordinates.splice(idx, 1);
        window.localStorage.setItem('coordinates', JSON.stringify(coordinates));
        // reRenderList();
    });

    const lat = document.createElement('span');
    lat.textContent = `lat: ${coords.lat().toPrecision(8)}`;
    lat.className = 'item__latlng';

    const lng = document.createElement('span');
    lng.textContent = `lng: ${coords.lng().toPrecision(8)}`;
    lng.className = 'item__latlng';

    itemHeader.appendChild(title);
    itemHeader.appendChild(deleteBtn);

    listItem.appendChild(itemHeader);
    listItem.appendChild(lat);
    listItem.appendChild(lng);

    list.appendChild(listItem);
}

function reRenderList() {
    list.textContent = '';
    markers = [];
    coordinates.forEach((element, index) => {
        const marker = putMarker(e.latLng);
        markers.push(marker);
        coordinates.push(element);
        window.localStorage.setItem('coordinates', JSON.stringify(coordinates));
        addListPosition(element, index);
    });
}

function initMap() {
    const options = {
        zoom: 12,
        center: {
            lat: 50.064744,
            lng: 19.923261
        }
    };

    const map =  new google.maps.Map(document.querySelector('.content__map'), options);

    function putMarker(coords) {
        const marker = new google.maps.Marker({
            position: coords,
            map: map,
            icon: './images/rocket.png'
        });

        const infoWindow = new google.maps.InfoWindow({
            content: `
                <div class="">${coords.lat().toPrecision(8)}</div>
                <div>${coords.lng().toPrecision(8)}</div>`,
        });

        infoWindow.open(map, marker);

        marker.addListener('click', function () {
            infoWindow.open(map, marker);
        });
        
        return marker;
    }


    


    google.maps.event.addListener(map, 'click', (e) => {
        const coords = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng()
        }
        const marker = putMarker(e.latLng);
        markers.push(marker);
        coordinates.push(coords);
        window.localStorage.setItem('coordinates', JSON.stringify(coordinates));
        addListPosition(e.latLng, listItems.length)
    });
}

