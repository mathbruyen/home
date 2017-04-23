{ pkgs ? import <nixpkgs> {} }:

pkgs.stdenv.mkDerivation rec {
  name = "kops-${version}";
  version = "1.5.3";
  builder = ./kops-builder.sh;
  src = pkgs.fetchurl {
    url = https://github.com/kubernetes/kops/releases/download/1.5.3/kops-linux-amd64;
    sha1 = "azqprmjwrlxfbf07nmwqbr0i3qs0pgsa";
  };
}
