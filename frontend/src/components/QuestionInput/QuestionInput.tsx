import { useState } from 'react'
import { Stack, TextField } from '@fluentui/react'
import { SendRegular } from '@fluentui/react-icons'

import Send from '../../assets/Send.svg'
import AttachedFile from '../../assets/AttachedFile.svg'

import styles from './QuestionInput.module.css'

interface Props {
  onSend: (question: string, id?: string, systemMessage?: string, imagesBase64?: string[] | null) => void
  disabled: boolean
  placeholder?: string
  clearOnSend?: boolean
  conversationId?: string
}

export const QuestionInput = ({ onSend, disabled, placeholder, clearOnSend, conversationId }: Props) => {
  const [question, setQuestion] = useState<string>('')
  const [systemMessage, setSystemMessage] = useState<string>('')
  const [imageBase64, setImageBase64] = useState<string[]>([])

  const sendQuestion = () => {
    if (disabled || !question.trim()) {
      return
    }

    if (conversationId) {
      onSend(question, conversationId, systemMessage, imageBase64)
    } else {
      onSend(question, undefined, systemMessage, imageBase64)
    }

    if (clearOnSend) {
      setQuestion('')
      setImageBase64([])
    }
  }

  const onEnterPress = (ev: React.KeyboardEvent<Element>) => {
    if (ev.key === 'Enter' && !ev.shiftKey && !(ev.nativeEvent?.isComposing === true)) {
      ev.preventDefault()
      sendQuestion()
    }
  }

  const onQuestionChange = (_ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {
    setQuestion(newValue || '')
  }

  const onSystemMessageChange = (_ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, newValue?: string) => {  
    setSystemMessage(newValue || '')  
  }

  const handlePaste = (event: React.ClipboardEvent<HTMLDivElement>) => {  
    const items = event.clipboardData.items;  
    for (const item of items) {  
      if (item.type.startsWith('image/')) {  
        const blob = item.getAsFile();  
        const reader = new FileReader();  
        reader.onload = (e) => {  
          setImageBase64(prev => [...prev, e.target?.result as string]); 
        };  
        reader.readAsDataURL(blob!);  
      }  
    }  
  } 

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {  
    const files = event.target.files;  
    if (files) {  
      for (const file of Array.from(files)) {  
        const reader = new FileReader();  
        reader.onload = (e) => {  
          setImageBase64(prev => [...prev, e.target?.result as string]); 
        };  
        reader.readAsDataURL(file);  
      }  
    }  
  }

  const sendQuestionDisabled = disabled || !question.trim()

  return (
    <Stack horizontal className={styles.questionInputContainer} onPaste={handlePaste}>
      <TextField
        className={styles.questionInputTextArea}
        placeholder={placeholder}
        multiline
        resizable={false}
        borderless
        value={question}
        onChange={onQuestionChange}
        onKeyDown={onEnterPress}
      />
      <TextField
        className={styles.systemMessageTextArea}
        placeholder="Type a system message..."  
        multiline  
        resizable={false}  
        borderless  
        value={systemMessage}  
        onChange={onSystemMessageChange}  
        onKeyDown={onEnterPress}   
      />
      <div className={styles.questionInputSendButtonContainer}>  
        <label htmlFor="file-upload" className={styles.questionInputAttachedFileButton}>  
          <img src={AttachedFile} alt="Attach File Button" />  
        </label>  
        <input  
          id="file-upload"  
          type="file"  
          accept="image/*"  
          multiple  
          style={{ display: 'none' }}  
          onChange={handleFileChange}  
        />  
        <div
          role="button"
          tabIndex={0}
          aria-label="Ask question button"
          onClick={sendQuestion}
          onKeyDown={e => (e.key === 'Enter' || e.key === ' ' ? sendQuestion() : null)}>
          {sendQuestionDisabled ? (
            <SendRegular className={styles.questionInputSendButtonDisabled} />
          ) : (
            <img src={Send} className={styles.questionInputSendButton} alt="Send Button" />
          )}
        </div>
      </div>
      <div className={styles.questionInputBottomBorder} />
    </Stack>
  )
}
