const socket = io();

const bubbleContainer = document.getElementById('bubbleContainer');
const bubbleMessage = document.getElementById('bubbleMessage');
const drinkMateContainer = document.getElementById('tomaMate');

const net = new brain.NeuralNetwork();
net.train(trainings);

const {
  ref,
  onUpdated,
  createApp,
} = Vue;

createApp({
  template: `
    <ul
      class="
        w-full flex flex-col space-y-4 max-w-md max-h-64 h-screen bg-blue-900
        overflow-y-auto p-4
      "
    >
      <li
        v-for="(message, index) in messageList"
        :key="index"
        class="text-sm flex flex-row space-x-2 rounded-lg text-white p-2"
        :class="users[message.userId].bubble"
        id="bubbleMessageVue"
      >
        <p
          class="font-semibold"
          :style="users[message.userId].user"
        >
          [{{ message.username }}]:
        </p>

        <span :class="users[message.userId].text">
          {{ message.message }}
        </span>
      </li>
    </ul>
  `,

  setup() {
    const messageList = ref([]);
    const users = ref({});

    const defaultColors = {
      bubble: 'bg-gray-900',
      text: 'text-white',
      user: { color: 'purple' },
    }

    socket.on('newMessage', ({ message, tags }) => {
      textFormarter(message, tags);
    });

    socket.on('setColor', ({ color }) => {
      bubbleContainer.style.backgroundColor = color;
    });

    socket.on('drinkMate', () => {
      drinkMateContainer.play();
    });

    const textFormarter = (message, tags) => {
      const username = tags['display-name'];
      const userId = tags['user-id'];

      const newMessage = message.replace(/!color\s\w{1,}\s?/, '');

      if(!newMessage.length) return;

      setTimeout(() => {
        setBubbleColor(message, userId);

        messageList.value.push({
          username,
          userId,
          message: newMessage,
        });
      });
    };

    const setBubbleColor = (message, userId) => {
      const htmlColor = window.getComputedStyle(bubbleContainer).backgroundColor;
      const exists = Object.keys(users.value).some(user => user == userId);

      if(message.startsWith('!color')) {
        users.value[userId] = getBubbleColors(htmlColor);
        return;
      };

      if(exists && !message.startsWith('!color')) return;

      const newUser = {};
      newUser[userId] = defaultColors;

      users.value = {
        ...users.value,
        ...newUser,
      };
    };

    onUpdated(() => {
      scrollToNewMessage();
    });

    const scrollToNewMessage = () => {
      [...document.querySelectorAll('#bubbleMessageVue')]
        .pop()
        .scrollIntoView();
    };

    const getBubbleColors = (color) => {
      const { black, white } = getIAColor(color);

      return {
        bubble: black < white ? 'bg-gray-900' : 'bg-gray-300',
        text: black < white ? 'text-white' : 'text-gray-900',
        user: { color },
      };
    };

    const getIAColor = (color) => {
      const [
        ,red,
        green,
        blue,
      ] = color.split(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
          .map(number => parseInt(number));

      const { black, white } = net.run({
          red: red / maxColor ,
          green: green / maxColor,
          blue: blue / maxColor,
      });

      return { black, white };
    };

    return { messageList, users };
  }
}).mount('#app');