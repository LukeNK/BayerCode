var express = require('express');
var router = express.Router();

/**
 * @param {Array.<Object>} json Object to pass
 */
function jsonToHTML(inp) {
  let out = '';
  for (const obj of inp) {
    let pro, name, content = obj.content;
    // check for allowed section name
    for (pro of ['title', 'chapter', 'part', 'article']) {
      if (!obj[pro]) continue;
      name = obj[pro];
      break;
    }
    out += `<details class="${pro}"><summary>${name}</summary>`
    if (typeof(content) == 'string')
      out += `<p>${content}</p></details>`;
    else {
      // object content, do recursive
      out += `${jsonToHTML(obj.content)}</details>`
    }
  }
  return out.replace(RegExp('\n', 'g'), '<br>')
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express', data: jsonToHTML(require('../public/code.json')) });
});

module.exports = router;