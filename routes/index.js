var express = require('express');
var router = express.Router();
const fs = require('fs')

/**
 * @param {Array.<Object>} json Object to pass
 * @param {Object.<Number>} art Article number object, pass as reference
 */
function jsonToHTML(inp, art) {
  let out = '';
  if (art == undefined)
    art = {n: 1}; // first recursive chain, pass as reference
  for (const obj of inp) {
    let pro, name, content = obj.content;
    // check for allowed section name
    for (pro of ['title', 'subtitle', 'chapter', 'part', 'article', 'section']) {
      if (!obj[pro]) continue;
      name = obj[pro];
      break;
    }
    if (typeof(content) == 'string' && pro == 'article') {
      name = `Article ${art.n}. ${name}`;
      art.n++;
    }
    out += `<details class="${pro}"><summary>${name}</summary>`
    if (content?.length === 0) {
      out += `</details>`;
    } else if (typeof(content) == 'string') {
      out += `<p>${content}</p>`;
      if (obj.source) out += `<code>${obj.source}</code>`;
      if (obj?.note) out += `<p><i>${obj.note}</i></p>`
      out += '</details>';
    } else {
      // object content, do recursive
      out += `${jsonToHTML(obj.content, art)}</details>`;
    }
  }
  return out.replace(RegExp('\n', 'g'), '<br>')
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'The Code of Laws of the Bayer Free State', data: jsonToHTML(JSON.parse(fs.readFileSync('./public/code.json', 'utf-8'))) });
});

module.exports = router;