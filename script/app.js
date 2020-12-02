let sidebar;
let mainpage;
let graph;
let plabels = [];
let values = [];
const updateChart = function () {
  console.log(values);
  let ctx = graph.getContext('2d');
	console.log(ctx)
	graph.style.display = 'block';
	// let chart = new Chart(ctx, {
	 new Chart(ctx, {

		type : "bar",
		data: {
			labels: plabels,
			datasets: [{
				label: 'Aantal keer gezien',
				data: values,
				backgroundColor: [
					'rgba(255, 99, 132, 0.2)',
					'rgba(54, 162, 235, 0.2)',
					'rgba(255, 206, 86, 0.2)',
					'rgba(75, 192, 192, 0.2)',
					'rgba(153, 102, 255, 0.2)',
					'rgba(255, 159, 64, 0.2)'
				],
				borderColor: [
					'rgba(255, 99, 132, 1)',
					'rgba(54, 162, 235, 1)',
					'rgba(255, 206, 86, 1)',
					'rgba(75, 192, 192, 1)',
					'rgba(153, 102, 255, 1)',
					'rgba(255, 159, 64, 1)'
				],
				borderWidth: 1
			}]
		},
		options: {
			scales: {
				yAxes: [{
					ticks: {
						beginAtZero: true
					}
				}]
			}}
	})

};
const save = async (id) => {
  mainpage = document.querySelector('.js-main');
  console.log(id);
  const data = await fetch(`https://api.gbif.org/v1/species/${id}?language=nl`)
    .then((r) => r.json())
    .catch((err) => console.error('An error occured:', err));
  const data2 = await fetch(`https://api.gbif.org/v1/occurrence/search?taxonKey=${id}`)
    .then((r) => r.json())
    .catch((err) => console.error('An error occured:', err));
  const data3 = await fetch(`https://api.gbif.org/v1/occurrence/count?taxonKey=${id}`)
	.then((r) => r.json())
	.then(updateChart())
    .catch((err) => console.error('An error occured:', err));
  console.log(data3);
  let image;
  if (data2.results != undefined) {
    let i = 0;
    let ImageElem = data2.results[i];

    while (i < 19 && !ImageElem.media.length) {
      i += 1;
      ImageElem = data2.results[i];
    }
    if (ImageElem.media.length) {
      image = ImageElem.media[0].identifier;
    }
  } else {
    image = 'https://www.signfix.com.au/wp-content/uploads/2017/09/placeholder-600x400.png';
  }
  console.log(image);
  let html = ' ';
  html = `<div class="c-dashboard__item u-x-span-3-bp3 ">
				<div class="c-card">
				<div class="c-card__header">
					<h2 class="c-card__title">${data.scientificName}</h2>`;
  if (data.hasOwnProperty('vernacularName')) {
    html += `<h3> ${data.vernacularName} </h3>`;
  }
  html += `</div>
				<div class="c-card__body">
					<img src="${image}" alt="Afbeelding van ${data.scientificName}" onerror="this.src='https://www.signfix.com.au/wp-content/uploads/2017/09/placeholder-600x400.png'" style="width : 100%; height: 200px;  object-fit: cover;">
					<input class="o-hide-accessible c-option c-option--hidden js-remember-input" type="checkbox" id="checkbox${data.key}">
					<label class="c-label c-label--option c-custom-option js-show-label" data-id="${data.key}" data-count="${data3}" data-name="${data.scientificName}" for="checkbox${data.key}">
						<span class="c-custom-option__fake-input c-custom-option__fake-input--checkbox">
							<svg class="c-custom-option__symbol" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6.75">
								<path d="M4.75,9.5a1,1,0,0,1-.707-.293l-2.25-2.25A1,1,0,1,1,3.207,5.543L4.75,7.086,8.793,3.043a1,1,0,0,1,1.414,1.414l-4.75,4.75A1,1,0,0,1,4.75,9.5" transform="translate(-1.5 -2.75)"/>
							</svg>
						</span>
						Remember me
					</label>
				</div>
			</div>
		</div>`;
	
  mainpage.innerHTML += html;
  graph = document.querySelector('.js-bar');
	updateChart();
  let shows = document.querySelectorAll('.js-show-label');
  shows.forEach((show) => {
    show.addEventListener('click', function () {
	graph = document.querySelector('.js-bar');
      plabels.push(show.getAttribute('data-name'));
      values.push(show.getAttribute('data-count'));
      updateChart();
    });
  });
  updateChart();
};
const showSpecies = async (genus) => {
  // Eerst bouwen we onze url op
  let data = await fetch(`https://api.gbif.org/v1/species/${genus.getAttribute('data-id')}/children?limit=100`)
    .then((r) => r.json())
    .catch((err) => console.error('An error occured:', err));

  console.log('GEN');
  console.log(data);
  let html = '';
  let loop = true;
  let offset = 0;
  while (loop) {
    for (let result of data.results) {
      if (result.rank != 'SPECIES') {
        loop = false;
        break;
      }
      html += `<li class="c-main-nav__item "  >
			  <span class="c-main-nav__link js-order"data-id=${result.key}>
				  ${result.scientificName} (${result.rank})
			  </span>
			  <svg class="js-add" data-id=${result.key} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 64 64">
			  <g id="Group_9" data-name="Group 9" transform="translate(-136 -368)">
				  <line id="Line_14" data-name="Line 14" y2="64" transform="translate(168 368)" fill="none" stroke="#f9f8f6" stroke-width="5"/>
				  <line id="Line_15" data-name="Line 15" x2="64" transform="translate(136 400)" fill="none" stroke="#f9f8f6" stroke-width="5"/>
			  </g>
			  </svg>
		  </li>`;
    }
    console.log(data.results.length);

    if (data.results.length <= 100) {
      loop = false;
    }
    offset = offset + 100;
    console.log(offset);
    data = await fetch(`https://api.gbif.org/v1/species/${genus.getAttribute('data-id')}/children?limit=100&offset=${offset}`)
      .then((r) => r.json())
      .catch((err) => console.error('An error occured:', err));
    console.log(data);
  }
  sidebar.innerHTML = html;
  // Met de fetch API proberen we de data op te halen.
  // Als dat gelukt is, gaan we naar onze showResult functie.
  // showResult(data)
};
const showGenus = async (family) => {
  // Eerst bouwen we onze url op
  let data = await fetch(`https://api.gbif.org/v1/species/${family.getAttribute('data-id')}/children?limit=100`)
    .then((r) => r.json())
    .catch((err) => console.error('An error occured:', err));

  console.log('GEN');
  console.log(data);
  let html = '';
  let loop = true;
  let offset = 0;
  while (loop) {
    for (let result of data.results) {
      if (result.rank != 'GENUS') {
        loop = false;
        break;
      }
      html += `<li class="c-main-nav__item "  >
			<span class="c-main-nav__link js-genus"data-id=${result.key}>
				${result.scientificName} (${result.rank})
			</span>
			<svg class="js-add" data-id=${result.key} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 64 64">
			<g id="Group_9" data-name="Group 9" transform="translate(-136 -368)">
				<line id="Line_14" data-name="Line 14" y2="64" transform="translate(168 368)" fill="none" stroke="#f9f8f6" stroke-width="5"/>
				<line id="Line_15" data-name="Line 15" x2="64" transform="translate(136 400)" fill="none" stroke="#f9f8f6" stroke-width="5"/>
			</g>
			</svg>
		</li>`;
    }
    console.log(data.results.length);

    if (data.results.length <= 100) {
      loop = false;
    }
    offset = offset + 100;
    console.log(offset);
    data = await fetch(`https://api.gbif.org/v1/species/${family.getAttribute('data-id')}/children?limit=100&offset=${offset}`)
      .then((r) => r.json())
      .catch((err) => console.error('An error occured:', err));
    console.log(data);
  }
  sidebar.innerHTML = html;
  let geni = document.querySelectorAll('.js-genus');
  geni.forEach((genus) => {
    genus.addEventListener('click', function () {
      showSpecies(genus);
    });
  });
  // Met de fetch API proberen we de data op te halen.
  // Als dat gelukt is, gaan we naar onze showResult functie.
  // showResult(data)
};
const showFamily = async (order) => {
  // Eerst bouwen we onze url op
  const data = await fetch(`https://api.gbif.org/v1/species/${order.getAttribute('data-id')}/children?limit=100`)
    .then((r) => r.json())
    .catch((err) => console.error('An error occured:', err));
  console.log(data);
  let html = '';
  for (let result of data.results) {
    console.log(result);
    if (result.rank != 'FAMILY') {
      break;
    }
    html += `<li class="c-main-nav__item "  >
		  <span class="c-main-nav__link js-family"data-id=${result.key}>
			  ${result.scientificName} (${result.rank})
		  </span>
		  <svg class="js-add" data-id=${result.key} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 64 64">
		  <g id="Group_9" data-name="Group 9" transform="translate(-136 -368)">
			  <line id="Line_14" data-name="Line 14" y2="64" transform="translate(168 368)" fill="none" stroke="#f9f8f6" stroke-width="5"/>
			  <line id="Line_15" data-name="Line 15" x2="64" transform="translate(136 400)" fill="none" stroke="#f9f8f6" stroke-width="5"/>
		  </g>
		  </svg>
	  </li>`;
  }
  sidebar.innerHTML = html;
  let families = document.querySelectorAll('.js-family');
  families.forEach((family) => {
    family.addEventListener('click', function () {
      showGenus(family);
    });
  });
  // Met de fetch API proberen we de data op te halen.
  // Als dat gelukt is, gaan we naar onze showResult functie.
  // showResult(data)
};

