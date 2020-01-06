// ==UserScript==
// @name         Tampermonkey Shivtr extension
// @namespace    https://github.com/JJetmar
// @version      0.1
// @description  Allows to generate World of Warcraft in-game scripts based on Shivtr page content.
// @author       JJetmar
// @include      *.shivtr.com/events/*
// @include      *.wowhordes.com/events/*
// @include      *.wowalliances.com/events/*
// @include      *.tyriaguilds.com/events/*
// @include      *.pwfactions.com/events/*
// @include      *.shivtr.red/events/*
// @include      *.shivtr.blue/events/*
// @updateURL    https://raw.githubusercontent.com/JJetmar/tampermonkey-shivtr-extend/master/tampermonkey-shivtr-extend.user.js
// @downloadURL  https://raw.githubusercontent.com/JJetmar/tampermonkey-shivtr-extend/master/tampermonkey-shivtr-extend.user.js
// ==/UserScript==

(function() {
    'use strict';

    // Invite all members
    const initInvitations = function() {
        const tabs = document.getElementById("signup_tabs");
        const signUpContent = document.getElementById("signup_content");

        tabs.insertAdjacentHTML('afterEnd', `
          <button id="invite_all" class="btn-primary">
            <i class="icon-person"></i> Invite all
          </button>
        `);

        document.getElementById("invite_all").addEventListener("click", () => {
            const members = `{${[...signUpContent.querySelectorAll("a.member_link")].map(member => `"${member.innerText.trim()}"`).join(",")}}`;

            // TODO CHANGE TO RAID IF NEEDED

            // TODO INVITE TO SPECIFIC GROUP OF RAID IF POSSIBLE

            const result = `/script a=${members};for b=1,#a do InviteUnit(a[b]) end`;
            prompt("Copy to clipboard", result);
        }, false);
    }

    // Sort by groups
    const result = `/script
        local m={Jetyus=4,Bonifacek=4,Ledoborec=4,Pythony=4,Aruja=4,Molonlabe=4,Gretorzor=4};

        local g={}; 
        local pi={};  -- player index mapping => player_name=>raid_index

        for i=1,GetNumGroupMembers() do
        local p,w,s=GetRaidRosterInfo(i);
        g[s] = (g[s] and g[s]+1 or 1);
        pi[p] = i;
        print(s, g[s]);
        end

        for i=1,GetNumGroupMembers() do
        local p=GetRaidRosterInfo(i);
        if g[m[p]] == 5 then
            -- find first invalid user in group 
            -- SwapRaidSubgroup(20, 15);
        else
            -- move to group
            -- SetRaidSubgroup(index, subgroup);
        end
    end`.replace(/--[^\n]*/mg, "").replace(/\s+/mg, " ").replace(/; /mg, ";");



    // On page load
    initInvitations();
})();