import "core-js/features/array/to-reversed"; import "core-js/features/array/to-sorted"; import "core-js/features/array/to-spliced"
export const noop = () => { /* Intentionally left blank */}
export const highlightThread = (threadList, index = 0) => threadList.map((e, i) => ({ ...e, highlighted: i === index }))
export const convertMessagesToGemini = old => old.map(message => ({ role: message.SentByUser, parts: [{ text: message.Text }] }))
export const downloadFile = (content, fileName, type) => { const link = document.createElement('a'); link.href = URL.createObjectURL(new Blob([content], { type })); link.download = fileName; link.click() }
export const formatMessagesForExport = messages => messages.toReversed().map(message => `${message.SentByUser}: ${message.Text}`).join('\n')
export const handleExportButtonClick = messages => downloadFile(formatMessagesForExport(messages), 'exported_messages.txt', 'text/plain')