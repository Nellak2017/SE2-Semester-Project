import TypingSimulator from './TypingSimulator'

export default {
  title: 'Molecules/TypingSimulator',
  component: TypingSimulator,
  argTypes: {
    message: { control: 'text' },
	typingSpeed: { control: 'text' },
  }
}

const Template = args => <TypingSimulator {...args} />


const longParagraph = `
The behavior you're observing is due to the asynchronous nature of the await inside the loop. While the await pauses the execution of the loop until the setTimeout is complete, it doesn't prevent the loop from continuing, and currentIndex gets incremented before the setTypedText callback is executed.

To capture the correct value of currentIndex inside the setTypedText callback, you can create a local variable that holds the current value of currentIndex. Here's an updated version of your code:
\`\`\`
const typeCharacters = async () => {
	while (currentIndex < totalChars) {
	  // Use a Promise to introduce an asynchronous delay
	  await new Promise((resolve) => setTimeout(resolve, calculateDelay()));
  
	  // Capture the current index in a local variable
	  const indexToUse = currentIndex;
  
	  console.log(indexToUse); // on iteration 1, it is 1
  
	  setTypedText((prevText) => {
		console.log(indexToUse); // on iteration 1, it is still 1
		console.log(message[indexToUse]);
  
		return prevText + message[indexToUse];
	  });
  
	  // Increment currentIndex
	  currentIndex += 1;
	}
  };
\`\`\`
`

export const light = Template.bind({})
light.args = {
  message: 'light',
  typingSpeed: .5
}

export const dark = Template.bind({})
dark.args = {
  message: longParagraph,
  typingSpeed: 100
}
