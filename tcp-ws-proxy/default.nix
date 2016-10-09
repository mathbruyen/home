{ pkgs ? import <nixpkgs> {} }:

pkgs.stdenv.mkDerivation rec {
  name = "dev";
  buildInputs = [ pkgs.nodejs-6_x ];
  src = ./src;
}