const showOrder = async (pclass) => {
  // Eerst bouwen we onze url op
  const data = await fetch(`https://api.gbif.org/v1/species/${pclass.getAttribute('data-id')}/children?limit=100`)
    .then((r) => r.json())
    .catch((err) => console.error('An error occured:', err));
  console.log(data);
  let html = '';
  for (let result of data.results) {
    console.log(result);
    if (result.rank != 'ORDER') {
      break;
    }
    html += `<li class="c-main-nav__item "  >
		  <span class="c-main-nav__link js-order"data-id=${result.key}>
			  ${result.scientificName} (${result.rank})
		  </span>
		  <svg class="js-add" data-id=${result.key} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 64 64">
		  <g id="Group_9" data-name="Group 9" transform="translate(-136 -368)">
			  <line id="Line_14" data-name="Line 14" y2="64" transform="translate(168 368)" fill="none" stroke="#f9f8f6" stroke-width="5"/>
			  <line id="Line_15" data-name="Line 15" x2="64" transform="translate(136 400)" fill="none" stroke="#f9f8f6" stroke-width="5"/>
		  </g>
		  </svg>
	  </li>`;
  }
  sidebar.innerHTML = html;
  let orders = document.querySelectorAll('.js-order');
  orders.forEach((order) => {
    order.addEventListener('click', function () {
      showFamily(order);
    });
  });
  // Met de fetch API proberen we de data op te halen.
  // Als dat gelukt is, gaan we naar onze showResult functie.
  // showResult(data)
};
const showClass = async (phyl) => {
  // Eerst bouwen we onze url op
  const data = await fetch(`https://api.gbif.org/v1/species/${phyl.getAttribute('data-id')}/children?limit=100`)
    .then((r) => r.json())
    .catch((err) => console.error('An error occured:', err));
  console.log(data);
  let html = '';
  for (let result of data.results) {
    console.log(result);
    if (result.rank != 'CLASS') {
      break;
    }
    html += `<li class="c-main-nav__item "  >
		  <span class="c-main-nav__link js-class"data-id=${result.key}>
			  ${result.scientificName} (${result.rank})
		  </span>
		  <svg class="js-add" data-id=${result.key} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 64 64">
		  <g id="Group_9" data-name="Group 9" transform="translate(-136 -368)">
			  <line id="Line_14" data-name="Line 14" y2="64" transform="translate(168 368)" fill="none" stroke="#f9f8f6" stroke-width="5"/>
			  <line id="Line_15" data-name="Line 15" x2="64" transform="translate(136 400)" fill="none" stroke="#f9f8f6" stroke-width="5"/>
		  </g>
		  </svg>
	  </li>`;
  }
  sidebar.innerHTML = html;
  let classes = document.querySelectorAll('.js-class');
  classes.forEach((pclass) => {
    pclass.addEventListener('click', function () {
      showOrder(pclass);
    });
  });
  // Met de fetch API proberen we de data op te halen.
  // Als dat gelukt is, gaan we naar onze showResult functie.
  // showResult(data)
};

