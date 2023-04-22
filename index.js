//Importing sound effects
const introMusic = new Audio("./SoundEffects/enemy_instrumental.mp3");
const bulletsSound = new Audio("./SoundEffects/music_shoooting.mp3");
const killEnemySound = new Audio("./SoundEffects/music_killEnemy.mp3");
const gameOverSound = new Audio(
  "./SoundEffects/mixkit-cartoon-whistle-game-over-606.wav"
);
const heavyAmmoSound = new Audio("./SoundEffects/laser-gun-19sf.mp3");
const megaStrikeSound = new Audio(
  "./SoundEffects/lightsaber-ignition-6816.mp3"
);

introMusic.play();

const canvas = document.createElement("canvas");
document.querySelector(".myGame").appendChild(canvas);
canvas.width = innerWidth;
canvas.height = innerHeight;
const context = canvas.getContext("2d");
const lightWeaponDamage = 13;
const heavyWeaponDamage = 25;
let difficulty = 0;
const form = document.querySelector("form");
const scoreBoard = document.querySelector(".scoreBoard");
let shooterScore = 0;

document.querySelector("input").addEventListener("click", (e) => {
  e.preventDefault();

  //Stop music when game starts
  introMusic.pause();

  form.style.display = "none";
  scoreBoard.style.display = "block";
  const userValue = document.getElementById("difficulty").value;
  if (userValue === "Easy") {
    setInterval(spawnEnemy, 2500);
    return (difficulty = 1);
  }
  if (userValue === "Medium") {
    setInterval(spawnEnemy, 2000);
    return (difficulty = 2);
  }
  if (userValue === "Hard") {
    setInterval(spawnEnemy, 1500);
    return (difficulty = 3);
  }
  if (userValue === "Insane") {
    setInterval(spawnEnemy, 1000);
    return (difficulty = 4);
  }
});

const gameOverInitiator = () => {
  //Initiating endScreen div element and Replay button and High Score Element
  const gameOverDisplay = document.createElement("div");
  const gameOverBtn = document.createElement("button");
  const highScore = document.createElement("div");

  //insert text to replay button
  gameOverBtn.innerHTML = "Retry";

  gameOverDisplay.appendChild(highScore);
  gameOverDisplay.appendChild(gameOverBtn);

  highScore.innerHTML = `High Score: ${
    localStorage.getItem("highScore")
      ? localStorage.getItem("highScore")
      : shooterScore
  }`;

  const previousHighScore =
    localStorage.getItem("highScore") && localStorage.getItem("highScore");

  //If player beats his/her previous high score than set current shooter score as the new high score
  if (previousHighScore < shooterScore) {
    localStorage.setItem("highScore", shooterScore);
    highScore.innerHTML = `High Score: ${shooterScore}`;
  }
  //Reload when retry button is clicked
  gameOverBtn.onclick = () => {
    window.location.reload();
  };
  gameOverDisplay.classList.add("gameover");

  document.querySelector("body").appendChild(gameOverDisplay);
};
//Shooter set at the center
ShooterPosition = { x: canvas.width / 2, y: canvas.height / 2 };

class Shooter {
  constructor(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
  }

  draw() {
    context.beginPath();
    context.arc(
      this.x,
      this.y,
      this.radius,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360,
      false
    );
    context.fillStyle = this.color;
    context.fill();
  }
}

class weapon {
  constructor(x, y, radius, color, velocity, damage) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.damage = damage;
  }

  draw() {
    context.beginPath();
    context.arc(
      this.x,
      this.y,
      this.radius,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360,
      false
    );
    context.fillStyle = this.color;
    context.fill();
  }
  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

class Megaweapon {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.color = "rgba(47,255,0,1)";
  }

  draw() {
    context.beginPath();
    context.fillStyle = this.color;
    context.fillRect(this.x, this.y, 200, canvas.height);
  }
  update() {
    this.draw();
    this.x += 20; //every frame will be shifted by 10 px
  }
}

class enemy {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
  }

  draw() {
    context.beginPath();
    context.arc(
      this.x,
      this.y,
      this.radius,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360,
      false
    );
    context.fillStyle = this.color;
    context.fill();
  }
  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
  }
}

