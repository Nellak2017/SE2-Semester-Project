// --- General Helpers
export const highlightThread = (threadList, index = 0) => threadList.map((e, i) => ({ ...e, highlighted: i === index }))
export const convertMessagesToGemini = old => old.map(message => ({ role: message.SentByUser, parts: [{ text: message.Text }] }))

// --- FILE API Helpers
export const downloadFile = (content, fileName, contentType) => {
	const blob = new Blob([content], { type: contentType }), link = document.createElement('a')
	link.href = URL.createObjectURL(blob)
	link.download = fileName
	link.click()
}
export const formatMessagesForExport = messages => messages.toReversed().map(message => `${message.author}: ${message.content}`).join('\n')
export const handleExportButtonClick = messages => downloadFile(formatMessagesForExport(messages), 'exported_messages.txt', 'text/plain')