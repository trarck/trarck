if [ $# -lt 2 ]; then
    echo "error.. need two args"
    exit 1
fi

mkdir ./Payload
cp -R "$1" ./Payload
zip -qyr "$2" ./Payload
rm -r -f ./Payload