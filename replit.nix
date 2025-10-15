{ pkgs }: {
  deps = [
    pkgs.nodejs_20
    pkgs.python311Full
    pkgs.python311Packages.pip
    pkgs.supabase-cli
    pkgs.tmux
    pkgs.bashInteractive
  ];
}