class Particle {
  constructor(x, y, radius, color, velocity) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.velocity = velocity;
    this.alpha = 1;
  }

  draw() {
    context.save();
    context.globalAlpha = this.alpha;
    context.beginPath();
    context.arc(
      this.x,
      this.y,
      this.radius,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360,
      false
    );
    context.fillStyle = this.color;
    context.fill();
    context.restore();
  }
  update() {
    this.draw();
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.alpha -= 0.01;
  }
}

//Creating Shooter object, weapons array, enemies array
const shooter1 = new Shooter(ShooterPosition.x, ShooterPosition.y, 15, "white");
const weapons = [];
const Megaweapons = [];
const enemies = [];
const particles = [];
//Arrow function to create Spawn enemy at random location
const spawnEnemy = () => {
  //assigning random size for enemy
  const enemySize = Math.random() * (40 - 5) + 5;
  //assigning random color to enemy
  const enemyColor = `hsl(${Math.floor(Math.random() * 100)},100%, 50%)`;

  let random; // Enemy spawn position

  //Making enemy location random but only from outside the screen
  if (Math.random() < 0.5) {
    //setting x to extreme left of the screen or extreme right of the screen and setting y to any random position vertically.
    random = {
      x: Math.random() < 0.5 ? canvas.width + enemySize : 0 - enemySize,
      y: Math.random() * canvas.height,
    };
  } else {
    //setting x to any random position horizontally and setting y to extreme top or bottom of the screen.
    random = {
      x: Math.random() * canvas.width,
      y: Math.random() < 0.5 ? canvas.height + enemySize : 0 - enemySize,
    };
  }

  //finding angle between center(i.e the Shooter position) and enemy position
  const myAngle = Math.atan2(
    canvas.height / 2 - random.y, //Enemy is directed towards the centre (Shooter)
    canvas.width / 2 - random.x
  );

  //Setting velocity of enemy as a multiple of 'difficulty' to radians
  const velocity = {
    x: Math.cos(myAngle) * difficulty,
    y: Math.sin(myAngle) * difficulty,
  };
  // inserting enemy to enemies array
  enemies.push(new enemy(random.x, random.y, enemySize, enemyColor, velocity));
};

let animationID;
function animation() {
  //Recursive call to animation function
  animationID = requestAnimationFrame(animation);

  //updating Shooter score on scoreboard
  scoreBoard.innerHTML = `Score : ${shooterScore}`;

  //Adding fade effect to each enemy in the frame
  context.fillStyle = "rgba(49,49,49,0.2)";
  context.fillRect(0, 0, canvas.width, canvas.height);
  //context.clearRect(0, 0, canvas.width, canvas.height);

  shooter1.draw();

  //Generating particles
  particles.forEach((particle, particleIndex) => {
    if (particle.alpha <= 0) particles.splice(particleIndex, 1);
    else particle.update();
  });

  //Generating Mega weapon
  Megaweapons.forEach((Megaweapon, MegaweaponIndex) => {
    if (Megaweapon.x > canvas.width) {
      Megaweapons.splice(MegaweaponIndex, 1);
    } else {
      Megaweapon.update();
    }
  });

  //Generating shooting bullets
  weapons.forEach((weapon, weaponIndex) => {
    weapon.update();

    //Deleting bullets which move out of the screen boundary
    if (
      weapon.x + weapon.radius < 1 ||
      weapon.y + weapon.radius < 1 ||
      weapon.x - weapon.radius > canvas.width ||
      weapon.y - weapon.radius > canvas.height
    ) {
      weapons.splice(weaponIndex, 1);
    }
  });

  //Generating enemies
  enemies.forEach((enemy, enemyIndex) => {
    enemy.update();
    const distance_between_Shooter_and_enemy = Math.hypot(
      shooter1.x - enemy.x,
      shooter1.y - enemy.y
    );

    //Finish the game if enemy hit the shooter
    if (
      distance_between_Shooter_and_enemy - shooter1.radius - enemy.radius <
      1
    ) {
      cancelAnimationFrame(animationID);
      gameOverSound.play();
      return gameOverInitiator();
    }

    // Initiating Megaweapon stike and computing distance between megaweapon and enemy
    Megaweapons.forEach((MegaWeapon) => {
      const distance_between_megaWeapon_and_enemy = MegaWeapon.x - enemy.x;
      if (
        distance_between_megaWeapon_and_enemy <= 200 &&
        distance_between_megaWeapon_and_enemy >= -200
      ) {
        //Incrementing Shooter's score when 1 enemy is eleminated
        shooterScore += 10;
        //Updating the scoreBoard
        scoreBoard.innerHTML = `Score : ${shooterScore}`;
        setTimeout(() => {
          killEnemySound.play();
          enemies.splice(enemyIndex, 1);
        }, 0);
      }
    });

    weapons.forEach((weapon, weaponIndex) => {
      const distance_between_weapon_and_enemy = Math.hypot(
        weapon.x - enemy.x,
        weapon.y - enemy.y
      );
      if (
        distance_between_weapon_and_enemy - weapon.radius - enemy.radius <
        1
      ) {
        killEnemySound.play();
        //reducing size of enemy on hit
        if (enemy.radius > weapon.damage + 8) {
          gsap.to(enemy, { radius: enemy.radius - weapon.damage }); //using a transition from gsap when size of enemy reduces
          setTimeout(() => {
            weapons.splice(weaponIndex, 1);
          }, 0);
        }
        //removing enemy on hit if their radius is smaller than 18
        else {
          for (let i = 0; i < enemy.radius * 2; i++) {
            particles.push(
              new Particle(weapon.x, weapon.y, Math.random() * 2, enemy.color, {
                x: (Math.random() - 0.4) * (Math.random() * 8),
                y: (Math.random() - 0.4) * (Math.random() * 8),
              })
            );
          }
          //Incrementing Shooter's score when 1 enemy is eleminated
          shooterScore += 10;

          //Rendering Shooter score on scoreboard
          scoreBoard.innerHTML = `Score : ${shooterScore}`;

          setTimeout(() => {
            enemies.splice(enemyIndex, 1);
            weapons.splice(weaponIndex, 1);
          }, 0);
        }
      }
    });
  });
}

