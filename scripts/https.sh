# mac only for now
if [[ $(command -v brew) == "" ]]; then
    echo "Hombrew not installed, if you are on MacOS make sure to install this"
else
    brew install mkcert
    mkcert -install
    mkcert localhost
    
    # display url to root certificate
    # This needs to be send to your iOS device
    mkcert -CAROOT
    
    # Let nodejs use this extra CA certificate
    export NODE_EXTRA_CA_CERTS="$(mkcert -CAROOT)/rootCA.pem"
fi
