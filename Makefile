SHELL=/bin/bash
JEKYLL_IMAGE ?= docker.io/jekyll/builder:4.2.2
BASEURL ?=
JEKYLL_BASEURL_ARG = $(if $(strip $(BASEURL)),--baseurl "$(BASEURL)",)

.PHONY: build serve test verify-local update-contributors

build:
	@mkdir -p "$(CURDIR)/_site"
	@docker run --rm \
		--volume "$(CURDIR):/srv/jekyll:ro" \
		--volume /dev/null:/srv/jekyll/Gemfile:ro \
		--volume "$(CURDIR)/_site:/srv/jekyll/_site" \
		--workdir /srv/jekyll \
		$(JEKYLL_IMAGE) \
		jekyll build --disable-disk-cache $(JEKYLL_BASEURL_ARG) --destination /srv/jekyll/_site

serve: build
	@python3 -m http.server 4000 --bind 127.0.0.1 --directory "$(CURDIR)/_site"

test:
	@pnpm test

verify-local: build
	@test -f "$(CURDIR)/_site/assets/css/style.css"
	@grep -q 'href="/assets/css/style.css?v=' "$(CURDIR)/_site/index.html"
	@grep -q 'src="/assets/images/speed-metal/01-dusk-lights.webp"' "$(CURDIR)/_site/index.html"
	@if grep -R -q "/''/" "$(CURDIR)/_site"; then \
		echo "Local build contains a malformed empty base URL"; \
		exit 1; \
	fi

update-contributors:
	@echo "# this file was auto generated - do not edit directly" > CONTRIBUTORS && \
	@git shortlog --summary --numbered --email >> CONTRIBUTORS
