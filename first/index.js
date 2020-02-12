const fs = require("fs");
const http = require("http");
const url = require("url");

// ===============================================================
const replaceTemplate = (template, product) => {
  let output = template.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);
  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  } else {
    output = output.replace(/{%NOT_ORGANIC%}/g, "");
  }
  return output;
};
// ===============================================================
// Sync files read
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const templateOverview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  "utf-8"
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/product.html`,
  "utf-8"
);
// =================================================================
const server = http.createServer((req, res) => {
  // console.log(req.url);
  // console.log(url.parse(req.url, true));
  // const pathName = req.url;
  // true parse query to object
  const { query, pathname } = url.parse(req.url, true);
  // console.log(query.id, pathname);
  // OVERVIEW PAGE -----------------------------------------------------
  if (pathname === "/" || pathname === "/overview") {
    res.writeHead(200, {
      "Content-type": "text/html"
    });
    const cardsHtml = dataObj
      .map(el => replaceTemplate(templateCard, el))
      .join("");

    const output = templateOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);
    res.end(output);
  }
  // PRODUCT PAGE -----------------------------------------------------
  else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html"
    });
    const product = dataObj[query.id];
    const output = replaceTemplate(templateProduct, product);
    res.end(output);
  }
  // API PAGE -----------------------------------------------------------
  else if (pathname === "/api") {
    res.writeHead(200, {
      "Content-type": "application/json"
    });
    res.end(data);
  }
  // NOT FOUND ---------------------------------------------------------
  else {
    // also can send headers as obj
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hellow-world"
    });
    res.end("<h1>that is bad page, not found 404!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Server listening on 8000!");
});
