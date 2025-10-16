{ pkgs }: {
  deps = [
    pkgs.nodejs_20
    pkgs.python310
    pkgs.python310Packages.pip
    pkgs.nano
  ];
}
