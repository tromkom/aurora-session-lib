require("dotenv").config();
const Koa = require("koa");
const session = require("koa-session");
const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const fetch = require("fetch-cookie")(require("node-fetch"));

const Connector = require("../");

const should = chai.should();
chai.use(chaiAsPromised);

const connector = new Connector({
  url: process.env.API,
  secret: process.env.SECRET
});

const app = new Koa();

app.keys = ["my secret string"];
app.use(
  session(
    {
      store: {
        get: connector.get,
        set: connector.set,
        destroy: connector.destroy
      }
    },
    app
  )
);

app.use(ctx => {
  // ignore favicon
  if (ctx.path === "/favicon.ico") return;

  let n = ctx.session.views || 0;
  ctx.session.views = ++n;
  ctx.body = n + " views";
});

app.listen(3015);

describe("Connectors", () => {
  it("should increment n for every request", async () => {
    const res1 = await fetch("http://localhost:3015/").then(res => res.text());
    const res2 = await fetch("http://localhost:3015/").then(res => res.text());
    const res3 = await fetch("http://localhost:3015/").then(res => res.text());

    return Promise.all([res1, res2, res3]).should.become([
      "1 views",
      "2 views",
      "3 views"
    ]);
  });
});
