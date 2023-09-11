import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Home() {
  return (
    <>
      <h1>Home Page</h1>
      <p>Under Construction</p>
      <button onClick={() => toast.warning('This is a warning message!')}>Warning Notification</button>
      <button onClick={() => toast.info('This is an info message!')}>Info Notification</button>
      <button onClick={() => toast.success('This is a success message!')}>Success Notification</button>
      <button onClick={() => toast.error('This is an error message!')}>Error Notification</button>
    </>
  )
}
