---
layout: default
title: Off-road Photography
description: Spooled Pixels is the off-road and rallycross photography portfolio of Jon Price.
body_class: home
---

{% assign album = site.data.albums.albums | first %}

<section class="home-hero">
  <div class="home-hero__media">
    <img src="{{ album.cover | relative_url }}" alt="{{ album.cover_alt }}" fetchpriority="high">
    <span class="media-mark media-mark--hero" aria-hidden="true">@spooled.pixels</span>
    <span class="home-hero__overlay" aria-hidden="true"></span>
  </div>
  <div class="home-hero__content">
    <p class="eyebrow hero-reveal">Off-road photography / Jon Price</p>
    <h1 class="hero-reveal"><span>Stories made</span><em>at speed.</em></h1>
    <div class="home-hero__footer hero-reveal">
      <p>Off-road, rallycross, and honest frames from the loud side of the desert.</p>
      <a class="round-link round-link--light" href="#work">
        <span>View work</span>
        <span aria-hidden="true">↓</span>
      </a>
    </div>
  </div>
  <div class="home-hero__coordinates" aria-hidden="true">
    <span>1 / 1600 SEC</span>
    <span>DUST / LIGHT</span>
  </div>
</section>

<section class="manifesto section-shell" id="about">
  <p class="eyebrow reveal">A practice of timing</p>
  <div class="manifesto__content">
    <h2 class="reveal">We photograph what speed feels like—not just the machine.</h2>
    <div class="manifesto__copy reveal">
      <p>Spooled Pixels is the automotive work of Jon Price—built around dust, available light, and the split second when motion becomes a photograph.</p>
      <a class="text-link" href="#work">See the latest story <span aria-hidden="true">↘</span></a>
    </div>
  </div>
</section>

<section class="selected-work" id="work">
  <div class="section-heading section-shell reveal">
    <div>
      <p class="eyebrow">Selected work / 001</p>
      <h2>{{ album.title }}</h2>
    </div>
    <p>{{ album.location }}, {{ album.year }}<br>{{ album.photos | size }} photographs</p>
  </div>

  <a class="project-feature reveal" href="{{ '/albums/noise-and-speed-metal/' | relative_url }}" aria-label="View album: {{ album.title }}">
    <div class="project-feature__image">
      <img src="{{ album.photos[7].src | relative_url }}" alt="{{ album.photos[7].alt }}" loading="lazy">
      <span class="media-mark" aria-hidden="true">@spooled.pixels</span>
    </div>
    <div class="project-feature__caption">
      <p>{{ album.dek }}</p>
      <span>Open the story <b aria-hidden="true">↗</b></span>
    </div>
  </a>
</section>

<section class="home-carousel section-shell reveal" aria-labelledby="home-carousel-title">
  <div class="home-carousel__intro">
    <p class="eyebrow">A moving edit</p>
    <h2 id="home-carousel-title">Six frames from<br>the dust.</h2>
  </div>

  <div class="carousel carousel--editorial" data-carousel data-carousel-autoplay="true" tabindex="0" aria-roledescription="carousel" aria-label="Featured photographs">
    <div class="carousel__viewport">
      {% for photo in album.photos offset: 1 limit: 6 %}
        <figure class="carousel__slide{% if forloop.first %} is-active{% endif %}" data-carousel-slide aria-hidden="{% if forloop.first %}false{% else %}true{% endif %}">
          <img src="{{ photo.src | relative_url }}" alt="{{ photo.alt }}" loading="lazy">
          <span class="media-mark media-mark--carousel" aria-hidden="true">@spooled.pixels</span>
          <figcaption>
            <span>{{ forloop.index | prepend: '0' | slice: -2, 2 }}</span>
            <p>{{ photo.caption }}</p>
          </figcaption>
        </figure>
      {% endfor %}
    </div>
    <div class="carousel__controls">
      <div class="carousel__buttons">
        <button type="button" data-carousel-prev aria-label="Previous photograph">←</button>
        <button type="button" data-carousel-next aria-label="Next photograph">→</button>
      </div>
      <div class="carousel__progress">
        <span data-carousel-current>01</span>
        <div class="carousel__dots" data-carousel-dots></div>
        <span>06</span>
      </div>
      <p class="sr-only" aria-live="polite" data-carousel-status></p>
    </div>
  </div>
</section>

<section class="closing-frame">
  <div class="closing-frame__image reveal">
    <img src="{{ album.photos[6].src | relative_url }}" alt="{{ album.photos[6].alt }}" loading="lazy">
    <span class="media-mark media-mark--closing" aria-hidden="true">@spooled.pixels</span>
  </div>
  <div class="closing-frame__copy section-shell">
    <p class="eyebrow reveal">The whole story</p>
    <h2 class="reveal">Eight photographs.<br>One day at full throttle.</h2>
    <a class="pill-link reveal" href="{{ '/albums/noise-and-speed-metal/' | relative_url }}">
      Enter the album <span aria-hidden="true">↗</span>
    </a>
  </div>
</section>
