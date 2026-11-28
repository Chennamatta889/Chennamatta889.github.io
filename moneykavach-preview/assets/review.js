(function(){'use strict';
const pause=document.getElementById('mk-ticker-pause'),track=document.querySelector('.mk-ticker-track');
if(pause&&track)pause.addEventListener('click',()=>{const paused=pause.getAttribute('aria-pressed')==='true';pause.setAttribute('aria-pressed',String(!paused));track.style.animationPlayState=paused?'running':'paused';pause.textContent=paused?'Pause':'Resume';});
const market=document.getElementById('market');
if(market){for(const e of market.querySelectorAll('input,select,button')){e.disabled=true;e.title='Use the live MoneyKavach website for calculations';}
for(const e of market.querySelectorAll('[role=status]')){e.textContent='Live data not loaded in design preview.';}
const links=market.querySelectorAll('a[data-market-open]');for(const a of links){a.addEventListener('click',()=>{const d=document.getElementById(a.dataset.marketOpen);if(d&&d.tagName==='DETAILS')d.open=true;});}}
for(const a of document.querySelectorAll('[data-market-open]'))a.addEventListener('click',()=>{const d=document.getElementById(a.dataset.marketOpen);if(d&&d.tagName==='DETAILS')d.open=true;});
})();