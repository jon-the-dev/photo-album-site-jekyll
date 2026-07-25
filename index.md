---
layout: default
title: Photography & Field Notes
description: Still / Wild is an editorial photography portfolio about remote landscapes, open roads, and the quiet moments between.
body_class: home
---

{% assign album = site.data.albums.albums | first %}

<section class="home-hero">
  <div class="home-hero__media">
    <img src="{{ album.cover | relative_url }}" alt="{{ album.cover_alt }}" fetchpriority="high">
    <span class="home-hero__overlay" aria-hidden="true"></span>
  </div>
  <div class="home-hero__content">
    <p class="eyebrow hero-reveal">Independent photography journal</p>
    <h1 class="hero-reveal"><span>Stories made</span><em>in weather.</em></h1>
    <div class="home-hero__footer hero-reveal">
      <p>Landscapes, slow travel, and honest frames from the edges of the map.</p>
      <a class="round-link round-link--light" href="#work">
        <span>View work</span>
        <span aria-hidden="true">↓</span>
      </a>
    </div>
  </div>
  <div class="home-hero__coordinates" aria-hidden="true">
    <span>58° 38′ N</span>
    <span>006° 04′ W</span>
  </div>
</section>

<section class="manifesto section-shell" id="about">
  <p class="eyebrow reveal">A practice of attention</p>
  <div class="manifesto__content">
    <h2 class="reveal">We photograph the feeling of a place—not just the place itself.</h2>
    <div class="manifesto__copy reveal">
      <p>Still / Wild is a fictional editorial portfolio built around natural light, patient observation, and the beautiful uncertainty of the road.</p>
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

  <a class="project-feature reveal" href="{{ '/albums/the-long-way-north/' | relative_url }}" aria-label="View album: {{ album.title }}">
    <div class="project-feature__image">
      <img src="{{ album.photos[10].src | relative_url }}" alt="{{ album.photos[10].alt }}" loading="lazy">
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
    <h2 id="home-carousel-title">Six frames from<br>the road north.</h2>
  </div>

  <div class="carousel carousel--editorial" data-carousel data-carousel-autoplay="true" tabindex="0" aria-roledescription="carousel" aria-label="Featured photographs">
    <div class="carousel__viewport">
      {% for photo in album.photos offset: 1 limit: 6 %}
        <figure class="carousel__slide{% if forloop.first %} is-active{% endif %}" data-carousel-slide aria-hidden="{% if forloop.first %}false{% else %}true{% endif %}">
          <img src="{{ photo.src | relative_url }}" alt="{{ photo.alt }}" loading="lazy">
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
    <img src="{{ album.photos[8].src | relative_url }}" alt="{{ album.photos[8].alt }}" loading="lazy">
  </div>
  <div class="closing-frame__copy section-shell">
    <p class="eyebrow reveal">The whole story</p>
    <h2 class="reveal">Eleven photographs.<br>One long way north.</h2>
    <a class="pill-link reveal" href="{{ '/albums/the-long-way-north/' | relative_url }}">
      Enter the album <span aria-hidden="true">↗</span>
    </a>
  </div>
</section>
