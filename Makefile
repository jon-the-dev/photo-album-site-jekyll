SHELL=/bin/bash
JEKYLL_IMAGE ?= docker.io/jekyll/builder:4.2.2
JEKYLL_CONFIG ?= _config.yml
BASEURL ?=
JEKYLL_BASEURL_ARG = $(if $(strip $(BASEURL)),--baseurl "$(BASEURL)",)

.PHONY: build serve test verify-analytics verify-local update-contributors

build:
	@mkdir -p "$(CURDIR)/_site"
	@docker run --rm \
		--volume "$(CURDIR):/srv/jekyll:ro" \
		--volume /dev/null:/srv/jekyll/Gemfile:ro \
		--volume "$(CURDIR)/_site:/srv/jekyll/_site" \
		--workdir /srv/jekyll \
		$(JEKYLL_IMAGE) \
		jekyll build --disable-disk-cache --config "$(JEKYLL_CONFIG)" $(JEKYLL_BASEURL_ARG) --destination /srv/jekyll/_site

serve: build
	@python3 -m http.server 4000 --bind 127.0.0.1 --directory "$(CURDIR)/_site"

test:
	@pnpm test

verify-local: build
	@test -f "$(CURDIR)/_site/assets/css/style.css"
	@test -f "$(CURDIR)/_site/assets/images/speed-metal/01-dusk-lights-960.webp"
	@test -f "$(CURDIR)/_site/assets/images/apple-touch-icon.png"
	@grep -q 'href="/assets/css/style.css?v=' "$(CURDIR)/_site/index.html"
	@grep -q 'src="/assets/images/speed-metal/01-dusk-lights.webp"' "$(CURDIR)/_site/index.html"
	@grep -q '/assets/images/speed-metal/01-dusk-lights-960.webp 960w' "$(CURDIR)/_site/index.html"
	@if grep -q 'spooledAnalyticsConfig' "$(CURDIR)/_site/index.html"; then \
		echo "Default local build unexpectedly enables analytics"; \
		exit 1; \
	fi
	@if grep -R -q "/''/" "$(CURDIR)/_site"; then \
		echo "Local build contains a malformed empty base URL"; \
		exit 1; \
	fi

verify-analytics:
	@$(MAKE) build JEKYLL_CONFIG="_config.yml,test/fixtures/analytics.yml"
	@grep -q 'measurementId: "G-TEST123456"' "$(CURDIR)/_site/index.html"
	@grep -q 'requireConsent: true' "$(CURDIR)/_site/index.html"
	@grep -q 'data-analytics-consent' "$(CURDIR)/_site/index.html"
	@$(MAKE) build JEKYLL_CONFIG="_config.yml,test/fixtures/analytics-without-consent.yml"
	@grep -q 'requireConsent: false' "$(CURDIR)/_site/index.html"
	@if grep -q 'data-analytics-consent' "$(CURDIR)/_site/index.html"; then \
		echo "Consent-free analytics build unexpectedly renders the consent prompt"; \
		exit 1; \
	fi
	@$(MAKE) build

update-contributors:
	@echo "# this file was auto generated - do not edit directly" > CONTRIBUTORS && \
	@git shortlog --summary --numbered --email >> CONTRIBUTORS
