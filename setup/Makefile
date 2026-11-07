
# Project configuration
BUN := bun
NAME := wallpaper-setup

SRC := src/main.ts
SOURCES := $(wildcard src/*.ts)
TARGET := build/$(NAME)

# System installation paths
PREFIX ?= /usr/local
FISH_COMPLETIONS_DIR ?= /usr/share/fish/vendor_completions.d

# User installation paths
USER_PREFIX := $(HOME)/.local
USER_FISH_DIR := $(HOME)/.config/fish/completions

# Fish completion source
FISH_COMPLETION := completions/$(NAME).fish

# Default target
.DEFAULT_GOAL := all

.PHONY: all build run install uninstall \
        user-install user-uninstall clean rebuild

# Default: Build and install for current user
all: build user-install

# Build executable
build: $(TARGET)

$(TARGET): $(SOURCES)
	@mkdir -p $(dir $@)
	$(BUN) build --compile $(SRC) --outfile $@

# Run executable
run: build
	./$(TARGET)

# System-wide installation (requires root)
install: build
	install -Dm755 $(TARGET) $(DESTDIR)$(PREFIX)/bin/$(NAME)
	install -Dm644 $(FISH_COMPLETION) $(DESTDIR)$(FISH_COMPLETIONS_DIR)/$(NAME).fish

# System-wide uninstallation
uninstall:
	rm -f $(DESTDIR)$(PREFIX)/bin/$(NAME)
	rm -f $(DESTDIR)$(FISH_COMPLETIONS_DIR)/$(NAME).fish

# User installation
user-install: build
	install -Dm755 $(TARGET) $(USER_PREFIX)/bin/$(NAME)
	install -Dm644 $(FISH_COMPLETION) $(USER_FISH_DIR)/$(NAME).fish
	@echo -e "\e[31mMake sure $(USER_PREFIX) is under the PATH\e[0m"

# User uninstallation
user-uninstall:
	rm -f $(USER_PREFIX)/bin/$(NAME)
	rm -f $(USER_FISH_DIR)/$(NAME).fish

# Clean build artifacts
clean:
	rm -rf build

# Force rebuild and reinstall for current user
rebuild:
	$(MAKE) clean
	$(MAKE) all

