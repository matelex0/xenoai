document.addEventListener("DOMContentLoaded", () => {
  const chatInput = document.getElementById("chat-input");
  const sendBtn = document.getElementById("send-btn");
  const messagesContainer = document.getElementById("messages-container");
  const sidebar = document.querySelector(".sidebar");
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const suggestionChips = document.querySelectorAll(".suggestion-chip");

  mobileMenuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });

  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 768) {
      if (
        !sidebar.contains(e.target) &&
        !mobileMenuToggle.contains(e.target) &&
        sidebar.classList.contains("active")
      ) {
        sidebar.classList.remove("active");
      }
    }
  });

  chatInput.addEventListener("input", function () {
    this.style.height = "auto";
    this.style.height = Math.min(this.scrollHeight, 150) + "px";
    
    if (this.value.trim().length > 0) {
      sendBtn.disabled = false;
    } else {
      sendBtn.disabled = true;
    }
  });

  function addMessage(content, isUser = false) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.classList.add(isUser ? "user-message" : "ai-message");

    let innerHTML = "";
    
    if (!isUser) {
      innerHTML += `
        <div class="avatar-ai">
          <img src="../assets/logo.png" alt="AI" />
        </div>
      `;
    }

    innerHTML += `
      <div class="message-content">
        <p>${content}</p>
      </div>
    `;

    if (!isUser) {
      innerHTML += `
        <div class="message-actions">
          <button class="action-btn" title="Copy"><i class="ph ph-copy"></i></button>
          <button class="action-btn" title="Good response"><i class="ph ph-thumbs-up"></i></button>
        </div>
      `;
    } else {
      innerHTML += `<div class="message-meta">Just now</div>`;
    }

    messageDiv.innerHTML = innerHTML;
    messagesContainer.appendChild(messageDiv);
    
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function handleSend() {
    const content = chatInput.value.trim();
    if (!content) return;

    addMessage(content, true);

    chatInput.value = "";
    chatInput.style.height = "auto";
    sendBtn.disabled = true;

    showTypingIndicator();
    
    setTimeout(() => {
      removeTypingIndicator();
      addMessage("This is a simulated response. The g4f integration is coming soon!");
    }, 1500);
  }

  sendBtn.addEventListener("click", handleSend);
  
  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });

  suggestionChips.forEach(chip => {
    chip.addEventListener("click", () => {
      const text = chip.innerText.trim();
      chatInput.value = text;
      chatInput.focus();
      const event = new Event('input', {
        bubbles: true,
        cancelable: true,
      });
      chatInput.dispatchEvent(event);
    });
  });

  let typingDiv = null;

  function showTypingIndicator() {
    typingDiv = document.createElement("div");
    typingDiv.classList.add("message", "ai-message");
    typingDiv.innerHTML = `
      <div class="avatar-ai">
        <img src="../assets/logobig.png" alt="AI" />
      </div>
      <div class="message-content" style="padding: 1rem;">
        <div class="typing-indicator">
          <span></span><span></span><span></span>
        </div>
      </div>
    `;
    messagesContainer.appendChild(typingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  function removeTypingIndicator() {
    if (typingDiv) {
      typingDiv.remove();
      typingDiv = null;
    }
  }
  const canvas = document.getElementById("star-canvas");
  const ctx = canvas.getContext("2d");

  let width, height;
  let stars = [];
  let shootingStars = [];

  const config = {
    starCount: 300,
    speed: 0.05,
    maxSize: 1.5,
    tailLength: 50,
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
        this.x = Math.random() * width;
        this.y = 0;
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
        this.opacity -= 0.02;

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

    draw() {
      if (this.isShooting && !this.active) return;

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

  function initCanvas() {
    resize();
    stars = [];
    for (let i = 0; i < config.starCount; i++) {
      stars.push(new Star());
    }
    animate();
  }

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

  window.addEventListener("resize", resize);
  initCanvas();
});
