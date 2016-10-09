{ pkgs ? import <nixpkgs> {} }:

pkgs.stdenv.mkDerivation rec {
  name = "dev";
  buildInputs = [ pkgs.kubernetes pkgs.google-cloud-sdk ];
  src = ./web;
}
