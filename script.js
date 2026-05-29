const chatBox = document.getElementById("chatBox");
const promptInput = document.getElementById("prompt");
const sendBtn = document.getElementById("sendBtn");

const historyDiv = document.getElementById("history");
const newChatBtn = document.getElementById("newChatBtn");

const settingsBtn = document.getElementById("settingsBtn");
const settingsModal = document.getElementById("settingsModal");

const saveSettings = document.getElementById("saveSettings");

const username = document.getElementById("username");
const userPfp = document.getElementById("userPfp");

const themeBtn = document.getElementById("themeBtn");

let chats =
  JSON.parse(localStorage.getItem("studyChats"))
  || [];

let currentChat = [];

/* =========================
   LOAD SETTINGS
========================= */

window.onload = () => {

  const savedName =
    localStorage.getItem("username");

  const savedPfp =
    localStorage.getItem("pfp");

  if (savedName) {
    username.innerText = savedName;
  }

  if (savedPfp) {
    userPfp.src = savedPfp;
  }

  renderHistory();
};

/* =========================
   SAVE CHATS
========================= */

function saveChats() {

  localStorage.setItem(
    "studyChats",
    JSON.stringify(chats)
  );

}

/* =========================
   ADD MESSAGE
========================= */

function addMessage(text, type) {

  const div = document.createElement("div");

  div.className =
    `message ${type}`;

  div.innerText = text;

  chatBox.appendChild(div);

  chatBox.scrollTop =
    chatBox.scrollHeight;
}

/* =========================
   SEND MESSAGE
========================= */

async function sendMessage() {

  const text =
    promptInput.value.trim();

  if (!text) return;

  removeWelcome();

  addMessage(text, "user");

  currentChat.push({
    text,
    type: "user"
  });

  promptInput.value = "";

  const thinking =
    document.createElement("div");

  thinking.className =
    "message ai";

  thinking.innerText =
    "Thinking...";

  chatBox.appendChild(thinking);

  chatBox.scrollTop =
    chatBox.scrollHeight;

  try {

    const response =
      await fetch(
        "http://localhost:3000/api/ai",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify({
            message: text
          })
        }
      );

    const data =
      await response.json();

    thinking.remove();

    addMessage(data.reply, "ai");

    currentChat.push({
      text: data.reply,
      type: "ai"
    });

    updateHistory(text);

  }

  catch (err) {

    thinking.innerText =
      "Backend not responding.";

  }

}

/* =========================
   REMOVE WELCOME
========================= */

function removeWelcome() {

  const welcome =
    document.querySelector(".welcome");

  if (welcome) {
    welcome.remove();
  }

}

/* =========================
   UPDATE HISTORY
========================= */

function updateHistory(firstMessage) {

  if (currentChat.length <= 2) {

    chats.unshift({

      title:
        firstMessage.slice(0, 30),

      messages:
        [...currentChat]

    });

  }

  else {

    chats[0].messages =
      [...currentChat];

  }

  saveChats();

  renderHistory();
}

/* =========================
   RENDER HISTORY
========================= */

function renderHistory() {

  historyDiv.innerHTML = "";

  chats.forEach((chat, index) => {

    const item =
      document.createElement("div");

    item.className =
      "history-item";

    const title =
      document.createElement("span");

    title.innerText =
      chat.title;

    const del =
      document.createElement("button");

    del.className =
      "delete-chat";

    del.innerText = "🗑";

    del.onclick = (e) => {

      e.stopPropagation();

      chats.splice(index, 1);

      saveChats();

      renderHistory();

    };

    item.onclick = () => {

      loadChat(chat.messages);

    };

    item.appendChild(title);

    item.appendChild(del);

    historyDiv.appendChild(item);

  });

}

/* =========================
   LOAD CHAT
========================= */

function loadChat(messages) {

  chatBox.innerHTML = "";

  currentChat = [...messages];

  messages.forEach(msg => {

    addMessage(
      msg.text,
      msg.type
    );

  });

}

/* =========================
   NEW CHAT
========================= */

newChatBtn.onclick = () => {

  currentChat = [];

  chatBox.innerHTML = `

    <div class="welcome">

      <h1>Study AI</h1>

      <p>
        Your local AI study assistant
      </p>

    </div>

  `;

};

/* =========================
   SETTINGS
========================= */

settingsBtn.onclick = () => {

  settingsModal.classList
    .remove("hidden");

};

saveSettings.onclick = () => {}

  const newName =
    document.getElementById(
      "nameInput"
    ).value;

  const newPfp =
    document.getElementById(
      "pfpInput"
    ).value;

  if (newName) {

    username.innerText =
      newName;

    localStorage.setItem(
      "username",
      newName
    );

  }

  const pfpInput =
  document.getElementById("pfpInput");

saveSettings.onclick = () => {

  const newName =
    document.getElementById(
      "nameInput"
    ).value;

  /* SAVE NAME */

  if (newName) {

    username.innerText =
      newName;

    localStorage.setItem(
      "username",
      newName
    );

  }

  /* SAVE PROFILE IMAGE */

  const file =
    pfpInput.files[0];

  if (file) {

    const reader =
      new FileReader();

    reader.onload = function(e) {

      const imageData =
        e.target.result;

      userPfp.src =
        imageData;

      localStorage.setItem(
        "pfp",
        imageData
      );

    };

    reader.readAsDataURL(file);

  }

  settingsModal.classList
    .add("hidden");

};

/* =========================
   THEME
========================= */

themeBtn.onclick = () => {

  document.body.classList
    .toggle("light-mode");

};

/* =========================
   ENTER TO SEND
========================= */

promptInput.addEventListener(
  "keydown",
  (e) => {

    if (
      e.key === "Enter"
      &&
      !e.shiftKey
    ) {

      e.preventDefault();

      sendMessage();

    }

  }
);

/* =========================
   BUTTON SEND
========================= */

sendBtn.onclick =
  sendMessage;