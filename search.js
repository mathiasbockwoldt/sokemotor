
/**
 * Find needle in haystack. The function will return true only if each character
 * in the needle can be found in the haystack and occurs after the preceding matches.
 *
 * Function by Nicolas Bevacqua via https://github.com/bevacqua/fuzzysearch
 *
 * @param {string} needle - the string to find
 * @param {string} haystack - the string to search in
 * @returns true if needle is fuzzily contained in haystack, false otherwise
 */
function fuzzysearch(needle, haystack) {
  var hlen = haystack.length;
  var nlen = needle.length;
  if (nlen > hlen) {
    return false;
  }
  if (nlen === hlen) {
    return needle === haystack;
  }
  outer: for (var i = 0, j = 0; i < nlen; i++) {
    var nch = needle.charCodeAt(i);
    while (j < hlen) {
      if (haystack.charCodeAt(j++) === nch) {
        continue outer;
      }
    }
    return false;
  }
  return true;
}

let haystack = {};

function do_search() {
    let needle = document.getElementById('needle').value.trim();
    if(needle === '') {
        document.getElementById('output').innerHTML = '<p>Start å lete ved å taste inn enkelte bokstaver.</p>';
    }
    else {
        needle = needle.toLowerCase();
        const results = [];
        for(const element of Object.keys(haystack)) {
            if(fuzzysearch(needle, element)) {
                results.push(haystack[element]);
            }
        }

        results.sort((a, b) => b.num - a.num);

        const num_results = Math.min(results.length, 20);

        let html = '';
        if(num_results > 0) {
            for(let i = 0; i < num_results; i++) {
                html += `<p>${results[i].name} - ${results[i].num}</p>`;
            }
        }
        else {
            html = '<p>Fant ingen tettsted med de bokstavene.</p>';
        }
        document.getElementById('output').innerHTML = html;
    }
}

/**
 * Turn tsv into a js object.
 * Expected tsv format is:
 *   Name[TAB]number[NEWLINE]
 * Output object looks like this:
 *   {LowercaseName: {"name": Name, "num": number},...}
 */
function parse_tsv(content) {
  const content_obj = {};

  for(const line of content.split('\n')) {
    const [name, num] = line.split('\t');
    const lower_name = name.toLowerCase(name);
    content_obj[lower_name] = {'name': name, 'num': num};
  }

  return content_obj;
}

fetch('./tettsteder.tsv').then(response => response.text()).then(content => {
    haystack = parse_tsv(content);
    document.getElementById('needle').addEventListener('keyup', do_search);
    document.getElementById('needle').value = '';
    document.getElementById('needle').focus();
    do_search();
});
