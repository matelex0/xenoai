document.addEventListener("DOMContentLoaded", () => {
  const inputField = document.getElementById("initial-input");
  const sendBtn = document.getElementById("send-btn");
  const inputWrapper = document.querySelector(".input-wrapper");

  setTimeout(() => {
    inputField.focus();
  }, 1500);

  inputField.addEventListener("focus", () => {
    inputWrapper.classList.add("focused");
  });

  inputField.addEventListener("blur", () => {
    inputWrapper.classList.remove("focused");
  });

  inputField.addEventListener("input", () => {
    if (inputField.value.trim().length > 0) {
      inputWrapper.classList.add("has-content");
    } else {
      inputWrapper.classList.remove("has-content");
    }
  });

  sendBtn.addEventListener("click", () => {
    const val = inputField.value.trim();
    if (val.length > 0) {
      console.log("Sending message:", val);

      inputField.value = "";
      inputWrapper.classList.remove("has-content");
    }
  });

  inputField.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const val = inputField.value.trim();
      if (val.length > 0) {
        sendBtn.click();
      }
    }
  });

/**
 * Fetches the number of stars for a given GitHub repository and updates the star count element.
 *
 * @async
 * @function fetchGitHubStars
 * @param {string} repo - The GitHub repository in the format "owner/repo".
 * @returns {Promise<void>} - A Promise that resolves when the star count is updated.
 */

async function fetchGitHubStars() {
    const repo = "matelex0/xenoai";
    const starElement = document.getElementById("star-count");

    try {
      const response = await fetch(`https://api.github.com/repos/${repo}`);
      if (response.ok) {
        const data = await response.json();

        const stars = data.stargazers_count;
        starElement.innerText =
          stars >= 1000 ? (stars / 1000).toFixed(1) + "k" : stars;

        starElement.parentElement.style.opacity = "1";
      } else {
        console.log("GitHub repo not found, using default");
        starElement.innerText = "0";
      }
    } catch (error) {
      console.error("Error fetching stars:", error);
      starElement.innerText = "-";
    }
  }

fetchGitHubStars();

/**
 * Initializes the star canvas and starts the animation.
 *
 * @function init
 * @returns {void}
 */

const canvas = document.getElementById("star-canvas");
  const ctx = canvas.getContext("2d");

  let width, height;
  let stars = [];

      const config = {
    starCount: 500,
    speed: 0,
    maxSize: 1.5,
    tailLength: 50,
    shootingStarInterval: 3000,
  };

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
  }

  class Star {
    constructor(isShooting = false) {
      this.isShooting = isShooting;
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.z = Math.random() * 2 + 0.5;
      this.size = Math.random() * config.maxSize;
      this.opacity = Math.random() * 0.5 + 0.3;
      this.speed = config.speed * this.z;

      if (this.isShooting) {
        if (Math.random() < 0.5) {
          this.x = Math.random() * width;
          this.y = 0;
        } else {
          this.x = 0;
          this.y = Math.random() * height;
        }

        this.speed = Math.random() * 5 + 10;
        this.size = Math.random() * 2 + 1;
        this.angle = Math.PI / 4;
        this.opacity = 1;
        this.active = true;
      }
    }

    update() {
      if (this.isShooting && this.active) {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.opacity -= 0.01;

        if (this.opacity <= 0 || this.x > width || this.y > height) {
          this.active = false;
        }
      } else {
        if (Math.random() > 0.99) {
          this.opacity = Math.random() * 0.5 + 0.5;
        } else {
          this.opacity = Math.max(0.1, this.opacity - 0.005);
        }
      }
    }

    /**
     * Draws the star on the canvas.
     *
     * @function draw
     * @returns {void}
     */
    draw() {
      if (this.isShooting && !this.active) return;

      ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
      ctx.beginPath();

      if (this.isShooting) {
        const tailX = this.x - Math.cos(this.angle) * config.tailLength;
        const tailY = this.y - Math.sin(this.angle) * config.tailLength;

        const gradient = ctx.createLinearGradient(this.x, this.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity})`);
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.strokeStyle = gradient;
        ctx.lineWidth = this.size;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(tailX, tailY);
        ctx.stroke();
      } else {
        ctx.fillStyle = `rgba(236, 163, 255, ${this.opacity})`;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }

  let shootingStars = [];

  function init() {
    resize();
    stars = [];
    for (let i = 0; i < config.starCount; i++) {
      stars.push(new Star());
    }
    animate();
  }

/**
 * Animates the star canvas by updating and drawing stars, as well as shooting stars.
 *
 * @function animate
 * @returns {void}
 */
  function animate() {
    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createRadialGradient(
      width / 2,
      height / 2,
      0,
      width / 2,
      height / 2,
      width,
    );
    gradient.addColorStop(0, "#0a0510");
    gradient.addColorStop(1, "#020103");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    stars.forEach((star) => {
      star.update();
      star.draw();
    });

    if (Math.random() < 0.005) {
      shootingStars.push(new Star(true));
    }

    shootingStars = shootingStars.filter((star) => star.active);
    shootingStars.forEach((star) => {
      star.update();
      star.draw();
    });

    requestAnimationFrame(animate);
  }

/**
 * Event listener for the window resize event.
 * Resizes the canvas and updates the star positions.
 *
 * @function resize
 * @returns {void}
 */
  window.addEventListener("resize", resize);
  init();
});
