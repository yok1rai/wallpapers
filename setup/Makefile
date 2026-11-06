
BUN := bun
SRC := src/main.ts
TARGET := build/wallpaper-setup
SOURCES := $(wildcard src/*.ts)

PREFIX ?= /usr/local

.PHONY: all clean install run rebuild

all: $(TARGET)

$(TARGET): $(SOURCES)
	@mkdir -p $(dir $@)
	$(BUN) build --compile $(SRC) --outfile $@

run: $(TARGET)
	./$(TARGET)

install: $(TARGET)
	install -Dm755 $(TARGET) $(DESTDIR)$(PREFIX)/bin/wallpaper-setup

clean:
	rm -rf build

rebuild:
	$(MAKE) clean
	$(MAKE) all

