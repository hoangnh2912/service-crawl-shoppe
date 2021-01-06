const puppeteer = require("puppeteer");
const fs = require("fs");
const config = {
  url:
    "https://shopee.vn/%C4%90i%E1%BB%87n-Tho%E1%BA%A1i-Ph%E1%BB%A5-Ki%E1%BB%87n-cat.84",
  file_name: "dien_thoai_phu_kien",
  pages: 100,
};

async function autoScrollBottom(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 300;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(distance, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });
  });
}

async function autoScrollTop(page) {
  await page.evaluate(async () => {
    await new Promise((resolve, reject) => {
      var totalHeight = 0;
      var distance = 300;
      var timer = setInterval(() => {
        var scrollHeight = document.body.scrollHeight;
        window.scrollBy(-distance, -distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });
  });
}

let dataCrawl = [];
const crawlPage = async (pageIndex = 0, browser) => {
  const page = await browser.newPage();

  await page.goto(`${config.url}?page=${pageIndex}`, {
    waitUntil: "networkidle2",
  });
  await autoScrollBottom(page);
  await autoScrollTop(page);
  const res = await page.evaluate(async () => {
    let arr = [];
    let item = document.getElementsByClassName(
      "shopee-search-item-result__item"
    );
    for (let i = 0; i < item.length; i++) {
      let url = document
        .getElementsByClassName("shopee-search-item-result__item")
        .item(i)
        .children.item(0)
        .children.item(0).href;
      let name = document.getElementsByClassName("_1NoI8_").item(i).textContent;
      let img_url = document
        .getElementsByClassName("_1tDEiO")
        .item(i)
        .children.item(0).src;
      arr.push({
        url,
        name,
        img_url,
      });
    }
    return arr;
  });
  dataCrawl = dataCrawl.concat(res);

  await page.close();
  return res;
};

puppeteer.launch(require("./config.json")).then(async (browser) => {
  for (let i = 0; i < config.pages - 1; i++) {
    {
      console.log("Crawl page " + (i + 1));
      const data = await crawlPage(i, browser);
      for (let j = 0; j < data.length; j++) {
        console.log("Item " + (j + i * data.length) + "/" + dataCrawl.length);
        const pg = await browser.newPage();
        await pg.goto(data[j].url, {
          waitUntil: "networkidle2",
        });
        try {
          const des = await pg.evaluate(() => {
            return document.getElementsByClassName("_2u0jt9").item(0)
              .textContent;
          });
          dataCrawl[j + i * data.length]["description"] = des;
        } catch (error) {}

        await pg.close();
      }
    }
    fs.writeFileSync(
      `.${require("./config.json").save}/${config.file_name}.json`,
      JSON.stringify(dataCrawl)
    );
    console.log("saved file: " + (i + 1));
  }
});
