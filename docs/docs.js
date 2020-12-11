function all_paragraphs() {
  return Array.from(document.querySelectorAll("p"));
}

function all_pres() {
  return Array.from(document.querySelectorAll("pre"));
}

function all_lists() {
  return Array.from(document.querySelectorAll("li"));
}

function all_anchors() {
  return Array.from(document.querySelectorAll("a"));
}

function all_headers() {
  return Array.from([
    Array.from(document.querySelectorAll("h1")),
    Array.from(document.querySelectorAll("h2")),
    Array.from(document.querySelectorAll("h3"))
  ].flat());
}

function all_searchable_elements() {
  return Array.from([
    all_paragraphs(),
    all_pres(),
    all_lists(),
    all_headers(),
    all_anchors()
  ].flat());
}

function hide_element(element) {
  element.style.color = "rgb(0, 0, 0, 0.2)";
}

function show_element(element) {
  element.style.color = "";
}

function show_all_searchable_elements() {
  all_searchable_elements().forEach(show_element);
}

function does_element_has_word(element, word) {
  return element.innerText
                .toLowerCase()
                .includes(word.toLowerCase());
}

function perform_search(search_text) {
  search_text = search_text || "";
  show_all_searchable_elements();
  var result_count = 0;
  document.getElementById('search-count').innerHTML = "&nbsp;";
  if (search_text.length < 3) return;

  var tokens = search_text.split(" ");

  all_searchable_elements().forEach(function (element) {
    tokens.forEach(function(word) {
      if (does_element_has_word(element, word)) {
        result_count += 1;
        show_element(element);
      } else {
        hide_element(element);
      }
    });
  });

  document.getElementById('search-count').innerHTML = result_count.toString() + " result(s) found.";
}

function add_search() {
  var search_html = `
    <div style='padding: 10px; border: solid 1px silver; background-color: white;'>
      <input placeholder='search' type='text' id='search-term' style='width: 100%; padding: 5px; margin-bottom: 3px;' />
      <div id='search-count'>&nbsp;</div>
    </div>
`;

  // create search div
  var search_div = document.createElement("div");
  search_div.innerHTML = search_html;
  document.body.insertBefore(search_div, document.body.firstChild);
  search_div.style.position = 'fixed';
  search_div.style.right = '10px';
  search_div.style.width = '200px';

  // wire up incremental search
  var search_textbox = document.getElementById("search-term");
  search_textbox.onkeydown = function() { perform_search(search_textbox.value); };
}

class CategoricalPhaser {
  constructor() {
    this.categories = {
      'API': document.querySelectorAll('div#toc li.phaser-docs'),
      'cheatsheets': document.querySelectorAll('div#toc li.phaser-cheatsheet'),
      'the rest': document.querySelectorAll('div#toc li.phaser-rest')
    };
    let storage = JSON.parse(window.localStorage.getItem('CategoricalPhaser.categoryColors'));
    Object.keys(this.categories).reverse().forEach(category => {
      let element = document.createElement('button');
      element.textContent = category;
      if(storage) {
        element.style.backgroundColor = storage[category];
        if(storage[category] == 'pink') {this.phase(element, false);};
      } else {element.style.backgroundColor = 'palegreen';}
      element.onclick = (event => {this.phase(event.target, true);});
      document.querySelector('#toc').insertAdjacentElement('afterbegin', element);
    });
  };
  phase(element, flip) {
    let color = this.convert(element.style.backgroundColor, 'color', 'color', flip);
    let mode = this.convert(element.style.backgroundColor, 'color', 'mode', flip);
    element.style.backgroundColor = color;
    this.categories[element.textContent].forEach(node => {node.style.display = mode;});
    let storage = JSON.parse(window.localStorage.getItem('CategoricalPhaser.categoryColors'));
    if(!storage) {
      storage = {
        'API': 'palegreen',
        'cheatsheets': 'palegreen',
        'the rest': 'palegreen'
      };
    };
    storage[element.textContent] = color;
    window.localStorage.setItem('CategoricalPhaser.categoryColors', JSON.stringify(storage));
  };
  convert(string, from, to, flip) {
    let table = {
      'color': ['palegreen', 'pink'],
      'mode': ['', 'none']
    };
    let index = table[from].indexOf(string);
    if(index == -1) {throw `No such ${from}`;};
    if(flip) {index = index ? 0 : 1;}
    return table[to][index];
  };
};

document.addEventListener('DOMContentLoaded', function() {
  add_search();
  new CategoricalPhaser;
}, false);
