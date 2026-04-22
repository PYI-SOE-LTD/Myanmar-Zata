import BirthDataForm from '../components/BirthDataForm/BirthDataForm'
import { useZata } from '../context/ZataContext'

export default function InputPage() {
  const { state } = useZata()
  return (
    <div className="input-page">
      <BirthDataForm />
    </div>
  )
}
