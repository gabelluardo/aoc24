new-day:
    #!/usr/bin/env bash
    set -euo pipefail
    
    # Get confirmation
    read -rp "Do you want to create a new day folder? (Y/n) " confirm
    if [[ "$confirm" == [nN] ]]; then
        echo "Operation cancelled."
        exit 0
    fi

    day_num=1
    # Find last created day
    if last_folder=$(find . -maxdepth 1 -type d -name "day_*" | sort -V | tail -n1 2>/dev/null); then
        day_num=$(($(echo "$last_folder" | grep -o '[0-9][0-9]') + 1))
    fi

    # Verify day is valid
    if ((day_num < 1 || day_num > 25)); then
        echo "Error: Day must be between 1 and 25!" >&2
        exit 1
    fi
    
    # Create folder name with padding
    day_padded=$(printf "day_%02d" "$day_num")
    
    # Create directory structure
    if ! mkdir -p "$day_padded"; then
        echo "Error: Unable to create folder $day_padded" >&2
        exit 1
    fi
       
    # Copy entire template directory
    if ! cp -r "template/"* "$day_padded/"; then
        echo "Error: Unable to copy template" >&2
        exit 1
    fi
    
    echo "✨ Successfully created folder '$day_padded'"
