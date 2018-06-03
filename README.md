# body-reader

Lazy request body stream consumption.

```js
import * as Http from "http";
import * as Parser from "body-reader";
import * as B from "fmt-bytes";

Http.createServer((request, response) => {
  Parser.Json.read(
    request,
    { limit: B.toBytes(100, "KiB"), encoding: "utf8" },
    result =>
      result.match({
        Ok(data) {
          response.setHeader("content-type", "application/json");
          response.write(JSON.stringify(data));
          response.end();
        },
        Err(err) {
          response.writeHead(err.code, {
            "content-type": "application/json",
          });
          response.write(JSON.stringify(err));
          response.end();
        },
      })
  );
}).listen({ port: 3000 });
```
