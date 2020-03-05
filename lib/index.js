const wretch = require("wretch");

class Connector {
  constructor({ url, secret }) {
    this.url = url;
    this.secret = secret;

    this.api = wretch()
      .polyfills({ fetch: require("node-fetch") })
      .url(url)
      .auth(`Bearer ${secret}`);
  }

  get = async id => {
    const v = await this.api
      .url(`/sessions/${id}`)
      .get()
      .json()
      .catch(_ => null);

    return v;
  };

  set = async (id, sess, maxAge) => {
    return this.api
      .url(`/sessions/${id}`)
      .put({ value: JSON.stringify(sess), maxAge })
      .text();
  };

  destroy = async id => {
    return this.api
      .url(`/sessions/${id}`)
      .delete()
      .text();
  };
}

module.exports = Connector;
