{ pkgs ? import <nixpkgs> {}, kops ? import ./kops.nix {} }:

pkgs.stdenv.mkDerivation rec {
  name = "dev";
  buildInputs = [
    pkgs.kubernetes
    pkgs.google-cloud-sdk
    pkgs.python27Packages.openstackclient
    pkgs.awscli
    kops
  ];
  src = ./web;
}
