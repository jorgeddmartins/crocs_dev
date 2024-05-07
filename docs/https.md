# HTTPS local server

For using cameras on phones its needed to have a HTTPS connection. This means that we can't develop for, for example, 8th Wall without running the local server without a HTTPS connection.

## SSL certificate

Create local certificates on mac by running `npm run generate:ssl`. For more help see: https://github.com/FiloSottile/mkcert

### Mobile devices

For the certificates to be trusted on mobile devices, you will have to install the root CA. It's the `rootCA.pem` file in the folder printed by `mkcert -CAROOT`.

On iOS, you can either use AirDrop, email the CA to yourself, or serve it from an HTTP server. After opening it, you need to [install the profile in Settings > Profile Downloaded](https://github.com/FiloSottile/mkcert/issues/233#issuecomment-690110809) and then [enable full trust in it](https://support.apple.com/en-nz/HT204477).

For Android, you will have to install the CA and then enable user roots in the development build of your app. See [this StackOverflow answer](https://stackoverflow.com/a/22040887/749014).
