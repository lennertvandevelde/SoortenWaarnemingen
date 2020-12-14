let sidebar;
let mainpage;
let graph;
let plabels = [];
let values = [];
let first = true;
let saves = [];
let chart;
let scrollTop = true;
const checkScroll = function () {
  let up = document.querySelector('.js-up');
  let main = document.querySelector('.js-appmain');
  if (scrollTop) {
    window.addEventListener('scroll', function () {
      if (window.scrollY != 0) {
        up.classList.add('c-app__upbutton--enable');
      } else {
        up.classList.remove('c-app__upbutton--enable');
      }
    });
    main.addEventListener('scroll', function () {
      if (main.scrollY != 0) {
        up.classList.add('c-app__upbutton--enable');
      } else {
        up.classList.remove('c-app__upbutton--enable');
      }
    });
  }
};
const addScrollButton = function () {
  let main = document.querySelector('.js-appmain');
  let app = document.querySelector('.js-app');
  let up = document.querySelector('.js-up');

  up.addEventListener('click', function () {
    scrollTop = false;
    up.classList.remove('c-app__upbutton--enable');
    main.scrollTo(0, 0);
    window.scrollTo(0, 0);
    console.log(window.scrollY);
  });
};
const deleteCard = function (element) {
  if (plabels.indexOf(element.getAttribute('data-name')) != -1) {
    plabels.splice(plabels.indexOf(element.getAttribute('data-name')), 1);
    values.splice(values.indexOf(element.getAttribute('data-count')), 1);
  }

  saves.splice(saves.indexOf(element.getAttribute('data-id')), 1);
  element.classList.add('c-card__bin--clicked');
  let card = document.querySelector(`.js-${element.getAttribute('data-id')}`);
  setTimeout(function () {
    card.classList.add('c-dashboard__item--deleted');
  }, 500);
  setTimeout(function () {
    card.remove();
    updateChart();
    checkClicks();
  }, 1200);
};
const checkClicks = function () {
  let adds = document.querySelectorAll('.js-add');
  adds.forEach((add) => {
    if (saves.includes(add.getAttribute('data-id'))) {
      add.classList.add('c-clicked');
      setTimeout(function () {
        add.classList.add('o-hide-accessible');
      }, 2000);
    } else {

      add.classList.remove('c-clicked');
      add.classList.remove('o-hide-accessible');
    }
  });
};
const addClicks = function () {
  let adds = document.querySelectorAll('.js-add');
  adds.forEach((add) => {
    add.addEventListener('click', function () {
      save(add.getAttribute('data-id'));
    });
  });
  checkClicks();
};
const removeprevious = function (classname) {
  let previous = document.querySelector('.js-back-list');
  let element = document.querySelector(`.${classname}`);

  if (element != null) {
    previous.removeChild(element);
  }
};
const showprevious = function (element) {
  let previous = document.querySelector('.js-back-list');
  let span = document.createElement('span');
  span.appendChild(document.createTextNode(element.getAttribute('data-name')));
  span.classList.add('c-main-nav__link');
  let li = document.createElement('li');
  li.classList.add('c-main-nav__item');
  li.classList.add('c-main-nav__item--back');
  li.classList.add(element.getAttribute('data-rank'));

  li.appendChild(span);
  previous.appendChild(li);
  return li;
};
const updateChart = function () {

  chart.data.labels = plabels;
  chart.data.datasets.data = values;
  chart.update();
};
const initChart = function () {
  let ctx = graph.getContext('2d');

  graph.style.display = 'block';
  // let chart = new Chart(ctx, {
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: plabels,
      datasets: [
        {
          label: 'Aantal waarnemingen',
          data: values,
          backgroundColor: '#FEC760',
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
      maintainAspectRatio: false,
    },
  });
};
const save = async (id) => {
  saves.push(id);
  checkClicks();
  mainpage = document.querySelector('.js-main');

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

  let image;
  if (data2.results != undefined && data2.results.length) {
    let i = 0;
    let ImageElem = data2.results[i];

    while (i < data2.results.length - 1 && !ImageElem.media.length) {
      i += 1;
      ImageElem = data2.results[i];
    }

    if (ImageElem.media.length) {
      image = ImageElem.media[0].identifier;
    }
  } else {
    image = 'https://www.signfix.com.au/wp-content/uploads/2017/09/placeholder-600x400.png';
  }

  let html = ' ';
  html = `<div class="c-dashboard__item u-x-span-3-bp3 js-${data.key}">
				<div class="c-card">
				<div class="c-card__header">
					<h2 class="c-card__title">${data.scientificName}</h2>`;
  if (data.hasOwnProperty('vernacularName')) {
    html += `<h3 class="c-card__subtitle"> ${data.vernacularName} </h3>`;
  }
  html += `</div>
				<div class="c-card__body">
					<img src="${image}" class="c-card__image" alt="Afbeelding van ${data.scientificName}" onerror="this.src='https://www.signfix.com.au/wp-content/uploads/2017/09/placeholder-600x400.png'" >
          <div class="c-card__buttons">
          	<input class="o-hide-accessible c-option c-option--hidden js-checkbox" type="checkbox" id="checkbox${data.key}" data-name="${data.scientificName}">
					  <label class="c-label c-label--option c-custom-option js-show-label" data-id="${data.key}" data-count="${data3}" data-name="${data.scientificName}" data-checked=false for="checkbox${data.key}">
  						<span class="c-custom-option__fake-input c-custom-option__fake-input--checkbox">
  							<svg class="c-custom-option__symbol" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 9 6.75">
  								<path d="M4.75,9.5a1,1,0,0,1-.707-.293l-2.25-2.25A1,1,0,1,1,3.207,5.543L4.75,7.086,8.793,3.043a1,1,0,0,1,1.414,1.414l-4.75,4.75A1,1,0,0,1,4.75,9.5" transform="translate(-1.5 -2.75)"/>
  							</svg>
  						</span>
  						Toon op grafiek
            </label>
            <button class="o-button-reset c-card__button js-bin " data-id="${data.key}" data-name="${data.scientificName}" data-count="${data3}">
              <svg class="c-card__bin " xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" >
  
                <path class="c-card__bin-top" d="M15,3.75 C15.5522847,3.75 16,4.19771525 16,4.75 L16,5.75 L18.25,5.75 C18.6642136,5.75 19,6.08578644 19,6.5 C19,6.91421356 18.6642136,7.25 18.25,7.25 L5.75,7.25 C5.33578644,7.25 5,6.91421356 5,6.5 C5,6.08578644 5.33578644,5.75 5.75,5.75 L8,5.75 L8,4.75 C8,4.19771525 8.44771525,3.75 9,3.75 L15,3.75 Z M14,5 L10,5 C9.72385763,5 9.5,5.22385763 9.5,5.5 C9.5,5.74545989 9.67687516,5.94960837 9.91012437,5.99194433 L10,6 L14,6 C14.2761424,6 14.5,5.77614237 14.5,5.5 C14.5,5.25454011 14.3231248,5.05039163 14.0898756,5.00805567 L14,5 Z"></path>
                <path transform="translate(0 0)" d="M7.02498527,8.25 L16.9751371,8.25 C17.5411532,8.25 18,8.69771525 18,9.25 C18,9.2951932 17.9968602,9.34033442 17.9906022,9.3851132 L16.6878729,18.7066989 C16.6389095,19.0569074 16.4041276,19.3558931 16.0703039,19.4931212 C14.8428392,19.9977071 13.4860916,20.25 12.0000612,20.25 C10.5140229,20.25 9.1572688,19.9977044 7.92979891,19.4931132 C7.59597391,19.3558774 7.36118974,19.0568881 7.31224574,18.7066728 L6.00952014,9.3851132 C5.93304388,8.83789281 6.32568685,8.33379079 6.88651275,8.25916983 C6.93240487,8.25306363 6.97866843,8.25 7.02498527,8.25 Z"></path>
  
              </svg>

            </button>


					</div>
				</div>
			</div>
    </div>`;
  let frag = document.createRange().createContextualFragment(html);

  checkClicks();
  graph = document.querySelector('.js-bar');
  updateChart();
  let checkboxes = frag.querySelectorAll('.js-checkbox');
  checkboxes.forEach((checkbox) => {
    if (plabels.includes(checkbox.getAttribute('data-name'))) {
      checkbox.checked = true;
    }
  });
  let deletes = frag.querySelectorAll('.js-bin');
  deletes.forEach((pdelete) => {
    pdelete.addEventListener('click', function () {
      deleteCard(pdelete);
    });
  });
  let shows = frag.querySelectorAll('.js-show-label');
  shows.forEach((show) => {
    show.addEventListener('click', function () {
      if (show.getAttribute('data-checked') == 'false') {

        graph = document.querySelector('.js-bar');
        plabels.push(show.getAttribute('data-name'));
        values.push(show.getAttribute('data-count'));
        show.setAttribute('data-checked', true);
        updateChart();
      } else {


        graph = document.querySelector('.js-bar');
        plabels.splice(plabels.indexOf(show.getAttribute('data-name')), 1);
        values.splice(values.indexOf(show.getAttribute('data-count')), 1);
        show.setAttribute('data-checked', false);

        updateChart();
      }
    });
  });
  mainpage.appendChild(frag);

  updateChart();
};
const showSpecies = async (genus) => {
  // Eerst bouwen we onze url op
  let data = await fetch(`https://api.gbif.org/v1/species/${genus.getAttribute('data-id')}/children?limit=100`)
    .then((r) => r.json())
    .catch((err) => console.error('An error occured:', err));


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
			  <span class="c-main-nav__link js-order"data-id=${result.key} >
				  ${result.scientificName} (${result.rank})
			  </span>
			  <svg class="c-add js-add" data-id=${result.key} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 64 64">
			  <line class="c-add__ver" id="Line_14" data-name="Line 14" y2="64" transform="translate(32 0)" fill="none" stroke="#f9f8f6" stroke-width="5"/>
			  <line class="c-add__hor" id="Line_15" data-name="Line 15" x2="64" transform="translate(0 32)" fill="none" stroke="#f9f8f6" stroke-width="5"/>
		  </svg>
		  </li>`;
    }


    if (data.results.length <= 100) {
      loop = false;
    }
    offset = offset + 100;

    data = await fetch(`https://api.gbif.org/v1/species/${genus.getAttribute('data-id')}/children?limit=100&offset=${offset}`)
      .then((r) => r.json())
      .catch((err) => console.error('An error occured:', err));

  }
  sidebar.innerHTML = html;
  addClicks();
};
const showGenus = async (family) => {
  // Eerst bouwen we onze url op
  let data = await fetch(`https://api.gbif.org/v1/species/${family.getAttribute('data-id')}/children?limit=100`)
    .then((r) => r.json())
    .catch((err) => console.error('An error occured:', err));

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
			<span class="c-main-nav__link js-genus"data-id=${result.key} data-name=${result.scientificName} data-rank=${result.rank}>
				${result.scientificName} (${result.rank})
			</span>
			<svg class="c-add js-add" data-id=${result.key} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 64 64">
			  <line class="c-add__ver" id="Line_14" data-name="Line 14" y2="64" transform="translate(32 0)" fill="none" stroke="#f9f8f6" stroke-width="5"/>
			  <line class="c-add__hor" id="Line_15" data-name="Line 15" x2="64" transform="translate(0 32)" fill="none" stroke="#f9f8f6" stroke-width="5"/>
		  </svg>
		</li>`;
    }


    if (data.results.length <= 100) {
      loop = false;
    }
    offset = offset + 100;

    data = await fetch(`https://api.gbif.org/v1/species/${family.getAttribute('data-id')}/children?limit=100&offset=${offset}`)
      .then((r) => r.json())
      .catch((err) => console.error('An error occured:', err));

  }
  sidebar.innerHTML = html;
  let geni = document.querySelectorAll('.js-genus');
  geni.forEach((genus) => {
    genus.addEventListener('click', function () {
      prev = showprevious(genus).addEventListener('click', function () {
        showSpecies(genus);
      });
      showSpecies(genus);
    });
  });
  addClicks();
};
const showFamily = async (order) => {
  // Eerst bouwen we onze url op
  const data = await fetch(`https://api.gbif.org/v1/species/${order.getAttribute('data-id')}/children?limit=100`)
    .then((r) => r.json())
    .catch((err) => console.error('An error occured:', err));

  let html = '';
  for (let result of data.results) {

    if (result.rank != 'FAMILY') {
      break;
    }
    html += `<li class="c-main-nav__item "  >
		  <span class="c-main-nav__link js-family"data-id=${result.key} data-name=${result.scientificName} data-rank=${result.rank}>
			  ${result.scientificName} (${result.rank})
		  </span>
		  <svg class="c-add js-add" data-id=${result.key} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 64 64">
			  <line class="c-add__ver" id="Line_14" data-name="Line 14" y2="64" transform="translate(32 0)" fill="none" stroke="#f9f8f6" stroke-width="5"/>
			  <line class="c-add__hor" id="Line_15" data-name="Line 15" x2="64" transform="translate(0 32)" fill="none" stroke="#f9f8f6" stroke-width="5"/>
		  </svg>
	  </li>`;
  }
  sidebar.innerHTML = html;
  let families = document.querySelectorAll('.js-family');
  families.forEach((family) => {
    family.addEventListener('click', function () {
      prev = showprevious(family).addEventListener('click', function () {
        showGenus(family);
        removeprevious('GENUS');
      });
      showGenus(family);
    });
  });
  addClicks();
};

