complete -c wallpaper-setup -f

set -l commands status help build uninstall

set -l descriptions \
    'Check installation and dependency status' \
    'Show available commands' \
    'Build and install components' \
    'Uninstall the components'

for i in (seq (count $commands))
    complete -c wallpaper-setup \
        -n "not __fish_seen_subcommand_from $commands" \
        -a "$commands[$i]" \
        -d "$descriptions[$i]"
end

set -l targets manager hyprpapercli hyprpapertui hyprpapergui all

complete -c wallpaper-setup \
    -n '__fish_seen_subcommand_from build' \
    -a "$targets" \
    -d 'Build target'
