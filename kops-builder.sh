source $stdenv/setup

mkdir -p $out/bin
cp $src $out/bin/kops
chmod +x $out/bin/kops