//setInterval(spawnEnemy, 1000); //call spawnEnemy() after every 1 second(1000 ms)

//Event listener for light ammo i.e. left mouse click
canvas.addEventListener("click", (e) => {
  bulletsSound.play();

  //computing angle between Shooter position and 'click' co-ordinates
  const myAngle = Math.atan2(
    e.clientY - canvas.height / 2,
    e.clientX - canvas.width / 2
  );
  //Setting constant speed for light ammo
  const velocity = {
    x: Math.cos(myAngle) * 8,
    y: Math.sin(myAngle) * 8,
  };

  //insert light ammo into weapons array
  weapons.push(
    new weapon(
      canvas.width / 2,
      canvas.height / 2,
      6,
      "white",
      velocity,
      lightWeaponDamage
    )
  );
});

//Event listener for heavy ammo i.e. right mouse click
canvas.addEventListener("contextmenu", (e) => {
  e.preventDefault();
  if (shooterScore <= 0) return;
  heavyAmmoSound.play();
  //Imposing penalty or reducing shooter's score if Heavy ammo is used
  shooterScore -= 2;
  //Updating the scoreBoard
  scoreBoard.innerHTML = `Score : ${shooterScore}`;
  //computing angle between Shooter position and 'click' co-ordinates
  const myAngle = Math.atan2(
    e.clientY - canvas.height / 2,
    e.clientX - canvas.width / 2
  );
  //Setting constant speed for light ammo
  const velocity = {
    x: Math.cos(myAngle) * 4,
    y: Math.sin(myAngle) * 4,
  };

  //insert light ammo into weapons array
  weapons.push(
    new weapon(
      canvas.width / 2,
      canvas.height / 2,
      30,
      "cyan",
      velocity,
      heavyWeaponDamage
    )
  );
});

addEventListener("keypress", (e) => {
  if (e.key === " ") {
    if (shooterScore < 25) return;
    shooterScore -= 25;
    scoreBoard.innerHTML = `Score : ${shooterScore}`;
    megaStrikeSound.play();
    Megaweapons.push(new Megaweapon(0, 0));
  }
});

addEventListener("contextmenu", (e) => {
  e.preventDefault();
});
addEventListener("resize", () => {
  //Making canvas size compatible with varying window size
  window.location.reload();
});

animation();