const showOrder = async (pclass) => {
  // Eerst bouwen we onze url op
  const data = await fetch(`https://api.gbif.org/v1/species/${pclass.getAttribute('data-id')}/children?limit=100`)
    .then((r) => r.json())
    .catch((err) => console.error('An error occured:', err));

  let html = '';
  for (let result of data.results) {

    if (result.rank != 'ORDER') {
      break;
    }
    html += `<li class="c-main-nav__item "  >
		  <span class="c-main-nav__link js-order"data-id=${result.key} data-name=${result.scientificName} data-rank=${result.rank}>
			  ${result.scientificName} (${result.rank})
		  </span>
		  <svg class="c-add js-add" data-id=${result.key} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 64 64">
			  <line class="c-add__ver" id="Line_14" data-name="Line 14" y2="64" transform="translate(32 0)" fill="none" stroke="#f9f8f6" stroke-width="5"/>
			  <line class="c-add__hor" id="Line_15" data-name="Line 15" x2="64" transform="translate(0 32)" fill="none" stroke="#f9f8f6" stroke-width="5"/>
		  </svg>
	  </li>`;
  }
  sidebar.innerHTML = html;
  let orders = document.querySelectorAll('.js-order');
  orders.forEach((order) => {
    order.addEventListener('click', function () {
      prev = showprevious(order).addEventListener('click', function () {
        showFamily(order);
        removeprevious('FAMILY');
        removeprevious('GENUS');
      });
      showFamily(order);
    });
  });
  addClicks();
};
const showClass = async (phyl) => {
  // Eerst bouwen we onze url op
  const data = await fetch(`https://api.gbif.org/v1/species/${phyl.getAttribute('data-id')}/children?limit=100`)
    .then((r) => r.json())
    .catch((err) => console.error('An error occured:', err));

  let html = '';
  for (let result of data.results) {

    if (result.rank != 'CLASS') {
      break;
    }
    html += `<li class="c-main-nav__item "  >
		  <span class="c-main-nav__link js-class"data-id=${result.key} data-name=${result.scientificName} data-rank=${result.rank}>
			  ${result.scientificName} (${result.rank})
		  </span>
		  <svg class="c-add js-add" data-id=${result.key} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 64 64">
			  <line class="c-add__ver" id="Line_14" data-name="Line 14" y2="64" transform="translate(32 0)" fill="none" stroke="#f9f8f6" stroke-width="5"/>
			  <line class="c-add__hor" id="Line_15" data-name="Line 15" x2="64" transform="translate(0 32)" fill="none" stroke="#f9f8f6" stroke-width="5"/>
		  </svg>
	  </li>`;
  }
  sidebar.innerHTML = html;
  let classes = document.querySelectorAll('.js-class');
  classes.forEach((pclass) => {
    pclass.addEventListener('click', function () {
      prev = showprevious(pclass).addEventListener('click', function () {
        showOrder(pclass);
        removeprevious('ORDER');
        removeprevious('FAMILY');
        removeprevious('GENUS');
      });
      showOrder(pclass);
    });
  });
  addClicks();
};

