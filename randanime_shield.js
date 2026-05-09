// 1. INJECT THE CSS (The Paint)
(function () {
  const style = document.createElement("style");
  style.textContent = `
        /* SHIELD Breach Glitch Shards */
        .shield-shard {
            position: fixed; 
            background-color: #111; 
            pointer-events: none; 
            z-index: 9999;
            opacity: 0;
            animation: shieldFlicker linear infinite;
        }

        /* Base sizes for the fragments */
        .shard-massive { width: 40vw; height: 15vh; }
        .shard-medium  { width: 20vw; height: 8vh;  }
        .shard-small   { width: 10vw; height: 3vh;  }
        .shard-micro   { width: 3vw;  height: 1vh; background-color: #ff003c; }

        /* The chaotic flickering animation */
        @keyframes shieldFlicker {
            0%   { opacity: 0; transform: translateX(0); }
            5%   { opacity: 0.9; transform: translateX(-5px); }
            10%  { opacity: 0; transform: translateX(5px); }
            15%  { opacity: 0.8; transform: translateX(-2px); }
            20%  { opacity: 0; transform: translateX(0); }
            100% { opacity: 0; }
        }
    `;
  document.head.appendChild(style);
})();

// 2. THE SCATTER ENGINE (The Logic)
function shieldRandAnime(targetId) {
  const shardCounts = {
    massive: { min: 1, max: 2 },
    medium: { min: 2, max: 4 },
    small: { min: 3, max: 6 },
    micro: { min: 5, max: 12 },
  };

  function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function spawnShard(typeClass) {
    const shard = document.createElement("div");
    shard.classList.add("shield-shard", typeClass);

    // Randomize coordinates
    const randomTop = Math.random() * 100;
    const randomLeft = Math.random() * 100;

    // Randomize desynchronization
    const randomDelay = Math.random() * 3;
    const randomDuration = Math.random() * 4 + 2;

    shard.style.top = `${randomTop}vh`;
    shard.style.left = `${randomLeft}vw`;
    shard.style.animationDelay = `${randomDelay}s`;
    shard.style.animationDuration = `${randomDuration}s`;

    document.body.appendChild(shard);
  }

  // Execute the Breach
  for (
    let i = 0;
    i < randomInt(shardCounts.massive.min, shardCounts.massive.max);
    i++
  ) {
    spawnShard("shard-massive");
  }
  for (
    let i = 0;
    i < randomInt(shardCounts.medium.min, shardCounts.medium.max);
    i++
  ) {
    spawnShard("shard-medium");
  }
  for (
    let i = 0;
    i < randomInt(shardCounts.small.min, shardCounts.small.max);
    i++
  ) {
    spawnShard("shard-small");
  }
  for (
    let i = 0;
    i < randomInt(shardCounts.micro.min, shardCounts.micro.max);
    i++
  ) {
    spawnShard("shard-micro");
  }
}
