
# Project configuration
BUN := bun
NAME := wallpapercli

SRC := src/main.ts
SOURCES := $(shell find src -type f -name '*.ts')
TARGET := build/$(NAME)

# System installation paths
PREFIX ?= /usr/local
DESTDIR ?=
BINDIR ?= $(PREFIX)/bin
FISH_COMPLETIONS_DIR ?= $(PREFIX)/share/fish/vendor_completions.d

# User installation paths
USER_PREFIX ?= $(HOME)/.local
USER_BINDIR := $(USER_PREFIX)/bin
USER_FISH_DIR := $(HOME)/.config/fish/completions

# Fish completion source
FISH_COMPLETION := completions/$(NAME).fish

# Runtime arguments
ARGS ?=

# Default target
.DEFAULT_GOAL := all

.PHONY: all build run install uninstall \
        user-install user-uninstall clean rebuild

# Build and install for current user
all: user-install

# Build executable
build: $(TARGET)

$(TARGET): $(SOURCES)
	@mkdir -p $(dir $@)
	$(BUN) build --compile $(SRC) --outfile $@

# Run executable
run: build
	./$(TARGET) $(ARGS)

# System-wide installation
install: build
	install -Dm755 $(TARGET) $(DESTDIR)$(BINDIR)/$(NAME)
	install -Dm644 $(FISH_COMPLETION) $(DESTDIR)$(FISH_COMPLETIONS_DIR)/$(NAME).fish

# System-wide uninstallation
uninstall:
	rm -f $(DESTDIR)$(BINDIR)/$(NAME)
	rm -f $(DESTDIR)$(FISH_COMPLETIONS_DIR)/$(NAME).fish

# User installation
user-install: build
	install -Dm755 $(TARGET) $(USER_BINDIR)/$(NAME)
	install -Dm644 $(FISH_COMPLETION) $(USER_FISH_DIR)/$(NAME).fish
	@printf '\033[33mEnsure %s is in your PATH\033[0m\n' "$(USER_BINDIR)"

# User uninstallation
user-uninstall:
	rm -f $(USER_BINDIR)/$(NAME)
	rm -f $(USER_FISH_DIR)/$(NAME).fish

# Clean build artifacts
clean:
	rm -rf build

# Force rebuild and reinstall for current user
rebuild:
	$(MAKE) clean
	$(MAKE) all

