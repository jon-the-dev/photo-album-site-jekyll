SHELL=/bin/bash
JEKYLL_IMAGE ?= docker.io/jekyll/builder:4.2.2
BASEURL ?=

.PHONY: build serve test update-contributors

build:
	@mkdir -p "$(CURDIR)/_site"
	@docker run --rm \
		--volume "$(CURDIR):/srv/jekyll:ro" \
		--volume /dev/null:/srv/jekyll/Gemfile:ro \
		--volume "$(CURDIR)/_site:/srv/jekyll/_site" \
		--workdir /srv/jekyll \
		$(JEKYLL_IMAGE) \
		jekyll build --disable-disk-cache --baseurl "$(BASEURL)" --destination /srv/jekyll/_site

serve: build
	@python3 -m http.server 4000 --bind 127.0.0.1 --directory "$(CURDIR)/_site"

test:
	@pnpm test

update-contributors:
	@echo "# this file was auto generated - do not edit directly" > CONTRIBUTORS && \
	@git shortlog --summary --numbered --email >> CONTRIBUTORS
