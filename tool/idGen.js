let fs = require('fs');
let code = JSON.parse(fs.readFileSync('./public/code.json', 'utf-8'));

let artIds = []; // list of article ids 
function artCheck(code, gen) {
    for (const obj of code) {
        if (obj?.article) {
            if (gen) {
                do obj.articleId = makeId(5); while (artIds.includes(obj.articleId));
            }
            if (obj?.articleId) {
                if(!artIds.includes(obj?.articleId)) artIds.push(obj.articleId);
            }
        } else artCheck(obj.content, gen);
    }
}

artCheck(code); // list all articles to artIds
artCheck(code, true); // generate missing articleId
fs.writeFileSync('./out.json', JSON.stringify(code), 'utf-8')

function makeId(length) {
    var result           = '';
    var characters       = 'BCDFGHJKLMNPQRSTVWXYZbcdfghjklmnpqrstvwxyz0123456789'; // removed vowels
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
   return result;
}