const showSub = async (kingdom) => {
  console.log(kingdom.getAttribute('data-id'));
  const data = await fetch(`https://api.gbif.org/v1/species/${kingdom.getAttribute('data-id')}/children?limit=100`)
    .then((r) => r.json())
    .catch((err) => console.error('An error occured:', err));
  console.log(data);
  let html = '';
  for (let result of data.results) {
    console.log(result);
    if (result.rank != 'PHYLUM' && result.rank != 'ORDER') {
      break;
    }
    html += `<li class="c-main-nav__item "  >
		<span class="c-main-nav__link js-sub"data-id=${result.key}>
			${result.scientificName} (${result.rank})
		</span>
		<svg class="js-add" data-id=${result.key} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 64 64">
		<g id="Group_9" data-name="Group 9" transform="translate(-136 -368)">
			<line id="Line_14" data-name="Line 14" y2="64" transform="translate(168 368)" fill="none" stroke="#f9f8f6" stroke-width="5"/>
			<line id="Line_15" data-name="Line 15" x2="64" transform="translate(136 400)" fill="none" stroke="#f9f8f6" stroke-width="5"/>
		</g>
		</svg>
	</li>`;
  }
  sidebar.innerHTML = html;
  let subs = document.querySelectorAll('.js-sub');
  if (data.results[0].rank == 'PHYLUM') {
    subs.forEach((sub) => {
      sub.addEventListener('click', function () {
        showClass(sub);
      });
    });
  } else {
    subs.forEach((sub) => {
      sub.addEventListener('click', function () {
        showFamily(sub);
      });
    });
  }

  let adds = document.querySelectorAll('.js-add');
  adds.forEach((add) => {
    add.addEventListener('click', function () {
      save(add.getAttribute('data-id'));
    });
  });
};

