
# Disable file completions
complete -c wallpapercli -f

# Available commands
set -l commands \
    list-monitors \
    list-wallappers \
    set-wallpaper \
    refresh-monitors \
    refresh-walllpapers \
    auto-continue

# Command descriptions
set -l descriptions \
    'List available monitors' \
    'List wallpapers for a monitor' \
    'Set a wallpaper for a monitor' \
    'Refresh detected monitors' \
    'Refresh wallpapers on all monitors' \
    'Configure automatic wallpaper switching'

# Register command completions
for i in (seq (count $commands))
    complete -c wallpapercli \
        -n "not __fish_seen_subcommand_from $commands" \
        -a "$commands[$i]" \
        -d "$descriptions[$i]"
end

# Automatic wallpaper switching
complete -c wallpapercli \
    -n '__fish_seen_subcommand_from auto-continue' \
    -a 'off' \
    -d 'Disable automatic wallpaper switching'

# Options
complete -c wallpapercli \
    -l help \
    -d 'Show help menu'