const showSub = async (kingdom) => {

  const data = await fetch(`https://api.gbif.org/v1/species/${kingdom.getAttribute('data-id')}/children?limit=100`)
    .then((r) => r.json())
    .catch((err) => console.error('An error occured:', err));

  let html = '';
  for (let result of data.results) {

    if (result.rank != 'PHYLUM' && result.rank != 'ORDER') {
      break;
    }
    html += `<li class="c-main-nav__item "  >
		<span class="c-main-nav__link js-sub"data-id=${result.key} data-name=${result.scientificName} data-rank=${result.rank}>
			${result.scientificName} (${result.rank})
		</span>
		<svg class="c-add js-add" data-id=${result.key} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 64 64">
			  <line class="c-add__ver" id="Line_14" data-name="Line 14" y2="64" transform="translate(32 0)" fill="none" stroke="#f9f8f6" stroke-width="5"/>
			  <line class="c-add__hor" id="Line_15" data-name="Line 15" x2="64" transform="translate(0 32)" fill="none" stroke="#f9f8f6" stroke-width="5"/>
		  </svg>
	</li>`;
  }
  sidebar.innerHTML = html;
  let subs = document.querySelectorAll('.js-sub');
  if (data.results[0].rank == 'PHYLUM') {
    subs.forEach((sub) => {
      sub.addEventListener('click', function () {
        prev = showprevious(sub).addEventListener('click', function () {
          showClass(sub);
          removeprevious('CLASS');
          removeprevious('ORDER');
          removeprevious('FAMILY');
          removeprevious('GENUS');
        });
        showClass(sub);
      });
    });
  } else {
    subs.forEach((sub) => {
      sub.addEventListener('click', function () {
        prev = showprevious(sub).addEventListener('click', function () {
          showFamily(sub);
          removeprevious('GENUS');
        });
        showFamily(sub);
      });
    });
  }

  addClicks();
};

