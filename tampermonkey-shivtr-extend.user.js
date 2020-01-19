// ==UserScript==
// @name         Tampermonkey Shivtr extension
// @namespace    https://github.com/JJetmar
// @version      0.2
// @description  Allows to generate World of Warcraft in-game scripts based on Shivtr page content.
// @author       JJetmar
// @include      *.shivtr.com/events/*
// @include      *.wowhordes.com/events/*
// @include      *.wowalliances.com/events/*
// @include      *.tyriaguilds.com/events/*
// @include      *.pwfactions.com/events/*
// @include      *.shivtr.red/events/*
// @include      *.shivtr.blue/events/*
// ==/UserScript==

(function($) {
  'use strict';

  const originalAjax = $.ajax;

  // Created invisible element to be possible to create DOM structure from plain text.
  document.body.insertAdjacentHTML('afterEnd', `<div id="shadow" style="display:none"></div>`);

  // Inject Ajax requests, to keep button visible during switching tabs.
  $.ajax = (options) => originalAjax(options).always(() => {
    if (options.url.match(/\/events\/\d+\?event_instance_id=\d+(&view=(classes|status|groups))?$/)) {
      initInvitations();
    }
  });

  // Invite all members
  const initInvitations = function() {
    const tabs = document.getElementById("signup_tabs");
    const signUpContent = document.getElementById("signup_content");

    tabs.insertAdjacentHTML('afterEnd', `
      <button id="copy_for_raid_raider" class="btn-primary">
        <i class="icon-person"></i> Export for NightRaider (requires addon)
      </button>
    `);

    tabs.insertAdjacentHTML('afterEnd', `
      <button id="invite_all" class="btn-primary">
        <i class="icon-person"></i> Invite all (in-game script)
      </button>
    `);

    document.getElementById("invite_all").addEventListener("click", () => {
      const members = `{${[...signUpContent.querySelectorAll("a.member_link")].map(member => `"${member.innerText.trim()}"`).join(",")}}`;

      const result = `/script a=${members};for b=1,#a do InviteUnit(a[b]) end`;
      prompt("Copy to clipboard", result);
    }, false);

    document.getElementById("copy_for_raid_raider").addEventListener("click", () => {
      $.ajax({
        url: `${location.href}&view=groups`,
        headers: {
          Accept: "text/javascript",
        },
        data: "data"
      })
      .done(data => {
        const shadow = document.getElementById("shadow");
        shadow.innerHTML = data.match(/^\$\('#events_show'\)\.replaceWith\('(.+)'\)\s*if \( \$\('#new_or_edit'\).length > 0 \)/)[1]
        .replace(/\\n/gm, "")
        .replace(/\\(.)/gm, "$1");

        const members = {};
        const groups = shadow.querySelectorAll("td");
        for (const group of groups) {
          const groupNumber = (group.querySelectorAll(".table_header")[0].innerText.match(/^Group(\d+)/) || {1: 0})[1];

          for (const member of [...group.querySelectorAll("a.member_link")].map(member => member.innerText.trim())) {
            members[member] = parseInt(groupNumber);
          }
        }

        // JSON to Lua table
        const result = JSON.stringify(members).replace(/:/mg, "=").replace(/"/mg, "");
        prompt("Copy to clipboard", result);
      });
    }, false);
  };

  // On page load
  initInvitations();
})(jQuery);