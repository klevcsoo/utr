#!/bin/zsh

set -e

declare -a os_arch_list=("linux/386" "linux/amd64" "linux/arm" "linux/arm64" "darwin/amd64" "darwin/arm64" "windows/386" "windows/amd64")

rm -rf ./build
mkdir ./build

for item in "${os_arch_list[@]}"; do
    os=${item%%/*}
    arch=${item#*/}

    filename="utr_api_v2_${os}_${arch}"
    if [ "$os" = "windows" ]; then
        filename="${filename}.exe"
    fi

    echo "Packaging for $item: $filename"
    GOOS=$os GOARCH=$arch go build -o "./build/$filename" utr-api-v2
done
