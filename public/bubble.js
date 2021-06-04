const socket = io();

const bubbleMessage = document.getElementById('bubbleMessage');
bubbleMessage.style.color = 'black';

socket.on('newMessage', (data) => {
    const user = data.tags['display-name'];
    const message = data.message.replace(/!color\s\w{1,}\s/, '');
    bubbleMessage.innerText = `[${user}]: ${message}`
});

const bubbleContainer = document.getElementById('bubbleContainer');
bubbleContainer.style.backgroundColor = 'white';

const maxColor = 255;

const net = new brain.NeuralNetwork();
net.train([
    { input: { red: 1, green: 1, blue: 1 }, output: { black: 1 } },
    { input: { red: 0, green: 0, blue: 0 }, output: { white: 1 } },
    { input: { red: 0, green: 1, blue: 0 }, output: { white: 1 } },
    { input: { red: 0, green: 0, blue: 1 }, output: { white: 1 } },
    { input: { red: 0, green: 54 / maxColor, blue: 1 }, output: { white: 1 } },
    { input: { red: 0, green: 1, blue: 1 }, output: { black: 1 } },
]);

const output = net.run({ r: 1, g: 1, b: 1 });

socket.on('setColor', ({ color }) => {
    bubbleContainer.style.backgroundColor = color;

    const divColor = window.getComputedStyle(bubbleContainer).backgroundColor;
    const [
        red,
        green,
        blue
    ] = divColor
        .split(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
        .map(number => parseInt(number));

    const { black, white } = net.run({
        red: red / maxColor ,
        green: green / maxColor,
        blue: blue / maxColor,
    });

    bubbleMessage.style.color = black > white
        ? 'black'
        : 'white';
});