const getKingdomNames = async () => {
  // Eerst bouwen we onze url op
  const data = await fetch(`https://api.gbif.org/v1/species?offset=1&limit=8`)
    .then((r) => r.json())
    .catch((err) => console.error('An error occured:', err));

  let html = '';
  data.results.forEach((element) => {

    html += `<li class="c-main-nav__item "  >
				<a class="c-main-nav__link js-kingdom" data-id=${element.key} data-name=${element.scientificName} data-rank=${element.rank}>
					${element.scientificName} (${element.rank})
				</a>
        <svg class="c-add js-add" data-id=${element.key} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 64 64">
			  <line class="c-add__ver" id="Line_14" data-name="Line 14" y2="64" transform="translate(32 0)" fill="none" stroke="#f9f8f6" stroke-width="5"/>
			  <line class="c-add__hor" id="Line_15" data-name="Line 15" x2="64" transform="translate(0 32)" fill="none" stroke="#f9f8f6" stroke-width="5"/>
		  </svg>

			</li>`;
  });
  sidebar.innerHTML = html;
  let kingdoms = document.querySelectorAll('.js-kingdom');
  for await (let kingdom of kingdoms) {
    if (first) {
      await save(kingdom.getAttribute('data-id'));

      document.querySelector('.js-home').addEventListener('click', function () {
        getKingdomNames();
        removeprevious('KINGDOM');
        removeprevious('PHYLUM');
        removeprevious('CLASS');
        removeprevious('ORDER');
        removeprevious('FAMILY');
        removeprevious('GENUS');
      });
    }

    kingdom.addEventListener('click', function () {
      prev = showprevious(kingdom).addEventListener('click', function () {
        showSub(kingdom);
        removeprevious('PHYLUM');
        removeprevious('CLASS');
        removeprevious('ORDER');
        removeprevious('FAMILY');
        removeprevious('GENUS');
      });
      showSub(kingdom);
    });
  }
  let shows = document.querySelectorAll('.js-show-label');
  shows.forEach((show) => {
    show.dispatchEvent(new CustomEvent('click'));
  });
  let checkboxes = document.querySelectorAll('.js-checkbox');
  checkboxes.forEach((checkbox) => {
    if (plabels.includes(checkbox.getAttribute('data-name'))) {
      checkbox.checked = true;
    }
  })

  addClicks();
  first = false;
};

document.addEventListener('DOMContentLoaded', function () {
  // 1 We will query the API with longitude and latitude.
  sidebar = document.querySelector('.js-list');
  graph = document.querySelector('.js-bar');
  initChart();
  getKingdomNames();
  addScrollButton();
  checkScroll();
});
