# Server-Time

Checks a given time against the actual time, that is fetched from a server.


# API
## Sync Mode

If your environment does **not** allow to execute asynchronous javascript, this method can be used. The time is not directly available on page-load since the time is globally loaded from the server. You shoudl expect a delay of 200 - 2000 milliseonds depending on how fast the script is laoded and executed from the server.

```HTML
<html>
  <head>  
    <title>Server Time</title>
    <script type="text/javascript" src="./build/index.js"></script>
    <script type="text/javascript">
      // the timeout is only present for this demonstration since the 
      // server time is not available immediatelly. You porpably wont
      // use a timeout in your code.
      setTimeout(() => {
        // the timestamp passed to the isLaterThan method is UTC time! 
        // When used in Switzerland during winter time, one hour must be 
        // removed; e.g.: if you want to check if it's 13:00:00 on January 
        // 20 you have to pass the following string: 
        // 2022-01-20T12:00:00.000Z
        // make sure the Z character at the end of the string is present!
        if (serverTime.isLaterThan('2022-01-20T2:00:00.000Z')) {
          // display message that shall be displayed after 13:00
        } else {
          // display message that shall be displayed before 13:00
        }
      }, 500);
    </script>
  </head>
</html>
```

## Async Mode

If your environment **does** allow to execute asynchronous javascript, you may use the asynchronous api. In this case your script will wait until the time was fetched from the server and there is no inital delay.

```HTML
<html>
  <head>
    <title>Server Time</title>
    <script type="text/javascript" src="./build/index.js"></script>
    <script type="text/javascript">
      (async() => {
        try {
          // the timestamp passed to the isLaterThanAsync method is UTC time! 
          // When used in Switzerland during winter time, one hour must be 
          // removed; e.g.: if you want to check if it's 13:00:00 on January 
          // 20 you have to pass the following string: 
          // 2022-01-20T12:00:00.000Z
          // make sure the Z character at the end of the string is present!
          const isLater = await serverTime.isLaterThanAsync('2022-01-20T2:00:00.000Z');

          if (isLater) {
            // display message that shall be displayed after 13:00
          } else {
            // display message that shall be displayed before 13:00
          }
        } catch (e) {
          console.log(`Failed to fetch server time ${e.message}`);
        }
      })();
    </script>
  </head>
</html>
```