const getKingdomNames = async () => {
  // Eerst bouwen we onze url op
  const data = await fetch(`https://api.gbif.org/v1/species?offset=1&limit=8`)
    .then((r) => r.json())
    .catch((err) => console.error('An error occured:', err));
  console.log(data);
  let html = '';
  data.results.forEach((element) => {
    console.log(element);
    html += `<li class="c-main-nav__item "  >
				<span class="c-main-nav__link js-kingdom" data-id=${element.key}>
					${element.scientificName} (${element.rank})
				</span>
				<svg class="js-add" data-id=${element.key} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 64 64" data-id=${element.key}>
				<g id="Group_9" data-name="Group 9" transform="translate(-136 -368)">
					<line id="Line_14" data-name="Line 14" y2="64" transform="translate(168 368)" fill="none" stroke="#f9f8f6" stroke-width="5"/>
					<line id="Line_15" data-name="Line 15" x2="64" transform="translate(136 400)" fill="none" stroke="#f9f8f6" stroke-width="5"/>
				</g>
				</svg>

			</li>`;
  });
  sidebar.innerHTML = html;
  let kingdoms = document.querySelectorAll('.js-kingdom');
  kingdoms.forEach((kingdom) => {
    save(kingdom.getAttribute('data-id'));
    kingdom.addEventListener('click', function () {
      showSub(kingdom);
    });
  });
  // Met de fetch API proberen we de data op te halen.
  // Als dat gelukt is, gaan we naar onze showResult functie.
  // showResult(data)
};

document.addEventListener('DOMContentLoaded', function () {
  // 1 We will query the API with longitude and latitude.
  sidebar = document.querySelector('.js-list');
  graph = document.querySelector('.js-bar');
  console.log(graph);
  console.log(sidebar.I);
  getKingdomNames();
});
