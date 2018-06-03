# body-reader

Lazy request body stream consumption.

```js
import * as Http from "http";
import * as Parse from "../src";

Http.createServer((request, response) => {
  Parse.Json.read(request, result =>
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
