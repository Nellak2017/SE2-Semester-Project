// Contains many pure functions used through out the application

// --- General Helpers

// Function to highlight a specific thread at an index. If index is negative, it makes everything false
export const highlightThread = (threadList, index = 0) => threadList.map((e, i) => ({ ...e, highlighted: i === index }))

// Function used to convert old format messages to the new Gemini format
export const convertMessagesToGemini = old => old.map(message => ({
	role: message.SentByUser,
	parts: [{
		text: message.Text
	}]
}))

// --- FILE API Helpers

export const downloadFile = (content, fileName, contentType) => {
	const blob = new Blob([content], { type: contentType }), link = document.createElement('a')
	link.href = URL.createObjectURL(blob)
	link.download = fileName
	link.click()
}

export const formatMessagesForExport = messages => messages
	.toReversed()
	.map(message => `${message.author}: ${message.content}`).join('\n')

export const handleExportButtonClick = messages => downloadFile(formatMessagesForExport(messages), 'exported_messages.txt', 'text/plain')